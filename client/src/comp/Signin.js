import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { userAuthorLoginThunk, clearError } from '../redux/slices/userAuthorSlice';
import { useNavigate } from "react-router-dom";
import React from 'react';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import './Signin.css';

function Signin() {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const { currentUser, loginUserStatus, errorOccurred, errMsg } = useSelector((state) => state.userAuthorLoginReducer);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Clear errors when component mounts
    useEffect(() => {
        dispatch(clearError());
    }, [dispatch]);

    // Handle form submission
    const handleFormSubmit = (userCred) => {
        dispatch(clearError()); // Clear any previous errors
        dispatch(userAuthorLoginThunk(userCred));
    };

    // Watch login status
    useEffect(() => {
        if (loginUserStatus === true && currentUser && currentUser.usertype) {
            toast.success('Welcome back!', {
                duration: 2000,
            });
            setTimeout(() => {
                if (currentUser.usertype === "user") {
                    navigate("/user-profile");
                } else if (currentUser.usertype === "author") {
                    navigate("/author-profile");
                }
            }, 500);
        }
    }, [loginUserStatus, currentUser, navigate]);

    // Handle login errors
    useEffect(() => {
        if (errorOccurred && errMsg) {
            toast.error(errMsg, {
                duration: 3000
            });
        }
    }, [errorOccurred, errMsg]);
    

    // Handle form validation errors
    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            if (errors.usertype) {
                toast.error('Please select User or Author');
            } else if (errors.username) {
                toast.error('Please enter a valid username');
            } else if (errors.password) {
                toast.error('Please enter your password');
            }
        }
    }, [errors]);

    return (
        <div className='container'>
            <Toaster 
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    className: 'toast-notification',
                    success: {
                        style: {
                            background: '#10B981',
                            color: '#fff',
                        },
                        iconTheme: {
                            primary: '#fff',
                            secondary: '#10B981',
                        },
                    },
                    error: {
                        style: {
                            background: '#EF4444',
                            color: '#fff',
                        },
                        iconTheme: {
                            primary: '#fff',
                            secondary: '#EF4444',
                        },
                    },
                }}
            />
            
            <div className="card w-50 mx-auto mt-5 container xxxx">
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    {/* Usertype */}
                    <div className="mt-3">
                        <label className="form-label font-weight-bold">Role</label>
                        <div className="row justify-content-center">
                            <div className="col-auto">
                                <div className="form-check">
                                    <input 
                                        type="radio" 
                                        id="userRole" 
                                        value="user" 
                                        {...register("usertype", { required: true })} 
                                        className="form-check-input" 
                                    />
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
                                maxLength: 20,
                            })}
                        />
                    </div>

                    <button type="submit" className="btn btn-success mt-3 mb-3">Login</button>
                    <p>Don't have an account yet? <Link to="/signup">Signup</Link></p>
                </form>
            </div>
        </div>
    );
}

export default Signin;