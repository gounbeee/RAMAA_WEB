import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import axios from "axios";




function PasswordReset() {


  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");


  // useParams() IS FOR GETTING PARAMETERS FROM URL
  // ie ) URL.....com:token
  //                 ~~~~~~
  const params = useParams();



  useEffect(() => {
    console.log(document.getElementById("REACT_ROOT"))
    const react_root = document.getElementById("REACT_ROOT")
    const root_dom = document.getElementById("allArea")
    root_dom.appendChild(react_root)

    document.getElementById("ramaaApp").style.display = "none"

  },[])



  const resetPassword = async () => {

    try {
      
      toast.loading('Changing your password...');


      //console.log(confirmpassword)

      // THIS REQUEST ACTUALLY CHANGE THE PASSWORD
      const response = await axios.post("/api/auth/reset-password", {
        password: password,
        confirmedPassword: confirmpassword,
        token: params.token,
      });

      if (response.data.success) {

        toast.success(response.data.message);

        toast.dismiss();
        
        // < JUMP TO NEW PAGE WITH JAVASCRIPT >
        // https://stackoverflow.com/questions/1226714/how-to-get-the-browser-to-navigate-to-url-in-javascript
        //
        window.location.replace('/');

      } else {
        toast.dismiss();

        toast.error(response.data.message);

      } 

      

    } catch (error) {
      // console.log(error)
      toast.dismiss();

      toast.error("Something went wrong");


    }

  };



  return (
    <div className="flex py-5 my-10 justify-center items-center">

      <div className="space-y-3 my-40 flex-col p-5 ">
        
        <h2 className="font-semibold text-2xl">
          Hi, our member!
        </h2>
        <h3 className="font-semibold text-2xl">
          This is Gounbeee.com
        </h3>
        <h3 className="font-semibold text-2xl">
          Here, you can change your password to New one.
        </h3>

        <input
          type="password"
          className="py-1 px-3 border-2 border-secondary focus:outline-none w-full"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}

        />

        <input
          type="password"
          className="py-1 px-3 border-2 border-secondary focus:outline-none w-full"
          placeholder="confirm password"
          onChange={(e) => setConfirmPassword(e.target.value)}
          value={confirmpassword}
          
        />



        <div className="flex justify-center items-center">

          <button
            className="text-5xl py-1 px-10 hover:text-amber-600"
            onClick={resetPassword}
          >
            Reset Password
          </button>

        </div>


      </div>
    </div>

  );          // END OF RETURN



}



export default PasswordReset;
