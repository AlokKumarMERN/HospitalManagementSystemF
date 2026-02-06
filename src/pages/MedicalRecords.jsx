import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import './MedicalRecords.css';

const MedicalRecords = () => {
  const { user } = useAuth();
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchMedicalRecords();

    // Auto-refresh every 30 seconds
    const refreshInterval = setInterval(() => {
      fetchMedicalRecords();
    }, 30000);

    return () => clearInterval(refreshInterval);
  }, []);

  const fetchMedicalRecords = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get('http://localhost:5001/api/medical-records', config);
      setMedicalRecords(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching medical records:', error);
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const openModal = (record) => {
    setSelectedRecord(record);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRecord(null);
  };

  if (loading) {
    return (
      <div className="medical-records-page">
        <Header />
        <div className="loading">Loading medical records...</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="medical-records-page">
      <Header />
      <main className="medical-records-main">
        <div className="medical-records-container">
          <div className="medical-records-header">
            <div>
              <h1>My Medical Records</h1>
              <p>View all your medical records and diagnoses</p>
            </div>
            <Link to="/dashboard" className="back-btn">
              ← Back to Dashboard
            </Link>
          </div>

          {medicalRecords.length > 0 ? (
            <div className="records-grid">
              {medicalRecords.map((record) => (
                <div key={record._id} className="record-card">
                  <div className="record-header">
                    <div className="doctor-info">
                      <div className="doctor-avatar">
                        <img src="https://cdn-icons-png.flaticon.com/512/2785/2785482.png" alt="Doctor" />
                      </div>
                      <div>
                        <h3>Dr. {record.doctor?.name || 'N/A'}</h3>
                        <p className="record-date">{formatDate(record.createdAt)}</p>
                      </div>
                    </div>
                    <span className="record-badge">
                      <img src="https://cdn-icons-png.flaticon.com/512/3209/3209265.png" alt="Medical Record" />
                    </span>
                  </div>

                  <div className="record-body">
                    <div className="diagnosis-section">
                      <h4>Diagnosis</h4>
                      <p>{record.diagnosis?.substring(0, 100) || 'No diagnosis provided'}{record.diagnosis?.length > 100 ? '...' : ''}</p>
                    </div>

                    {record.symptoms && (
                      <div className="symptoms-section">
                        <h4>Symptoms</h4>
                        <p>{record.symptoms.substring(0, 80)}{record.symptoms.length > 80 ? '...' : ''}</p>
                      </div>
                    )}

                    {record.treatment && (
                      <div className="treatment-section">
                        <h4>Treatment</h4>
                        <p>{record.treatment.substring(0, 80)}{record.treatment.length > 80 ? '...' : ''}</p>
                      </div>
                    )}
                  </div>

                  <div className="record-footer">
                    <button onClick={() => openModal(record)} className="view-details-btn">
                      View Full Record
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-data">
              <div className="no-data-icon">
                <img src="https://cdn-icons-png.flaticon.com/512/3209/3209265.png" alt="No Records" />
              </div>
              <h3>No Medical Records Yet</h3>
              <p>Your medical records from doctors will appear here</p>
              <Link to="/appointment" className="btn-primary">
                Book an Appointment
              </Link>
            </div>
          )}
        </div>
      </main>

      {/* Modal for Full Record Details */}
      {showModal && selectedRecord && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <img src="https://cdn-icons-png.flaticon.com/512/3209/3209265.png" alt="Medical Record" className="modal-icon" />
                Medical Record Details
              </h2>
              <button className="close-btn" onClick={closeModal}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="record-info">
                <p>
                  <strong>Doctor:</strong> Dr. {selectedRecord.doctor?.name || 'N/A'}
                </p>
                <p>
                  <strong>Date:</strong> {formatDate(selectedRecord.createdAt)}
                </p>
                {selectedRecord.appointment && (
                  <p>
                    <strong>Appointment Date:</strong>{' '}
                    {formatDate(selectedRecord.appointment.appointmentDate)}
                  </p>
                )}
              </div>

              <div className="record-section">
                <h3>Diagnosis</h3>
                <div className="record-content">
                  <p>{selectedRecord.diagnosis || 'No diagnosis provided'}</p>
                </div>
              </div>

              {selectedRecord.symptoms && (
                <div className="record-section">
                  <h3>Symptoms</h3>
                  <div className="record-content">
                    <p>{selectedRecord.symptoms}</p>
                  </div>
                </div>
              )}

              {selectedRecord.treatment && (
                <div className="record-section">
                  <h3>Treatment Plan</h3>
                  <div className="record-content">
                    <p>{selectedRecord.treatment}</p>
                  </div>
                </div>
              )}

              {selectedRecord.notes && (
                <div className="record-section">
                  <h3>Additional Notes</h3>
                  <div className="record-content">
                    <p>{selectedRecord.notes}</p>
                  </div>
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

export default MedicalRecords;
