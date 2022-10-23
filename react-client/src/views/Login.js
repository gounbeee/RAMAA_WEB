
// ----------------------------------------------------------------
// IMPORT TOOLKITS

// WE WANT TO USE REACT'S COMPONENT
import React, { useState, useEffect } from "react"

// FOR DISPLAYING FLASH MESSAGE WHEN USER'S INPUT IS VALID OR NOT
// ON THE SERVER !! NOT CLIENT !!
import toast from "react-hot-toast"

// react-router-dom 
// IS GREAT HELPER OBJECT TO CREATE DOM ELEMENT EASILY !
import { Link } from "react-router-dom"
import { useNavigate } from 'react-router-dom'

// axios
// AXIOS IS FOR MANAGING HTTP CLIENT FUNCTIONALITY (GET / POST)
import axios from "axios"

//import { Modal } from 'react-responsive-modal';



// ----------------------------------------------------------------



// DEFINE LOGIN FUNCTION COMPONENT IN REACT
function Login() {


	const [isPwForgot, setIsPwForgot] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const navigate = useNavigate();


	const [csrf_tkn, setCsrf_tkn] = useState("");




	// const location = useLocation();
	// let history = useNavigate();

	// if(location.state == undefined || location.state == null || location.state == ''){
	// 	history.push("/");   
	// }





	const loginUser = async () => {
		const userObj = {
			password,
			email,
		};

		try {



			toast.loading();

			const response = await axios.post("/api/auth/login", userObj);

			toast.dismiss();

			if (response.data.success) {

				toast.success(response.data.message);

				// DEFINED AT auth.js !!!!
				// res.status(200).send({
				// 	success: true,
				// 	message: "User Login Successfull",
				// 	data: token,
				// });


				sessionStorage.setItem("user", response.data.data);

				navigate("/member-area");

			} else {

				toast.error(response.data.message);

			}

		} catch (error) {

			toast.dismiss();

			toast.error("Something went wrong");

		}

	};


	const sendResetPasswordLink = async () => {
		try {

			toast.loading("");
 
			if( email !== '' ) {
				const response = await axios.post("/api/auth/send-password-reset-link", {
					email
				});


				toast.dismiss();

				if (response.data.success) {

					toast.success(response.data.message);

					setIsPwForgot(false);

				} else {

					toast.error(response.data.message);

				}

			} else {
				toast.dismiss();
				toast.error("Your input is empty");

			}


		} catch (error) {

			toast.dismiss();

			toast.error("Something went wrong");

		}


	};




	// *********************  MUST YOU HAVE TO DO !!!!  *********************
	// GET CSRF TOKEN FOR POST REQUESTING WITHOUY CSRF ATTACK !!!!
	// GET CSRF TOKEN AND SETUP AXIOS !
	const getCSRFToken = async () => {
		try {

			await axios.get('/api/auth/login')
				.then((res) => {
					console.log(res.data.csrfToken)
					// SETTING UP CSRF USING STATE
					setCsrf_tkn(res.data.csrfToken)
					axios.defaults.headers.common['CSRF-TOKEN'] = res.data.csrfToken
				})
				.catch(err => console.log(err))

		} catch (error) {
			console.log(error)
		}

	};

	const hideWorkArea = () => {
		if(document.getElementById("workarea").style.display !== 'none')
			document.getElementById("workarea").style.display = 'none';

	}

	const displayWorkArea = () => {
		if(document.getElementById("workarea").style.display === 'none')
			document.getElementById("workarea").style.display = '';
	}




	useEffect(() => {

		getCSRFToken()

	}, []);









	// AS A REACT COMPONENT, WE RETURN JSX CODES TO CONSTRUCT THE HTML PAGE !
	return (

		<div className="flex w-full items-center h-screen">


			{!isPwForgot && (


				<div className="flex flex-col">

					<h1 className="text-7xl text-center">
						Welcome back
					</h1>

					<div className="flex flex-col space-y-3 p-20">
						<input name="_csrf" value={csrf_tkn} type="hidden" />
						
						<h3>Your Email Address</h3>
						
						<input 
							type="text"
							className="py-1 px-3 border-2 focus:outline-0 w-full"
							placeholder="email"
							onChange={(e) => { setEmail(e.target.value)}}
							value={email}
						/>
						<h3>Password</h3>
						<input 
							type="password"
							className="py-1 px-3 border-2 focus:outline-0 w-full"
							placeholder="password"
							onChange={(e) => { setPassword(e.target.value)}}
							value={password}
						/>

						<button
							className="h-[90px] py-1 py-5 text-4xl hover:text-amber-600"
							onClick={loginUser}
						>
						Login
						</button>

						<div className="flex justify-between items-end">
							<div className="flex space-x-10">
								<Link className="underline hover:text-amber-600" to="/api/auth/make-account">
									Click Here to Make Account
								</Link>
								<h1 className="underline cursor-pointer hover:text-amber-600"
									onClick={() => {
										console.log("Forgot Password Button Clicked !!")
										setIsPwForgot(true)
										hideWorkArea()
								} } >
	 							Forgot Password ?
	 							</h1>

	 						</div>

	 					</div>
						<Link
							className="py-1 py-5 text-xl hover:text-amber-600"
							onClick={
								() => {
									console.log("CANCELED TO LOGIN")
									displayWorkArea()
								}
							} 
							to="/"
						>
						Cancel
						</Link>
					</div>

				</div>

			)}

			{isPwForgot && (


				<div className="flex flex-col">

					<h1 className="text-5xl text-center">
						Forgot your password ?
					</h1>

					<div className="flex flex-col space-y-3 p-20">
						<h3>Enter email address</h3>
						<input 
							type="text"
							className="py-1 px-3 border-2 focus:outline-0 w-full"
							placeholder="email"
							onChange={(e) => { setEmail(e.target.value)}}
							value={email}
						/>

						<button
							className="h-[90px] text-3xl hover:text-amber-600"
							onClick={setIsPwForgot}
						>
						Send Email to Reset password
						</button>

						<h1
			              onClick={() => setIsPwForgot(false)}
			              className="underline cursor-pointer underline text-md text-left"
			            >
			            Click Here To Login
			            </h1>
						<Link
							className="py-1 py-5 text-xl hover:text-amber-600"
							onClick={
								() => {
									console.log("CANCELED TO LOGIN")
									displayWorkArea()
								}
							} 
							to="/"
						>
						Cancel
						</Link>
					</div>

				</div>

			)}



		</div>


	)



}



export default Login