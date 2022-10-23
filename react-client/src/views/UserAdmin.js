import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";




function UserAdmin() {

	// USING STATE FOR GETTING USER
	const [userInfo, setUserInfo] = useState(null);
	const [csrf_tkn, setCsrf_tkn] = useState("");

	const navigate = useNavigate();


	// useParams() IS FOR GETTING PARAMETERS FROM URL
	// ie ) URL.....com:token
	//                 ~~~~~~
	const params = useParams();

	console.log('UserAdmin Page OPENED  URL PARAMETER IS ...')
	console.log(params)


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
						
						setUserInfo(res_usr.data.userData)


						const targetURL = `/member-area/${res_usr.data.userData.name}`
						console.log("UserAdmin ::  TARGET URL IS ")
						console.log(targetURL)

						axios.get(targetURL)
	 					     .then( res => {

	 					     	// SO FAR WE GOT USER INFORMATION FROM DATABASE,
	 					     	// AND CSRF TOKEN !!!
	 						 	console.log( res )

	 						 	// SETTING UP CSRF TOKEN FROM SERVER TO THIS ELEMENT
	 						 	
	 						 	setCsrf_tkn(res.data.csrfToken)
								axios.defaults.headers.common['CSRF-TOKEN'] = res.data.csrfToken


	 						 })


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


	// WHEN BACK BUTTON PRESSED
	const bckBtn = async () => {


		console.log("BACK BUTTON IS PRESSED")

		displayWorkArea()


	}


	// WHEN RESET PASSWORD BUTTON CLICKED
	const chngPwBtn = async () => {


		console.log("CHANGE PASSWORD BUTTON CLICKED")

		//navigate("/api")

	}

	// WHEN EDIT USERNAME BUTTON CLICKED
	const edtNameBtn = async () => {


		console.log("CHANGE USERNAME BUTTON CLICKED")

		//navigate("/api")

	}

	// WHEN EDIT EMAIL BUTTON CLICKED
	const edtEmailBtn = async () => {

		console.log("CHANGE EMAIL BUTTON CLICKED")

		//navigate("/api")

	}

	// WHEN EDIT EMAIL BUTTON CLICKED
	const rvwBillingBtn = async () => {

		console.log("REVIEW BILLING BUTTON CLICKED")

		//navigate("/api")

	}

	// WHEN EDIT EMAIL BUTTON CLICKED
	const delAccountBtn = async () => {

		console.log("DELETE ACCOUNT BUTTON CLICKED")

		//navigate("/api")

	}

	const hideWorkArea = () => {
		if(document.getElementById("workarea").style.display !== 'none')
			document.getElementById("workarea").style.display = 'none';

	}

	const displayWorkArea = () => {
		if(document.getElementById("workarea").style.display === 'none')
			document.getElementById("workarea").style.display = '';
	}


	useEffect(() => {
		hideWorkArea()
		getUserData()

	},[])





  return (
    <div className="absolute top-0 left-0 w-full h-[550px] z-20 bg-slate-500">
	    <h2 className="p-10 font-semibold text-2xl">
	      Account settings
	    </h2>

		<Link className="hover:text-ramaa_buttonHover p-10" 
			  to="/member-area"
			  onClick={bckBtn}
			  >Back</Link>

		<div className="bg-slate-500 p-10 space-y-7">
			<input name="_csrf" value={csrf_tkn} type="hidden" />

			<div className="grid grid-cols-3 gap-4 place-items-start">
				<h3>Unique ID</h3>
				<p>{userInfo?._id}</p>
			</div>
			<div className="grid grid-cols-3 gap-4 place-items-start">
				<h3>User Name</h3>
				<p>{userInfo?.name}</p>
				<p className="hover:text-ramaa_buttonHover" onClick={edtNameBtn}>edit</p>
			</div>
			<div className="grid grid-cols-3 gap-4 place-items-start">
				<h3>Email</h3>
				<p>{userInfo?.email}</p>
				<p className="hover:text-ramaa_buttonHover" onClick={edtEmailBtn}>edit</p>
			</div>
			<div className="grid grid-cols-3 gap-4 place-items-start">
				<h3>Billing Data</h3>
				<p> SAMPLE BILLING DATA </p>
				<p className="hover:text-ramaa_buttonHover" onClick={rvwBillingBtn}>review</p>
			</div>
			<div className="grid grid-cols-3 gap-4 place-items-start">
				<Link className="hover:text-ramaa_buttonHover" onClick={chngPwBtn} to="/api/auth/login">Change Password</Link>
			</div>
			<div className="grid grid-cols-3 gap-4 place-items-start">
				<Link className="text-ramaa_buttonHover hover:text-amber-800" onClick={delAccountBtn} to="/api/auth/delete-account">Delete Account</Link>
			</div>

      	</div>
    </div>

  );          // END OF RETURN



}



export default UserAdmin;
