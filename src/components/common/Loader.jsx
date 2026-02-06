import './Loader.css';

const Loader = ({ size = 'medium' }) => {
  return (
    <div className={`loader-container ${size}`}>
      <div className="loader"></div>
    </div>
  );
};

export default Loader;
