import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";



function EmailVerify() {


	
  const [emailVerified, setEmailVerified] = useState("");

  //const [csrf_tkn, setCsrf_tkn] = useState("");

  // --------------------------------------------
  // useParams GETS THE PARAMETERS IN THE URL
  // LIKE URL........com:token
  //                    ~~~~~~
  const params = useParams();


  const verifyToken = async () => {

    try {


      toast.loading("Verifying your Email...");

      console.log(params.token)

      const response = await axios.post("/api/auth/emailverify", {

        token: params.token,
        
      });

      console.log(response)



      if (response.data.success) {
        toast("Success !");

        const react_root = document.getElementById("REACT_ROOT")
        const root_dom = document.getElementById("allArea")
        root_dom.appendChild(react_root)

        document.getElementById("ramaaApp").style.display = "none"


        setEmailVerified("true");


      } else {
        toast.error("Failed to verify the mail.");

        // console.log(document.getElementById("REACT_ROOT"))
        const react_root = document.getElementById("REACT_ROOT")
        const root_dom = document.getElementById("allArea")
        root_dom.appendChild(react_root)

        document.getElementById("ramaaApp").style.display = "none"

        // VERIFICATION IS FAILED OR ALREADY EXPIRED
        // WHEN USER CLICKED VERIFICATION EMAIL'S LINK,
        // IT WILL BE DELETED WHEN IT SUCCEEDED
        setEmailVerified("false");


      }

      toast.dismiss();


    } catch (error) {
      // console.log(document.getElementById("REACT_ROOT"))
      const react_root = document.getElementById("REACT_ROOT")
      const root_dom = document.getElementById("allArea")
      root_dom.appendChild(react_root)

      document.getElementById("ramaaApp").style.display = "none"


      setEmailVerified("false");


      toast.dismiss();
    }


  };


  // *********************  MUST YOU HAVE TO DO !!!!  *********************
  // GET CSRF TOKEN FOR POST REQUESTING WITHOUY CSRF ATTACK !!!!
  // GET CSRF TOKEN AND SETUP AXIOS !
  // const getCSRFToken = async () => {
  //   try {

  //     await axios.get('/api/auth/emailverify')
  //       .then((res) => {
  //         console.log("GET REQUESTED DONE(RESPONSED)")
  //         console.log(res.data.csrfToken)
  //         // SETTING UP CSRF USING STATE
  //         setCsrf_tkn(res.data.csrfToken)
  //         axios.defaults.headers.common['CSRF-TOKEN'] = res.data.csrfToken
  //       })
  //       .catch(err => console.log(err))

  //   } catch (error) {
  //     console.log(error)
  //   }

  // };


  useEffect(() => {
    //getCSRFToken()
    verifyToken();
   
  }, []);


  // ---------------------------------------------------------------------------
  // BELOW, href= TO '/' IS CRITICAL !!
  // IN CASE OF HAVING index.html CONTENTS IN PUBLICK FOLDER WITH USING REACT,
  // THIS IS CRITICAL TO LOAD THE PAGE PROPERLY ! 
  return (

    <div className="flex py-5 my-20 justify-center items-center">
      
      
      {emailVerified === "" && (
        <div className="my-20">
          <h1 className="text-primary text-4xl">Please wait we are verifying your email</h1>
          <a className="text-center text-2xl cursor-pointer hover:text-ramaa_buttonHover" href='/' target='_self'>Go to Gounbeee.com >>></a>
        </div>
      )}

      {emailVerified === "true" && (
        <div className="my-20">
          <h1 className="text-primary text-4xl">Your email verified successfully</h1>
          <a className="text-center text-2xl cursor-pointer hover:text-ramaa_buttonHover" href='/' target='_self'>Go to Gounbeee.com >>></a>        </div>
      )}

      {emailVerified === "false" && (
        <div className="my-20">
          <h1 className="text-primary text-4xl">Invalid or Expired Token</h1>
          <h1 className="text-primary text-4xl mb-5" >Maybe already verified ? </h1>
          <a className="text-center text-2xl cursor-pointer hover:text-ramaa_buttonHover" href='/' target='_self'>Go to Gounbeee.com >>></a>

        </div>
      )}
    </div>
  );
}

export default EmailVerify;
