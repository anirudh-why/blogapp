import React from 'react'
import {Link, Outlet} from 'react-router-dom'



function AuthorProfile() {
  return (
    <div>
        <ul className='nav justify-content-center bg-light'>
            <li className='nav-item'>
                <Link className='nav-link' to='articles-by-author/nihaal'>Articles</Link>
            </li>
            <li className='nav-item'>
                <Link className='nav-link' to='new-article'>Add new</Link>
            </li>
        </ul>
        <Outlet />
    </div>
  )
}

export default AuthorProfile