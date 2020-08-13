import React, {useState} from "react";
import axios from "axios";
import {toast, ToastContainer} from "react-toastify";
import Layout from "./Layout";


const Signup =() =>{
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

    axios.post("/signup",{name, email, password})
    .then((res)=>{
    console.log("Successfully signed up.",res);
    setFormInputs({
    name:"",
    email:"",
    password:"",
    buttonText :"Submit",
    });
    toast.success(res.data.message);
  })
    .catch((err) =>{
      if(err && err.response && err.response.data)
      {
        toast.error(err.response.data.error);
      }
      setFormInputs({
        ...formInputs, buttonText:"Submit",
      });
    });

  };

  const signupForm =() =>(
    <form>
      <div>
        <label>Name</label>
        <input
          onChange ={handleChange}
          name= "name"
          type="text"
          value = {name}
        />
      </div>
      <div>
        <label>Email</label>
        <input
          onChange ={handleChange}
          name= "email"
          type="email"
          value = {email}
        />
      </div>


      <div>
        <label>Password</label>
        <input
          onChange ={handleChange}
          name="password"
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
    <h1>Signup component</h1>
    {signupForm()}
    </div>
  </Layout>
);
};

export default Signup;
