import { useForm } from "react-hook-form";
import { useState } from "react";
import {useDispatch,useSelector} from 'react-redux'
import {userAuthorLoginThunk} from '../redux/slices/userAuthorSlice'
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import React from 'react';
import { Link } from 'react-router-dom';
import './Signin.css'

function Signin() {

    let userobj;
    let {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();
    let { isPending, currentUser, loginUserStatus, errorOccurred, errMsg } =
    useSelector((state) => state.userAuthorLoginReducer);
    let [users, setUsers] = useState([]);
    let dispatch=useDispatch();
    let navigate=useNavigate();

    function handleFormSubmit(userCred) {
       setUsers([...users, userobj]);
       console.log(userCred)
       dispatch(userAuthorLoginThunk(userCred))
    }

    useEffect(() => {
        if (loginUserStatus) {
          if (currentUser.usertype === "user") {
            navigate("/user-profile");
          }
          if (currentUser.usertype === "author") {
            navigate("/author-profile");
          }
        }
      }, [loginUserStatus]);

  return (
    <div className='container'>
    <div className="card w-50 mx-auto mt-5 container xxxx">
        <form onSubmit={handleSubmit(handleFormSubmit)}>
            {/* Usertype */}
            <div className="mt-3">
                <label className="form-label font-weight-bold">Usertype</label>
                <div className="row justify-content-center">
                    <div className="col-auto">
                        <div className="form-check">
                            <input type="radio" id="userRole" value="user" {...register("usertype", { required: true })} className="form-check-input" />
                            <label htmlFor="userRole" className="form-check-label ml-2">User</label>
                        </div>
                    </div>
                    <div className="col-auto">
                        <div className="form-check">
                            <input
                                type="radio"
                                id="authorRole"
                                value="author"
                                {...register("usertype", { required: true })}
                                className="form-check-input"
                            />
                            <label htmlFor="authorRole" className="form-check-label ml-2">Author</label>
                        </div>
                    </div>
                </div>
                {errors.usertype && (
                    <p className="text-danger">Please select a role</p>
                )}
            </div>
            {/* Username */}
            <div className="mt-3">
                <label htmlFor="username" className="form-label font-weight-bold">
                    Username
                </label>
                <input
                    type="text"
                    id="username"
                    className="form-control form-control-sm"
                    {...register("username", {
                        required: true,
                        minLength: 3,
                        maxLength: 12,
                    })}
                />
                {errors.username?.type === "required" && (
                    <p className="text-danger">Enter username</p>
                )}
                {errors.username?.type === "minLength" && (
                    <p className="text-danger">Min length should be 3</p>
                )}
                {errors.username?.type === "maxLength" && (
                    <p className="text-danger">Max length should be 12</p>
                )}
            </div>
            {/* Password */}
            <div className="mt-3">
                <label htmlFor="password" className="form-label font-weight-bold">
                    Password
                </label>
                <input
                    type="password"
                    id="password"
                    className="form-control form-control-sm"
                    {...register("password", {
                        required: true,
                        minLength: 1,
                        maxLength: 20,
                    })}
                />
                {errors.password?.type === "required" && (
                    <p className="text-danger">Enter password</p>
                )}
                {errors.password?.type === "minLength" && (
                    <p className="text-danger">Min length should be 1</p>
                )}
                {errors.password?.type === "maxLength" && (
                    <p className="text-danger">Max length should be 20</p>
                )}
            </div>
        
            <button type="submit" className="btn btn-success mt-3 mb-3">Login</button>
            <p>Don't have an account yet?
 <Link to="http://localhost:4000/signup"> Signup</Link>
</p>
        </form>
    </div>
</div>

  )
}

export default Signin;
