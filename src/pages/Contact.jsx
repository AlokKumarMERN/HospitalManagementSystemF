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
                  <p>SaveLife Hospital</p>
                  <p>Gopalganj, Barauli, 841405</p>
                </div>
                <div className="info-item">
                  <h3>Phone</h3>
                  <p>Emergency: +91 10009 38001</p>
                  <p>General: +91 56782 45678 </p>
                </div>
                <div className="info-item">
                  <h3>Email</h3>
                  <p>alokgupta742001@gmail.com</p>
                  <p>support@savelife.com</p>
                </div>
                <div className="info-item">
                  <h3>Hours</h3>
                  <p>Emergency: 24/7</p>
                  <p>OPD: 9:00 AM - 11:00 PM</p>
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
