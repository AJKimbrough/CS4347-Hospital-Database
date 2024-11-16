import React, { useState } from 'react';

function Billing() {
  const [formData, setFormData] = useState({
    billing_id: '',
    patient_id: '',
    total_cost: '',
    insurance_coverage: '',
    payment_received: '',
    outstanding_balance: '',
    billing_date: '',
  });
  
  const [confirmationMessage, setConfirmationMessage] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5001/billing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setConfirmationMessage(true);
        setFormData({
          billing_id: '',
          patient_id: '',
          total_cost: '',
          insurance_coverage: '',
          payment_received: '',
          outstanding_balance: '',
          billing_date: '',
        });
      } else {
        console.error('Failed to submit billing info.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h1>Billing and Payment</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="billing_id">Billing ID:</label>
        <input
          type="text"
          id="billing_id"
          name="billing_id"
          value={formData.billing_id}
          onChange={handleChange}
          required
        />
        <br />

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

        <label htmlFor="total_cost">Total Cost:</label>
        <input
          type="number"
          step="0.01"
          id="total_cost"
          name="total_cost"
          value={formData.total_cost}
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

        <button type="submit">Save Billing Info</button>
      </form>

      {confirmationMessage && (
        <div id="confirmationMessage" style={{ marginTop: '20px', color: 'green' }}>
          Form submitted successfully!
        </div>
      )}
    </div>
  );
}

export default Billing;
