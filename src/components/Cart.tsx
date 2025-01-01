// src/components/Cart.tsx

import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { CartItem } from '../context/CartContext';


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
  const costoEnvio = 8500; // Fijo por ahora
  const totalPedido = subtotalProductos + costoEnvio;

  // Manejo de confirmación => abrir WhatsApp
  const handleConfirm = () => {
    const nombre = 'Nombre de usuario'; // Podrías obtenerlo de un formulario
    const metodoPago = 'Transferencia'; // Idem
    const direccion = 'Dirección de envío'; // Idem

    // Armar el texto
    const textoWhatsApp =
    `Hola soy ${nombre} y quería:\n` +
    cartItems
      .map(
        (item) => `- (${item.quantity}) ${item.title} por $${item.price * item.quantity}`
      )
      .join('\n') +
    `\nPor el precio de $${subtotalProductos}\n` +
    `Costo de envío: $${costoEnvio}\n` +
    `Total: $${totalPedido}\n` +
    `Para ser enviado a ${direccion}\n` +
    `Con el método de pago ${metodoPago}\n`;

  const telefonoTienda = '+5491128973151';
  const url = `https://wa.me/${telefonoTienda.replace('+', '')}?text=${encodeURIComponent(
    textoWhatsApp
  )}`;

  window.open(url, '_blank');
};

return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Mi Pedido</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Detalle del pedido:</p>
        {cartItems.map((item) => (
          <div key={item.id} className="d-flex justify-content-between">
            <span>
              ({item.quantity}) {item.title}
            </span>
            <span>${item.price * item.quantity}</span>
          </div>
        ))}
        <hr />
        <p>Forma de entrega</p>
        <p>Lo antes posible o en una fecha y hora (no disponible aún)</p>
        <p>Nombre del que recibe: ___________</p>
        <p>Dirección de envío: ___________</p>
        <p>Forma de pago</p>
        <ul>
          <li>Transferencia</li>
          <li>Mercadopago</li>
          <li>Tarjeta de crédito</li>
        </ul>
        <div
          className="mt-3 p-2"
          style={{ backgroundColor: 'orange', borderRadius: '10px' }}
        >
          <p>Subtotal productos: ${subtotalProductos}</p>
          <p>Costo de envío: ${costoEnvio}</p>
          <strong>Total del pedido: ${totalPedido}</strong>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="light" onClick={handleConfirm}>
          CONFIRMAR PEDIDO
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Cart;
