// Existing imports and setup
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
require('dotenv').config(); 

const app = express();
const port = 5001;

app.use(cors());
app.use(express.json());  




const pool = new Pool({
  user: process.env.PG_USER || 'aj',        
  host: process.env.PG_HOST || 'localhost',
  database: process.env.PG_DATABASE || 'hospital_db',
  password: process.env.PG_PASSWORD || '123',
  port: process.env.PG_PORT || 5433,         
});


app.get('/scheduling', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM appointments');
    res.json(result.rows); 
  } catch (err) {
    console.error('Error fetching appointments:', err);
    res.status(500).json({ error: 'Error fetching appointments' });
  }
});




// Route to add a new appointment
app.post('/scheduling', async (req, res) => {
  const { patient_id, staff_id, appointment_date, reason_for_visit, status } = req.body;
  const query = `
    INSERT INTO appointments (patient_id, staff_id, appointment_date, reason_for_visit, status)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;

  try {
    const result = await pool.query(query, [patient_id, staff_id, appointment_date, reason_for_visit, status]);
    res.json({
      message: 'Appointment scheduled successfully!',
      appointment: result.rows[0],  // Return the scheduled appointment details
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'An error occurred while scheduling the appointment.' });
  }
});

// Delete appointment
app.delete('/scheduling/:appointmentId', async (req, res) => {
  const { appointmentId } = req.params;
  console.log(`DELETE request received for appointment ID: ${appointmentId}`);

  try {
    const result = await pool.query('DELETE FROM appointments WHERE appointment_id = $1', [appointmentId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json({ message: 'Appointment deleted successfully' });
  } catch (err) {
    console.error('Error deleting appointment:', err);
    res.status(500).json({ error: 'Error deleting appointment' });
  }
});

// Update appointment
app.put('/scheduling/:appointmentId', async (req, res) => {
  const { appointmentId } = req.params;
  const { patient_id, staff_id, appointment_date, reason_for_visit, status } = req.body;

  try {
    const result = await pool.query(
      'UPDATE appointments SET patient_id = $1, staff_id = $2, appointment_date = $3, reason_for_visit = $4, status = $5 WHERE appointment_id = $6',
      [patient_id, staff_id, appointment_date, reason_for_visit, status, appointmentId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json({ message: 'Appointment updated successfully' });
  } catch (err) {
    console.error('Error updating appointment:', err);
    res.status(500).json({ error: 'Error updating appointment' });
  }
});


// Fetch staff data
app.get('/staff', async (req, res) => {
  console.log('Received request to fetch staff data');  
  
  try {
    const result = await pool.query('SELECT * FROM staff');
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No staff data found' });
    }

    res.json(result.rows);  
  } catch (err) {
    console.error('Error fetching staff:', err);
    res.status(500).json({ error: 'Error fetching staff data' });
  }
});



// Add new staff member
app.post('/staff', async (req, res) => {
  const { first_name, last_name, position, contact_info, hire_date } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO staff (first_name, last_name, position, contact_info, hire_date)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [first_name, last_name, position, contact_info || null, hire_date]
    );
    res.status(201).json({
      message: 'Staff added successfully!',
      staff: result.rows[0],  
    });
  } catch (err) {
    console.error('Error adding staff:', err);  
    res.status(500).json({ error: 'Database error while adding staff' });
  }
});


// CREATE Billing Information
app.post('/billing', async (req, res) => {
  const {
    patient_id,
    amount_due,
    insurance_coverage,
    payment_received,
    outstanding_balance,
    billing_date,
  } = req.body;

  // Validate required fields
  if (!patient_id || !amount_due || !outstanding_balance || !billing_date) {
    return res.status(400).json({ error: 'Missing required fields: patient_id, amount_due, outstanding_balance, or billing_date' });
  }

  try {
    console.log('Request body:', req.body);

    // Provide a default value for payment_status if not present
    const paymentStatus = req.body.payment_status || 'pending';

    const result = await pool.query(
      `INSERT INTO billing (patient_id, amount_due, insurance_coverage, payment_received, outstanding_balance, billing_date, payment_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [patient_id, amount_due, insurance_coverage || null, payment_received || 0, outstanding_balance, billing_date, paymentStatus]
    );

    // Respond with success message
    res.status(201).json({ message: 'Billing info added successfully!', billing: result.rows[0] });
  } catch (error) {
    // Log detailed error
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database error while adding billing info', details: error.message });
  }
});


