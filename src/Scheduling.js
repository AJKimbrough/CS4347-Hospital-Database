// src/components/Scheduling.js
import React, { useState } from 'react';
import axios from 'axios';

function Scheduling() {
  const [formData, setFormData] = useState({
    appointment_id: '',
    patient_id: '',
    staff_id: '',
    date: '',
    time: '',
    reason: '',
    status: '',
  });
  const [confirmationMessage, setConfirmationMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/appointments', formData);
      setConfirmationMessage(response.data.message);
    } catch (error) {
      setConfirmationMessage(
        error.response?.data?.error || 'An error occurred while scheduling the appointment.'
      );
    }
  };

  return (
    <div className="container mt-4">
      <h1>Appointment Scheduling</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Appointment ID:
          <input
            type="text"
            name="appointment_id"
            value={formData.appointment_id}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Patient ID:
          <input
            type="text"
            name="patient_id"
            value={formData.patient_id}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Staff ID:
          <input
            type="text"
            name="staff_id"
            value={formData.staff_id}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Date:
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Time:
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Reason:
          <input
            type="text"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Status:
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="">Select Status</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </label>
        <br />
        <button type="submit">Schedule Appointment</button>
      </form>
      {confirmationMessage && <p>{confirmationMessage}</p>}
    </div>
  );
}

export default Scheduling;
