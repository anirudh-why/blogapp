import React from 'react'
import {Link} from 'react-router-dom'
import { useSelector ,useDispatch} from 'react-redux';
import { resetState } from '../redux/slices/userAuthorSlice';

function Navbar() {

    
    
    let { isPending, currentUser, loginUserStatus, errorOccurred, errMsg } =
    useSelector((state) => state.userAuthorLoginReducer);

    let dispatch=useDispatch()

    function signout(){
        dispatch(resetState())
    }

  return (
    <div>
        <ul className='nav justify-content-end bg-light'>
            {loginUserStatus===false?
            <>
            <li className='nav-item'>
                <Link className='nav-link' to='home'>Home</Link>
            </li>
            <li className='nav-item'>
                <Link className='nav-link' to='signup'>Signup</Link>
            </li>
            <li className='nav-item'>
                <Link className='nav-link' to='signin'>Signin</Link>
            </li></>:<>
            <li className='nav-item'>
                <p className='fs-3' style={{ fontFamily: 'Arial, sans-serif' }}> Welcome {currentUser.username}</p>
            </li>
            <li className='nav-item'>
                <Link className='nav-link' to='signin' onClick={signout}>
                    Signout
                </Link>
            </li></>}
        </ul>
    </div>
  )
}

export default Navbar