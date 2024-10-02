import React from 'react'

export default function Button({
    children,
    bgColor = 'bg-tn_primary',
    textColor = 'text-white',
    type = 'button',
    textSize = 'text-base ',
    padX = 'px-8',
    padY = 'py-2',
    className = '',
    ...props
}) {
  return (
    <button className={`${padX} ${padY} rounded-[100px] ${textSize} ${className} ${bgColor} ${textColor}`} {...props}>
        {children}
    </button>
  )
}
