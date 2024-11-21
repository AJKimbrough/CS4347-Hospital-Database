import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Patients = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: '',
    contact_info: '',
    address: '',
    insurance_info: '',
    medical_history: '',
  });

  const [patients, setPatients] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editPatientId, setEditPatientId] = useState(null);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [viewPatients, setViewPatients] = useState(false);  

  // Fetch existing patients when the component is mounted
  useEffect(() => {
    if (viewPatients) {
      axios.get('http://localhost:5001/patients')
        .then((response) => setPatients(response.data))
        .catch((error) => console.error('Error fetching patients:', error));
    }
  }, [viewPatients]);

  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission for creating or updating a patient
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editMode) {
      // Update patient data
      axios.put(`http://localhost:5001/patients/${editPatientId}`, formData)
        .then(() => {
          setEditMode(false);
          setEditPatientId(null);
          setFormData({
            first_name: '',
            last_name: '',
            date_of_birth: '',
            gender: '',
            contact_info: '',
            address: '',
            insurance_info: '',
            medical_history: '',
          });
          setConfirmationMessage('Patient updated successfully');
          setErrorMessage('');
          // Refresh patient list after update
          axios.get('http://localhost:5001/patients')
            .then((response) => setPatients(response.data));
        })
        .catch((error) => {
          setErrorMessage('Error updating patient');
          setConfirmationMessage('');
        });
    } else {
      // Create new patient
      axios.post('http://localhost:5001/registration', formData)
        .then((response) => {
          setPatients([...patients, response.data.patient]);
          setFormData({
            first_name: '',
            last_name: '',
            date_of_birth: '',
            gender: '',
            contact_info: '',
            address: '',
            insurance_info: '',
            medical_history: '',
          });
          setConfirmationMessage(response.data.message);
          setErrorMessage('');
        })
        .catch((error) => {
          setErrorMessage('Error adding patient');
          setConfirmationMessage('');
        });
    }
  };

  // Handle editing an existing patient
  const handleEdit = (patient) => {
    setEditMode(true);
    setEditPatientId(patient.patient_id);
    setFormData({
      first_name: patient.first_name,
      last_name: patient.last_name,
      date_of_birth: patient.date_of_birth,
      gender: patient.gender,
      contact_info: patient.contact_info,
      address: patient.address,
      insurance_info: patient.insurance_info,
      medical_history: patient.medical_history,
    });
  };

  // Handle deleting a patient
  const handleDelete = (id) => {
    axios.delete(`http://localhost:5001/patients/${id}`)
      .then(() => {
        setPatients(patients.filter((p) => p.patient_id !== id));
      })
      .catch((error) => console.error('Error deleting patient:', error));
  };

  // Function to handle cancel action
  const handleCancel = () => {
    setEditMode(false);
    setEditPatientId(null);
    setFormData({
      first_name: '',
      last_name: '',
      date_of_birth: '',
      gender: '',
      contact_info: '',
      address: '',
      insurance_info: '',
      medical_history: '',
    });
  };

  return (
    <div>
      <h2>{editMode ? 'Edit Patient' : 'Register a New Patient'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          value={formData.first_name}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={formData.last_name}
          onChange={handleInputChange}
          required
        />
        <input
          type="date"
          name="date_of_birth"
          value={formData.date_of_birth}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="gender"
          placeholder="Gender"
          value={formData.gender}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="contact_info"
          placeholder="Contact Info"
          value={formData.contact_info}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="insurance_info"
          placeholder="Insurance Info"
          value={formData.insurance_info}
          onChange={handleInputChange}
        />
        <textarea
          name="medical_history"
          placeholder="Medical History"
          value={formData.medical_history}
          onChange={handleInputChange}
        />
        <button type="submit">{editMode ? 'Update Patient' : 'Register Patient'}</button>
        {editMode && <button type="button" onClick={handleCancel}>Cancel</button>}
      </form>
      
      {confirmationMessage && <div style={{ color: 'green' }}>{confirmationMessage}</div>}
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}

      <hr />

      <button onClick={() => setViewPatients(!viewPatients)}>
        {viewPatients ? 'Hide Patients' : 'View All Patients'}
      </button>

      {viewPatients && (
        <div>
          <h3>Patient List</h3>
          <ul>
            {patients.map((patient) => (
              <li key={patient.patient_id}>
                {patient.first_name} {patient.last_name} ({patient.patient_id})
                <button onClick={() => handleEdit(patient)}>Edit</button>
                <button onClick={() => handleDelete(patient.patient_id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Patients;

