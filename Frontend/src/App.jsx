import React from 'react'
import Router from './routes'
import { Toaster } from 'react-hot-toast'
const App = () => {
  return (
    <div className='bg-[url("/bgImage.svg")] bg-contain  '>
      <Toaster />
      <Router />
    </div>
  )
}

export default App