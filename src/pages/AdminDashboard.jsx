import { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    totalDepartments: 0,
  });
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'user', 'department'
  const [editingItem, setEditingItem] = useState(null);
  const [activeTab, setActiveTab] = useState('users'); // 'users', 'departments'
  const [loading, setLoading] = useState(true);

  // Form states
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'patient',
    phone: '',
    address: '',
    dateOfBirth: '',
    gender: '',
    department: '',
    specialization: '',
    qualification: '',
    experience: '',
  });

  const [departmentForm, setDepartmentForm] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const [usersRes, departmentsRes] = await Promise.all([
        axios.get('http://localhost:5001/api/users', config),
        axios.get('http://localhost:5001/api/departments', config),
      ]);

      const usersData = usersRes.data;
      const departmentsData = departmentsRes.data;

      setUsers(usersData);
      setDepartments(departmentsData);

      setStats({
        totalDoctors: usersData.filter((u) => u.role === 'doctor').length,
        totalPatients: usersData.filter((u) => u.role === 'patient').length,
        totalDepartments: departmentsData.length,
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    if (type === 'user') {
      if (item) {
        setUserForm({
          name: item.name || '',
          email: item.email || '',
          password: '',
          role: item.role || 'patient',
          phone: item.phone || '',
          address: item.address || '',
          dateOfBirth: item.dateOfBirth ? item.dateOfBirth.split('T')[0] : '',
          gender: item.gender || '',
          department: item.department?._id || '',
          specialization: item.specialization || '',
          qualification: item.qualification || '',
          experience: item.experience || '',
        });
      } else {
        setUserForm({
          name: '',
          email: '',
          password: '',
          role: 'patient',
          phone: '',
          address: '',
          dateOfBirth: '',
          gender: '',
          department: '',
          specialization: '',
          qualification: '',
          experience: '',
        });
      }
    } else if (type === 'department') {
      if (item) {
        setDepartmentForm({
          name: item.name || '',
          description: item.description || '',
        });
      } else {
        setDepartmentForm({
          name: '',
          description: '',
        });
      }
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  const handleSubmitUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const userData = {
        ...userForm,
      };

      if (editingItem) {
        await axios.put(`http://localhost:5001/api/users/${editingItem._id}`, userData, config);
        alert('User updated successfully!');
      } else {
        await axios.post('http://localhost:5001/api/users', userData, config);
        alert('User created successfully!');
      }

      closeModal();
      fetchDashboardData();
    } catch (error) {
      console.error('Error saving user:', error);
      alert(error.response?.data?.message || 'Failed to save user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        await axios.delete(`http://localhost:5001/api/users/${userId}`, config);
        alert('User deleted successfully!');
        fetchDashboardData();
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
      }
    }
  };

  const handleSubmitDepartment = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      if (editingItem) {
        await axios.put(
          `http://localhost:5001/api/departments/${editingItem._id}`,
          departmentForm,
          config
        );
        alert('Department updated successfully!');
      } else {
        await axios.post('http://localhost:5001/api/departments', departmentForm, config);
        alert('Department created successfully!');
      }

      closeModal();
      fetchDashboardData();
    } catch (error) {
      console.error('Error saving department:', error);
      alert(error.response?.data?.message || 'Failed to save department');
    }
  };

  const handleDeleteDepartment = async (departmentId) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        await axios.delete(`http://localhost:5001/api/departments/${departmentId}`, config);
        alert('Department deleted successfully!');
        fetchDashboardData();
      } catch (error) {
        console.error('Error deleting department:', error);
        alert('Failed to delete department');
      }
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Manage users and departments</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon doctors-icon">
            <img src="https://cdn-icons-png.flaticon.com/512/2785/2785482.png" alt="Doctors" />
          </div>
          <div className="stat-content">
            <h3>{stats.totalDoctors}</h3>
            <p>Total Doctors</p>
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
        <div className="stat-card">
          <div className="stat-icon departments-icon">
            <img src="https://cdn-icons-png.flaticon.com/512/2913/2913133.png" alt="Departments" />
          </div>
          <div className="stat-content">
            <h3>{stats.totalDepartments}</h3>
            <p>Departments</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button
          className={`tab ${activeTab === 'departments' ? 'active' : ''}`}
          onClick={() => setActiveTab('departments')}
        >
          Departments
        </button>
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="content-section">
          <div className="section-header">
            <h2>Users Management</h2>
            <button className="btn-primary" onClick={() => openModal('user')}>
              + Add User
            </button>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Phone</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge role-${user.role}`}>{user.role}</span>
                    </td>
                    <td>{user.phone || '-'}</td>
                    <td>{user.department?.name || '-'}</td>
                    <td>
                      <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-edit"
                          onClick={() => openModal('user', user)}
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteUser(user._id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Departments Tab */}
      {activeTab === 'departments' && (
        <div className="content-section">
          <div className="section-header">
            <h2>Departments Management</h2>
            <button className="btn-primary" onClick={() => openModal('department')}>
              + Add Department
            </button>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((dept) => (
                  <tr key={dept._id}>
                    <td>{dept.name}</td>
                    <td>{dept.description}</td>
                    <td>
                      <span className={`status-badge ${dept.isActive ? 'active' : 'inactive'}`}>
                        {dept.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-edit"
                          onClick={() => openModal('department', dept)}
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteDepartment(dept._id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {editingItem ? 'Edit' : 'Add'} {modalType === 'user' ? 'User' : 'Department'}
              </h2>
              <button className="close-btn" onClick={closeModal}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              {modalType === 'user' && (
                <form onSubmit={handleSubmitUser}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Name *</label>
                      <input
                        type="text"
                        value={userForm.name}
                        onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Email *</label>
                      <input
                        type="email"
                        value={userForm.email}
                        onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Password {!editingItem && '*'}</label>
                      <input
                        type="password"
                        value={userForm.password}
                        onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                        required={!editingItem}
                        placeholder={editingItem ? 'Leave blank to keep current' : ''}
                      />
                    </div>
                    <div className="form-group">
                      <label>Role *</label>
                      <select
                        value={userForm.role}
                        onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                        required
                      >
                        <option value="patient">Patient</option>
                        <option value="doctor">Doctor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Phone</label>
                      <input
                        type="text"
                        value={userForm.phone}
                        onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Gender</label>
                      <select
                        value={userForm.gender}
                        onChange={(e) => setUserForm({ ...userForm, gender: e.target.value })}
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Date of Birth</label>
                      <input
                        type="date"
                        value={userForm.dateOfBirth}
                        onChange={(e) => setUserForm({ ...userForm, dateOfBirth: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Address</label>
                      <input
                        type="text"
                        value={userForm.address}
                        onChange={(e) => setUserForm({ ...userForm, address: e.target.value })}
                      />
                    </div>
                  </div>
                  {userForm.role === 'doctor' && (
                    <>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Department</label>
                          <select
                            value={userForm.department}
                            onChange={(e) => setUserForm({ ...userForm, department: e.target.value })}
                          >
                            <option value="">Select Department</option>
                            {departments.map((dept) => (
                              <option key={dept._id} value={dept._id}>
                                {dept.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Specialization</label>
                          <input
                            type="text"
                            value={userForm.specialization}
                            onChange={(e) =>
                              setUserForm({ ...userForm, specialization: e.target.value })
                            }
                          />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Qualification</label>
                          <input
                            type="text"
                            value={userForm.qualification}
                            onChange={(e) =>
                              setUserForm({ ...userForm, qualification: e.target.value })
                            }
                          />
                        </div>
                        <div className="form-group">
                          <label>Experience (years)</label>
                          <input
                            type="number"
                            value={userForm.experience}
                            onChange={(e) => setUserForm({ ...userForm, experience: e.target.value })}
                          />
                        </div>
                      </div>
                    </>
                  )}
                  <button type="submit" className="btn-submit">
                    {editingItem ? 'Update' : 'Create'} User
                  </button>
                </form>
              )}

              {modalType === 'department' && (
                <form onSubmit={handleSubmitDepartment}>
                  <div className="form-group">
                    <label>Department Name *</label>
                    <input
                      type="text"
                      value={departmentForm.name}
                      onChange={(e) => setDepartmentForm({ ...departmentForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={departmentForm.description}
                      onChange={(e) =>
                        setDepartmentForm({ ...departmentForm, description: e.target.value })
                      }
                    />
                  </div>
                  <button type="submit" className="btn-submit">
                    {editingItem ? 'Update' : 'Create'} Department
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
