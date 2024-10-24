import React from 'react'
import { useParams } from 'react-router-dom'

const EmployeeView = () => {
  const { id } = useParams()
  console.log(id, 'id>>>>>>>>>>');
  
  return (
    <div>EmployeeView</div>
  )
}

export default EmployeeView