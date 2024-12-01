import React, { useState, useEffect } from 'react';

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

  useEffect(() => {
    if (viewPatients) {
      fetchPatients();
    }
  }, [viewPatients]);

  // Fetch request
  const fetchPatients = async () => {
    try {
      const response = await fetch('http://localhost:5001/patients');
      const data = await response.json();
      setPatients(data);
    } catch (error) {
      setErrorMessage('Error fetching patients');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editMode) {
      await updatePatient();
    } else {
      await registerPatient();
    }
  };
  // New patient
  const registerPatient = async () => {
    try {
      const response = await fetch('http://localhost:5001/registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setPatients([...patients, data.patient]);
      resetForm();
      setConfirmationMessage(data.message);
    } catch (error) {
      setErrorMessage('Error adding patient');
    }
  };

  // Update request
  const updatePatient = async () => {
    try {
      const response = await fetch(`http://localhost:5001/patients/${editPatientId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      resetForm();
      setConfirmationMessage(data.message);
    } catch (error) {
      setErrorMessage('Error updating patient');
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

  // Delete request
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5001/patients/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      setPatients(patients.filter((p) => p.patient_id !== id));
      setConfirmationMessage(data.message);
    } catch (error) {
      setErrorMessage('Error deleting patient');
    }
  };

  const resetForm = () => {
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
      textAlign: 'center',
    }}>
      <h1>{editMode ? 'Edit Patient' : 'Register a New Patient'}</h1>

      <form 
        onSubmit={handleSubmit} 
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          width: '50%',
        }}
      >
        <input 
          type="text" 
          placeholder="First Name" 
          name="first_name" 
          value={formData.first_name} 
          onChange={handleInputChange} 
          required 
          style={{ padding: '10px', borderRadius: '5px' }}
        />
        <input 
          type="text" 
          placeholder="Last Name" 
          name="last_name" 
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
          placeholder="Gender" 
          name="gender" 
          value={formData.gender} 
          onChange={handleInputChange} 
          required 
          style={{ padding: '10px', borderRadius: '5px' }}
        />
        <input 
          type="text" 
          placeholder="Contact Info" 
          name="contact_info" 
          value={formData.contact_info} 
          onChange={handleInputChange} 
          required 
          style={{ padding: '10px', borderRadius: '5px' }}
        />
        <input 
          type="text" 
          placeholder="Address" 
          name="address" 
          value={formData.address} 
          onChange={handleInputChange} 
          required 
          style={{ padding: '10px', borderRadius: '5px' }}
        />
        <input 
          type="text" 
          placeholder="Insurance Info" 
          name="insurance_info" 
          value={formData.insurance_info} 
          onChange={handleInputChange} 
          style={{ padding: '10px', borderRadius: '5px' }}
        />
        <textarea 
          placeholder="Medical History" 
          name="medical_history" 
          value={formData.medical_history} 
          onChange={handleInputChange} 
          style={{ padding: '10px', borderRadius: '5px' }}
        />
        <button 
          type="submit" 
          style={{
            gridColumn: '1 / -1', 
            padding: '10px', 
            borderRadius: '5px', 
            backgroundColor: '#0DB8DE', 
            color: 'white', 
            fontWeight: 'bold',
          }}
        >
          {editMode ? 'Update Patient' : 'Register Patient'}
        </button>
      </form>

      {confirmationMessage && <div style={{ color: 'green', marginTop: '10px' }}>{confirmationMessage}</div>}
      {errorMessage && <div style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</div>}

      <button 
        onClick={() => setViewPatients(!viewPatients)} 
        style={{
          marginTop: '20px', 
          padding: '10px', 
          borderRadius: '5px', 
          backgroundColor: '#0DB8DE', 
          color: 'white', 
          fontWeight: 'bold',
        }}
      >
        {viewPatients ? 'Hide Patients' : 'View All Patients'}
      </button>

      {viewPatients && (
        <div style={{ marginTop: '20px', width: '80%' }}>
          <h3>Patient List</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead>
              <tr style={{ backgroundColor: '#1A2226', color: 'white' }}>
                <th style={{ padding: '10px', border: '1px solid #444' }}>Patient ID</th>
                <th style={{ padding: '10px', border: '1px solid #444' }}>Name</th>
                <th style={{ padding: '10px', border: '1px solid #444' }}>Date of Birth</th>
                <th style={{ padding: '10px', border: '1px solid #444' }}>Gender</th>
                <th style={{ padding: '10px', border: '1px solid #444' }}>Contact</th>
                <th style={{ padding: '10px', border: '1px solid #444' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.patient_id} style={{ backgroundColor: '#2A3338', color: 'white' }}>
                  <td style={{ padding: '10px', border: '1px solid #444' }}>
                    {patient.patient_id}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #444' }}>
                    {patient.first_name} {patient.last_name}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #444' }}>
                    {new Date(patient.date_of_birth).toLocaleDateString()}
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
                      style={{ backgroundColor: '#0DB8DE', padding: '5px', borderRadius: '5px' }}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(patient.patient_id)} 
                      style={{ backgroundColor: '#FF6347', padding: '5px', borderRadius: '5px', marginLeft: '10px' }}
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
