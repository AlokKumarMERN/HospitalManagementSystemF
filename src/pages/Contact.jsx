import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import './Contact.css';

const Contact = () => {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <div className="container">
          <div className="contact-page">
            <h1>Contact Us</h1>
            <div className="contact-content">
              <div className="contact-info">
                <div className="info-item">
                  <h3>Address</h3>
                  <p>123 Healthcare Avenue, Medical District</p>
                  <p>City, State 12345</p>
                </div>
                <div className="info-item">
                  <h3>Phone</h3>
                  <p>Emergency: +1 (555) 911-911</p>
                  <p>General: +1 (555) 123-4567</p>
                </div>
                <div className="info-item">
                  <h3>Email</h3>
                  <p>info@savelife.com</p>
                  <p>support@savelife.com</p>
                </div>
                <div className="info-item">
                  <h3>Hours</h3>
                  <p>Emergency: 24/7</p>
                  <p>OPD: 9:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
