// src/components/Cart.tsx

import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { CartItem } from '../context/CartContext';

import "./cart.css";

interface CartProps {
    show: boolean;
    onClose: () => void;
    cartItems: CartItem[];
  }

const Cart: React.FC<CartProps> = ({ show, onClose, cartItems }) => {
  // Podríamos calcular totales aquí
  const subtotalProductos = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const costoEnvio = 0; // Fijo por ahora
  const totalPedido = subtotalProductos + costoEnvio;

  // Nuevos estados
  const [loAntesPosible, setLoAntesPosible] = useState(false);
  const [nombreRecibe, setNombreRecibe] = useState('');
  const [calle, setCalle] = useState('');
  const [numero, setNumero] = useState('');
  const [provincia, setProvincia] = useState('');
  const [Localidad, setLocalidad] = useState('');
  const [codigoPostal, setCodigoPostal] = useState('');
  const [metodoPago, setMetodoPago] = useState('Mercadopago');

  // Lista de provincias
  const provinciasArgentina = [
    'Buenos Aires', 'CABA', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba',
    'Corrientes', 'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa', 'La Rioja',
    'Mendoza', 'Misiones', 'Neuquén', 'Río Negro', 'Salta', 'San Juan',
    'San Luis', 'Santa Cruz', 'Santa Fe', 'Santiago del Estero',
    'Tierra del Fuego', 'Tucumán'
  ];

  // Validación y manejo de confirmación actualizado
  const handleConfirm = () => {
    if (!nombreRecibe.trim()) {
      alert('Por favor ingrese el nombre de quien recibe');
      return;
    }
    if (!calle.trim() || !numero.trim() || !provincia || !Localidad.trim() || !codigoPostal.trim()) {
      alert('Por favor complete todos los campos de la dirección');
      return;
    }

    const direccionFinal = `${calle} ${numero}, ${Localidad}, ${provincia}, CP: ${codigoPostal}`;
    
    const textoWhatsApp =
      `Hola soy ${nombreRecibe} y quería:\n` +
      cartItems
        .map(
          (item) => `- (${item.quantity}) ${item.title} por $${item.price * item.quantity}`
        )
        .join('\n') +
      `\nPor el precio de $${subtotalProductos}\n` +
       //  `Costo de envío: $${costoEnvio}\n` +
      `Total: $${totalPedido}\n` +
      `Entrega: ${loAntesPosible ? 'Lo antes posible' : 'A coordinar'}\n` +
      `Para ser enviado a ${direccionFinal}\n` +
      `Con el método de pago ${metodoPago}\n`;

    const telefonoTienda = '+5491128973151';
    const url = `https://wa.me/${telefonoTienda.replace('+', '')}?text=${encodeURIComponent(
      textoWhatsApp
    )}`;

    window.open(url, '_blank');
  };

  return (
    <Modal 
      show={show} 
      onHide={onClose} 
      backdropClassName="backdrop-blur"
    >
      <Modal.Header closeButton>
        <Modal.Title className='cart-title'>Mi Pedido</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className='cart-divider'>Detalle del pedido</p>
        {cartItems.map((item) => (
          <div key={item.id} className="d-flex justify-content-between">
            <span>
              ({item.quantity}) {item.title}
            </span>
            <span>${item.price * item.quantity}</span>
          </div>
        ))}
        <hr />
        <p className='cart-divider'>Forma de entrega</p>
        <div className="mb-3">
          <input
            type="checkbox"
            id="loAntesPosible"
            checked={loAntesPosible}
            onChange={(e) => setLoAntesPosible(e.target.checked)}
          />
          <label htmlFor="loAntesPosible" className="ms-2">Lo antes posible</label>
        </div>


        <div className="mb-3">
          <label className="form-label">Dirección de envío: *</label>
         
          <select
            className="form-select mb-2"
            value={provincia}
            onChange={(e) => setProvincia(e.target.value)}
          >
            <option value="">Seleccione provincia</option>
            {provinciasArgentina.map(prov => (
              <option key={prov} value={prov}>{prov}</option>
            ))}
          </select>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Localidad"
            value={Localidad}
            onChange={(e) => setLocalidad(e.target.value)}
          />
           <input
            type="text"
            className="form-control mb-2"
            placeholder="Calle"
            value={calle}
            onChange={(e) => setCalle(e.target.value)}
          />
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Número"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Código Postal"
            value={codigoPostal}
            onChange={(e) => setCodigoPostal(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className='cart-divider'>Nombre de quien recibe:</label>
          <p>Nombre: *</p>
          <input
            type="text"
            placeholder="ingresa tu nombre"
            className="form-control"
            value={nombreRecibe}
            onChange={(e) => setNombreRecibe(e.target.value)}
            required
          />
        </div>


        <p className='cart-divider'>Forma de pago</p>
        <div className="mb-3">
          {['Mercadopago', 'Tarjeta débito / Crédito'].map((metodo) => (
            <div key={metodo}>
              <input
                type="radio"
                id={metodo}
                name="metodoPago"
                value={metodo}
                checked={metodoPago === metodo}
                onChange={(e) => setMetodoPago(e.target.value)}
              />
              <label htmlFor={metodo} className="ms-2">{metodo}</label>
            </div>
          ))}
        </div>

        <div
          className="mt-3 p-2"
          style={{ backgroundColor: 'orange', borderRadius: '10px' }}
        >
            {/*     <p>Subtotal productos: ${subtotalProductos}</p>*/}
             {/*   <p>Costo de envío: ${costoEnvio}</p> */}
          <strong>Total del pedido: ${totalPedido}</strong>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button 
          variant="success" 
          onClick={handleConfirm} 
          style={{ width: '100%', fontWeight: 'bold', color: 'white' }}
        >
          CONFIRMAR PEDIDO
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Cart;
