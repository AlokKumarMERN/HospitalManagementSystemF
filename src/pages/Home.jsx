import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleBookAppointment = () => {
    if (user) {
      navigate('/appointment');
    } else {
      navigate('/auth');
    }
  };

  const healthyFoods = [
    {
      name: 'Fresh Fruits',
      emoji: '🍎🍊🍌',
      benefits: ['Rich in vitamins & minerals', 'Boosts immunity', 'Natural energy source', 'High in fiber'],
      color: '#ff6b6b'
    },
    {
      name: 'Green Vegetables',
      emoji: '🥗🥦🥬',
      benefits: ['Loaded with antioxidants', 'Prevents chronic diseases', 'Supports digestion', 'Low in calories'],
      color: '#51cf66'
    },
    {
      name: 'Whole Grains',
      emoji: '🌾🍚🍞',
      benefits: ['Sustained energy release', 'Rich in B vitamins', 'Improves heart health', 'Aids weight management'],
      color: '#ffd43b'
    },
    {
      name: 'Nuts & Seeds',
      emoji: '🥜🌰',
      benefits: ['Healthy fats for brain', 'Protein-rich snacks', 'Reduces inflammation', 'Supports heart health'],
      color: '#ff922b'
    },
    {
      name: 'Lean Proteins',
      emoji: '🐟🍗🥚',
      benefits: ['Builds muscle tissue', 'Repairs body cells', 'Keeps you full longer', 'Essential amino acids'],
      color: '#748ffc'
    },
    {
      name: 'Dairy Products',
      emoji: '🥛🧀',
      benefits: ['Calcium for strong bones', 'Protein & vitamin D', 'Supports dental health', 'Aids muscle function'],
      color: '#94d82d'
    }
  ];

  const motivationalCards = [
    {
      icon: '💪',
      title: 'Stay Strong',
      message: 'Every day is a new opportunity to improve your health',
      color: '#e74c3c'
    },
    {
      icon: '🧘',
      title: 'Mental Wellness',
      message: 'A healthy mind leads to a healthy body',
      color: '#9b59b6'
    },
    {
      icon: '🏃',
      title: 'Stay Active',
      message: 'Movement is medicine for creating change',
      color: '#3498db'
    },
    {
      icon: '😊',
      title: 'Positive Mindset',
      message: 'Healing starts with a smile and positive thoughts',
      color: '#f39c12'
    }
  ];

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        {/* Hero Section */}
        <div className="home-hero">
          <div className="container">
            <div className="hero-content-wrapper">
              <div className="hero-text">
                <h1 className="hero-title">Welcome to SaveLife Hospital</h1>
                <p className="hero-subtitle">Caring for Life, Every Step of the Way</p>
                <p className="hero-description">
                  Leading healthcare provider committed to delivering exceptional medical services
                  with compassion, innovation, and excellence.
                </p>
                <div className="hero-stats">
                  <div className="stat-item">
                    <div className="stat-number">15+</div>
                    <div className="stat-label">Years Experience</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">50+</div>
                    <div className="stat-label">Expert Doctors</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">10K+</div>
                    <div className="stat-label">Happy Patients</div>
                  </div>
                </div>
              </div>
              <div className="hero-image">
                <div className="image-placeholder">
                  <div className="medical-icon">
                    <img src="https://cdn-icons-png.flaticon.com/512/2913/2913133.png" alt="Hospital" />
                  </div>
                  <div className="pulse-animation"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="features-section">
          <div className="container">
            <h2 className="section-title">Why Choose SaveLife?</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <img src="https://cdn-icons-png.flaticon.com/512/2693/2693507.png" alt="Calendar" />
                </div>
                <h3>Easy Appointments</h3>
                <p>Book appointments with doctors easily and manage your schedule online</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <img src="https://cdn-icons-png.flaticon.com/512/2785/2785482.png" alt="Doctor" />
                </div>
                <h3>Expert Doctors</h3>
                <p>Access to experienced and qualified healthcare professionals</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <img src="https://cdn-icons-png.flaticon.com/512/2382/2382533.png" alt="Ambulance" />
                </div>
                <h3>24/7 Emergency</h3>
                <p>Round-the-clock emergency services and patient care</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <img src="https://cdn-icons-png.flaticon.com/512/3209/3209265.png" alt="Laboratory" />
                </div>
                <h3>Advanced Technology</h3>
                <p>State-of-the-art medical equipment and diagnostic facilities</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <img src="https://cdn-icons-png.flaticon.com/512/2913/2913133.png" alt="Medicine" />
                </div>
                <h3>Quality Treatment</h3>
                <p>Evidence-based medical care with proven treatment protocols</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">❤️</div>
                <h3>Compassionate Care</h3>
                <p>Patient-centered approach with warmth and understanding</p>
              </div>
            </div>
          </div>
        </div>

        {/* Motivational Cards Section */}
        <div className="motivation-section">
          <div className="container">
            <h2 className="section-title">Words of Encouragement</h2>
            <p className="section-subtitle">Stay motivated on your journey to health and wellness</p>
            <div className="motivation-grid">
              {motivationalCards.map((card, index) => (
                <div key={index} className="motivation-card" style={{ borderTopColor: card.color }}>
                  <div className="motivation-icon">{card.icon}</div>
                  <h3>{card.title}</h3>
                  <p>{card.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Healthy Food Section */}
        <div className="healthy-food-section">
          <div className="container">
            <h2 className="section-title">Nutrition Guide</h2>
            <p className="section-subtitle">Fuel your body with the right foods for optimal health</p>
            <div className="food-grid">
              {healthyFoods.map((food, index) => (
                <div key={index} className="food-card">
                  <div className="food-header" style={{ backgroundColor: food.color }}>
                    <div className="food-emoji">{food.emoji}</div>
                    <h3>{food.name}</h3>
                  </div>
                  <div className="food-benefits">
                    <h4>Health Benefits:</h4>
                    <ul>
                      {food.benefits.map((benefit, i) => (
                        <li key={i}>
                          <span className="check-icon">✓</span> {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="cta-section">
          <div className="container">
            <div className="cta-content">
              <h2>Ready to Take Control of Your Health?</h2>
              <p>Schedule your appointment today and start your journey to better health</p>
              <button className="cta-button" onClick={handleBookAppointment}>
                Book Appointment Now
              </button>
              {!user && (
                <p className="cta-note">
                  <small>You'll need to login or create an account to book an appointment</small>
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
