import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import './ViewAppointments.css';

const ViewAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, upcoming, completed, cancelled

  useEffect(() => {
    fetchAppointments();

    // Auto-refresh appointments every 30 seconds for real-time updates
    const refreshInterval = setInterval(() => {
      fetchAppointments();
    }, 30000); // 30 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(refreshInterval);
  }, []);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get('http://localhost:5001/api/appointments', config);
      setAppointments(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        await axios.delete(`http://localhost:5001/api/appointments/${appointmentId}`, config);
        alert('Appointment cancelled successfully!');
        fetchAppointments();
      } catch (error) {
        console.error('Error cancelling appointment:', error);
        alert('Failed to cancel appointment');
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
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

  const filteredAppointments = appointments.filter((appointment) => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') {
      const appointmentDate = new Date(appointment.appointmentDate);
      const today = new Date();
      return appointmentDate >= today && appointment.status === 'scheduled';
    }
    return appointment.status === filter;
  });

  if (loading) {
    return (
      <div className="app">
        <Header />
        <main className="main-content">
          <div className="container">
            <div className="loading">Loading appointments...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <div className="container">
          <div className="view-appointments-page">
            <div className="page-header">
              <h1>My Appointments</h1>
              <Link to="/appointment" className="btn-book-new">
                + Book New Appointment
              </Link>
            </div>

            {/* Filter Tabs */}
            <div className="filter-tabs">
              <button
                className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All ({appointments.length})
              </button>
              <button
                className={`filter-tab ${filter === 'upcoming' ? 'active' : ''}`}
                onClick={() => setFilter('upcoming')}
              >
                Upcoming
              </button>
              <button
                className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
                onClick={() => setFilter('completed')}
              >
                Completed
              </button>
              <button
                className={`filter-tab ${filter === 'cancelled' ? 'active' : ''}`}
                onClick={() => setFilter('cancelled')}
              >
                Cancelled
              </button>
            </div>

            {/* Appointments List */}
            {filteredAppointments.length > 0 ? (
              <div className="appointments-grid">
                {filteredAppointments.map((appointment) => (
                  <div key={appointment._id} className="appointment-card">
                    <div className="card-header">
                      <div className="appointment-date-time">
                        <div className="date-badge">
                          <span className="day">{new Date(appointment.appointmentDate).getDate()}</span>
                          <span className="month">
                            {new Date(appointment.appointmentDate).toLocaleDateString('en-US', { month: 'short' })}
                          </span>
                        </div>
                        <div className="time-info">
                          <p className="time">🕐 {formatTime(appointment.appointmentTime)}</p>
                          <p className="full-date">{formatDate(appointment.appointmentDate)}</p>
                        </div>
                      </div>
                      <div className="card-status">
                        {getStatusBadge(appointment.status)}
                      </div>
                    </div>

                    <div className="card-body">
                      <div className="doctor-info">
                        <div className="doctor-avatar">
                          <img src="https://cdn-icons-png.flaticon.com/512/2785/2785482.png" alt="Doctor" />
                        </div>
                        <div className="doctor-details">
                          <h3>Dr. {appointment.doctor?.name || 'N/A'}</h3>
                          <p className="specialization">{appointment.doctor?.specialization || 'General'}</p>
                        </div>
                      </div>

                      <div className="appointment-details">
                        <div className="detail-item">
                          <span className="detail-icon">
                            <img src="https://cdn-icons-png.flaticon.com/512/2913/2913133.png" alt="Hospital" />
                          </span>
                          <div>
                            <p className="detail-label">Department</p>
                            <p className="detail-value">{appointment.department?.name || 'N/A'}</p>
                          </div>
                        </div>

                        {appointment.reason && (
                          <div className="detail-item">
                            <span className="detail-icon">
                              <img src="https://cdn-icons-png.flaticon.com/512/2541/2541988.png" alt="Reason" />
                            </span>
                            <div>
                              <p className="detail-label">Reason</p>
                              <p className="detail-value">{appointment.reason}</p>
                            </div>
                          </div>
                        )}

                        {appointment.notes && (
                          <div className="detail-item">
                            <span className="detail-icon">💬</span>
                            <div>
                              <p className="detail-label">Notes</p>
                              <p className="detail-value">{appointment.notes}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="card-footer">
                      {appointment.status === 'scheduled' && (
                        <button
                          className="btn-cancel"
                          onClick={() => handleCancelAppointment(appointment._id)}
                        >
                          Cancel Appointment
                        </button>
                      )}
                      {appointment.status === 'completed' && (
                        <button className="btn-view-details" disabled>
                          View Medical Records
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-appointments">
                <div className="no-appointments-icon">
                  <img src="https://cdn-icons-png.flaticon.com/512/2693/2693507.png" alt="No Appointments" />
                </div>
                <h2>No {filter !== 'all' ? filter : ''} appointments found</h2>
                <p>
                  {filter === 'all'
                    ? "You haven't booked any appointments yet."
                    : `You don't have any ${filter} appointments.`}
                </p>
                <Link to="/appointment" className="btn-primary">
                  Book Your First Appointment
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ViewAppointments;
