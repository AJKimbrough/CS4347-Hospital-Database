import React, { useState, useEffect } from 'react';

function Billing() {
  const [formData, setFormData] = useState({
    patient_id: '',
    amount_due: '',
    insurance_coverage: '',
    payment_received: '',
    outstanding_balance: '',
    billing_date: '',
    payment_status: '', 
  });

  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [billingRecords, setBillingRecords] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch all billing records when the component is mounted
  useEffect(() => {
    const fetchBillingRecords = async () => {
      try {
        const response = await fetch('http://localhost:5001/billing');
        if (!response.ok) {
          throw new Error('Failed to fetch billing records');
        }
        const data = await response.json();
        setBillingRecords(data);
      } catch (error) {
        setErrorMessage('Failed to fetch billing records');
      }
    };

    fetchBillingRecords();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Input validation for required fields
    if (!formData.patient_id || !formData.amount_due || !formData.outstanding_balance || !formData.billing_date) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/billing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setErrorMessage('');
        setConfirmationMessage('Billing info submitted successfully!');

        // Clear form data after submission
        setFormData({
          patient_id: '',
          amount_due: '',
          insurance_coverage: '',
          payment_received: '',
          outstanding_balance: '',
          billing_date: '',
          payment_status: '', 
        });

        // Fetch updated billing records
        const updatedResponse = await fetch('http://localhost:5001/billing');
        const updatedData = await updatedResponse.json();
        setBillingRecords(updatedData);
      } else {
        throw new Error('Failed to submit billing info.');
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="container mt-4">
      <h1>Billing and Payment</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="patient_id">Patient ID:</label>
        <input
          type="text"
          id="patient_id"
          name="patient_id"
          value={formData.patient_id}
          onChange={handleChange}
          required
        />
        <br />

        <label htmlFor="amount_due">Amount Due:</label>
        <input
          type="number"
          step="0.01"
          id="amount_due"
          name="amount_due"
          value={formData.amount_due}
          onChange={handleChange}
          required
        />
        <br />

        <label htmlFor="insurance_coverage">Insurance Coverage:</label>
        <input
          type="number"
          step="0.01"
          id="insurance_coverage"
          name="insurance_coverage"
          value={formData.insurance_coverage}
          onChange={handleChange}
        />
        <br />

        <label htmlFor="payment_received">Payment Received:</label>
        <input
          type="number"
          step="0.01"
          id="payment_received"
          name="payment_received"
          value={formData.payment_received}
          onChange={handleChange}
        />
        <br />

        <label htmlFor="outstanding_balance">Outstanding Balance:</label>
        <input
          type="number"
          step="0.01"
          id="outstanding_balance"
          name="outstanding_balance"
          value={formData.outstanding_balance}
          onChange={handleChange}
          required
        />
        <br />

        <label htmlFor="billing_date">Billing Date:</label>
        <input
          type="date"
          id="billing_date"
          name="billing_date"
          value={formData.billing_date}
          onChange={handleChange}
          required
        />
        <br />

        <label htmlFor="payment_status">Payment Status:</label>
        <input
          type="text"
          id="payment_status"
          name="payment_status"
          value={formData.payment_status}
          onChange={handleChange}
        />
        <br />

        <button type="submit">Save Billing Info</button>
      </form>

      {confirmationMessage && (
        <div style={{ marginTop: '20px', color: 'green' }}>
          {confirmationMessage}
        </div>
      )}

      {errorMessage && (
        <div style={{ marginTop: '20px', color: 'red' }}>
          {errorMessage}
        </div>
      )}

      <h2>Billing Records</h2>
      {billingRecords.length > 0 ? (
        <ul>
          {billingRecords.map((bill) => (
            <li key={bill.billing_id}>
              Billing ID: {bill.billing_id} | Patient ID: {bill.patient_id} | Amount Due: ${bill.amount_due} | Outstanding Balance: ${bill.outstanding_balance}
            </li>
          ))}
        </ul>
      ) : (
        <p>No billing records found.</p>
      )}
    </div>
  );
}

export default Billing;
