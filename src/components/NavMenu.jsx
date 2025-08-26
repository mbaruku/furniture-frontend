import { Navbar, Form, FormControl, Button, Container } from 'react-bootstrap';
import logo from '../assets/logo.png';
import CartButton from './CartButton';
import { Typewriter } from 'react-simple-typewriter';
import './NavMenu.css'

const Topbar = ({ showSearch = true, showCartButton = true, showWelcomeMessage = true }) => {
  return (
    <Navbar expand="lg" bg="light" variant="light" sticky="top" className="shadow-sm">
  <Container fluid>
    {/* Brand */}
    <Navbar.Brand href="/" className="d-flex align-items-center">
      <img
        src={logo}
        alt="Logo"
        height="70"
        width="70"
        className="rounded-circle me-2 border"
        style={{ objectFit: 'cover' }}
      />
      <span className="fw-bold fs-5 text-dark">MKOMBOZI FURNITURE STORE</span>
    </Navbar.Brand>

    {/* Welcome Message */}
    {showWelcomeMessage && (
      <div className="text-primary fw-bold fs-6 ms-3 topbar-welcome" style={{ whiteSpace: 'nowrap' }}>
        <Typewriter
          words={['KARIBU SANA MTEJA WETU']}
          loop={0}
          cursor
          cursorStyle="|"
          typeSpeed={80}
          deleteSpeed={0}
          delaySpeed={1000}
        />
      </div>
    )}

    {/* Spacer to push CartButton to the right */}
    <div className="ms-auto d-flex align-items-center">
      {showSearch && (
        <Form className="d-flex me-3 mt-2 mt-lg-0">
          <FormControl
            type="search"
            placeholder="Tafuta bidhaa..."
            className="rounded-pill me-2"
            aria-label="Search"
          />
          <Button variant="outline-dark" className="rounded-pill">Tafuta</Button>
        </Form>
      )}

      {showCartButton && <CartButton />}
    </div>
  </Container>
</Navbar>

  );
};


export default Topbar;
