import React from 'react'
import { TestimonialSlider, Contact as ContactForm } from '../component'
import { testimonial } from '../utils/localDB'
import { peoples } from '../assets'
import { FaEnvelope, FaPhone } from 'react-icons/fa'

export default function Contact() {
  return (
    <>
      <div className="flex items-center justify-center bg-hero sm:h-[250px] h-[200px] sm:mb-16 mb-12 mt-2 bg-no-repeat bg-cover container rounded-site overflow-hidden px-0">
        <h3 className="text-tn_primary text-4xl sm:text-5xl inline sm:block leading-tight font-semibold">
          Contact Us
        </h3>
      </div>
      <div className="container flex items-start my-20 testimonials gap-6">
        <div className="lg:w-5/12 w-full">
          {/* <div className="flex shadow-md rounded-lg bg-white p-6 border gap-4 items-center mb-6">
            <FaPhone size={50} color='#F59200' />
            <div>
              <h4 className='text-tn_dark text-2xl sm:text-3xl inline sm:block leading-tight font-semibold mb-2'>Phone Number</h4>
              <p className='text-base text-tn_text_grey'><a href='tel:(132) 123-1324'>(132) 123-1324</a></p>
              <p className='text-base text-tn_text_grey'><a href='tel:(132) 123-1324'>(132) 123-1324</a></p>
            </div>
          </div> */}
          <div className="flex shadow-md rounded-lg bg-white p-6 border gap-4 items-center">
            <FaEnvelope size={50} color='#F59200' />
            <div>
              <h4 className='text-tn_dark text-2xl sm:text-3xl inline sm:block leading-tight font-semibold mb-2'>Email Address</h4>
              <p className='text-base text-tn_text_grey'><a href='mailto:info@standbyshifts.com'>customercare@standybyshifts.com</a></p>
              {/* <p className='text-base text-tn_text_grey'><a href='mailto:info@standbyshifts.com'>info@standbyshifts.com</a></p> */}
            </div>
          </div>
        </div>
        <div className="lg:w-7/12 w-full">
          <ContactForm />
        </div>
      </div>
      <div className="container flex items-center my-20 testimonials">
        <div className="lg:w-5/12 w-full">
          <img src={peoples} alt="" />
        </div>
        <div className="lg:w-7/12 w-full ">
          <div className="text-start w-full lg:w-[65%] mx-auto">
            <h3 className="text-tn_dark text-4xl sm:text-5xl inline sm:block leading-tight font-semibold">
              Control Your Workforce Experience.
            </h3>
            <TestimonialSlider data={testimonial} />
          </div>
        </div>
      </div>
    </>
  )
}
