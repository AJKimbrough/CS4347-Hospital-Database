import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Patients = () => {
  const [patients, setPatients] = useState([]);
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

  const [editMode, setEditMode] = useState(false);
  const [editPatientId, setEditPatientId] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5001/patients')
      .then((response) => setPatients(response.data))
      .catch((error) => console.error('Error fetching patients:', error));
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
          // Refresh patient list after update
          axios.get('http://localhost:5001/patients')
            .then((response) => setPatients(response.data));
        })
        .catch((error) => console.error('Error updating patient:', error));
    } else {
      // Create new patient
      axios.post('http://localhost:5001/patients', formData)
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
        })
        .catch((error) => console.error('Error adding patient:', error));
    }
  };

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

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5001/patients/${id}`)
      .then(() => {
        setPatients(patients.filter((p) => p.patient_id !== id));
      })
      .catch((error) => console.error('Error deleting patient:', error));
  };

  return (
    <div>
      <h2>Patients</h2>
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
        <button type="submit">{editMode ? 'Update Patient' : 'Add Patient'}</button>
      </form>

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
  );
};

export default Patients;

