import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import './Signup.css'

function Signup() {

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

  return (
    
    <div className='container sig'>
        <div className="card w-50 mx-auto mt-5 container">
        {err.length !== 0 && (
                <p className="lead text-center text-danger">{err}</p>
              )}
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                {/* usertype */}
                <div className="mt-3">
                    <label className="form-label">Usertype</label>
                    <div>
                        <input type="radio" id="userRole" value="user" {...register("usertype", { required: true })} />
                        <label htmlFor="userRole" className="ml-2">User</label>
                    </div>
                    <div>
                        <input
                            type="radio"
                            id="authorRole"
                            value="author"
                            {...register("usertype", { required: true })}
                        />
                        <label htmlFor="authorRole" className="ml-2">Author</label>
                    </div>
                    {errors.usertype && (
                    <p className="text-danger">Please select a role</p>
                    )}
                </div>
                {/* username */}
                <div className="mt-3">
                    <label htmlFor="username" className="form-label">
                    Username
                    </label>
                    <input
                    type="text"
                    id="username"
                    className="form-control"
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
                {/* password */}
                <div className="mt-3">
                    <label htmlFor="password" className="form-label">
                    Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        className="form-control"
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
                
                {/* email */}
                <div className="mt-3">
                    <label htmlFor="email" className="form-label">
                    Email
                    </label>
                    <input type="text" id="email" className="form-control" {...register("email", { required: true })} />
                    {errors.email?.type === "required" && (
                    <p className="text-danger">Enter Email</p>
                    )}
                </div>
                <button type="submit" className="btn btn-success mt-3 mb-3">Add User</button>
            </form>
        </div>
    </div>
  )
}

export default Signup