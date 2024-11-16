// src/components/Registration.js
import React, { useState } from 'react';
import axios from 'axios';

const Registration = () => {
  const [formData, setFormData] = useState({
    patient_id: '',
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: '',
    contact_info: '',
    address: '',
    insurance_info: '',
    medical_history: '',
  });

  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5001/register', formData);
      setConfirmationMessage(response.data.message);
      setErrorMessage('');
      setFormData({
        patient_id: '',
        first_name: '',
        last_name: '',
        date_of_birth: '',
        gender: '',
        contact_info: '',
        address: '',
        insurance_info: '',
        medical_history: '',
      });
    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'An error occurred');
      setConfirmationMessage('');
    }
  };

  return (
    <div>
      <h2>Register a New Patient</h2>
      <form onSubmit={handleSubmit}>
        <label>Patient ID:</label>
        <input
          type="text"
          name="patient_id"
          value={formData.patient_id}
          onChange={handleChange}
          required
        />
        <br />
        <label>First Name:</label>
        <input
          type="text"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          required
        />
        <br />
        <label>Last Name:</label>
        <input
          type="text"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          required
        />
        <br />
        <label>Date of Birth:</label>
        <input
          type="date"
          name="date_of_birth"
          value={formData.date_of_birth}
          onChange={handleChange}
          required
        />
        <br />
        <label>Gender:</label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
        >
          <option value="">Choose Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <br />
        <label>Contact Info:</label>
        <input
          type="text"
          name="contact_info"
          value={formData.contact_info}
          onChange={handleChange}
          required
        />
        <br />
        <label>Address:</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
        />
        <br />
        <label>Insurance Info:</label>
        <input
          type="text"
          name="insurance_info"
          value={formData.insurance_info}
          onChange={handleChange}
        />
        <br />
        <label>Medical History:</label>
        <textarea
          name="medical_history"
          value={formData.medical_history}
          onChange={handleChange}
        ></textarea>
        <br />
        <button type="submit">Register Patient</button>
      </form>
      {confirmationMessage && <div style={{ color: 'green' }}>{confirmationMessage}</div>}
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
    </div>
  );
};

export default Registration;
