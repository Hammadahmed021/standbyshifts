import React from 'react'

export default function Button({
    children,
    bgColor = 'bg-tn_pink',
    textColor = 'text-white',
    type = 'button',
    className = '',
    ...props
}) {
  return (
    <button className={`px-4 py-3 rounded-lg text-lg ${className} ${bgColor} ${textColor}`} {...props}>
        {children}
    </button>
  )
}
