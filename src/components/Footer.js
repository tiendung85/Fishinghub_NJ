import React from 'react';
import { Container } from 'react-bootstrap';
import '../assets/styles/Header.css';

function Footer() {
  return (
    <footer className="bg-white shadow-sm py-3 mt-auto border-top">
      <Container className="d-flex flex-column flex-md-row justify-content-between align-items-center">
        <div className="text-secondary mb-2 mb-md-0" style={{ fontSize: '1rem' }}>
          © {new Date().getFullYear()} FishingHub. All rights reserved.
        </div>
        <div>
          <a
            href="https://facebook.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary mx-2"
            aria-label="Facebook"
          >
            <i className="bi bi-facebook" style={{ fontSize: '1.3rem' }}></i>
          </a>
          <a
            href="https://instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-danger mx-2"
            aria-label="Instagram"
          >
            <i className="bi bi-instagram" style={{ fontSize: '1.3rem' }}></i>
          </a>
          <a
            href="mailto:support@fishinghub.vn"
            className="text-secondary mx-2"
            aria-label="Email"
          >
            <i className="bi bi-envelope" style={{ fontSize: '1.3rem' }}></i>
          </a>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;