import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import './Services.css';

const Services = () => {
  const services = [
    {
      title: 'Emergency Care',
      description: '24/7 emergency medical services with state-of-the-art facilities',
    },
    {
      title: 'Cardiology',
      description: 'Advanced cardiac care and heart disease treatment',
    },
    {
      title: 'Orthopedics',
      description: 'Comprehensive bone and joint care services',
    },
    {
      title: 'Pediatrics',
      description: 'Specialized healthcare for children and adolescents',
    },
    {
      title: 'Radiology',
      description: 'Advanced imaging and diagnostic services',
    },
    {
      title: 'Laboratory',
      description: 'Comprehensive pathology and diagnostic testing',
    },
  ];

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <div className="container">
          <div className="services-page">
            <h1>Our Services</h1>
            <div className="services-grid">
              {services.map((service, index) => (
                <div key={index} className="service-card">
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Services;
