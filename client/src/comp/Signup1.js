import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { userAuthorLoginThunk, clearError } from '../redux/slices/userAuthorSlice';
import './Signup.css';

function Signup1() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch
    } = useForm();
    
    let navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentUser, loginUserStatus } = useSelector((state) => state.userAuthorLoginReducer);

    // Clear errors when component mounts
    useEffect(() => {
        dispatch(clearError());
    }, [dispatch]);

    // Watch password field for validation
    const password = watch('password');

    // Password validation
    const validatePassword = (password) => {
        const checks = {
            length: password?.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[@$!%*?&]/.test(password)
        };

        // Show specific validation errors
        if (!checks.length) {
            toast.error('Password must be at least 8 characters long');
            return false;
        }
        if (!checks.uppercase) {
            toast.error('Password must contain at least one uppercase letter');
            return false;
        }
        if (!checks.lowercase) {
            toast.error('Password must contain at least one lowercase letter');
            return false;
        }
        if (!checks.number) {
            toast.error('Password must contain at least one number');
            return false;
        }
        if (!checks.special) {
            toast.error('Password must contain at least one special character (@$!%*?&)');
            return false;
        }
        return true;
    };

    // Email validation
    const validateEmail = (email) => {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        if (!emailRegex.test(email)) {
            toast.error('Please enter a valid email address');
            return false;
        }
        return true;
    };

    async function handleFormSubmit(userobj) {
        // Validate password and email before submission
        if (!validatePassword(userobj.password) || !validateEmail(userobj.email)) {
            return;
        }

        try {
            let res = await axios.post(`/${userobj.usertype}-api/${userobj.usertype}`, userobj);
            
            if (res.data.message === 'User created' || res.data.message === 'Author created') {
                toast.success('Account created! Logging you in...', {
                    duration: 2000
                });
                
                // Automatically login after successful signup
                setTimeout(() => {
                    dispatch(userAuthorLoginThunk({
                        username: userobj.username,
                        password: userobj.password,
                        usertype: userobj.usertype
                    }));
                }, 1000);
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            toast.error('Signup failed. Please try again.');
        }
    }

    // Watch for successful login after signup
    useEffect(() => {
        if (loginUserStatus === true && currentUser && currentUser.usertype) {
            setTimeout(() => {
                if (currentUser.usertype === "user") {
                    navigate("/user-profile");
                } else if (currentUser.usertype === "author") {
                    navigate("/author-profile");
                }
            }, 500);
        }
    }, [loginUserStatus, currentUser, navigate]);

    // Show field-specific validation errors as toasts
    const showFieldErrors = () => {
        if (errors.username) {
            if (errors.username.type === "required") {
                toast.error('Username is required');
            } else if (errors.username.type === "minLength") {
                toast.error('Username must be at least 3 characters');
            } else if (errors.username.type === "maxLength") {
                toast.error('Username must be 12 characters or less');
            }
        }
        if (errors.usertype?.type === "required") {
            toast.error('Please select User or Author');
        }
        if (errors.email?.type === "required") {
            toast.error('Email is required');
        }
        if (errors.password?.type === "required") {
            toast.error('Password is required');
        }
    };

    return (
        <div className='container'>
            <Toaster 
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                    success: {
                        style: {
                            background: 'green',
                        },
                    },
                    error: {
                        style: {
                            background: '#ff4b4b',
                        },
                    },
                }}
            />

            <div className="w-50 mx-auto mt-5 container xxx">
                <form onSubmit={handleSubmit(handleFormSubmit)} onChange={showFieldErrors}>
                    {/* Usertype */}
                    <div className="mt-3">
                        <label className="form-label font-weight-bold">Usertype</label>
                        <div className="d-flex justify-content-center">
                            <div className="form-check form-check-inline">
                                <input type="radio" id="userRole" value="user" {...register("usertype", { required: true })} className="form-check-input" />
                                <label htmlFor="userRole" className="form-check-label ml-1">User</label>
                            </div>
                            <div className="form-check form-check-inline ml-3">
                                <input
                                    type="radio"
                                    id="authorRole"
                                    value="author"
                                    {...register("usertype", { required: true })}
                                    className="form-check-input"
                                />
                                <label htmlFor="authorRole" className="form-check-label ml-1">Author</label>
                            </div>
                        </div>
                    </div>

                    {/* Email */}
                    <div className="mt-3">
                        <label htmlFor="email" className="form-label font-weight-bold">
                            Email
                        </label>
                        <input 
                            type="text" 
                            id="email" 
                            className="form-control form-control-sm" 
                            {...register("email", { required: true })} 
                        />
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
                            {...register("password", { required: true })}
                        />
                    </div>

                    <button type="submit" id="btn" className="btn btn-success mt-3 mb-3">Sign Up</button>
                    <p>Already have an account? <Link to="/signin">Signin</Link></p>
                </form>
            </div>
        </div>
    );
}

export default Signup1;