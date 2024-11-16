import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EMR = () => {
  const [records, setRecords] = useState([]);
  const [formData, setFormData] = useState({
    record_id: '',
    patient_id: '',
    diagnosis: '',
    treatment: '',
    doctor_notes: '',
    medications: '',
    record_date: '',
  });

  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5001/medical-records')
      .then((response) => setRecords(response.data))
      .catch((error) => console.error('Error fetching medical records:', error));
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editMode) {
      axios.put(`http://localhost:5001/medical-records/${formData.record_id}`, formData)
        .then(() => {
          setEditMode(false);
          setFormData({
            record_id: '',
            patient_id: '',
            diagnosis: '',
            treatment: '',
            doctor_notes: '',
            medications: '',
            record_date: '',
          });
          axios.get('http://localhost:5001/medical-records')
            .then((response) => setRecords(response.data));
        })
        .catch((error) => console.error('Error updating record:', error));
    } else {
      axios.post('http://localhost:5001/medical-records', formData)
        .then((response) => {
          setRecords([...records, response.data.newRecord]);
          setFormData({
            record_id: '',
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
    setFormData(record);
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5001/medical-records/${id}`)
      .then(() => {
        setRecords(records.filter((r) => r.record_id !== id));
      })
      .catch((error) => console.error('Error deleting record:', error));
  };

  return (
    <div>
      <h2>Electronic Medical Records</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="record_id"
          placeholder="Record ID"
          value={formData.record_id}
          onChange={handleInputChange}
          required
          disabled={editMode} 
        />
        <input
          type="text"
          name="patient_id"
          placeholder="Patient ID"
          value={formData.patient_id}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="diagnosis"
          placeholder="Diagnosis"
          value={formData.diagnosis}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="treatment"
          placeholder="Treatment"
          value={formData.treatment}
          onChange={handleInputChange}
          required
        />
        <textarea
          name="doctor_notes"
          placeholder="Doctor's Notes"
          value={formData.doctor_notes}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="medications"
          placeholder="Medications"
          value={formData.medications}
          onChange={handleInputChange}
        />
        <input
          type="date"
          name="record_date"
          value={formData.record_date}
          onChange={handleInputChange}
          required
        />
        <button type="submit">{editMode ? 'Update Record' : 'Add Record'}</button>
      </form>

      <h3>Medical Records List</h3>
      <ul>
        {records.map((record) => (
          <li key={record.record_id}>
            Record ID: {record.record_id} (Patient ID: {record.patient_id})
            <button onClick={() => handleEdit(record)}>Edit</button>
            <button onClick={() => handleDelete(record.record_id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EMR;