// READ All Billing Records
app.get('/billing', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM billing');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching billing records:', error);
    res.status(500).json({ error: 'Error fetching billing records' });
  }
});


// CREATE Patient 
app.post('/registration', async (req, res) => {
  const {
    first_name,
    last_name,
    date_of_birth,
    gender,
    contact_info,
    address,
    insurance_info,
    medical_history,
  } = req.body;

  if (!first_name || !last_name || !date_of_birth || !gender || !contact_info || !address) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  

  try {
    const result = await pool.query(
      `INSERT INTO patients (first_name, last_name, date_of_birth, gender, contact_info, address, insurance_info, medical_history)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [first_name, last_name, date_of_birth, gender, contact_info, address, insurance_info, medical_history]
    );
    res.status(201).json({ message: 'Patient registered successfully!', patient: result.rows[0] });
  } catch (error) {
    console.error('Error adding patient:', error);
    res.status(500).json({ error: 'Database error while adding patient' });
  }
});

// READ Patients
app.get('/patients', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM patients');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ error: 'Error fetching patients' });
  }
});

// UPDATE Patient
app.put('/patients/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  if (!Object.keys(updates).length) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  try {
    const keys = Object.keys(updates);
    const values = Object.values(updates);
    const setString = keys.map((key, index) => `${key} = $${index + 2}`).join(', ');

    const result = await pool.query(
      `UPDATE patients SET ${setString} WHERE patient_id = $1 RETURNING *`,
      [id, ...values]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.json({ message: 'Patient updated successfully', patient: result.rows[0] });
  } catch (error) {
    console.error('Error updating patient:', error);
    res.status(500).json({ error: 'Error updating patient' });
  }
});


// DELETE Patient
app.delete('/patients/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM patients WHERE patient_id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    console.error('Error deleting patient:', error);
    res.status(500).json({ error: 'Error deleting patient' });
  }
});

//Injection
app.put('/patient/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  if (!Object.keys(updates).length) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  try {
    // 
    const keys = Object.keys(updates);
    const values = Object.values(updates);
    
    const setString = keys.map((key, index) => `${key} = $${index + 2}`).join(', ');
    
    //prepared statement in conjunction with pool.query
    const query = `
      UPDATE patients
      SET ${setString}
      WHERE patient_id = $1
      RETURNING *;
    `;

    const result = await pool.query(query, [id, ...values]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.json({ message: 'Patient updated successfully', patient: result.rows[0] });
  } catch (error) {
    console.error('Error updating patient:', error);
    res.status(500).json({ error: 'Error updating patient' });
  }
});



// Routes for Medical Records
app.get('/medical-records', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM medical_records');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error fetching medical records' });
  }
});

app.post('/medical-records', async (req, res) => {
  const { patient_id, diagnosis, treatment, doctor_notes, medications, record_date } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO medical_records (patient_id, diagnosis, treatment, doctor_notes, medications, record_date)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [patient_id, diagnosis, treatment, doctor_notes, medications, record_date]
    );
    res.json({ message: 'Medical record added!', newRecord: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error adding medical record' });
  }
});

app.put('/medical-records/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const keys = Object.keys(updates);
    const values = Object.values(updates);
    const setString = keys.map((key, index) => `${key} = $${index + 2}`).join(', ');

    const result = await pool.query(
      `UPDATE medical_records SET ${setString} WHERE record_id = $1 RETURNING *`,
      [id, ...values]
    );
    res.json({ message: 'Medical record updated!', record: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error updating medical record' });
  }
});

app.delete('/medical-records/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM medical_records WHERE record_id = $1 RETURNING *', [id]);
    res.json({ message: 'Medical record deleted!', record: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error deleting medical record' });
  }
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
