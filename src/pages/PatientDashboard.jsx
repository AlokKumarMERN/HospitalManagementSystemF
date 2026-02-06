import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './PatientDashboard.css';

const PatientDashboard = () => {
  const [stats, setStats] = useState({
    appointments: 0,
    medicalRecords: 0,
    prescriptions: 0,
    testResults: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [allActivities, setAllActivities] = useState([]);
  const [showAllActivities, setShowAllActivities] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();

    // Auto-refresh dashboard data every 30 seconds for real-time updates
    const refreshInterval = setInterval(() => {
      fetchDashboardData();
    }, 30000); // 30 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(refreshInterval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // Fetch all data in parallel
      const [appointmentsRes, medicalRecordsRes, prescriptionsRes, testResultsRes] = await Promise.all([
        axios.get('http://localhost:5001/api/appointments', config),
        axios.get('http://localhost:5001/api/medical-records', config),
        axios.get('http://localhost:5001/api/prescriptions', config),
        axios.get('http://localhost:5001/api/test-results', config),
      ]);

      setStats({
        appointments: appointmentsRes.data.length,
        medicalRecords: medicalRecordsRes.data.length,
        prescriptions: prescriptionsRes.data.length,
        testResults: testResultsRes.data.length,
      });

      // Get recent appointments (latest 5)
      setRecentAppointments(appointmentsRes.data.slice(0, 5));

      // Combine all activities and sort by date
      const activities = [
        ...appointmentsRes.data.map(a => ({ type: 'appointment', date: a.appointmentDate, data: a })),
        ...medicalRecordsRes.data.map(m => ({ type: 'medical record', date: m.createdAt, data: m })),
        ...prescriptionsRes.data.map(p => ({ type: 'prescription', date: p.createdAt, data: p })),
        ...testResultsRes.data.map(t => ({ type: 'test result', date: t.createdAt, data: t })),
      ];
      
      const sortedActivities = activities
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      
      setAllActivities(sortedActivities);
      setRecentActivity(sortedActivities.slice(0, 5));
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

  const toggleShowAllActivities = () => {
    setShowAllActivities(!showAllActivities);
  };

  const getStatusBadge = (status) => {
    const statusClass = {
      scheduled: 'status-scheduled',
      completed: 'status-completed',
      cancelled: 'status-cancelled',
      'in-progress': 'status-in-progress',
      pending: 'status-pending',
    };
    return <span className={`status-badge ${statusClass[status]}`}>{status}</span>;
  };

  if (loading) {
    return (
      <div className="patient-dashboard">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="patient-dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Patient Dashboard</h1>
          <p>Welcome back! Here's your health overview</p>
        </div>
        <button onClick={fetchDashboardData} className="refresh-btn" title="Refresh Dashboard">
          <img src="https://cdn-icons-png.flaticon.com/512/2618/2618245.png" alt="Refresh" className="refresh-icon" />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <Link to="/appointments" className="stat-card stat-card-link">
          <div className="stat-icon appointments-icon">
            <img src="https://cdn-icons-png.flaticon.com/512/2693/2693507.png" alt="Appointments" />
          </div>
          <div className="stat-content">
            <h3>{stats.appointments}</h3>
            <p>Total Appointments</p>
          </div>
        </Link>
        <Link to="/medical-records" className="stat-card stat-card-link">
          <div className="stat-icon records-icon">
            <img src="https://cdn-icons-png.flaticon.com/512/3209/3209265.png" alt="Medical Records" />
          </div>
          <div className="stat-content">
            <h3>{stats.medicalRecords}</h3>
            <p>Medical Records</p>
          </div>
        </Link>
        <Link to="/prescriptions" className="stat-card stat-card-link">
          <div className="stat-icon prescriptions-icon">
            <img src="https://cdn-icons-png.flaticon.com/512/2913/2913133.png" alt="Prescriptions" />
          </div>
          <div className="stat-content">
            <h3>{stats.prescriptions}</h3>
            <p>Prescriptions</p>
          </div>
        </Link>
        <Link to="/test-results" className="stat-card stat-card-link">
          <div className="stat-icon tests-icon">
            <img src="https://cdn-icons-png.flaticon.com/512/3209/3209265.png" alt="Test Results" />
          </div>
          <div className="stat-content">
            <h3>{stats.testResults}</h3>
            <p>Test Results</p>
          </div>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <Link to="/appointment" className="action-button">
            <span className="action-icon">
              <img src="https://cdn-icons-png.flaticon.com/512/1237/1237946.png" alt="Add" />
            </span>
            <span>Book Appointment</span>
          </Link>
          <Link to="/appointments" className="action-button">
            <span className="action-icon">
              <img src="https://cdn-icons-png.flaticon.com/512/709/709612.png" alt="View" />
            </span>
            <span>View Appointments</span>
          </Link>
          <Link to="/medical-records" className="action-button">
            <span className="action-icon">
              <img src="https://cdn-icons-png.flaticon.com/512/2541/2541988.png" alt="Records" />
            </span>
            <span>Medical Records</span>
          </Link>
          <Link to="/prescriptions" className="action-button">
            <span className="action-icon">
              <img src="https://cdn-icons-png.flaticon.com/512/2913/2913133.png" alt="Prescriptions" />
            </span>
            <span>Prescriptions</span>
          </Link>
          <Link to="/test-results" className="action-button">
            <span className="action-icon">
              <img src="https://cdn-icons-png.flaticon.com/512/3209/3209265.png" alt="Test Results" />
            </span>
            <span>Test Results</span>
          </Link>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-content">
        {/* Recent Appointments */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Appointments</h2>
            <Link to="/appointments" className="view-all">View All →</Link>
          </div>
          {recentAppointments.length > 0 ? (
            <div className="appointments-list">
              {recentAppointments.map((appointment) => (
                <div key={appointment._id} className="appointment-item">
                  <div className="appointment-date">
                    <span className="date">{formatDate(appointment.appointmentDate)}</span>
                    <span className="time">{formatTime(appointment.appointmentTime)}</span>
                  </div>
                  <div className="appointment-info">
                    <p className="doctor-name">Dr. {appointment.doctor?.name || 'N/A'}</p>
                    <p className="department">{appointment.department?.name || 'N/A'}</p>
                  </div>
                  <div className="appointment-status">
                    {getStatusBadge(appointment.status)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-data">
              <p>No appointments found</p>
              <Link to="/appointments" className="btn-primary">Book Your First Appointment</Link>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Activity</h2>
            {allActivities.length > 5 && (
              <button onClick={toggleShowAllActivities} className="view-all">
                {showAllActivities ? 'Show Less' : 'View All →'}
              </button>
            )}
          </div>
          {(showAllActivities ? allActivities : recentActivity).length > 0 ? (
            <div className="activity-list">
              {(showAllActivities ? allActivities : recentActivity).map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-icon">
                    {activity.type === 'appointment' && <img src="https://cdn-icons-png.flaticon.com/512/2693/2693507.png" alt="Appointment" />}
                    {activity.type === 'medical record' && <img src="https://cdn-icons-png.flaticon.com/512/3209/3209265.png" alt="Medical Record" />}
                    {activity.type === 'prescription' && <img src="https://cdn-icons-png.flaticon.com/512/2913/2913133.png" alt="Prescription" />}
                    {activity.type === 'test result' && <img src="https://cdn-icons-png.flaticon.com/512/3209/3209265.png" alt="Test Result" />}
                  </div>
                  <div className="activity-content">
                    <p className="activity-title">
                      New {activity.type}
                      {activity.type === 'test result' && activity.data.status && 
                        ` - ${activity.data.status}`}
                    </p>
                    <p className="activity-date">{formatDate(activity.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-data">
              <p>No recent activity</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
