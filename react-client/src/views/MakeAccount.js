import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

import toast from 'react-hot-toast'


import { useNavigate } from 'react-router-dom'



function MakeAccount() {

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const [csrf_tkn, setCsrf_tkn] = useState("");


	// FOR PROGRAMATICAL ROUTING
	const navigate = useNavigate();


	const registerUser = async () => {


		console.log(csrf_tkn)



		if (password === confirmPassword) {

			const userObj = {
				name,
				password,
				email,
				confirmPassword,
			};

			try {
				toast.loading("Loading...");

				// **** THIS ROUTE SHOULD BE THE SAME AS EXPRESS'S ONE !!!!

				console.log(csrf_tkn)

				const response = await axios.post("/api/auth/make-account",userObj);


				toast.dismiss();


				if (response.data.success) {
					
					console.log(response.data)


					toast.success(response.data.message);


					navigate('/api/auth/login')


				} else {
					console.log(response.data)
					toast.error(response.data.message);

				}

			} catch (error) {
				console.log(error)
				toast.dismiss();
				toast.error("Something went wrong");

			}


		} else {

			toast.error("Passwords Not Matched");

		}

	};




	// *********************  MUST YOU HAVE TO DO !!!!  *********************
	// GET CSRF TOKEN FOR POST REQUESTING WITHOUY CSRF ATTACK !!!!
	// GET CSRF TOKEN AND SETUP AXIOS !
	const getCSRFToken = async () => {
		try {

			await axios.get('/api/auth/make-account')
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

	useEffect(() => {
		getCSRFToken()
	}, []);



	return (

		<div className="flex w-full items-center h-screen text-amber-700 ">

			<div className="flex flex-col space-y-5">
				
				<h1 className="text-6xl text-center">
					Make Your Account
				</h1>

				<div className="flex flex-col space-y-3 p-5">
					<input name="_csrf" value={csrf_tkn} type="hidden" />
						
					<h3>Your Email Address</h3>
					<input 
						type="text"
						className="py-1 px-3 border-2 focus:outline-0 w-full"
						placeholder="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<h3>Your Nickname</h3>
					<input 
						type="text"
						className="py-1 px-3 border-2 focus:outline-0 w-full"
						placeholder="nickname"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
					<h3>Password</h3>
					<input 
						type="password"
						className="py-1 px-3 border-2 focus:outline-0 w-full"
						placeholder="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<h3>Confirm Password</h3>
					<input 
						type="password"
						className="py-1 px-3 border-2 focus:outline-0 w-full"
						placeholder="repeat password"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
					/>
					<button
						className="py-5 py-5 text-4xl hover:text-amber-600"
						onClick={registerUser}
					>
					Make Account
					</button>
					<Link
						className="underline text-ml hover:text-amber-600"
						onClick={
							() => console.log("Moved to Login Page")
						} 
						to="/api/auth/login"
					>
					Already have account?
					</Link>
					<Link
						className="text-xl hover:text-amber-600"
						onClick={
							() => console.log("Canceled Making Account")
						} 
						to="/"
					>
					Cancel
					</Link>
				</div>

			</div>

		</div>

	)



}



export default MakeAccount


