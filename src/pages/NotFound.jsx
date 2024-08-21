import React from 'react'
import { Link } from 'react-router-dom'
import { notfound } from '../assets'

const NotFound = () => {
  return (
    <div className='text-center my-10 container mx-auto'>
      <img src={notfound} alt='not found' className="w-[500px] mx-auto mb-6" />
      <Link to={'/'} className='bg-tn_pink rounded-lg text-base px-6 py-3 text-white'>Back to home</Link>
    </div>
  )
}

export default NotFound