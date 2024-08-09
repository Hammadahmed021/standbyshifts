import React from 'react'

export default function Button({
    children,
    bgColor = 'bg-tn_pink',
    textColor = 'text-white',
    type = 'button',
    textSize = 'text-lg',
    padX = 'px-4',
    padY = 'py-3',
    className = '',
    ...props
}) {
  return (
    <button className={`${padX} ${padY} rounded-lg ${textSize} ${className} ${bgColor} ${textColor}`} {...props}>
        {children}
    </button>
  )
}
