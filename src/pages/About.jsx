import React from 'react'
import { Link } from 'react-router-dom'
import { about, peoples } from '../assets'
import { Button, TestimonialSlider } from '../component'
import { infoGrid, testimonial } from '../utils/localDB'
import InfoGrid from '../component/InfoGrid'

export default function About() {
  return (
    <>
      <div className="flex items-center justify-center bg-hero sm:h-[250px] h-[200px] sm:mb-16 mb-12 mt-2 bg-no-repeat bg-cover container rounded-site overflow-hidden px-0">
        <h3 className="text-tn_primary text-4xl sm:text-5xl inline sm:block leading-tight font-semibold">
          About Us
        </h3>
      </div>

      <div className="container flex items-center my-20">
        <div className="lg:w-7/12 w-full ">
          <div className="text-start w-full lg:w-[75%] mx-auto">
            <h3 className="text-tn_dark text-4xl sm:text-5xl inline sm:block leading-tight font-semibold mb-4">
              What we can do?
            </h3>
            <p className='text-base text-tn_text_grey mb-8'>
              Aenean sollicituin, lorem quis bibendum auctor nisi elit consequat ipsum sagittis sem nibh id elit. Duis sed odio sit amet nibh vulputate cursus a sit amet maurisorbi accumsan ipsum velit. Nam nec tellus a odio tincidunt auctora ornare odio.
              <br /><br />
              Aenean sollicituin, lorem quis bibendum auctor nisi elit consequat ipsum sagittis sem nibh id elit. Duis sed odio sit amet nibh vulputate cursus a sit amet maurisorbi accumsan ipsum velit. Nam nec tellus a odio tincidunt auctora ornare odio.
            </p>
            <Button>
              {" "}
              Read More
            </Button>
          </div>
        </div>
        <div className="lg:w-5/12 w-full">
          <img src={about} alt="" />
        </div>
      </div>

      <div className="container mx-auto">
        <div className=" mb-10 sm:mb-14">
         
          <div className="mt-8">
            <InfoGrid items={infoGrid} />
          </div>
        </div>
      </div>

      <div className="container flex items-center my-20 testimonials">
        <div className="lg:w-5/12 w-full">
          <img src={peoples} alt="" />
        </div>
        <div className="lg:w-7/12 w-full ">
          <div className="text-start w-full lg:w-[65%] mx-auto">
            <h3 className="text-tn_dark text-4xl sm:text-5xl inline sm:block leading-tight font-semibold">
              Trusted by people all over
            </h3>
            <TestimonialSlider data={testimonial} />
          </div>
        </div>
      </div>
    </>
  )
}
