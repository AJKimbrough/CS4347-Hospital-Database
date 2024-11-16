import React, { useState } from 'react';

function Staff() {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('http://localhost:5001/staff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setFormSubmitted(true);
      } else {
        console.error('Failed to submit staff information.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h1>Staff Management</h1>

      {/* Form */}
      <form id="staffForm" onSubmit={handleSubmit}>
        <label htmlFor="staff_id">Staff ID:</label>
        <input type="text" id="staff_id" name="staff_id" required />
        <br />

        <label htmlFor="first_name">First Name:</label>
        <input type="text" id="first_name" name="first_name" required />
        <br />

        <label htmlFor="last_name">Last Name:</label>
        <input type="text" id="last_name" name="last_name" required />
        <br />

        <label htmlFor="role">Role:</label>
        <input type="text" id="role" name="role" required />
        <br />

        <label htmlFor="department">Department:</label>
        <input type="text" id="department" name="department" required />
        <br />

        <label htmlFor="contact_info">Contact Information:</label>
        <input type="text" id="contact_info" name="contact_info" required />
        <br />

        <label htmlFor="availability">Availability:</label>
        <input type="text" id="availability" name="availability" required />
        <br />

        <label htmlFor="assigned_patients">Assigned Patients:</label>
        <input type="number" id="assigned_patients" name="assigned_patients" />
        <br />

        <button type="submit">Save Staff Info</button>
      </form>

      {/* Confirmation message */}
      {formSubmitted && (
        <div id="confirmationMessage" style={{ marginTop: '20px', color: 'green' }}>
          Form submitted successfully!
        </div>
      )}
    </div>
  );
}

export default Staff;
