// src/components/Navbar.tsx

import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { FaFacebook, FaInstagram, FaMapMarkerAlt } from 'react-icons/fa';

const MyNavbar: React.FC = () => {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="#">Mi Tienda</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="#"><FaFacebook /></Nav.Link>
            <Nav.Link href="#"><FaInstagram /></Nav.Link>
            <Nav.Link href="#"><FaMapMarkerAlt /></Nav.Link>
            {/* Podríamos poner más categorías aquí */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MyNavbar;
