// src/components/Navbar.tsx (MyNavbar)

import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { FaFacebook, FaInstagram, FaMapMarkerAlt } from 'react-icons/fa';

interface MyNavbarProps {
  storeName?: string;
  logoURL?: string;
}

const MyNavbar: React.FC<MyNavbarProps> = ({ storeName, logoURL }) => {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="#">
          {logoURL && logoURL.trim() !== '' ? (
            <img
              src={logoURL}
              alt={storeName || 'Logo de la tienda'}
              style={{ height: '40px' }}
            />
          ) : (
            storeName || 'Mi Tienda'
          )}
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="#"><FaFacebook /></Nav.Link>
            <Nav.Link href="#"><FaInstagram /></Nav.Link>
            <Nav.Link href="#"><FaMapMarkerAlt /></Nav.Link>
            {/* Podríamos inyectar socialLinks aquí, si lo deseas */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MyNavbar;
