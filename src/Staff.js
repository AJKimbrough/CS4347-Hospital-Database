import React, { useState, useEffect } from 'react';

function Staff() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    position: '',
    contact_info: '',
    hire_date: '',
  });

  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [staffList, setStaffList] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [showRecords, setShowRecords] = useState(false);

  // Function to format the date as YYYY-MM-DD
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];  // Get only the YYYY-MM-DD part
  };

  // Fetch staff 
  const fetchStaff = async () => {
    try {
      const response = await fetch('http://localhost:5001/staff');
      if (!response.ok) {
        throw new Error('Failed to fetch staff data');
      }
      const staffData = await response.json();
      setStaffList(staffData);
    } catch (error) {
      setErrorMessage('Failed to fetch staff data');
    }
  };

  useEffect(() => {
    fetchStaff();
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

    if (!formData.first_name || !formData.last_name || !formData.position || !formData.hire_date) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setErrorMessage('');
        setConfirmationMessage('Staff info submitted successfully!');
        setFormData({
          first_name: '',
          last_name: '',
          position: '',
          contact_info: '',
          hire_date: '',
        });

        const updatedResponse = await fetch('http://localhost:5001/staff');
        const updatedData = await updatedResponse.json();
        setStaffList(updatedData);
      } else {
        throw new Error('Failed to submit staff info.');
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
      <h1>Staff Management</h1>

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
          name="first_name"
          placeholder="First Name (Required)"
          value={formData.first_name}
          onChange={handleChange}
          style={{ padding: '10px', borderRadius: '5px' }}
        />
        <input
          type="text"
          name="last_name"
          placeholder="Last Name (Required)"
          value={formData.last_name}
          onChange={handleChange}
          style={{ padding: '10px', borderRadius: '5px' }}
        />
        <input
          type="text"
          name="position"
          placeholder="Position (Required)"
          value={formData.position}
          onChange={handleChange}
          style={{ padding: '10px', borderRadius: '5px' }}
        />
        <input
          type="text"
          name="contact_info"
          placeholder="Contact Info"
          value={formData.contact_info}
          onChange={handleChange}
          style={{ padding: '10px', borderRadius: '5px' }}
        />
        <input
          type="date"
          name="hire_date"
          value={formData.hire_date}
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
            fontWeight: 'bold',
          }}
        >
          Add Staff
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
        {showRecords ? 'Hide Staff Records' : 'Show Staff Records'}
      </button>

      {showRecords && staffList.length > 0 && (
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
                <th style={{ border: '1px solid #444', padding: '12px', textAlign: 'center' }}>Employee ID</th>
                <th style={{ border: '1px solid #444', padding: '12px', textAlign: 'center' }}>First Name</th>
                <th style={{ border: '1px solid #444', padding: '12px', textAlign: 'center' }}>Last Name</th>
                <th style={{ border: '1px solid #444', padding: '12px', textAlign: 'center' }}>Position</th>
                <th style={{ border: '1px solid #444', padding: '12px', textAlign: 'center' }}>Contact Info</th>
                <th style={{ border: '1px solid #444', padding: '12px', textAlign: 'center' }}>Hire Date</th>
              </tr>
            </thead>
            <tbody>
              {staffList.map((staff, index) => (
                <tr key={staff.staff_id} style={{ backgroundColor: index % 2 === 0 ? '#34495E' : '#2A3E4C' }}>
                  <td style={{ border: '1px solid #444', padding: '12px', textAlign: 'center' }}>{staff.staff_id}</td>
                  <td style={{ border: '1px solid #444', padding: '12px', textAlign: 'center' }}>{staff.first_name}</td>
                  <td style={{ border: '1px solid #444', padding: '12px', textAlign: 'center' }}>{staff.last_name}</td>
                  <td style={{ border: '1px solid #444', padding: '12px', textAlign: 'center' }}>{staff.position}</td>
                  <td style={{ border: '1px solid #444', padding: '12px', textAlign: 'center' }}>
                    {staff.contact_info || 'N/A'}
                  </td>
                  <td style={{ border: '1px solid #444', padding: '12px', textAlign: 'center' }}>
                    {formatDate(staff.hire_date)}
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

export default Staff;
