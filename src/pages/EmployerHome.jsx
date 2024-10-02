import React from 'react'

const EmployerHome = () => {
  const { type } = location.state || {}; // Get the type passed from modal

  return (
    <div>EmployerHome {type}</div>
  )
}

export default EmployerHome