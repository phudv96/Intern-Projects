import React from 'react';
import { AiFillGoogleCircle } from 'react-icons/ai';
import {GoogleAuthProvider, signInWithPopup, getAuth} from 'firebase/auth';
import {useDispatch} from 'react-redux';
import {app} from '../../firebase';
import {useNavigate} from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { generateRandomPassword } from '../../utils/helper'; 


const OAuth = ({type, message}) => {

  const auth = getAuth(app);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      const resultFromGoogle = await signInWithPopup(auth, provider);
      const { displayName, email, metadata } = resultFromGoogle.user;
      const creationTime = metadata.createdAt; 

      // Send the data to the backend API
      if (type==="signUp"){
      await createAccountWithGoogle({ displayName, email, creationTime});
      } else {
        await logInAccountWithGoogle(email, creationTime);
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  const logInAccountWithGoogle = async(email, creationTime)=>{
    try{
      const response = await axiosInstance.post("/login",{
        email: email,
        password: creationTime,
      });
      console.log(response);
      //Handle successful login
      if(response.data && response.data.accessToken){
        localStorage.setItem("token", response.data.accessToken);
        navigate('/home');
      }
    } catch(error){
      console.log(error);
    }
  }
  
  const createAccountWithGoogle = async (data) => {
    try {
      const response = await axiosInstance.post("/create-account", {
        fullName: data.displayName,
        email: data.email,
        password: data.creationTime,
        role: "guest",
      });
      console.log(response.data);
      if(response.data && response.data.accessToken){
          localStorage.setItem("token", response.data.accessToken);
          navigate('/home');
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  
  return (
    <button
      type='button'
      className='btn-primary'
      onClick={handleGoogleSignIn}
    >
    <div className="flex items-center justify-center">
      <AiFillGoogleCircle className='w-6 h-6 mr-2' />
      <span>{message}</span>
    </div>
</button>
  );
};

export default OAuth;
