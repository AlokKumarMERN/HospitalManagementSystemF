import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import './TestResults.css';

const TestResults = () => {
  const { user } = useAuth();
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTest, setSelectedTest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all'); // all, pending, completed
  const [uploadingId, setUploadingId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchTestResults();

    // Auto-refresh every 30 seconds
    const refreshInterval = setInterval(() => {
      fetchTestResults();
    }, 30000);

    return () => clearInterval(refreshInterval);
  }, []);

  const fetchTestResults = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get('http://localhost:5001/api/test-results', config);
      setTestResults(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching test results:', error);
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const openModal = (test) => {
    setSelectedTest(test);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTest(null);
  };

  const handleFileSelect = (e, testId) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload only JPEG, PNG, or PDF files');
        return;
      }
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      setSelectedFile({ file, testId });
    }
  };

  const handleUpload = async (testId) => {
    if (!selectedFile || selectedFile.testId !== testId) {
      alert('Please select a file first');
      return;
    }

    try {
      setUploadingId(testId);
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('testFile', selectedFile.file);

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      };

      await axios.post(
        `http://localhost:5001/api/test-results/${testId}/upload`,
        formData,
        config
      );

      alert('Test result uploaded successfully!');
      setSelectedFile(null);
      setUploadingId(null);
      fetchTestResults();
    } catch (error) {
      console.error('Error uploading file:', error);
      alert(error.response?.data?.message || 'Failed to upload file');
      setUploadingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'status-pending',
      completed: 'status-completed',
      'in-progress': 'status-in-progress',
    };

    return <span className={`status-badge ${statusClasses[status]}`}>{status}</span>;
  };

  const filteredResults = testResults.filter((test) => {
    if (filter === 'all') return true;
    return test.status === filter;
  });

  if (loading) {
    return (
      <div className="test-results-page">
        <Header />
        <div className="loading">Loading test results...</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="test-results-page">
      <Header />
      <main className="test-results-main">
        <div className="test-results-container">
          <div className="test-results-header">
            <div>
              <h1>My Test Results</h1>
              <p>View all your laboratory and diagnostic test results</p>
            </div>
            <Link to="/dashboard" className="back-btn">
              ← Back to Dashboard
            </Link>
          </div>

          {/* Filter Tabs */}
          <div className="filter-tabs">
            <button
              className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({testResults.length})
            </button>
            <button
              className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              Pending ({testResults.filter((t) => t.status === 'pending').length})
            </button>
            <button
              className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Completed ({testResults.filter((t) => t.status === 'completed').length})
            </button>
          </div>

          {filteredResults.length > 0 ? (
            <div className="test-results-grid">
              {filteredResults.map((test) => (
                <div key={test._id} className="test-card">
                  <div className="test-header">
                    <div className="test-info">
                      <div className="test-icon">
                        <img src="https://cdn-icons-png.flaticon.com/512/3209/3209265.png" alt="Test" />
                      </div>
                      <div>
                        <h3>{test.testName}</h3>
                        <p className="test-type">{test.testType}</p>
                      </div>
                    </div>
                    {getStatusBadge(test.status)}
                  </div>

                  <div className="test-body">
                    <div className="doctor-info-section">
                      <p>
                        <strong>Ordered by:</strong> Dr. {test.doctor?.name || 'N/A'}
                      </p>
                      <p>
                        <strong>Date Ordered:</strong> {formatDate(test.createdAt)}
                      </p>
                      {test.resultDate && (
                        <p>
                          <strong>Result Date:</strong> {formatDate(test.resultDate)}
                        </p>
                      )}
                    </div>

                    {test.result && (
                      <div className="result-preview">
                        <strong>Result:</strong>
                        <p>{test.result.substring(0, 100)}{test.result.length > 100 ? '...' : ''}</p>
                      </div>
                    )}

                    {test.notes && !test.result && (
                      <div className="notes-preview">
                        <strong>Notes:</strong>
                        <p>{test.notes.substring(0, 80)}{test.notes.length > 80 ? '...' : ''}</p>
                      </div>
                    )}

                    {/* Show upload section for pending tests */}
                    {test.status === 'pending' && user?.role === 'patient' && (
                      <div className="upload-section">
                        <label className="file-input-label">
                          <input
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,application/pdf"
                            onChange={(e) => handleFileSelect(e, test._id)}
                            className="file-input"
                          />
                          <span className="file-input-text">
                            {selectedFile?.testId === test._id
                              ? selectedFile.file.name
                              : '📎 Choose File (JPEG, PNG, PDF)'}
                          </span>
                        </label>
                        {selectedFile?.testId === test._id && (
                          <button
                            onClick={() => handleUpload(test._id)}
                            className="upload-btn"
                            disabled={uploadingId === test._id}
                          >
                            {uploadingId === test._id ? 'Uploading...' : '⬆️ Upload Result'}
                          </button>
                        )}
                      </div>
                    )}

                    {/* Show uploaded file info for completed tests */}
                    {test.uploadedFile && (
                      <div className="uploaded-file-info">
                        <p>
                          <img src="https://cdn-icons-png.flaticon.com/512/2541/2541988.png" alt="File" className="file-icon" />
                          <strong>Uploaded:</strong> {test.uploadedFileName}
                        </p>
                        <p className="upload-date">
                          {formatDate(test.uploadedAt)}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="test-footer">
                    <button onClick={() => openModal(test)} className="view-details-btn">
                      View Full Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-data">
              <div className="no-data-icon">
                <img src="https://cdn-icons-png.flaticon.com/512/3209/3209265.png" alt="No Tests" />
              </div>
              <h3>
                {filter === 'all'
                  ? 'No Test Results Yet'
                  : `No ${filter.charAt(0).toUpperCase() + filter.slice(1)} Tests`}
              </h3>
              <p>Your test results from doctors will appear here</p>
              {filter === 'all' && (
                <Link to="/appointment" className="btn-primary">
                  Book an Appointment
                </Link>
              )}
              {filter !== 'all' && (
                <button onClick={() => setFilter('all')} className="btn-primary">
                  View All Tests
                </button>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Modal for Full Test Details */}
      {showModal && selectedTest && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <img src="https://cdn-icons-png.flaticon.com/512/3209/3209265.png" alt="Test" className="modal-icon" />
                Test Result Details
              </h2>
              <button className="close-btn" onClick={closeModal}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="test-status-section">
                {getStatusBadge(selectedTest.status)}
              </div>

              <div className="test-info-section">
                <h3>{selectedTest.testName}</h3>
                <p className="test-type-full">{selectedTest.testType}</p>
              </div>

              <div className="test-details-section">
                <p>
                  <strong>Ordered by:</strong> Dr. {selectedTest.doctor?.name || 'N/A'}
                </p>
                <p>
                  <strong>Date Ordered:</strong> {formatDate(selectedTest.createdAt)}
                </p>
                {selectedTest.resultDate && (
                  <p>
                    <strong>Result Date:</strong> {formatDate(selectedTest.resultDate)}
                  </p>
                )}
                {selectedTest.appointment && (
                  <p>
                    <strong>Appointment Date:</strong>{' '}
                    {formatDate(selectedTest.appointment.appointmentDate)}
                  </p>
                )}
              </div>

              {selectedTest.result ? (
                <div className="result-section">
                  <h3>Test Result</h3>
                  <div className="result-content">
                    <p>{selectedTest.result}</p>
                  </div>
                </div>
              ) : (
                <div className="pending-section">
                  <div className="pending-message">
                    <span className="pending-icon">⏳</span>
                    <p>Test results are pending. You will be notified once they are available.</p>
                  </div>
                </div>
              )}

              {/* Display uploaded file */}
              {selectedTest.uploadedFile && (
                <div className="uploaded-file-section">
                  <h3>Uploaded Test Result</h3>
                  <div className="file-viewer">
                    {selectedTest.uploadedFile.toLowerCase().endsWith('.pdf') ? (
                      <div className="pdf-viewer">
                        <iframe
                          src={`http://localhost:5001/uploads/test-results/${selectedTest.uploadedFile}`}
                          title="Test Result PDF"
                          width="100%"
                          height="500px"
                        />
                        <a
                          href={`http://localhost:5001/uploads/test-results/${selectedTest.uploadedFile}`}
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
                          src={`http://localhost:5001/uploads/test-results/${selectedTest.uploadedFile}`}
                          alt="Test Result"
                          className="test-result-image"
                        />
                        <a
                          href={`http://localhost:5001/uploads/test-results/${selectedTest.uploadedFile}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="download-link"
                        >
                          📥 Download Image
                        </a>
                      </div>
                    )}
                    <p className="upload-info">
                      <strong>Uploaded:</strong> {formatDate(selectedTest.uploadedAt)}
                    </p>
                  </div>
                </div>
              )}

              {selectedTest.notes && (
                <div className="notes-section">
                  <h3>Additional Notes</h3>
                  <div className="notes-content">
                    <p>{selectedTest.notes}</p>
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

export default TestResults;
