import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'

function UserProfile() {
  return (
    <div>
      <NavLink to='articles' className='fs-4 text-white nav-link mt-4'>Articles</NavLink>
      <Outlet />
    </div>
  )
}

export default UserProfile