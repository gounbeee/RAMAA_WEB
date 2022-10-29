// ----------------------------------------------------
// REACT STATE MANAGEMENT
// WITH THIS FEATURES, INTERACTION BETWEEN DOM AND LOGIC
// CAN BE INCREASED !
import React, {useState, useEffect} from 'react'

// ----------------------------------------------------
// REACT DOM LIBRARY'S FEATURE
// https://reactrouter.com/en/main/hooks/use-navigate
// 
// The useNavigate hook returns a function that lets you 
// navigate programmatically, for example in an effect:
// 
// YOU CAN 
import { useNavigate, Link } from 'react-router-dom'


// ----------------------------------------------------
// < FOR GETTING AND POSTING HTTP REQUEST >
// *** MORE EASILY ***
import axios from "axios";

// ----------------------------------------------------
// < DISPLAYING OVERLAY >
// https://react-hot-toast.com/
// 
import toast from 'react-hot-toast'




// < useEffect FUNCTION IN REACT >
// https://jasonwatmore.com/post/2020/07/17/react-axios-http-get-request-examples
// :: useEffect React hook replaces the componentDidMount 
//    lifecycle method to make the HTTP GET request 
//    when the component loads.
function LandingPage() {


	// --------------------------------------------------------------------------
	// < IMPORTING HTML FILE WITH dangerouslySetInnerHTML ATTRIBUTE IN REACT>
	// https://www.pluralsight.com/guides/how-to-use-static-html-with-react
	//
	// <div id="RAMAA_APP" dangerouslySetInnerHTML={{ __html: htmlData }} />

	// -------------------------------------------------
	// const [htmlData, setHtml] = useState(null)
	// useEffect( () => {
	// 	 axios.get("/main")
	// 		.then(response => setHtml(response.data) )
	// }, [])


	// USING STATE FOR GETTING USER
	const [userInfo, setUserInfo] = useState(null);

	// PROGRAMATICAL ROUTING
	const navigate = useNavigate();


	const checkReferrer = () => {
		console.log(document.referrer)

		if (document.referrer == null) { 
		 console.log("User came directly");


		} else { 
		 console.log("User did not came directly"); 

		}

	}



	// const openUsrAdmin = async () => {

	// 	console.log("OPEN USER ADMIN PAGE")

	// 	const token = sessionStorage.getItem("user");

	// 	const targetUrl = `/member-area/${userInfo.name}`

	// 	const response = await axios.get(targetUrl, {

	// 									// HEADER SETTING FOR JWT TOKEN HANDLING
	// 									// IT SHOULD BE AN ARRAY WITH
	// 									// Bearer ELEMENT FIRST !
	// 									// https://www.permify.co/post/jwt-authentication-in-react
	// 									headers: {
	// 									  Authorization: `Bearer ${token}`,
	// 									},

	// 								})
	// 								.then((result)=> {
	// 									console.log(result)
	// 									navigate(targetUrl)
	// 								})
	// }




	// 
	const getData = async () => {

		// ENTERING LOADING START
		toast.loading();


		try {


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

			});


			// -------------------------------------------------------
			// < END TOASTING >
			// Dismiss toast programmatically
			// You can manually dismiss a notification with toast.dismiss. 
			// Be aware that it triggers the exit animation and does not remove 
			// the Toast instantly. Toasts will auto-remove after 1 second by default.
			toast.dismiss();


			// IF THERE IS AN USER MATCHED 
			// IN DATABASE THEN RETURNED FROM SERVER
			if (response.data.success) {

				// WE HAVE 2 SCENARIOS WITH SUCCESS FROM SERVER
				// 1. USER IS FOUND          >>      ROUTE TO MEMBER AREA      /member-area
				// 2. USER IS NOT FOUND      >>      ROUTE TO NON-MEMBER AREA  /
				//console.log(response)

				if(response.data.userData == "OUR-GUEST") {

					navigate("/");

				} else {

					// RETRIEVING USER TO HOOK
					setUserInfo(response.data.userData);

				}


			} else {

				// IF THERE IS AN ERROR, DELETE DATA FROM LOCALSTORAGE
				sessionStorage.removeItem("user");

				// PROGRAMATICAL ROUTING TO NON-MENBER AREA
				navigate("/");

				// TOAST ENDED WITH ERROR
				toast.error("Something went wrong");

			}

		} catch (error) {

			// IF THERE IS AN ERROR, DELETE DATA FROM LOCALSTORAGE
			sessionStorage.removeItem("user");

			// PROGRAMATICALLY ROUTE TO LOGIN PAGE
			navigate("/");	

			// TOAST END
			toast.error("Something went wrong");

		}

	};


	const hideWorkArea = () => {
		if(document.getElementById("workarea").style.display !== 'none')
			document.getElementById("workarea").style.display= 'none';
	}

	const displayWorkArea = () => {
		if(document.getElementById("workarea").style.display === null)
			document.getElementById("workarea").style.display = '';
	}




	useEffect(() => {
		console.log("LandingPage :: useEffect EXECUTED")
		//console.log(userInfo)

		//checkReferrer()
		//displayWorkArea()
		//console.log(document.getElementById("workarea").style.display);


		if (userInfo == null) {
		  getData();
		}

	}, [userInfo]);






	// IF-STRUCTURED WITH LOGICAL OPERATOR && IN JSX

	// LINK -> WE USED   onClick TO COMMUNICATE WITH 'SERVER' (axios USED)
	//		   AND, USED to=...  FOR ROUTING IN      'REACT '
	//
	// Link ELEMENT SETTINGS
	//                      **** FULL PATH TO ROUTE FOR EXPRESS SERVER ****
	//                           ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


	return (
		<div className="text-1xl inline-flex p-1">
			{userInfo !== null && (
				<div className="inline-flex">
					<div className="ml-10">
						{userInfo?.name}
					</div>
					<Link className="ml-2 text-xs p-1 hover:text-ramaa_buttonHover"
						  to={userInfo.name}>
						( {userInfo?.email} )
					</Link>
					<Link className="ml-10 cursor-pointer hover:text-ramaa_buttonHover" 
						  to="/member-area/contents">CONTENTS</Link>
					<button
						className="ml-24 hover:text-ramaa_buttonHover"
						onClick={() => {
						  sessionStorage.clear();
						  navigate("/");
						}} >
						LOGOUT
					</button>
				</div>

			)}
		
			{userInfo == null && (
				<div className="ml-40">
					<Link className="ml-40 cursor-pointer hover:text-ramaa_buttonHover" to="/subjects">SUBJECTS</Link>
					<Link className="hidden ml-20 cursor-pointer hover:text-ramaa_buttonHover" to="/api/auth/login">LOGIN</Link>
					<Link className="hidden ml-16 cursor-pointer hover:text-ramaa_buttonHover" to="/api/auth/make-account">SIGNUP</Link>
				</div>
	        )}

        </div>
	);
}
//


export default LandingPage

