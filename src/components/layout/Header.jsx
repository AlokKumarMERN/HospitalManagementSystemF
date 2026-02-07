import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleLoginClick = () => {
    navigate('/auth');
  };

  const handleProtectedAction = (path) => {
    if (!user) {
      navigate('/auth');
    } else {
      navigate(path);
    }
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <img src="https://cdn-icons-png.flaticon.com/512/2913/2913133.png" alt="SaveLife Logo" className="logo-icon" />
            <h1>SaveLife</h1>
          </Link>
          <nav className="nav">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
            <Link to="/services" className="nav-link">Services</Link>
            <Link to="/blogs" className="nav-link">Blogs</Link>
            {user && <Link to="/appointment" className="nav-link">Appointment</Link>}
          </nav>
          <div className="user-section">
            {user ? (
              <>
                <Link to="/dashboard" className="nav-link dashboard-link">
                  Dashboard
                </Link>
                <span className="user-name">Hi, {user.name}</span>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
              </>
            ) : (
              <button onClick={handleLoginClick} className="login-btn">Login</button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
