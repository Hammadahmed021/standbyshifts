import React from 'react'

export default function Button({
    children,
    bgColor = 'bg-tn_primary',
    textColor = 'text-white',
    type = 'button',
    textSize = 'text-sm md:text-lg',
    padX = 'px-10',
    padY = 'py-2',
    className = '',
    ...props
}) {
  return (
    <button className={`${padX} ${padY} shadow-xl transition duration-500 ease-in-out hover:opacity-80 rounded-[100px] ${textSize} ${className} ${bgColor} ${textColor}`} {...props}>
        {children}
    </button>
  )
}
