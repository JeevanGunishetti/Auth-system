import React, {useState} from "react";
import axios from "axios";
import {toast, ToastContainer} from "react-toastify";
import Layout from "./Layout";


const Forgot =() =>{
  const [values, setValues] = useState({
  email: "",
  buttonText: "Send Reset password link",
  });

  const {email, buttonText} = values;

  const handleChange = (name) => (evt) =>{
    setValues =({
    ...values,
    [name] : evt.target.value
    });
  };

  const handleSubmit = (evt) =>{
    evt.preventDefault();
    setValues({...values, buttonText :"Sending"})

    axios.post("/forgot-password",{email})
    .then((res)=>{
    console.log("Success Forgot password", res);
    setValues({
    ...values,
    buttonText :"Send Reset password link",
    });
    toast.success(res.date.message);
    })
    .catch((err) =>{
      console.log("failure forgot password", err.response.data)
      toast.error(err.response.data.error);
      setValues({
        ...values, buttonText:"Send Reset password link"
      });
    });

  };

  const ForgotpasswordForm =() =>(
    <form>
      <div>
        <label>Email</label>
        <input
          onChange ={handleChange(email)}
          type="email"
          value = {email}
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
    <h1>Forgot password component</h1>
    {ForgotpasswordForm()}
    </div>
  </Layout>
);
};

export default Forgot;
