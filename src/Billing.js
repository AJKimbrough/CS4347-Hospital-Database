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
  const [showRecords, setShowRecords] = useState(false);

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
        setFormData({
          patient_id: '',
          amount_due: '',
          insurance_coverage: '',
          payment_received: '',
          outstanding_balance: '',
          billing_date: '',
          payment_status: '', 
        });

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
      <h1>Billing and Payment</h1>
      
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
          placeholder="Patient ID (Required)" 
          name="patient_id" 
          value={formData.patient_id} 
          onChange={handleChange} 
          style={{ padding: '10px', borderRadius: '5px' }}
        />
        <input 
          type="number" 
          step="0.01" 
          placeholder="Amount Due (Required)" 
          name="amount_due" 
          value={formData.amount_due} 
          onChange={handleChange} 
          style={{ padding: '10px', borderRadius: '5px' }}
        />
        <input 
          type="number" 
          step="0.01" 
          placeholder="Insurance Coverage" 
          name="insurance_coverage" 
          value={formData.insurance_coverage} 
          onChange={handleChange} 
          style={{ padding: '10px', borderRadius: '5px' }}
        />
        <input 
          type="number" 
          step="0.01" 
          placeholder="Payment Received" 
          name="payment_received" 
          value={formData.payment_received} 
          onChange={handleChange} 
          style={{ padding: '10px', borderRadius: '5px' }}
        />
        <input 
          type="number" 
          step="0.01" 
          placeholder="Outstanding Balance (Required)" 
          name="outstanding_balance" 
          value={formData.outstanding_balance} 
          onChange={handleChange} 
          style={{ padding: '10px', borderRadius: '5px' }}
        />
        <input 
          type="date" 
          placeholder="Billing Date (Required)" 
          name="billing_date" 
          value={formData.billing_date} 
          onChange={handleChange} 
          style={{ padding: '10px', borderRadius: '5px' }}
        />
        <input 
          type="text" 
          placeholder="Payment Status" 
          name="payment_status" 
          value={formData.payment_status} 
          onChange={handleChange} 
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
            fontWeight: 'bold'
          }}
        >
          Save Billing Info
        </button>
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

      <button 
        onClick={() => setShowRecords(!showRecords)} 
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          borderRadius: '5px',
          backgroundColor: '#0DB8DE',
          color: 'white',
          fontWeight: 'bold',
        }}
      >
        {showRecords ? 'Hide Billing Records' : 'Show Billing Records'}
      </button>

      {showRecords && billingRecords.length > 0 && (
        <div style={{ marginTop: '20px', width: '80%' }}>
          <table 
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              backgroundColor: '#2A3E4C',
              color: 'white',
              borderRadius: '8px',
            }}
          >
            <thead>
              <tr>
                <th style={{ border: '1px solid #444', padding: '12px', textAlign: 'center' }}>Billing ID</th>
                <th style={{ border: '1px solid #444', padding: '12px', textAlign: 'center' }}>Patient ID</th>
                <th style={{ border: '1px solid #444', padding: '12px', textAlign: 'center' }}>Amount Due</th>
                <th style={{ border: '1px solid #444', padding: '12px', textAlign: 'center' }}>Outstanding Balance</th>
                <th style={{ border: '1px solid #444', padding: '12px', textAlign: 'center' }}>Billing Date</th>
                <th style={{ border: '1px solid #444', padding: '12px', textAlign: 'center' }}>Payment Status</th>
              </tr>
            </thead>
            <tbody>
              {billingRecords.map((bill, index) => (
                <tr key={bill.billing_id} style={{ backgroundColor: index % 2 === 0 ? '#34495E' : '#2A3E4C' }}>
                  <td style={{ border: '1px solid #444', padding: '12px', textAlign: 'center' }}>{bill.billing_id}</td>
                  <td style={{ border: '1px solid #444', padding: '12px', textAlign: 'center' }}>{bill.patient_id}</td>
                  <td style={{ border: '1px solid #444', padding: '12px', textAlign: 'center' }}>${bill.amount_due}</td>
                  <td style={{ border: '1px solid #444', padding: '12px', textAlign: 'center' }}>${bill.outstanding_balance}</td>
                  <td style={{ border: '1px solid #444', padding: '12px', textAlign: 'center' }}>{bill.billing_date}</td>
                  <td style={{ border: '1px solid #444', padding: '12px', textAlign: 'center' }}>{bill.payment_status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Billing;
