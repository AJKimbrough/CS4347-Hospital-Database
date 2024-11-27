import React from 'react';

function Home() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#222D32', // Dark background
      color: 'white', // White text
      textAlign: 'center',
    }}>
      <h2>Welcome to the Hospital Database</h2>
      <p>Here you can manage patients, appointments, billing, and more</p>
    </div>
  );
}

export default Home;
