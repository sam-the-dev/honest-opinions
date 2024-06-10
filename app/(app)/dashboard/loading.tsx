import { LoaderCircle } from 'lucide-react'
import React from 'react'

const loading = () => {
  return (
    <div className='flex justify-center items-center h-screen w-full'>
      <LoaderCircle className='animate-spin' size={50}/>
    </div>
  )
}

export default loading
