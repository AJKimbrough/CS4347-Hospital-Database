import React, { useState, useEffect } from 'react';

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
  const [showAppointments, setShowAppointments] = useState(false);

  // Fetch appointments from the server
  const fetchAppointments = async () => {
    try {
      const response = await fetch('http://localhost:5001/scheduling');
      if (!response.ok) {
        throw new Error('Error fetching appointments');
      }
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setErrorMessage('Error fetching appointments');
    }
  };

  
  useEffect(() => {
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
      appointment_date: `${formData.date} ${formData.time}`, 
      reason_for_visit: formData.reason,
      status: formData.status,
    };

    try {
      const url = selectedAppointmentId
        ? `http://localhost:5001/scheduling/${selectedAppointmentId}`
        : 'http://localhost:5001/scheduling';
      const method = selectedAppointmentId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      });

      if (!response.ok) {
        throw new Error('Error submitting appointment');
      }

      const result = await response.json();
      setConfirmationMessage(result.message);

      
      fetchAppointments();

      // Clear form data after successful submission
      setFormData({
        patient_id: '',
        staff_id: '',
        date: '',
        time: '',
        reason: '',
        status: '',
      });
      setSelectedAppointmentId(null); 
    } catch (error) {
      setErrorMessage(error.message || 'An error occurred while scheduling the appointment.');
    }
  };

  const handleDelete = async (appointmentId) => {
    try {
      const response = await fetch(`http://localhost:5001/scheduling/${appointmentId}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Error deleting appointment');
      }
  
      setConfirmationMessage('Appointment deleted successfully');
      
      // Remove deleted appointment 
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
      date: appointment.appointment_date.split(' ')[0], 
      time: appointment.appointment_date.split(' ')[1],
      reason: appointment.reason_for_visit,
      status: appointment.status,
    });
  };

  // Format date and time for table
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const formattedDate = date.toISOString().split('T')[0]; 
    return formattedDate;
  };

  const formatTime = (isoDate) => {
    const date = new Date(isoDate);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`; // Returns time in HH:mm format
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#222D32',
      color: 'white',
      textAlign: 'center',
    }}>
      <h1>Appointment Scheduling</h1>

      {/* Appointment Form */}
      <form onSubmit={handleSubmit} style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        width: '50%',
      }}>
        <input 
          type="text" 
          placeholder="Patient ID (Required)" 
          name="patient_id" 
          value={formData.patient_id} 
          onChange={handleChange} 
          style={{ padding: '10px', borderRadius: '5px' }} 
        />
        <input 
          type="text" 
          placeholder="Staff ID (Required)" 
          name="staff_id" 
          value={formData.staff_id} 
          onChange={handleChange} 
          style={{ padding: '10px', borderRadius: '5px' }} 
        />
        <input 
          type="date" 
          name="date" 
          value={formData.date} 
          onChange={handleChange} 
          style={{ padding: '10px', borderRadius: '5px' }} 
        />
        <input 
          type="time" 
          name="time" 
          value={formData.time} 
          onChange={handleChange} 
          style={{ padding: '10px', borderRadius: '5px' }} 
        />
        <input 
          type="text" 
          placeholder="Reason (Required)" 
          name="reason" 
          value={formData.reason} 
          onChange={handleChange} 
          style={{ padding: '10px', borderRadius: '5px' }} 
        />
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
        <button 
          type="submit" 
          style={{
            gridColumn: '1 / -1', 
            padding: '10px', 
            borderRadius: '5px', 
            backgroundColor: '#0DB8DE', 
            color: 'white', 
            fontWeight: 'bold'
          }}
        >
          {selectedAppointmentId ? 'Update Appointment' : 'Schedule Appointment'}
        </button>
      </form>

      {confirmationMessage && (
        <div style={{ marginTop: '20px', color: 'green' }}>
          {confirmationMessage}
        </div>
      )}

      {errorMessage && (
        <div style={{ marginTop: '20px', color: 'red' }}>
          {errorMessage}
        </div>
      )}

      <button 
        onClick={() => setShowAppointments(!showAppointments)} 
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          borderRadius: '5px',
          backgroundColor: '#0DB8DE',
          color: 'white',
          fontWeight: 'bold',
        }}
      >
        {showAppointments ? 'Hide Appointments' : 'Show Appointments'}
      </button>

      {showAppointments && appointments.length > 0 && (
        <div style={{ marginTop: '20px', width: '80%' }}>
          <table 
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              backgroundColor: '#2A3E4C',
              color: 'white',
              borderRadius: '8px',
            }}
          >
            <thead>
              <tr>
                <th style={{ border: '1px solid #444', padding: '12px', textAlign: 'center' }}>Patient ID</th>
                <th style={{ border: '1px solid #444', padding: '12px', textAlign: 'center' }}>Reason</th>
                <th style={{ border: '1px solid #444', padding: '12px', textAlign: 'center' }}>Date</th>
                <th style={{ border: '1px solid #444', padding: '12px', textAlign: 'center' }}>Time</th>
                <th style={{ border: '1px solid #444', padding: '12px', textAlign: 'center' }}>Status</th>
                <th style={{ border: '1px solid #444', padding: '12px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.appointment_id}>
                  <td style={{ border: '1px solid #444', padding: '12px', textAlign: 'center' }}>{appointment.patient_id}</td>
                  <td style={{ border: '1px solid #444', padding: '12px', textAlign: 'center' }}>{appointment.reason_for_visit}</td>
                  <td style={{ border: '1px solid #444', padding: '12px', textAlign: 'center' }}>{formatDate(appointment.appointment_date)}</td>
                  <td style={{ border: '1px solid #444', padding: '12px', textAlign: 'center' }}>{formatTime(appointment.appointment_date)}</td>
                  <td style={{ border: '1px solid #444', padding: '12px', textAlign: 'center' }}>{appointment.status}</td>
                  <td style={{ border: '1px solid #444', padding: '12px', textAlign: 'center' }}>
                    <button 
                      onClick={() => handleEdit(appointment)} 
                      style={{
                        backgroundColor: '#0DB8DE',
                        color: 'white',
                        padding: '5px 10px',
                        borderRadius: '5px',
                      }}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(appointment.appointment_id)} 
                      style={{
                        backgroundColor: '#E74C3C',
                        color: 'white',
                        padding: '5px 10px',
                        borderRadius: '5px',
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
      )}
    </div>
  );
}

export default Scheduling;
