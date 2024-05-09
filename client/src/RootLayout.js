import React from 'react'
import Navbar from './comp/Navbar'
import Footer from './comp/Footer'
import { Outlet } from 'react-router-dom'

function RootLayout() {
  return (
    <div>
      <Navbar />
      <div style={{minHeight:'90vh'}} className='mb-5'>
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}

export default RootLayout