"use client"

import React, { useState } from 'react'
import error_img from "@/public/error_img.svg"


export function ImageWithFallback(props: React.ImgHTMLAttributes<HTMLImageElement>) {
    const [didError, setDidError] = useState(false)

    const handleError = () => {
        setDidError(true)
    }

    const { src, alt, style, className, ...rest } = props

    return didError ? (
        <div
            className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
            style={style}
        >
            <div className="flex items-center justify-center w-full h-full">
                <img src={error_img} alt="Error loading image" {...rest} data-original-url={src} />
            </div>
        </div>
    ) : (
        <img src={src} alt={alt} className={className} style={style} {...rest} onError={handleError} />
    )
}
