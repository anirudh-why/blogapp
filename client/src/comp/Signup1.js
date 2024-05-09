import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import './Signup1.css'
import React from 'react';
import { Link } from 'react-router-dom';

function Signup1() {

    let {
        register,
        handleSubmit,
        formState: { errors }
      } = useForm();
      let [err, seterr] = useState('');
      let navigate=useNavigate()

      async function handleFormSubmit(userobj) {
        //http post request
        let res=await axios.post(`${window.location.origin}/${userobj.usertype}-api/${userobj.usertype}`,userobj)
        console.log(res);
        if(res.data.message==='User created' || res.data.message==='Author created' )
        {
            //navigate to signin
            navigate('/signin')
        }
        else{
            seterr(res.data.message)
        }
      }

  return (<div className='container'>
  <div className="w-50 mx-auto mt-5 container xxx">
      {err.length !== 0 && (
          <p className="lead text-center text-danger">{err}</p>
      )}
      <form onSubmit={handleSubmit(handleFormSubmit)}>

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
              {errors.usertype && (
                  <p className="text-danger">Please select a role</p>
              )}
          </div>

          {/* Email */}
          <div className="mt-3">
              <label htmlFor="email" className="form-label font-weight-bold">
                  Email
              </label>
              <input type="text" id="email" className="form-control form-control-sm" {...register("email", { required: true })} />
              {errors.email?.type === "required" && (
                  <p className="text-danger">Enter Email</p>
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

          <button type="submit" id="btn" className="btn btn-success mt-3 mb-3">Sign Up</button>
          <p>Already have an account?
 <Link to="http://localhost:4000/signin"> Signin</Link>
</p>
      </form>
  </div>
</div>
)
}

export default Signup1