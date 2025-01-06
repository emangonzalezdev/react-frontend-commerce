// src/components/Navbar.tsx (MyNavbar)

import React, { useState } from 'react';
import { Navbar, Nav, Container, Button, Modal } from 'react-bootstrap';
import { FaInstagram, FaBars } from 'react-icons/fa';

import './Navbar.css';

interface MyNavbarProps {
  storeName?: string;
  logoURL?: string;
}

const MyNavbar: React.FC<MyNavbarProps> = ({ storeName, logoURL }) => {
  // Control del modal
  const [showModal, setShowModal] = useState(false);

  const handleToggle = () => {
    // cuando se hace clic en el hamburger
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <>
      <Navbar bg="light" className="justify-content-between">
        <Container>
          <Navbar.Brand href="#">
            {logoURL && logoURL.trim() !== '' ? (
              <img
                src={logoURL}
                alt={storeName}
                className="navbar-logo"
          
              />
            ) : (
              storeName
            )}
          </Navbar.Brand>

          {/* Botón hamburger (usamos nuestro propio, no el de Bootstrap) */}
          <Button
            variant="outline-secondary"
            className="d-lg-none" // solo en mobile
            onClick={handleToggle}
          >
            <FaBars />
          </Button>

          {/* En pantallas grandes, mostramos el Nav normal (opcional) */}
          <Nav className="ms-auto d-none d-lg-flex">

            <Nav.Link href="https://www.instagram.com/granloot/">
              <FaInstagram className="icon-large" />
            </Nav.Link>

          </Nav>
        </Container>
      </Navbar>

      {/* MODAL que se muestra en mobile al hacer clic en hamburger */}
      <Modal
        show={showModal}
        onHide={handleClose}
        // backdrop="static" // si quieres que no se cierre al hacer clic afuera
        centered
        contentClassName="blur-modal-content"
      >
        <Modal.Header closeButton>
          {/* Título o Logo en el modal header (opcional) */}
          <Modal.Title>{storeName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Aquí pones los links, iconos, etc. */}
          <Nav className="flex-column">
     
            <Nav.Link href="https://www.instagram.com/granloot/"><FaInstagram  className="icon-large" /> Instagram</Nav.Link>
        
            {/* Más links si gustas */}
          </Nav>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default MyNavbar;
