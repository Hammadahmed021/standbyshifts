import React from 'react'
import { Link } from 'react-router-dom'

import { notfound } from '../assets'
import { useSelector } from 'react-redux';

const NotFound = () => {
  const userData = useSelector((state) => state.auth.userData);

  return (
    <div className='text-center my-10 container mx-auto'>
      {/* <img src={notfound} alt='not found' className="w-[500px] mx-auto mb-6" /> */}
      <h4 className='text-center text-6xl py-8 font-medium blockw'>Page not found</h4>
      <Link to={
        userData
          ? userData.user.type === "employee"
            ? "employee"
            : "employer"
          : "/"
      } className='bg-tn_pink rounded-lg text-base px-6 py-3 text-white'>Back to home</Link>
    </div>
  )
}

export default NotFound