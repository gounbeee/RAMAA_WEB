import React, { useState, useEffect, } from "react";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";



// < COMPONENT RECIEVING CALLBACK FUNCTIONS >
// I AM PASSING CALLBACK FUNCTIONS WHICH DEFINED FOR SET STATES OUTSIDE,
// TO BELOW'S props PARAMETER

function GetUserData(props) {

	const navigate = useNavigate();

	//console.log(props)


	// WHEN STARTING THIS PAGE
	const getUserData = async () => {

		// ENTERING LOADING START
		toast.loading();


		try {

			console.log('UserAdmin page getUserData() FUNCTION')

			// IF THERE ALREADY IS AN USER TOKEN,
			// GET IT
			// **** THIS TOKEN SHOULD BE PUBLISHED WHRN 
			//      USER LOGGED IN
			const token = sessionStorage.getItem("user");

			// GET REQUEST FOR GETTING USER TO SERVER
			const response = await axios.get("/api/user/getuserinfo", {

					// HEADER SETTING FOR JWT TOKEN HANDLING
					// IT SHOULD BE AN ARRAY WITH
					// Bearer ELEMENT FIRST !
					// https://www.permify.co/post/jwt-authentication-in-react
					headers: {
					  Authorization: `Bearer ${token}`,
					},

				})
				.then( res_usr => {

					// < CHAINING REQUEST USING AXIOS >
					// https://github.com/axios/axios/issues/708

					// AT FIRST WE GET THE USER DATA,
					// AND IF THE ABOVE PROCESS IS VALID,
					// THEN GET REQUEST AGAIN TO REQUEST PROPER ADMIN PAGE !
					// 
					// GET REQUEST TO '/member-area/<username>'

					console.log(res_usr.data.success)


					if(res_usr.data.success === true) {
						console.log("UserAdmin ::  USER CONFIRMED --> GO TO ADMIN PANEL ")
						console.log(res_usr.data.userData)
						

						if(props.cb_usr) props.cb_usr(res_usr.data.userData)


						const targetURL = `/member-area/${res_usr.data.userData.name}`
						console.log("UserAdmin ::  TARGET URL IS ")
						console.log(targetURL)

						axios.get(targetURL)
	 					     .then( res => {

	 					     	// SO FAR WE GOT USER INFORMATION FROM DATABASE,
	 					     	// AND CSRF TOKEN !!!
	 						 	//console.log( res )

	 						 	// SETTING UP CSRF TOKEN FROM SERVER TO THIS ELEMENT
	 						 	

	 						 	if(props.cb_csrf) props.cb_csrf(res.data.csrfToken)


								axios.defaults.headers.common['CSRF-TOKEN'] = res.data.csrfToken


	 						})

	 						// SETTING PATH URL FOR FORM ELEMENT BELOW
							// TO UPLOAD IMAGE FILE
							//console.log(userInfo)
							if(props.cb_imgPath) {
								const imgUpPth = `/member-area/${res_usr.data.userData.name}/uploadimg`
								props.cb_imgPath(imgUpPth)
							}


					} else {
						console.log( res_usr )
						toast.error("Error occured when getting user data")

					}

				}
			)


			toast.dismiss();



		} catch (error) {

			// IF THERE IS AN ERROR, DELETE DATA FROM LOCALSTORAGE
			sessionStorage.removeItem("user");

			// PROGRAMATICALLY ROUTE TO LOGIN PAGE
			navigate("/");	

			// TOAST END
			toast.error("Something went wrong");

		}

	};



	useEffect(() => {
		getUserData()
	},[])


	return(null)


}



export default GetUserData


