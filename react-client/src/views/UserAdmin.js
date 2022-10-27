import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

import Modal from './Modal'


import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Button, Box, TextField, Backdrop, Stack, Paper, styled } from '@mui/material'


import GetUserData from './GetUserData'
import GetImageList from './GetImageList'
import UploadImage from './UploadImage'





function UserAdmin() {

	// < THEME PROVIDER AND APPLYING THEME !!!! >
	// https://mui.com/material-ui/customization/palette/#adding-new-colors
	const theme = createTheme({
	  status: {
	    danger: '#e53e3e',
	  },
	  palette: {
	    primary: {
	      main: '#ff3892',
	      darker: '#600182',
	    },
	    neutral: {
	      main: '#64748B',
	      contrastText: '#fff',
	    },
	  },
	});


	// FOR STYLED HORIZONTAL LINE
	const ColoredHLine = ({color}) => (
		<hr style={{
			color: color,
			backgroundColor: color,
			height: 2,
			borderColor : '#000000'
		}}
		/>
	)


	// HIDING FOOTER AREA
	const hideFooter = () => {
		const footerDom = document.getElementById("footer_wrapper")
		footerDom.style.display = 'none'
	}

	// SHOWING FOOTER AREA
	const showFooter = () => {
		const footerDom = document.getElementById("footer_wrapper")
		footerDom.style.display = ''
	}




	// USING STATE FOR GETTING USER
	const [userInfo, setUserInfo] = useState(null);
	const [csrf_tkn, setCsrf_tkn] = useState("");

	const navigate = useNavigate();


	// HANDLE BACKDROP
	const [open, setOpen] = React.useState(true);
	const handleClose = () => {
		console.log("CANCELED TO LOGIN")
		navigate('/')
		setOpen(false);

	};


	const handleToggle = () => {
		setOpen(!open);

	};




	const onLoadFunc = (e) => {


		console.log('onLoadFunc IS EXECUTED !!!!')
		console.log(e)





	}





	// useParams() IS FOR GETTING PARAMETERS FROM URL
	// ie ) URL.....com:token
	//                  ~~~~~
	const params = useParams();

	console.log('UserAdmin Page OPENED  URL PARAMETER IS ...')
	//console.log(params)



	// ITEM DEFINITION
	const ImgItem = styled(Paper)(({ theme }) => ({

		// < CONDITIONAL SWITCH DEPENDING ON THEME NAME >
	  //backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
	  backgroundColor: '#1A2027',
	  color: '#fff',
	  padding: theme.spacing(2),
	  textAlign: 'center',

	}));





	// WHEN BACK BUTTON PRESSED
	const bckBtn = async () => {

		console.log("BACK BUTTON IS PRESSED")
		showFooter()
		//displayWorkArea()


	}


	// WHEN RESET PASSWORD BUTTON CLICKED
	const chngPwBtn = async () => {

		console.log("CHANGE PASSWORD BUTTON CLICKED")

		//navigate("/api")

	}


	// WHEN EDIT USERNAME BUTTON CLICKED
	const edtNameBtn = async () => {


		console.log("CHANGE USERNAME BUTTON CLICKED")
		showModal()


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

		//hideWorkArea()
		//getUserData()
		//UsrInfo(usr)

		hideFooter()


	},[])




	// < TOGGLING COMPONENT WITH FLAG >
	// https://bobbyhadz.com/blog/react-onclick-show-component
	//
	// + WITH BELOWS
	// <Link className="ml-16 cursor-pointer hover:text-ramaa_buttonHover" onClick={showModal}>modal TEST</Link>
	// {modalView && ( <Modal id="testId" question="Change your name ?" /> )}
	const [modalView, setModalView] = useState(false);
	const [modalQues, setModalQues] = useState("Initial Question");


	const showModal = (ev) => {

		console.log(ev)

		//setModalQues("SECOND QUESTION")

		setModalView(current => !current)


	}



	// < MAKE SCROLLABLE IN TAILWINDCSS >
	// https://tailwindcss.com/docs/overflow



	// ----------------------------------------------------------------
	// BELOW, WE PASS FUNCTIONS FOR GETTING CSRF TOKEN AND USER DATA
	// TO GetUserData COMPONENT !!!!




  return (
    <div className="">

	    <GetUserData cb_usr={setUserInfo} cb_csrf={setCsrf_tkn} />

			<input name="_csrf" value={csrf_tkn} type="hidden" />


    	<Backdrop
				className="flex flex-col"
				open={open}
			>
				<ThemeProvider theme={theme}>
					<div className="w-full h-full p-12 overflow-y-scroll">

						<div className="bg-slate-500 p-10 space-y-7">

							<h2 className="font-semibold my-5 text-2xl">
					      User Admin Panel
					    </h2>

							<Link className="hover:text-ramaa_buttonHover" 
								  to="/member-area"
								  onClick={bckBtn}
								  >Back
							</Link>

							<ColoredHLine color="pink" />

							<input name="_csrf" value={csrf_tkn} type="hidden" />

							{modalView && ( <Modal id="modal" question={modalQues} /> )}

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



							<ColoredHLine color="pink" />


							<UploadImage />

							<GetImageList />





							<ColoredHLine color="pink" />






							<div className="grid grid-cols-2 gap-2 place-items-start">

								<p>Categories in Database</p>
								<div className="w-full grid grid-cols-2 gap-2">

									<Stack 
										direction="column"
										sx={{
											width: 400
										}}
										spacing={2}>

									  <ImgItem>Item 1</ImgItem>
									  <ImgItem>Item 2</ImgItem>
									  <ImgItem>Item 3</ImgItem>

									</Stack>
								
								</div>

							</div>



							<div className="grid grid-cols-2 gap-2 place-items-start">

								<p>Subjects in Database</p>
								<div className="w-full grid grid-cols-2 gap-2">

									<Stack 
										direction="column"
										sx={{
											width: 400
										}}
										spacing={2}>

									  <ImgItem>Item 1</ImgItem>
									  <ImgItem>Item 2</ImgItem>
									  <ImgItem>Item 3</ImgItem>
									  <ImgItem>Item 3</ImgItem>
									  <ImgItem>Item 3</ImgItem>
									  <ImgItem>Item 3</ImgItem>
									  <ImgItem>Item 3</ImgItem>
									  <ImgItem>Item 3</ImgItem>

									</Stack>
								
								</div>

							</div>











							<div className="grid grid-cols-3 gap-4 place-items-start">
								<Link className="text-ramaa_buttonHover hover:text-amber-800" onClick={delAccountBtn} to="/api/auth/delete-account">Delete Account</Link>
							</div>

				    </div>

				  </div>
				</ThemeProvider>  
		  </Backdrop>

    </div>

  );          // END OF RETURN



}



export default UserAdmin;
