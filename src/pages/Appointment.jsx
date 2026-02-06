import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import './Appointment.css';

const Appointment = () => {
  const { user } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    patientName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    department: '',
    doctor: '',
    date: '',
    time: '',
    reason: '',
  });
  const [slotAvailable, setSlotAvailable] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [checkingSlot, setCheckingSlot] = useState(false);

  // Generate time slots in 15-minute intervals from 9 AM to 9 PM, excluding 1 PM to 2 PM
  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 9; // 9 AM
    const endHour = 21; // 9 PM
    const lunchStartHour = 13; // 1 PM
    const lunchEndHour = 14; // 2 PM

    for (let hour = startHour; hour < endHour; hour++) {
      // Skip lunch break (1 PM to 2 PM)
      if (hour >= lunchStartHour && hour < lunchEndHour) {
        continue;
      }

      for (let minute = 0; minute < 60; minute += 15) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const displayHour = hour > 12 ? hour - 12 : hour;
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayTime = `${displayHour}:${minute.toString().padStart(2, '0')} ${ampm}`;
        
        slots.push({ value: timeString, label: displayTime });
      }
    }

    return slots;
  };

  const timeSlots = generateTimeSlots();

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (formData.department) {
      fetchDoctorsByDepartment(formData.department);
    } else {
      setDoctors([]);
      setFormData({ ...formData, doctor: '' });
    }
  }, [formData.department]);

  useEffect(() => {
    if (formData.doctor && formData.date && formData.time) {
      checkSlotAvailability();
    } else {
      setSlotAvailable(null);
    }
  }, [formData.doctor, formData.date, formData.time]);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/departments');
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const fetchDoctorsByDepartment = async (departmentId) => {
    try {
      const response = await axios.get(`http://localhost:5001/api/departments/${departmentId}/doctors`);
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const checkSlotAvailability = async () => {
    try {
      setCheckingSlot(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5001/api/appointments/check-slot', {
        params: {
          doctor: formData.doctor,
          appointmentDate: formData.date,
          appointmentTime: formData.time,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSlotAvailable(response.data.available);
      setCheckingSlot(false);
    } catch (error) {
      console.error('Error checking slot availability:', error);
      setCheckingSlot(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!slotAvailable) {
      setError('Selected time slot is not available. Please choose another time.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.post(
        'http://localhost:5001/api/appointments',
        {
          department: formData.department,
          doctor: formData.doctor,
          appointmentDate: formData.date,
          appointmentTime: formData.time,
          reason: formData.reason,
        },
        config
      );

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setFormData({
          patientName: user?.name || '',
          email: user?.email || '',
          phone: user?.phone || '',
          department: '',
          doctor: '',
          date: '',
          time: '',
          reason: '',
        });
        setSlotAvailable(null);
      }, 3000);
    } catch (error) {
      console.error('Error booking appointment:', error);
      setError(error.response?.data?.message || 'Failed to book appointment');
    }
  };

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <div className="container">
          <div className="appointment-page">
            <h1>Book an Appointment</h1>
            {success && (
              <div className="success-banner">
                Appointment booked successfully! We'll contact you soon.
              </div>
            )}
            {error && (
              <div className="error-banner">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="appointment-form">
              <div className="form-row">
                <Input
                  label="Full Name"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                  required
                  disabled
                />
                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled
                />
              </div>
              <div className="form-row">
                <Input
                  label="Phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
                <div className="input-group">
                  <label className="input-label">
                    Department <span className="required">*</span>
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                    className="input-field"
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept._id} value={dept._id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="input-group">
                  <label className="input-label">
                    Doctor <span className="required">*</span>
                  </label>
                  <select
                    name="doctor"
                    value={formData.doctor}
                    onChange={handleChange}
                    required
                    className="input-field"
                    disabled={!formData.department}
                  >
                    <option value="">
                      {formData.department ? 'Select Doctor' : 'First select a department'}
                    </option>
                    {doctors.map((doctor) => (
                      <option key={doctor._id} value={doctor._id}>
                        Dr. {doctor.name} - {doctor.specialization || 'General'}
                      </option>
                    ))}
                  </select>
                </div>
                <Input
                  label="Preferred Date"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="form-row">
                <div className="input-group">
                  <label className="input-label">
                    Preferred Time <span className="required">*</span>
                  </label>
                  <select
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                    className="input-field"
                  >
                    <option value="">Select Time</option>
                    {timeSlots.map((slot) => (
                      <option key={slot.value} value={slot.value}>
                        {slot.label}
                      </option>
                    ))}
                  </select>
                  {checkingSlot && (
                    <p className="slot-status checking">Checking availability...</p>
                  )}
                  {!checkingSlot && slotAvailable === true && (
                    <p className="slot-status available">✓ Slot is available</p>
                  )}
                  {!checkingSlot && slotAvailable === false && (
                    <p className="slot-status unavailable">✗ Slot is not available</p>
                  )}
                </div>
                <div className="input-group">
                  <label className="input-label">Reason for Visit</label>
                  <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    className="input-field textarea"
                    rows="4"
                    placeholder="Brief description of your medical concern..."
                  />
                </div>
              </div>
              <Button type="submit" fullWidth disabled={slotAvailable === false}>
                Book Appointment
              </Button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Appointment;
