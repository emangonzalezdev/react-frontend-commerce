import React, { useState, useEffect } from 'react';
import MyNavbar from '../components/Navbar.tsx';
import Banner from '../components/Banner.tsx';
import AvatarSection from '../components/AvatarSection.tsx';
import ProductDropdown from '../components/ProductDropdown.tsx'; 
import { useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext.tsx';
import FloatingCartButton from '../components/FloatingCartButton.tsx';
import Cart from '../components/Cart.tsx';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig.ts';
import { JSX } from 'react/jsx-dev-runtime';
import { ProductItemData } from '../types/ProductItemData';

interface Category {
  id: string;
  name: string;
  parentId?: string | null;
  description?: string;
  slug?: string;
  imageUrl?: string;
  isActive?: boolean;
  order?: number;
  createdAt?: Date;
  updatedAt?: Date;
  metadata?: {
    [key: string]: any;
  };
}

/** Extensión para manejar subcategorías anidadas */
interface CategoryNode extends Category {
  children: CategoryNode[];
}

// Nuevas interfaces
interface StoreInfo {
  name: string;
  subtitle: string;
  storeType: string;
  logoURL?: string;
  avatarURL?: string;
  whatsapp?: string;
  phone?: string;
}

interface DesignConfig {
  bannerImages: { url: string; link?: string }[];
  bannerInterval: number;
  backgroundImage?: string;
}

const Home: React.FC = () => {
  const location = useLocation();
  const { cartItems } = useCart();

  // Para mostrar el carrito flotante
  const [showCartModal, setShowCartModal] = useState(false);

  // Cada vez que volvamos de SingleItem con state = { showCart: true }, abrimos el modal
  useEffect(() => {
    if (location.state && location.state.showCart) {
      setShowCartModal(true);
      window.history.replaceState({}, '');
    }
  }, [location]);

  // Calcular total del carrito
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Estados para productos y categorías
  const [products, setProducts] = useState<ProductItemData[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [storeInfo, setStoreInfo] = useState<StoreInfo | null>(null);
  const [designConfig, setDesignConfig] = useState<DesignConfig | null>(null);

  // 1. Cargar productos
  const fetchProducts = async () => {
    const snapshot = await getDocs(collection(db, 'products'));
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ProductItemData[];
    return data;
  };

  // 2. Cargar categorías
  const fetchCategories = async () => {
    const snapshot = await getDocs(collection(db, 'categories'));
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Category[];
    return data;
  };

  // Nuevas funciones fetch
  const fetchStoreInfo = async () => {
    try {
      const docRef = doc(db, 'storeInfo', 'main');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setStoreInfo(snap.data() as StoreInfo);
      }
    } catch (error) {
      console.error('Error fetching store info:', error);
    }
  };

  const fetchDesignConfig = async () => {
    try {
      const docRef = doc(db, 'storeInfo', 'designConfig');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setDesignConfig(snap.data() as DesignConfig);
      }
    } catch (error) {
      console.error('Error fetching design config:', error);
    }
  };

  // Carga inicial (productos + categorías)
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [prod, cat] = await Promise.all([fetchProducts(), fetchCategories()]);
        setProducts(prod);
        setCategories(cat);
        await Promise.all([fetchStoreInfo(), fetchDesignConfig()]);
        setLoading(false);
      } catch (error) {
        console.error('Error cargando datos:', error);
        setLoading(false);
      }
    })();
  }, []);

  // Construir árbol de categorías
  function buildCategoryTree(allCats: Category[]): CategoryNode[] {
    const map: Record<string, CategoryNode> = {};
    allCats.forEach((c) => {
      map[c.id] = { ...c, children: [] };
    });
    const roots: CategoryNode[] = [];
    // Conectar padre/hijos
    allCats.forEach((c) => {
      if (c.parentId) {
        map[c.parentId]?.children.push(map[c.id]);
      } else {
        roots.push(map[c.id]);
      }
    });
    return roots;
  }

  const categoryTree = buildCategoryTree(categories);

  // Agrupamos productos por categoría
  // Ej: productsByCategory["catPS4Pads"] = [ lista de ProductItemData... ]
  const productsByCategory: Record<string, ProductItemData[]> = {};
  products.forEach((p) => {
    if (!productsByCategory[p.category]) {
      productsByCategory[p.category] = [];
    }
    productsByCategory[p.category].push(p);
  });

  /**
   * Render recursivo de las categorías:
   * - Si la categoría tiene hijos, mostramos un título (h2/h3) y luego sus hijos.
   * - Si no tiene hijos (es "hoja"), mostramos un <ProductDropdown> con sus productos.
   */
  function renderCategoryNode(node: CategoryNode, level = 0): JSX.Element {
    const hasChildren = node.children.length > 0;
    const nodeProducts = productsByCategory[node.id] || [];

    // Ejemplo: si level=0 => h2, si level=1 => h3, etc. Ajusta según prefieras
    const Tag = level === 0 ? 'h2' : 'h3';

    return (
      <div key={node.id} style={{ marginLeft: level * 20 }}>
        {/* Mostrar el nombre de la categoría con un "heading" distinto según nivel */}
        <Tag>{node.name}</Tag>

        {/* Si la categoría es hoja (sin hijos) y hay productos, usamos <ProductDropdown> 
            para mantener el diseño anterior (con "Pedir", avatar a la derecha, etc.). */}
        {!hasChildren && nodeProducts.length > 0 && (
          <ProductDropdown sectionName={node.name} products={nodeProducts} />
        )}

        {/* Si hay hijos, renderizamos cada hijo de forma recursiva */}
        {node.children.map((childCat) => renderCategoryNode(childCat, level + 1))}

        {/* Si la categoría es hoja y NO hay productos, podrías mostrar 
            algo como "No hay productos en esta categoría" o simplemente nada. */}
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundImage: designConfig?.backgroundImage
          ? `url(${designConfig.backgroundImage})`
          : undefined,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
      }}
    >
      <MyNavbar
        storeName={storeInfo?.name}
        logoURL={storeInfo?.logoURL}
      />
      <Banner
        bannerImages={designConfig?.bannerImages || []}
        interval={designConfig?.bannerInterval || 5}
        storeType={storeInfo?.storeType || ''}
      />
      <AvatarSection
        avatarUrl={storeInfo?.avatarURL}
        storeName={storeInfo?.name}
        storeSubtitle={storeInfo?.subtitle}
        whatsapp={storeInfo?.whatsapp}
        phone={storeInfo?.phone}
      />

      <div className="container mt-3">
        {loading && <p>Cargando productos y categorías...</p>}

        {!loading && (
          <>
            {/* Renderizamos el árbol de categorías, 
                y en cada "hoja" usamos ProductDropdown. */}
            {categoryTree.map((rootCat) => renderCategoryNode(rootCat))}
          </>
        )}
      </div>

      {/* Botón flotante del carrito */}
      {cartItems.length > 0 && (
        <FloatingCartButton
          onClick={() => setShowCartModal(true)}
          totalPrice={totalPrice}
          cartCount={cartItems.reduce((total, item) => total + item.quantity, 0)}
        />
      )}

      {/* Modal del carrito */}
      <Cart
        show={showCartModal}
        onClose={() => setShowCartModal(false)}
        cartItems={cartItems}
      />
    </div>
  );
};

export default Home;