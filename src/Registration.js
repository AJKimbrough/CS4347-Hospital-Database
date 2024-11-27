import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Patients() {
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

  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [patients, setPatients] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [viewPatients, setViewPatients] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editPatientId, setEditPatientId] = useState(null);

  // Fetch existing patients when the component is mounted
  useEffect(() => {
    if (viewPatients) {
      axios.get('http://localhost:5001/patients')
        .then((response) => setPatients(response.data))
        .catch((error) => {
          setErrorMessage('Error fetching patients');
        });
    }
  }, [viewPatients]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#222D32',
      color: 'white',
      textAlign: 'center'
    }}>
      <h2>{editMode ? 'Edit Patient' : 'Register a New Patient'}</h2>

      <form onSubmit={handleSubmit} style={{ width: '60%', display: 'grid', gap: '10px' }}>
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          value={formData.first_name}
          onChange={handleInputChange}
          required
          style={{ padding: '10px', borderRadius: '5px' }}
        />
        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={formData.last_name}
          onChange={handleInputChange}
          required
          style={{ padding: '10px', borderRadius: '5px' }}
        />
        <input
          type="date"
          name="date_of_birth"
          value={formData.date_of_birth}
          onChange={handleInputChange}
          required
          style={{ padding: '10px', borderRadius: '5px' }}
        />
        <input
          type="text"
          name="gender"
          placeholder="Gender"
          value={formData.gender}
          onChange={handleInputChange}
          required
          style={{ padding: '10px', borderRadius: '5px' }}
        />
        <input
          type="text"
          name="contact_info"
          placeholder="Contact Info"
          value={formData.contact_info}
          onChange={handleInputChange}
          required
          style={{ padding: '10px', borderRadius: '5px' }}
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleInputChange}
          required
          style={{ padding: '10px', borderRadius: '5px' }}
        />
        <input
          type="text"
          name="insurance_info"
          placeholder="Insurance Info"
          value={formData.insurance_info}
          onChange={handleInputChange}
          style={{ padding: '10px', borderRadius: '5px' }}
        />
        <textarea
          name="medical_history"
          placeholder="Medical History"
          value={formData.medical_history}
          onChange={handleInputChange}
          style={{ padding: '10px', borderRadius: '5px' }}
        />
        <button type="submit" style={{
          padding: '10px',
          borderRadius: '5px',
          backgroundColor: '#0DB8DE',
          color: 'white',
          fontWeight: 'bold'
        }}>
          {editMode ? 'Update Patient' : 'Register Patient'}
        </button>
        {editMode && (
          <button
            type="button"
            onClick={handleCancel}
            style={{
              padding: '10px',
              borderRadius: '5px',
              backgroundColor: '#ff5722',
              color: 'white',
              fontWeight: 'bold'
            }}
          >
            Cancel
          </button>
        )}
      </form>

      {confirmationMessage && <div style={{ color: 'green', marginTop: '10px' }}>{confirmationMessage}</div>}
      {errorMessage && <div style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</div>}

      <hr style={{ margin: '20px 0' }} />

      <button
        onClick={() => setViewPatients(!viewPatients)}
        style={{
          padding: '10px 20px',
          borderRadius: '5px',
          backgroundColor: '#0DB8DE',
          color: 'white',
          fontWeight: 'bold'
        }}
      >
        {viewPatients ? 'Hide Patients' : 'View All Patients'}
      </button>

      {viewPatients && (
        <div style={{ marginTop: '20px', width: '80%' }}>
          <h3>Patient List</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead>
              <tr style={{ backgroundColor: '#1A2226' }}>
                <th style={{ padding: '10px', border: '1px solid #444' }}>Name</th>
                <th style={{ padding: '10px', border: '1px solid #444' }}>Date of Birth</th>
                <th style={{ padding: '10px', border: '1px solid #444' }}>Gender</th>
                <th style={{ padding: '10px', border: '1px solid #444' }}>Contact Info</th>
                <th style={{ padding: '10px', border: '1px solid #444' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
  {patients.map((patient) => (
    <tr key={patient.patient_id} style={{ backgroundColor: '#2A3338' }}>
      <td style={{ padding: '10px', border: '1px solid #444' }}>
        {patient.first_name} {patient.last_name}
      </td>
      <td style={{ padding: '10px', border: '1px solid #444' }}>
        {new Date(patient.date_of_birth).toLocaleDateString()} {/* Format the date */}
      </td>
      <td style={{ padding: '10px', border: '1px solid #444' }}>
        {patient.gender}
      </td>
      <td style={{ padding: '10px', border: '1px solid #444' }}>
        {patient.contact_info}
      </td>
      <td style={{ padding: '10px', border: '1px solid #444' }}>
        <button
          onClick={() => handleEdit(patient)}
          style={{
            padding: '5px 10px',
            borderRadius: '5px',
            backgroundColor: '#0DB8DE',
            color: 'white',
            marginRight: '10px',
          }}
        >
          Edit
        </button>
        <button
          onClick={() => handleDelete(patient.patient_id)}
          style={{
            padding: '5px 10px',
            borderRadius: '5px',
            backgroundColor: '#ff5722',
            color: 'white',
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

export default Patients;
