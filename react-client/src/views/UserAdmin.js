import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

import Modal from './Modal'


import { createTheme, ThemeProvider } from '@mui/material/styles';

import { Button, Box, TextField, Backdrop, Stack, Paper, styled } from '@mui/material'

import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

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


	// --------------------------------------------
	// THIS IS THE FORMAT FOR SINGLE IMAGE
	// SPECIFICATION FOR DATABASE
	const imgFileObj = {
		imgPath: "",
		imgAlt: "",
		imgTitle: "",
		imgDesc: "" 
	}





	const itemData = [
	  {
	    img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
	    title: 'Breakfast',
	  },
	  {
	    img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
	    title: 'Burger',
	  },
	  {
	    img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
	    title: 'Camera',
	  },
	  {
	    img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
	    title: 'Coffee',
	  },
	  {
	    img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
	    title: 'Hats',
	  },
	  {
	    img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
	    title: 'Honey',
	  },
	  {
	    img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
	    title: 'Basketball',
	  },
	  {
	    img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
	    title: 'Fern',
	  },
	  {
	    img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
	    title: 'Mushrooms',
	  },
	  {
	    img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
	    title: 'Tomato basil',
	  },
	  {
	    img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
	    title: 'Sea star',
	  },
	  {
	    img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
	    title: 'Bike',
	  },
	];






	// USING STATE FOR GETTING USER
	const [userInfo, setUserInfo] = useState(null);
	const [imgUpPath, setImgUpPath] = useState('');
	const [csrf_tkn, setCsrf_tkn] = useState("");

	const navigate = useNavigate();

	// STATES FOR FILE NAME TEXTFIELD
	// 
	// https://qiita.com/FumioNonaka/items/0b4771fdce748e0d67ce
	// :: BELOW STATE SETS THE VALUE OF 'input' ELEMENT
	//    SO WE NEED TO GIVE A INITIAL VALUE !!!!
	const [filenm, setFilenm] = useState('');



	// STATE OF IMAGE FOr PREVIEWING WHEN UPLOADING
	const [previewImg, setPreviewImg] = useState(null)
	const [formImg, setFormImg] = useState(null)




	// -------------------------------------------------------
	// < USING useRef TO MAKE PERSISTED OBJECT >
 	// https://reactjs.org/docs/hooks-reference.html#useref
	// const inputImgRef = useRef(null);



	// < BUTTON CLICK AND GETTING VALUE FROM IT >
	// https://bobbyhadz.com/blog/react-open-file-input-on-button-click
	const onImgLoadBtn = (e) => {
		//console.log(inputImgRef.current.files)
		//inputImgRef.current;
		//inputImgRef.current.click()
	}

	const onChangeFn = (e) => {

		console.log(e.target)
		console.log(e.target.files)

		if( e.target.files.length > 0 ) {

			// SETTING NAME FOR DISPLAY
			setFilenm(e.target.files[0].name)

			// SETTING IMAGE DATA OBJECT
			//imgFileObj
			console.log(e.target.files)

			// < FileList OBJECT >
			// 0: File
			// lastModified: 1637998402000
			// lastModifiedDate: Sat Nov 27 2021 16:33:22 GMT+0900 (日本標準時) {}
			// name: "PROFILE_GOUNBEEE.png"
			// size: 126105
			// type: "image/png"
			// webkitRelativePath: ""
			// [[Prototype]]: File
			// length: 1


			//console.log( URL.createObjectURL(e.target.files[0] ) )
			setPreviewImg(URL.createObjectURL(e.target.files[0] ))

			// ------------------------------------------------------------------------
			// CONSTRUCTING FORM DATA HERE !
			// ****** I DID NOT USE <form action=.... method.... > ELEMENT !!!! *******

			const imgFormData = new FormData();

	    imgFormData.append('fileName', e.target.files[0].name)
	    imgFormData.append('fileSize', e.target.files[0].size)
	    imgFormData.append('uploadingImage', e.target.files[0]);
	    

	    console.log(imgFormData)
	    setFormImg(imgFormData);
	    
	    


		}
	}



	// < UPLOADING IMAGE FILE TO SEF¥RVER IN REACT, MULTER AND CORS >
	// https://omarshishani.medium.com/how-to-upload-images-to-a-server-with-react-and-express-%EF%B8%8F-cbccf0ca3ac9
	const onClickUploadImg = (e) => {
		console.log("onClickUploadImg EXECUTED !!!!")
		//console.log(e)

		if(filenm !== '') {


			try {

				console.log(formImg)


				axios.post(imgUpPath, formImg)
						.then( (res) => {

							console.log(res)





	 				  })

			} catch (error) {

 				console.log(error)

			}

		}
		
	}





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






	// useParams() IS FOR GETTING PARAMETERS FROM URL
	// ie ) URL.....com:token
	//                 ~~~~~~
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
	 						 	//console.log( res )

	 						 	// SETTING UP CSRF TOKEN FROM SERVER TO THIS ELEMENT
	 						 	
	 						 	setCsrf_tkn(res.data.csrfToken)
								axios.defaults.headers.common['CSRF-TOKEN'] = res.data.csrfToken


	 						})



	 					// SETTING PATH URL FOR FORM ELEMENT BELOW
						// TO UPLOAD IMAGE FILE
						//console.log(userInfo)
						const imgUpPth = `/member-area/${res_usr.data.userData.name}/uploadimg`
						setImgUpPath(imgUpPth)




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
		getUserData()
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




	// < UPLOADING FILE >
	// https://maximorlov.com/fix-unexpected-field-error-multer/
	// https://stackoverflow.com/questions/40589302/how-to-enable-file-upload-on-reacts-material-ui-simple-input/49408555#49408555

	// 1. USING FORM ELEMENT
	//  <form 
	//  			action={imgUpPath}
	//  			method="POST"	
	//  			enctype="multipart/form-data"
	//  			className="col-start-2 col-end-4 grid grid-cols-3 gap-2" 
	// >

  // 2. USING PROGRAMATICAL WAY TO CONSTRUCT form ELEMENT
  //    < FormData OBJECT >
  // 




  return (
    <div className="">
	    
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



							<div className="grid grid-cols-3 gap-2 place-items-start">
							  <p className="col-start-1 col-end-2"
								>
								Upload Image</p>

								<input name="_csrf" value={csrf_tkn} type="hidden" />

								<TextField
				          id="outlined-textarea"
				          label="Image_Name"
				          placeholder=""
				          variant="filled"
				          multiline
							    style={{
							    	width : '100%', height: '100%',
							    	backgroundColor: "#CCCCCC"
							    }}
								/>
								<TextField
				          id="outlined-textarea"
				          label="Image_Desc"
				          placeholder=""
				          variant="filled"
				          multiline
				          style={{
				          	width : '100%', height: '100%',
							    	backgroundColor: "#CCCCCC"
							    }}
				        />
				        <TextField
				          id="outlined-textarea"
				          label="Image_Alt"
				          placeholder=""
				          variant="filled"
				          multiline
				          style={{
				          	width : '100%', height: '100%',
							    	backgroundColor: "#CCCCCC"
							    }}
				        />
					  		<Button
								  	variant="contained" 
								  	component="label" 
								  	size="large"
								  	style={{ width : '100%', height: '100%'}}
								  	onClick={onImgLoadBtn}
								  >
								  Choose File
								  <input
									  accept="image/*"
									  style={{ display: 'none' }}
									  id="input-upload-img-btn"
									  multiple
									  type="file"
									  onChange={onChangeFn}
									  name="uploadingImage"
									/>
								</Button>
								<TextField
									className="col-start-2 col-end-4" 
									value={filenm}
				          variant="filled"
				          disabled
				          style={{
			          		width: '100%',
						    		backgroundColor: "#CCCCCC"
							    }}
				        />

					  		<Button 
					  			className="col-start-1 col-end-4 h-[5em]" 
								  variant="contained" 
								  size="large"
								  type="submit"
								  onClick={onClickUploadImg}
								  >
								  UPLOAD
								</Button>
								<img className="col-start-1 col-end-4 h-[10em]" 
								     src={previewImg} />


							</div>




							<div className="grid grid-cols-2 gap-2 place-items-start">

								<p>Images in Database</p>

							   <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
							      {itemData.map((item) => (
							        <ImageListItem key={item.img}>
							          <img
							            src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
							            srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
							            alt={item.title}
							            loading="lazy"
							          />
							        </ImageListItem>
							      ))}
							    </ImageList>

							</div>




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
