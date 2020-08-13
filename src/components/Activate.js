import React, {useState} from "react";
import axios from "axios";
import {toast, ToastContainer} from "react-toastify";
import Layout from "./Layout";
import jwt from "jsonwebtoken";


const Activate = ({ match }) =>{
  const [values, setValues] = useState({
  name:"",
  token: "",
  show:true,
  });

  // useEffect =() =>();___

  const {name, token} = values;

  const handleSubmit = (evt) =>{
    evt.preventDefault();
    setValues({...values, buttonText :"Sending"})

    axios.post("/account-activation",{token})
    .then((res)=>{
    console.log("Successfully activated account", res);
    setValues({
    ...values,
    show:false
    });
    toast.success(res.date.message);
    })
    .catch((err) =>{
      console.log("Failed in activating the account", err.response.data)
      toast.error(err.response.data.error);
    });

  };

  const activateAccountForm = () =>(
      <div>
        <h1>Hey click the below button to activate the account</h1>
        <button onChange={handleSubmit} type="button">Activate Account</button>
      </div>
  );

  return (
    <Layout>
      <div>
      <ToastContainer/>
      <h1>Activate Account Component</h1>
      {activateAccountForm()}
      </div>
    </Layout>
  );
};

export default Activate;
