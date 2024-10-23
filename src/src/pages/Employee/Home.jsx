import React, { useEffect } from 'react'

const Home = () => {
  const { type } = location.state || {}; // Get the type passed from modal

  

   

  return (
    <div>Employee Home {type}</div>
  )
}

export default Home