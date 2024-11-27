import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EMR = () => {
  const [records, setRecords] = useState([]);
  const [formData, setFormData] = useState({
    patient_id: '',
    diagnosis: '',
    treatment: '',
    doctor_notes: '',
    medications: '',
    record_date: '',
  });

  const [editMode, setEditMode] = useState(false);
  const [editRecordId, setEditRecordId] = useState(null);
  const [showRecords, setShowRecords] = useState(false);  // To control the visibility of records

  useEffect(() => {
    if (showRecords) {
      axios.get('http://localhost:5001/medical-records')
        .then((response) => setRecords(response.data))
        .catch((error) => console.error('Error fetching medical records:', error));
    }
  }, [showRecords]); // Fetch records only when the "showRecords" state is true

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editMode) {
      axios.put(`http://localhost:5001/medical-records/${editRecordId}`, formData)
        .then(() => {
          setEditMode(false);
          setEditRecordId(null);
          setFormData({
            patient_id: '',
            diagnosis: '',
            treatment: '',
            doctor_notes: '',
            medications: '',
            record_date: '',
          });
          setShowRecords(true);  // Show records after update
        })
        .catch((error) => console.error('Error updating record:', error));
    } else {
      axios.post('http://localhost:5001/medical-records', formData)
        .then((response) => {
          setRecords([...records, response.data.newRecord]);
          setFormData({
            patient_id: '',
            diagnosis: '',
            treatment: '',
            doctor_notes: '',
            medications: '',
            record_date: '',
          });
        })
        .catch((error) => console.error('Error adding record:', error));
    }
  };

  const handleEdit = (record) => {
    setEditMode(true);
    setEditRecordId(record.record_id);
    setFormData({
      patient_id: record.patient_id,
      diagnosis: record.diagnosis,
      treatment: record.treatment,
      doctor_notes: record.doctor_notes,
      medications: record.medications,
      record_date: record.record_date,
    });
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5001/medical-records/${id}`)
      .then(() => {
        setRecords(records.filter((r) => r.record_id !== id));
      })
      .catch((error) => console.error('Error deleting record:', error));
  };

  return (
    <div style={{
      color: 'white',
      textAlign: 'center',
      backgroundColor: '#222D32',
      minHeight: '100vh',
      padding: '20px',
    }}>
      <h2>Electronic Medical Records</h2>
      <form 
        onSubmit={handleSubmit} 
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '15px',
          maxWidth: '500px',
          margin: '0 auto',
        }}
      >
        <input
          type="text"
          name="patient_id"
          placeholder="Patient ID"
          value={formData.patient_id}
          onChange={handleInputChange}
          required
          style={{ padding: '10px', borderRadius: '5px' }}
        />
        <input
          type="text"
          name="diagnosis"
          placeholder="Diagnosis"
          value={formData.diagnosis}
          onChange={handleInputChange}
          required
          style={{ padding: '10px', borderRadius: '5px' }}
        />
        <input
          type="text"
          name="treatment"
          placeholder="Treatment"
          value={formData.treatment}
          onChange={handleInputChange}
          required
          style={{ padding: '10px', borderRadius: '5px' }}
        />
        <textarea
          name="doctor_notes"
          placeholder="Doctor's Notes"
          value={formData.doctor_notes}
          onChange={handleInputChange}
          style={{ padding: '10px', borderRadius: '5px' }}
        />
        <input
          type="text"
          name="medications"
          placeholder="Medications"
          value={formData.medications}
          onChange={handleInputChange}
          style={{ padding: '10px', borderRadius: '5px' }}
        />
        <input
          type="date"
          name="record_date"
          value={formData.record_date}
          onChange={handleInputChange}
          required
          style={{ padding: '10px', borderRadius: '5px' }}
        />
        <button 
          type="submit" 
          style={{
            padding: '10px',
            borderRadius: '5px',
            backgroundColor: '#0DB8DE',
            color: 'white',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          {editMode ? 'Update Record' : 'Add Record'}
        </button>
      </form>

      <button 
        onClick={() => setShowRecords(!showRecords)}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#0DB8DE',
          color: 'white',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        {showRecords ? 'Hide Records' : 'Show Records'}
      </button>

      {showRecords && (
        <div style={{ marginTop: '30px' }}>
          <h3>Medical Records List</h3>
          <table style={{ margin: '0 auto', width: '80%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#34495e' }}>
                <th style={{ padding: '10px', color: 'white', textAlign: 'center' }}>Record ID</th>
                <th style={{ padding: '10px', color: 'white', textAlign: 'center' }}>Patient ID</th>
                <th style={{ padding: '10px', color: 'white', textAlign: 'center' }}>Diagnosis</th>
                <th style={{ padding: '10px', color: 'white', textAlign: 'center' }}>Treatment</th>
                <th style={{ padding: '10px', color: 'white', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.record_id}>
                  <td style={{ padding: '10px', textAlign: 'center' }}>{record.record_id}</td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>{record.patient_id}</td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>{record.diagnosis}</td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>{record.treatment}</td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>
                    <button 
                      onClick={() => handleEdit(record)} 
                      style={{
                        marginRight: '10px',
                        padding: '5px 10px',
                        borderRadius: '5px',
                        backgroundColor: '#3498db',
                        color: 'white',
                        cursor: 'pointer',
                      }}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(record.record_id)} 
                      style={{
                        padding: '5px 10px',
                        borderRadius: '5px',
                        backgroundColor: '#e74c3c',
                        color: 'white',
                        cursor: 'pointer',
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
};

export default EMR;
