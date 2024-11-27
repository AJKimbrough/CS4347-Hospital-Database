import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Scheduling() {
  const [formData, setFormData] = useState({
    patient_id: '',
    staff_id: '',
    date: '',
    time: '',
    reason: '',
    status: '',
  });
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

  // Fetch appointments from the server when the component mounts
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get('http://localhost:5001/scheduling');
        setAppointments(response.data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };
    fetchAppointments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const appointmentData = {
      patient_id: formData.patient_id,
      staff_id: formData.staff_id,
      appointment_date: `${formData.date} ${formData.time}`, // Combine date and time into a single timestamp
      reason_for_visit: formData.reason,
      status: formData.status,
    };

    try {
      if (selectedAppointmentId) {
        // Update existing appointment
        const response = await axios.put(`http://localhost:5001/scheduling/${selectedAppointmentId}`, appointmentData);
        setConfirmationMessage(response.data.message);
      } else {
        // Create a new appointment
        const response = await axios.post('http://localhost:5001/scheduling', appointmentData);
        setConfirmationMessage(response.data.message);
      }
      // Clear form data after successful submission
      setFormData({
        patient_id: '',
        staff_id: '',
        date: '',
        time: '',
        reason: '',
        status: '',
      });
      setSelectedAppointmentId(null); // Reset selected appointment ID
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error || 'An error occurred while scheduling the appointment.'
      );
    }
  };

  const handleDelete = async (appointmentId) => {
    try {
      await axios.delete(`http://localhost:5001/scheduling/${appointmentId}`);
      setConfirmationMessage('Appointment deleted successfully');
      // Remove deleted appointment from the list
      setAppointments(appointments.filter((appointment) => appointment.appointment_id !== appointmentId));
    } catch (error) {
      setErrorMessage('Error deleting appointment');
    }
  };

  const handleEdit = (appointment) => {
    setSelectedAppointmentId(appointment.appointment_id);
    setFormData({
      patient_id: appointment.patient_id,
      staff_id: appointment.staff_id,
      date: appointment.appointment_date.split(' ')[0], // Split date and time
      time: appointment.appointment_date.split(' ')[1],
      reason: appointment.reason_for_visit,
      status: appointment.status,
    });
  };

  return (
    <div className="container mt-4" style={{ textAlign: 'center', color: 'white' }}>
      <h1>Appointment Scheduling</h1>

      {/* Appointment Form */}
      <form onSubmit={handleSubmit} style={{ width: '60%', margin: '0 auto', display: 'grid', gap: '10px' }}>
        <label>
          Patient ID:
          <input
            type="text"
            name="patient_id"
            value={formData.patient_id}
            onChange={handleChange}
            required
            style={{ padding: '10px', borderRadius: '5px' }}
          />
        </label>
        <label>
          Staff ID:
          <input
            type="text"
            name="staff_id"
            value={formData.staff_id}
            onChange={handleChange}
            required
            style={{ padding: '10px', borderRadius: '5px' }}
          />
        </label>
        <label>
          Date:
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            style={{ padding: '10px', borderRadius: '5px' }}
          />
        </label>
        <label>
          Time:
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
            style={{ padding: '10px', borderRadius: '5px' }}
          />
        </label>
        <label>
          Reason:
          <input
            type="text"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            required
            style={{ padding: '10px', borderRadius: '5px' }}
          />
        </label>
        <label>
          Status:
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            style={{ padding: '10px', borderRadius: '5px' }}
          >
            <option value="">Select Status</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </label>
        <button
          type="submit"
          style={{
            padding: '10px',
            borderRadius: '5px',
            backgroundColor: '#0DB8DE',
            color: 'white',
            fontWeight: 'bold',
          }}
        >
          {selectedAppointmentId ? 'Update Appointment' : 'Schedule Appointment'}
        </button>
      </form>

      {confirmationMessage && <p>{confirmationMessage}</p>}
      {errorMessage && <p>{errorMessage}</p>}

      <h2>Existing Appointments</h2>
      <div style={{ width: '80%', margin: '20px auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#1A2226' }}>
              <th style={{ padding: '10px', border: '1px solid #444' }}>Patient ID</th>
              <th style={{ padding: '10px', border: '1px solid #444' }}>Reason</th>
              <th style={{ padding: '10px', border: '1px solid #444' }}>Date</th>
              <th style={{ padding: '10px', border: '1px solid #444' }}>Time</th>
              <th style={{ padding: '10px', border: '1px solid #444' }}>Status</th>
              <th style={{ padding: '10px', border: '1px solid #444' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.appointment_id} style={{ backgroundColor: '#2A3338' }}>
                <td style={{ padding: '10px', border: '1px solid #444' }}>{appointment.patient_id}</td>
                <td style={{ padding: '10px', border: '1px solid #444' }}>{appointment.reason_for_visit}</td>
                <td style={{ padding: '10px', border: '1px solid #444' }}>{appointment.appointment_date.split(' ')[0]}</td>
                <td style={{ padding: '10px', border: '1px solid #444' }}>{appointment.appointment_date.split(' ')[1]}</td>
                <td style={{ padding: '10px', border: '1px solid #444' }}>{appointment.status}</td>
                <td style={{ padding: '10px', border: '1px solid #444' }}>
                  <button
                    onClick={() => handleEdit(appointment)}
                    style={{
                      padding: '5px 10px',
                      borderRadius: '5px',
                      backgroundColor: '#0DB8DE',
                      color: 'white',
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(appointment.appointment_id)}
                    style={{
                      padding: '5px 10px',
                      borderRadius: '5px',
                      backgroundColor: '#ff5722',
                      color: 'white',
                      marginLeft: '10px',
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Scheduling;
