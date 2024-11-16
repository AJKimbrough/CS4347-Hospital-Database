const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5001;

app.use(cors());
app.use(bodyParser.json());

// Databases for patient registration and medical records
const patients = [];
const medicalRecords = [];

// CREATE
app.post('/patients', (req, res) => {
  const {
    patient_id,
    first_name,
    last_name,
    date_of_birth,
    gender,
    contact_info,
    address,
    insurance_info,
    medical_history,
  } = req.body;

  if (
    !patient_id ||
    !first_name ||
    !last_name ||
    !date_of_birth ||
    !gender ||
    !contact_info ||
    !address
  ) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (patients.find((p) => p.patient_id === patient_id)) {
    return res.status(400).json({ error: 'Patient ID already exists.' });
  }

  const newPatient = {
    patient_id,
    first_name,
    last_name,
    date_of_birth,
    gender,
    contact_info,
    address,
    insurance_info,
    medical_history,
  };

  patients.push(newPatient);
  res.status(201).json({ message: 'Patient registered successfully!', patient: newPatient });
});

// READ
app.get('/patients', (req, res) => {
  res.json(patients);
});

// UPDATE
app.put('/patients/:id', (req, res) => {
  const { id } = req.params;
  const patient = patients.find((p) => p.patient_id === id);

  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  Object.assign(patient, req.body); 
  res.json({ message: 'Patient updated successfully', patient });
});

// DELETE
app.delete('/patients/:id', (req, res) => {
  const { id } = req.params;
  const index = patients.findIndex((p) => p.patient_id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  patients.splice(index, 1);
  res.json({ message: 'Patient deleted successfully' });
});

// CREATE
app.post('/medical-records', (req, res) => {
  const {
    record_id,
    patient_id,
    diagnosis,
    treatment,
    doctor_notes,
    medications,
    record_date,
  } = req.body;

  if (!record_id || !patient_id || !diagnosis || !treatment || !record_date) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  if (!patients.find((p) => p.patient_id === patient_id)) {
    return res.status(404).json({ message: 'Patient not found' });
  }

  const newRecord = {
    record_id,
    patient_id,
    diagnosis,
    treatment,
    doctor_notes,
    medications,
    record_date,
  };

  medicalRecords.push(newRecord);
  res.status(201).json({ message: 'Medical record saved successfully', newRecord });
});

// READ
app.get('/medical-records', (req, res) => {
  res.json(medicalRecords);
});

// READ
app.get('/medical-records/:patient_id', (req, res) => {
  const { patient_id } = req.params;
  const records = medicalRecords.filter((record) => record.patient_id === patient_id);

  if (records.length === 0) {
    return res.status(404).json({ message: 'No medical records found for this patient' });
  }

  res.json(records);
});

// UPDATE
app.put('/medical-records/:record_id', (req, res) => {
  const { record_id } = req.params;
  const record = medicalRecords.find((r) => r.record_id === record_id);

  if (!record) {
    return res.status(404).json({ error: 'Medical record not found' });
  }

  Object.assign(record, req.body); 
  res.json({ message: 'Medical record updated successfully', record });
});

// DELETE
app.delete('/medical-records/:record_id', (req, res) => {
  const { record_id } = req.params;
  const index = medicalRecords.findIndex((r) => r.record_id === record_id);

  if (index === -1) {
    return res.status(404).json({ error: 'Medical record not found' });
  }

  medicalRecords.splice(index, 1);
  res.json({ message: 'Medical record deleted successfully' });
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
