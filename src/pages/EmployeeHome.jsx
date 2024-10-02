import React from 'react'

const EmployeeHome = () => {
  const { type } = location.state || {}; // Get the type passed from modal

  return (
    <div>EmployeeHome {type}</div>
  )
}

export default EmployeeHome