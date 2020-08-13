import React, {useState, useEffect} from "react";
import axios from "axios";
import {Link} from "react-router-dom"
import {toast, ToastContainer} from "react-toastify";
import Layout from "./Layout";
import jwt from "jsonwebtoken";


const Reset =({ match }) =>{
  const [values, setValues] = useState({
  name: "",
  token: "",
  newPassword: "",
  buttonText: "Submit",
  });
  // useEffect=() =>()____
  //

  useEffect(() => {
    let token = match.params.token;
    let { name } = jwt.decode(token);
    // console.log(name);
    if (token) {
      setValues((v) => ({ ...v, name, token }));
    }
  }, [match.params.token]);

  const {name, token, newPassword, buttonText} = values;

  const handleChange =(evt) =>{
    setValues =({
    ...values,
    newPassword : evt.target.value,
    });
  };

  const handleSubmit = (evt) =>{
    evt.preventDefault();
    setValues({...values, buttonText :"Submitting"})

    axios.post("/reset-password",{newPassword, resetPasswordLink: token})
    .then((res)=>{
    console.log("Reset password successfull.", res)
    toast.success(res.date.message);
    setValues({...values, buttonText:"Done"});
    //
    //
    })
    .catch((err) =>{
      console.log("there was some error in resetting password", err.response.data);
      toast.error(err.res.data.error);
      setValues({
        ...values, buttonText:"Reset Password"
      });
    });

  };

  const resetForm =() =>(
    <form>
      <div>
        <label>name</label>
        <input
          onChange ={handleChange}
          name= "name"
          type="text"
          value = {name}
        />
      </div>
      <div>
        <label>New Password</label>
        <input
          onChange ={handleChange}
          placeholder="Type new password"
          type="password"
          value = {newPassword}
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
    <h1>Reset component</h1>
    <h3>"Hey {name} type the new password"</h3>
    {resetForm()}
    </div>
  </Layout>
);
};

export default Reset;
