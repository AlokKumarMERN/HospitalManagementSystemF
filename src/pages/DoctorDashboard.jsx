import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './DoctorDashboard.css';

const DoctorDashboard = () => {
  const [stats, setStats] = useState({
    todayAppointments: 0,
    totalAppointments: 0,
    totalPatients: 0,
  });
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'prescription', 'test', 'record', 'viewTest'
  const [loading, setLoading] = useState(true);
  const [testResults, setTestResults] = useState([]);
  const [selectedTestResult, setSelectedTestResult] = useState(null);

  // Form states
  const [prescriptionForm, setPrescriptionForm] = useState({
    medications: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }],
    notes: '',
  });

  const [testForm, setTestForm] = useState({
    testName: '',
    testType: '',
    notes: '',
  });

  const [recordForm, setRecordForm] = useState({
    diagnosis: '',
    symptoms: '',
    treatment: '',
    notes: '',
  });

  useEffect(() => {
    fetchDashboardData();
    fetchTestResults();
  }, []);

  const fetchTestResults = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const testResultsRes = await axios.get('http://localhost:5001/api/test-results', config);
      setTestResults(testResultsRes.data);
    } catch (error) {
      console.error('Error fetching test results:', error);
    }
  };

  const openTestResultModal = (testResult) => {
    setSelectedTestResult(testResult);
    setModalType('viewTest');
    setShowModal(true);
  };

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const appointmentsRes = await axios.get('http://localhost:5001/api/appointments', config);
      const appointmentsData = appointmentsRes.data;

      // Filter today's appointments
      const today = new Date().toDateString();
      const todayAppointments = appointmentsData.filter(
        (app) => new Date(app.appointmentDate).toDateString() === today
      );

      // Get unique patients
      const uniquePatients = new Set(appointmentsData.map((app) => app.patient?._id));

      setStats({
        todayAppointments: todayAppointments.length,
        totalAppointments: appointmentsData.length,
        totalPatients: uniquePatients.size,
      });

      setAppointments(appointmentsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  const getStatusBadge = (status) => {
    const statusClass = {
      scheduled: 'status-scheduled',
      completed: 'status-completed',
      cancelled: 'status-cancelled',
      'in-progress': 'status-in-progress',
    };
    return <span className={`status-badge ${statusClass[status]}`}>{status}</span>;
  };

  const openModal = (appointment, type) => {
    setSelectedAppointment(appointment);
    setModalType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedAppointment(null);
    resetForms();
  };

  const resetForms = () => {
    setPrescriptionForm({
      medications: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }],
      notes: '',
    });
    setTestForm({ testName: '', testType: '', notes: '' });
    setRecordForm({ diagnosis: '', symptoms: '', treatment: '', notes: '' });
  };

  const handleMarkAsCompleted = async (appointmentId) => {
    if (!window.confirm('Mark this appointment as completed?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.put(
        `http://localhost:5001/api/appointments/${appointmentId}`,
        { status: 'completed' },
        config
      );

      alert('Appointment marked as completed! Time slot is now available for booking.');
      fetchDashboardData();
    } catch (error) {
      console.error('Error updating appointment status:', error);
      alert('Failed to update appointment status');
    }
  };

  const addMedication = () => {
    setPrescriptionForm({
      ...prescriptionForm,
      medications: [
        ...prescriptionForm.medications,
        { name: '', dosage: '', frequency: '', duration: '', instructions: '' },
      ],
    });
  };

  const updateMedication = (index, field, value) => {
    const updatedMedications = [...prescriptionForm.medications];
    updatedMedications[index][field] = value;
    setPrescriptionForm({ ...prescriptionForm, medications: updatedMedications });
  };

  const removeMedication = (index) => {
    const updatedMedications = prescriptionForm.medications.filter((_, i) => i !== index);
    setPrescriptionForm({ ...prescriptionForm, medications: updatedMedications });
  };

  const handleSubmitPrescription = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.post(
        'http://localhost:5001/api/prescriptions',
        {
          patient: selectedAppointment.patient._id,
          appointment: selectedAppointment._id,
          medications: prescriptionForm.medications,
          notes: prescriptionForm.notes,
        },
        config
      );

      alert('Prescription added successfully!');
      closeModal();
      fetchDashboardData();
    } catch (error) {
      console.error('Error adding prescription:', error);
      alert('Failed to add prescription');
    }
  };

  const handleSubmitTest = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.post(
        'http://localhost:5001/api/test-results',
        {
          patient: selectedAppointment.patient._id,
          appointment: selectedAppointment._id,
          testName: testForm.testName,
          testType: testForm.testType,
          notes: testForm.notes,
          status: 'pending',
        },
        config
      );

      alert('Test ordered successfully!');
      closeModal();
      fetchDashboardData();
    } catch (error) {
      console.error('Error ordering test:', error);
      alert('Failed to order test');
    }
  };

  const handleSubmitRecord = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.post(
        'http://localhost:5001/api/medical-records',
        {
          patient: selectedAppointment.patient._id,
          appointment: selectedAppointment._id,
          diagnosis: recordForm.diagnosis,
          symptoms: recordForm.symptoms,
          treatment: recordForm.treatment,
          notes: recordForm.notes,
        },
        config
      );

      alert('Medical record added successfully!');
      closeModal();
      fetchDashboardData();
    } catch (error) {
      console.error('Error adding medical record:', error);
      alert('Failed to add medical record');
    }
  };

  if (loading) {
    return (
      <div className="doctor-dashboard">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="doctor-dashboard">
      <div className="dashboard-header">
        <h1>Doctor Dashboard</h1>
        <p>Manage your patients and appointments</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon today-icon">
            <img src="https://cdn-icons-png.flaticon.com/512/2693/2693507.png" alt="Today" />
          </div>
          <div className="stat-content">
            <h3>{stats.todayAppointments}</h3>
            <p>Today's Appointments</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon appointments-icon">
            <img src="https://cdn-icons-png.flaticon.com/512/3209/3209265.png" alt="Total Appointments" />
          </div>
          <div className="stat-content">
            <h3>{stats.totalAppointments}</h3>
            <p>Total Appointments</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon patients-icon">
            <img src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png" alt="Patients" />
          </div>
          <div className="stat-content">
            <h3>{stats.totalPatients}</h3>
            <p>Total Patients</p>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="appointments-section">
        <div className="section-header">
          <h2>Patient Appointments</h2>
        </div>
        {appointments.length > 0 ? (
          <div className="appointments-table">
            <table>
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Patient</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Reason</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment._id}>
                    <td>
                      <div className="date-time">
                        <span className="date">{formatDate(appointment.appointmentDate)}</span>
                        <span className="time">{formatTime(appointment.appointmentTime)}</span>
                      </div>
                    </td>
                    <td>
                      <div className="patient-info">
                        <span className="patient-name">{appointment.patient?.name || 'N/A'}</span>
                        <span className="patient-email">{appointment.patient?.email || 'N/A'}</span>
                      </div>
                    </td>
                    <td>{appointment.department?.name || 'N/A'}</td>
                    <td>{getStatusBadge(appointment.status)}</td>
                    <td>{appointment.reason || '-'}</td>
                    <td>
                      <div className="action-buttons">
                        {appointment.status === 'scheduled' && (
                          <button
                            className="btn-action btn-complete"
                            onClick={() => handleMarkAsCompleted(appointment._id)}
                            title="Mark as Completed"
                          >
                            ✓
                          </button>
                        )}
                        <button
                          className="btn-action btn-prescription"
                          onClick={() => openModal(appointment, 'prescription')}
                          title="Add Prescription"
                        >
                          <img src="https://cdn-icons-png.flaticon.com/512/2913/2913133.png" alt="Prescription" />
                        </button>
                        <button
                          className="btn-action btn-test"
                          onClick={() => openModal(appointment, 'test')}
                          title="Order Test"
                        >
                          <img src="https://cdn-icons-png.flaticon.com/512/3209/3209265.png" alt="Test" />
                        </button>
                        <button
                          className="btn-action btn-record"
                          onClick={() => openModal(appointment, 'record')}
                          title="Add Medical Record"
                        >
                          <img src="https://cdn-icons-png.flaticon.com/512/2541/2541988.png" alt="Record" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-data">
            <p>No appointments found</p>
          </div>
        )}
      </div>

      {/* Patient Test Results */}
      <div className="test-results-section">
        <div className="section-header">
          <h2>Patient Test Results</h2>
        </div>
        {testResults.length > 0 ? (
          <div className="test-results-grid">
            {testResults.map((test) => (
              <div key={test._id} className="test-result-card">
                <div className="test-result-header">
                  <span className="test-icon">
                    <img src="https://cdn-icons-png.flaticon.com/512/3209/3209265.png" alt="Test" />
                  </span>
                  <div>
                    <h3>{test.testName}</h3>
                    <p className="test-patient">{test.patient?.name || 'N/A'}</p>
                  </div>
                  <span className={`status-badge status-${test.status}`}>
                    {test.status}
                  </span>
                </div>
                <div className="test-result-body">
                  <p><strong>Test Type:</strong> {test.testType || 'N/A'}</p>
                  <p><strong>Ordered:</strong> {formatDate(test.createdAt)}</p>
                  {test.uploadedFile && (
                    <>
                      <p><strong>Status:</strong> <img src="https://cdn-icons-png.flaticon.com/512/190/190411.png" alt="Completed" className="status-check-icon" /> Result Uploaded</p>
                      <p><strong>Uploaded:</strong> {formatDate(test.uploadedAt)}</p>
                    </>
                  )}
                </div>
                <div className="test-result-footer">
                  <button
                    onClick={() => openTestResultModal(test)}
                    className="view-test-btn"
                  >
                    {test.uploadedFile ? (
                      <>
                        <img src="https://cdn-icons-png.flaticon.com/512/709/709612.png" alt="View" className="btn-icon" />
                        View Uploaded Result
                      </>
                    ) : (
                      <>
                        <img src="https://cdn-icons-png.flaticon.com/512/3209/3209265.png" alt="Details" className="btn-icon" />
                        View Details
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-data">
            <p>No test results found</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {modalType === 'prescription' && (
                  <>
                    <img src="https://cdn-icons-png.flaticon.com/512/2913/2913133.png" alt="Prescription" className="modal-icon" />
                    Add Prescription
                  </>
                )}
                {modalType === 'test' && (
                  <>
                    <img src="https://cdn-icons-png.flaticon.com/512/3209/3209265.png" alt="Test" className="modal-icon" />
                    Order Test
                  </>
                )}
                {modalType === 'record' && (
                  <>
                    <img src="https://cdn-icons-png.flaticon.com/512/2541/2541988.png" alt="Record" className="modal-icon" />
                    Add Medical Record
                  </>
                )}
                {modalType === 'viewTest' && (
                  <>
                    <img src="https://cdn-icons-png.flaticon.com/512/3209/3209265.png" alt="Test" className="modal-icon" />
                    Test Result Details
                  </>
                )}
              </h2>
              <button className="close-btn" onClick={closeModal}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              {modalType !== 'viewTest' && (
                <div className="patient-details">
                  <p>
                    <strong>Patient:</strong> {selectedAppointment?.patient?.name}
                  </p>
                  <p>
                    <strong>Date:</strong> {formatDate(selectedAppointment?.appointmentDate)}
                  </p>
                </div>
              )}

              {modalType === 'prescription' && (
                <form onSubmit={handleSubmitPrescription}>
                  <h3>Medications</h3>
                  {prescriptionForm.medications.map((med, index) => (
                    <div key={index} className="medication-form">
                      <div className="form-row">
                        <input
                          type="text"
                          placeholder="Medicine Name"
                          value={med.name}
                          onChange={(e) => updateMedication(index, 'name', e.target.value)}
                          required
                        />
                        <input
                          type="text"
                          placeholder="Dosage"
                          value={med.dosage}
                          onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-row">
                        <input
                          type="text"
                          placeholder="Frequency"
                          value={med.frequency}
                          onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                          required
                        />
                        <input
                          type="text"
                          placeholder="Duration"
                          value={med.duration}
                          onChange={(e) => updateMedication(index, 'duration', e.target.value)}
                          required
                        />
                      </div>
                      <textarea
                        placeholder="Instructions"
                        value={med.instructions}
                        onChange={(e) => updateMedication(index, 'instructions', e.target.value)}
                      />
                      {prescriptionForm.medications.length > 1 && (
                        <button
                          type="button"
                          className="btn-remove"
                          onClick={() => removeMedication(index)}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" className="btn-add-med" onClick={addMedication}>
                    + Add Medication
                  </button>
                  <textarea
                    placeholder="Notes"
                    value={prescriptionForm.notes}
                    onChange={(e) =>
                      setPrescriptionForm({ ...prescriptionForm, notes: e.target.value })
                    }
                  />
                  <button type="submit" className="btn-submit">
                    Add Prescription
                  </button>
                </form>
              )}

              {modalType === 'test' && (
                <form onSubmit={handleSubmitTest}>
                  <input
                    type="text"
                    placeholder="Test Name"
                    value={testForm.testName}
                    onChange={(e) => setTestForm({ ...testForm, testName: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Test Type"
                    value={testForm.testType}
                    onChange={(e) => setTestForm({ ...testForm, testType: e.target.value })}
                    required
                  />
                  <textarea
                    placeholder="Notes"
                    value={testForm.notes}
                    onChange={(e) => setTestForm({ ...testForm, notes: e.target.value })}
                  />
                  <button type="submit" className="btn-submit">
                    Order Test
                  </button>
                </form>
              )}

              {modalType === 'record' && (
                <form onSubmit={handleSubmitRecord}>
                  <input
                    type="text"
                    placeholder="Diagnosis"
                    value={recordForm.diagnosis}
                    onChange={(e) => setRecordForm({ ...recordForm, diagnosis: e.target.value })}
                    required
                  />
                  <textarea
                    placeholder="Symptoms"
                    value={recordForm.symptoms}
                    onChange={(e) => setRecordForm({ ...recordForm, symptoms: e.target.value })}
                    required
                  />
                  <textarea
                    placeholder="Treatment"
                    value={recordForm.treatment}
                    onChange={(e) => setRecordForm({ ...recordForm, treatment: e.target.value })}
                    required
                  />
                  <textarea
                    placeholder="Notes"
                    value={recordForm.notes}
                    onChange={(e) => setRecordForm({ ...recordForm, notes: e.target.value })}
                  />
                  <button type="submit" className="btn-submit">
                    Add Medical Record
                  </button>
                </form>
              )}

              {modalType === 'viewTest' && selectedTestResult && (
                <div className="view-test-result">
                  <div className="test-info">
                    <p><strong>Patient:</strong> {selectedTestResult.patient?.name || 'N/A'}</p>
                    <p><strong>Test Name:</strong> {selectedTestResult.testName}</p>
                    <p><strong>Test Type:</strong> {selectedTestResult.testType || 'N/A'}</p>
                    <p><strong>Status:</strong> {selectedTestResult.status}</p>
                    <p><strong>Ordered:</strong> {formatDate(selectedTestResult.createdAt)}</p>
                    {selectedTestResult.uploadedAt && (
                      <p><strong>Uploaded:</strong> {formatDate(selectedTestResult.uploadedAt)}</p>
                    )}
                  </div>

                  {selectedTestResult.notes && (
                    <div className="test-notes">
                      <h4>Notes:</h4>
                      <p>{selectedTestResult.notes}</p>
                    </div>
                  )}

                  {selectedTestResult.uploadedFile ? (
                    <div className="uploaded-result">
                      <h4>Uploaded Test Result:</h4>
                      {selectedTestResult.uploadedFile.toLowerCase().endsWith('.pdf') ? (
                        <div className="pdf-viewer">
                          <iframe
                            src={`http://localhost:5001/uploads/test-results/${selectedTestResult.uploadedFile}`}
                            title="Test Result PDF"
                            width="100%"
                            height="500px"
                            style={{ border: 'none', borderRadius: '8px' }}
                          />
                          <a
                            href={`http://localhost:5001/uploads/test-results/${selectedTestResult.uploadedFile}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="download-link"
                          >
                            📥 Download PDF
                          </a>
                        </div>
                      ) : (
                        <div className="image-viewer">
                          <img
                            src={`http://localhost:5001/uploads/test-results/${selectedTestResult.uploadedFile}`}
                            alt="Test Result"
                            style={{
                              width: '100%',
                              maxHeight: '500px',
                              objectFit: 'contain',
                              borderRadius: '8px',
                              marginBottom: '1rem',
                            }}
                          />
                          <a
                            href={`http://localhost:5001/uploads/test-results/${selectedTestResult.uploadedFile}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="download-link"
                          >
                            📥 Download Image
                          </a>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="no-upload">
                      <p>⏳ Waiting for patient to upload test result</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
