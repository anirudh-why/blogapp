import React from 'react'
import { useSelector } from 'react-redux';
import {Link, Outlet} from 'react-router-dom'



function AuthorProfile() {
  let {currentUser}=useSelector(state=>state.userAuthorLoginReducer);
  return (
    <div>
        <ul className='nav justify-content-center bg-light'>
            <li className='nav-item'>
                <Link className='nav-link' to={`articles-by-author/${currentUser.username}`}>Articles</Link>
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