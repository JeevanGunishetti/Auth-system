import React, {useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom"
import {toast, ToastContainer} from "react-toastify";
import Layout from "./Layout";
import {isAuth} from "../utils/helpers";


const Signin =({history}) =>{
  const [formInputs, setFormInputs] = useState({
  name: "",
  email: "",
  password: "",
  buttonText: "Submit",
  });

  const {name, email, password, buttonText} = formInputs;

  const handleChange =(evt) =>{
    setFormInputs({
    ...formInputs,
    [evt.target.name] : evt.target.value,
    });
  };

  const handleSubmit = (evt) =>{
    evt.preventDefault();
    setFormInputs({...formInputs, buttonText :"Submitting"});

    axios.post("/signin",{email, password})
    .then((res)=>{
    console.log("Successfully signed in.",res);
    setFormInputs({
    email:"",
    password:"",
    buttonText :"Submit",
    });
    toast.success(res.date.message);
    //
    isAuth() ? history.push("/dashboard") : history.push("/signin");
    })
    .catch((err) =>{
      if(err && err.response && err.response.date)
      {
        toast.error(err.response.data.error);
      }
      setFormInputs({
        ...formInputs, buttonText:"Submit"
      });
    });

  };

  const signinForm =() =>(
    <form>
      <div>
        <label>Email</label>
        <input
          onChange ={handleChange}
          name= "name"
          type="text"
          value = {name}
        />
      </div>
      <div>
        <label>Password</label>
        <input
          onChange ={handleChange}
          name= "password"
          type="password"
          value = {password}
        />
      </div>
      <div>
        <button onChange={handleSubmit} type="button">{buttonText}</button>
      </div>
    </form>
  );

  return (
  <Layout>
    <div>
    <ToastContainer/>
    <h1>Signin component</h1>
    {signinForm()}
    <Link to="auth/password/forgot">Forgot password</Link>
    </div>
  </Layout>
);
};

export default Signin;
