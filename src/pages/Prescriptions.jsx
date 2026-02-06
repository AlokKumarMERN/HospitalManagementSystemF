import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import './Prescriptions.css';

const Prescriptions = () => {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchPrescriptions();

    // Auto-refresh every 30 seconds
    const refreshInterval = setInterval(() => {
      fetchPrescriptions();
    }, 30000);

    return () => clearInterval(refreshInterval);
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get('http://localhost:5001/api/prescriptions', config);
      setPrescriptions(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const openModal = (prescription) => {
    setSelectedPrescription(prescription);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPrescription(null);
  };

  if (loading) {
    return (
      <div className="prescriptions-page">
        <Header />
        <div className="loading">Loading prescriptions...</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="prescriptions-page">
      <Header />
      <main className="prescriptions-main">
        <div className="prescriptions-container">
          <div className="prescriptions-header">
            <div>
              <h1>My Prescriptions</h1>
              <p>View all prescriptions from your doctors</p>
            </div>
            <Link to="/dashboard" className="back-btn">
              ← Back to Dashboard
            </Link>
          </div>

          {prescriptions.length > 0 ? (
            <div className="prescriptions-grid">
              {prescriptions.map((prescription) => (
                <div key={prescription._id} className="prescription-card">
                  <div className="prescription-header">
                    <div className="doctor-info">
                      <div className="doctor-avatar">
                        <img src="https://cdn-icons-png.flaticon.com/512/2785/2785482.png" alt="Doctor" />
                      </div>
                      <div>
                        <h3>Dr. {prescription.doctor?.name || 'N/A'}</h3>
                        <p className="prescription-date">{formatDate(prescription.createdAt)}</p>
                      </div>
                    </div>
                    <span className="prescription-badge">
                      <img src="https://cdn-icons-png.flaticon.com/512/2913/2913133.png" alt="Medicine" />
                    </span>
                  </div>

                  <div className="prescription-body">
                    <div className="medications-summary">
                      <h4>Medications ({prescription.medications?.length || 0})</h4>
                      <ul>
                        {prescription.medications?.slice(0, 2).map((med, idx) => (
                          <li key={idx}>
                            <strong>{med.name}</strong> - {med.dosage}
                          </li>
                        ))}
                        {prescription.medications?.length > 2 && (
                          <li>+ {prescription.medications.length - 2} more</li>
                        )}
                      </ul>
                    </div>

                    {prescription.notes && (
                      <div className="prescription-notes">
                        <strong>Notes:</strong>
                        <p>{prescription.notes.substring(0, 100)}{prescription.notes.length > 100 ? '...' : ''}</p>
                      </div>
                    )}
                  </div>

                  <div className="prescription-footer">
                    <button onClick={() => openModal(prescription)} className="view-details-btn">
                      View Full Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-data">
              <div className="no-data-icon">
                <img src="https://cdn-icons-png.flaticon.com/512/2913/2913133.png" alt="No Prescriptions" />
              </div>
              <h3>No Prescriptions Yet</h3>
              <p>Your prescriptions from doctors will appear here</p>
              <Link to="/appointment" className="btn-primary">
                Book an Appointment
              </Link>
            </div>
          )}
        </div>
      </main>

      {/* Modal for Full Prescription Details */}
      {showModal && selectedPrescription && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <img src="https://cdn-icons-png.flaticon.com/512/2913/2913133.png" alt="Prescription" className="modal-icon" />
                Prescription Details
              </h2>
              <button className="close-btn" onClick={closeModal}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="prescription-info">
                <p>
                  <strong>Doctor:</strong> Dr. {selectedPrescription.doctor?.name || 'N/A'}
                </p>
                <p>
                  <strong>Date:</strong> {formatDate(selectedPrescription.createdAt)}
                </p>
                {selectedPrescription.appointment && (
                  <p>
                    <strong>Appointment Date:</strong>{' '}
                    {formatDate(selectedPrescription.appointment.appointmentDate)}
                  </p>
                )}
              </div>

              <div className="medications-list">
                <h3>Medications</h3>
                {selectedPrescription.medications?.map((med, idx) => (
                  <div key={idx} className="medication-item">
                    <div className="medication-header">
                      <span className="medication-number">{idx + 1}</span>
                      <h4>{med.name}</h4>
                    </div>
                    <div className="medication-details">
                      <p>
                        <strong>Dosage:</strong> {med.dosage}
                      </p>
                      <p>
                        <strong>Frequency:</strong> {med.frequency}
                      </p>
                      <p>
                        <strong>Duration:</strong> {med.duration}
                      </p>
                      {med.instructions && (
                        <p>
                          <strong>Instructions:</strong> {med.instructions}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {selectedPrescription.notes && (
                <div className="prescription-notes-full">
                  <h3>Additional Notes</h3>
                  <p>{selectedPrescription.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Prescriptions;
