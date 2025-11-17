"use client"

import { useEffect } from 'react'

export default function SuccessRedirect() {
  useEffect(() => {
    const t = setTimeout(() => {
      window.location.href = '/'
    }, 5000)
    return () => clearTimeout(t)
  }, [])

  return null
}
