// src/pages/Home.tsx

import React, { useState, useEffect } from 'react';
import MyNavbar from '../components/Navbar.tsx';
import Banner from '../components/Banner.tsx';
import AvatarSection from '../components/AvatarSection.tsx';
import ProductDropdown from '../components/ProductDropdown.tsx';
import { ProductItemData } from '../types/ProductItemData';
import { useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext.tsx';
import FloatingCartButton from '../components/FloatingCartButton.tsx';
import Cart from '../components/Cart.tsx'; // Este sería el modal o panel

const Home: React.FC = () => {
  // Ejemplo de datos de productos
  const location = useLocation();
  const { cartItems } = useCart();

  // Controla la visibilidad del modal/panel de carrito
  const [showCartModal, setShowCartModal] = useState(false);

  // Cada vez que volvamos de SingleItem con state = { showCart: true }, abrimos el modal
  useEffect(() => {
    if (location.state && location.state.showCart) {
      setShowCartModal(true);
      // Limpia el estado para que no se abra siempre
      window.history.replaceState({}, '');
    }
  }, [location]);

  // Calcular el total
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);


  const tarjetas: ProductItemData[] = [
    {
      id: 'tarjeta-1',
      title: 'Tarjeta Gráfica X',
      subtitle: 'NVIDIA GTX',
      price: 150000,
      image: 'https://via.placeholder.com/100',
    },
    {
      id: 'tarjeta-2',
      title: 'Tarjeta Madre Y',
      subtitle: 'Soporta Intel',
      price: 50000,
      image: 'https://via.placeholder.com/100',
    },
  ];

  const joysticks: ProductItemData[] = [
    {
      id: 'joystick-1',
      title: 'Joystick Inalámbrico A',
      subtitle: 'Bluetooth',
      price: 10000,
      image: 'https://via.placeholder.com/100',
    },
  ];

  const videojuegos: ProductItemData[] = [
    {
      id: 'videojuego-1',
      title: 'Juego Fútbol 2024',
      subtitle: 'Deportes',
      price: 8000,
      image: 'https://via.placeholder.com/100',
    },
  ];

  return (
    <div>
      <MyNavbar />
      <Banner />
      <AvatarSection />

      <div className="container mt-3">
        <ProductDropdown sectionName="Tarjetas" products={tarjetas} />
        <ProductDropdown sectionName="Joysticks" products={joysticks} />
        <ProductDropdown sectionName="Videojuegos" products={videojuegos} />
      </div>

         {/* Botón flotante que muestra el total */}
         {cartItems.length > 0 && (
        <FloatingCartButton
          onClick={() => setShowCartModal(true)}
          totalPrice={totalPrice}
        />
      )}

      {/* Modal con el carrito */}
      <Cart
        show={showCartModal}
        onClose={() => setShowCartModal(false)}
        cartItems={cartItems}
      />
    </div>
  );
};

export default Home;
