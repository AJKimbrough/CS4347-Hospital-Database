import React, { useState, useEffect } from 'react';

function Staff() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [staffList, setStaffList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch staff from the backend
  const fetchStaff = async () => {
    try {
      const response = await fetch('http://localhost:5001/staff');
      if (response.ok) {
        const staffData = await response.json();
        setStaffList(staffData); 
        setIsLoading(false); 
      } else {
        console.error('Failed to fetch staff data');
      }
    } catch (err) {
      console.error('Error fetching staff:', err);
    }
  };

  useEffect(() => {
    fetchStaff(); 
  }, []); 

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Create an object from the form data
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    // If contact_info is empty, set it to null before sending it to the server
    if (data.contact_info === '') {
      data.contact_info = null;
    }

    // Log the data before sending it to the server 
    console.log('Form data:', data);

    try {
      // Send the data to the server
      const response = await fetch('http://localhost:5001/staff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: data.first_name,
          last_name: data.last_name,
          position: data.position,
          contact_info: data.contact_info,
          hire_date: data.hire_date,
        }),
      });

      if (response.ok) {
        setFormSubmitted(true);
        fetchStaff(); // Refresh staff list after adding a new staff member
      } else {
        console.error('Failed to submit staff information.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Render the staff list and form
  return (
    <div>
      <h1>Staff List</h1>
      
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {staffList.map((staff) => (
            <li key={staff.staff_id}>
              {staff.first_name} {staff.last_name} - {staff.position}
            </li>
          ))}
        </ul>
      )}

      <h2>Add New Staff</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="first_name" placeholder="First Name" required />
        <input type="text" name="last_name" placeholder="Last Name" required />
        <input type="text" name="position" placeholder="Position" required />
        <input type="text" name="contact_info" placeholder="Contact Info" />
        <input type="date" name="hire_date" required />
        <button type="submit">Add Staff</button>
      </form>

      {formSubmitted && <p>Staff added successfully!</p>}
    </div>
  );
}

export default Staff;
