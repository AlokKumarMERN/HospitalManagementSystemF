import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo-container">
              <img src="https://cdn-icons-png.flaticon.com/512/2913/2913133.png" alt="SaveLife Logo" className="footer-logo-icon" />
              <h3 className="footer-logo">SaveLife</h3>
            </div>
            <p className="footer-description">
              Your trusted healthcare partner providing exceptional medical services with compassion and excellence.
            </p>
            <div className="social-links">
              <a href="#" className="social-icon" title="Facebook">
                <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" />
              </a>
              <a href="#" className="social-icon" title="Twitter">
                <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" />
              </a>
              <a href="#" className="social-icon" title="Instagram">
                <img src="https://cdn-icons-png.flaticon.com/512/174/174855.png" alt="Instagram" />
              </a>
              <a href="#" className="social-icon" title="LinkedIn">
                <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn" />
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/appointment">Book Appointment</Link></li>
              <li><Link to="/blogs">Health Blog</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Services</h4>
            <ul className="footer-links">
              <li><a href="#">Emergency Care</a></li>
              <li><a href="#">Cardiology</a></li>
              <li><a href="#">Orthopedics</a></li>
              <li><a href="#">Pediatrics</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contact Info</h4>
            <ul className="contact-info">
              <li>
                <span className="icon">
                  <img src="https://cdn-icons-png.flaticon.com/512/684/684908.png" alt="Location" />
                </span>
                <span>SaveLife Hospital<br/>Gopalganj, Barauli 841405</span>
              </li>
              <li>
                <span className="icon">
                  <img src="https://cdn-icons-png.flaticon.com/512/597/597177.png" alt="Phone" />
                </span>
                <span>Emergency: +91 9876543210<br/>General: +91 9876543210</span>
              </li>
              <li>
                <span className="icon">
                  <img src="https://cdn-icons-png.flaticon.com/512/732/732200.png" alt="Email" />
                </span>
                <span>alokgupta742001@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; {new Date().getFullYear()} SaveLife Hospital Management System. All rights reserved.</p>
            <div className="footer-bottom-links">
              <a href="#">Privacy Policy</a>
              <span>|</span>
              <a href="#">Terms of Service</a>
              <span>|</span>
              <a href="#">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
