import React, {useState} from 'react';
import Navbar from '../../components/Navbar/Navbar';
import {Link, useNavigate} from 'react-router-dom';
import PasswordInput from '../../components/Input/PasswordInput';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import OAuth from '../../components/Google/OAuth';

const Login = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [role, setRole] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if(!name){
      setError("Please enter your name");
      return;
    }

    if(!validateEmail(email)){
      setError("Please enter a valid email address.");
      return;
    }

    if(!password){
      setError("Please enter a password");
      return;
    }

    if(!role){
      setError("Please pick a role");
      return;
    }

    setError("");

    //SignUp API call
    try{
      const response = await axiosInstance.post("/create-account",{
        fullName: name,
        email: email,
        password: password,
        role: role,
      });
  
      //Handle successful registration
      if(response.data && response.data.error){
        setError(response.data.message);
        return
      }

      if(response.data && response.data.accessToken){
        localStorage.setItem("token", response.data.accessToken);
        navigate("/home");
      }
    } catch(error){
      //Handle Login Error
      if (error.response && error.response.data && error.response.data.message){
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <>
      <div className='flex items-center justify-center mt-28'>
        <div className='w-96 border rounded big-white px-7 py-10'>
          <form onSubmit={handleLogin}>
            <h4 className='text-2xl mb-7'>Sign Up</h4>

            <input type = 'text' placeholder='Name' className='input-box'
            value = {name}
            onChange={(e)=> setName(e.target.value)} />

            <input type = 'text' placeholder='Email' className='input-box'
            value = {email}
            onChange={(e)=> setEmail(e.target.value)} />

            <PasswordInput value = {password}
            onChange={(e)=> setPassword(e.target.value)} 
            />

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={role === 'admin'}
                  onChange={(e) => setRole(e.target.value)}
                  className="mr-2"
                />
                <label htmlFor="admin">Admin</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="guest"
                  checked={role === 'guest'}
                  onChange={(e) => setRole(e.target.value)}
                  className="mr-2"
                />
                <label htmlFor="guest">Guest</label>
              </div>
            </div>

            {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}
            
            <button type = 'submit' className='btn-primary'>
              Create An Account
            </button>

            <OAuth type="signUp" message="Sign Up With Google"/>

            <p className='text-sm text-center mt-4'>
              Already Got an Account ? {" "}
              <Link to ="/login" className="front-medium text-primary underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  )
}

export default Login

