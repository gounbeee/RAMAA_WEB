import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { createTheme } from '@mui/material/styles';
import { Button, TextField, Stack } from '@mui/material'


import GetUserData from './GetUserData'
//import CRUDCategoryList from './CRUDCategoryList'



function CRUDCategory() {



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



	const [userInfo, setUserInfo] = useState(null);
	const [csrf_tkn, setCsrf_tkn] = useState("");
	

	// STATES FOR CATEGORY
	const [categoryCreate, setCategoryCreate] = useState("");

	const [categoryList, setCategoryList] = useState()


	// -------------------------------------------------------
	// < USING useRef TO MAKE PERSISTED OBJECT >
 	// https://reactjs.org/docs/hooks-reference.html#useref
	// const inputImgRef = useRef(null);



	const getListFromDB = async() => {


		// const userEmail = props.email


		console.log('getListFromDB EXECUTED !!!!')
		console.log(userInfo)


		// WE IMPORT USER INFO HERE USING STATE
		// ADN THEN RETRIVE THE DATA FROM DATABASE


		try {

			if(userInfo) {

				const usrNm = userInfo.name

				const targetUrl = `/member-area/${usrNm}/get_categorylist`

				console.log(targetUrl)

				const response = await axios.post(targetUrl, userInfo)

				console.log(response.data)
				setCategoryList(response.data.foundCategories)

			}


		} catch( error ) {

			console.log(error)

		}


	}


	// -------------------------------------------
  	// < EDITTING MAP-ARRAY ELEMENT USINF INDEX > 
   	// https://stackoverflow.com/questions/70832443/how-to-update-the-array-of-objects-using-onchange-handler-in-react-js
	const onEditCategory = async (ev, index, id) => {

		//console.log('EDITING CATEGORY START')

		const clone = [...categoryList];

	    let obj = clone[index];
	    //console.log(obj)

	    obj.name = ev.target.value;

	    clone[index] = obj;
	    setCategoryList([...clone])


	}


	// ---------------------------------------------------
  	// < CONFIRM CHANGES OF EDITTED ELEMENT TO DATABASE > 
   	// https://stackoverflow.com/questions/70832443/how-to-update-the-array-of-objects-using-onchange-handler-in-react-js
	const onEditCategoryConfirm = async (ev, index, id) => {

		console.log('CHANGES OF CATEGORY CONFIRMED')

		// **** SOME VALIDATION PROCESSES REQUIRED !!!!

		console.log(categoryList[index])
		console.log(categoryList[index].name)

		const userName = userInfo.name
		const targetUrl = '/member-area/' + userName + '/update-category'
		console.log(targetUrl)
		


		const dataToUpdate = {

			type: 'CATEGORY',
			idToUpdate: categoryList[index]._id,
			value: categoryList[index].name
		}

		console.log(dataToUpdate)

		const response = await axios.post(targetUrl, dataToUpdate)

		if(response.status === 200) {

			console.log("UPDATING CATEGORY IN SERVER IS OK !!!!")


			// REFRESH DISPLAY 

			getListFromDB()




		}


	}

	const onDeleteCategory = async(e, index, id) => {

		console.log('DELETING CATEGORY START')

		// **** SOME VALIDATION PROCESSES REQUIRED !!!!

		console.log(categoryList[index])
		console.log(categoryList[index].name)

		const userName = userInfo.name
		const targetUrl = '/member-area/' + userName + '/delete-category'
		console.log(targetUrl)
		

		const dataToDelete = {

			type: 'CATEGORY',
			idToUpdate: categoryList[index]._id,
		}

		console.log(dataToDelete)

		const response = await axios.post(targetUrl, dataToDelete)

		console.log(response)

		if(response.status === 200) {

			console.log("UPDATING CATEGORY IN SERVER IS OK !!!!")


			// REFRESH DISPLAY 

			getListFromDB()




		}

	}






	// < UPLOADING IMAGE FILE TO SEF¥RVER IN REACT, MULTER AND CORS >
	// https://omarshishani.medium.com/how-to-upload-images-to-a-server-with-react-and-express-%EF%B8%8F-cbccf0ca3ac9
	const onClickCreateCategory = (e) => {
		console.log("onClickUploadImg EXECUTED !!!!")
		console.log(e)


		if(categoryCreate !== '') {
			
			try {

				const userName = userInfo.name
				const targetUrl = `/member-area/${userName}/create-category`


				const objForCategory = {
					name: categoryCreate,
					userEmail: userInfo.email,
				}


				axios.post(targetUrl, objForCategory)
						.then( (res) => {
							console.log(res)
							//resetAllStates()

							// IF FILE UPLOADING SUCCEEDED,
							//
							if( res.status === 200 ) {

								console.log('CREATING CATEGORY IS OK !!!!')

								// REFRESH THE LIST
								getListFromDB()

								// RESET INPUT ELEMENT
								setCategoryCreate('')
							}

						})


			} catch (error) {
					console.log(error)
			}

		}


	}









	// ---------------------------------------------------------
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

	// 2. USING PROGRAMATICAL WAY TO CONSTRUCT form ELEMENT **** ABOVE ****
	//    < FormData OBJECT >
	// 
	return(

		<div className="grid grid-cols-4 gap-2">

	    	<GetUserData cb_usr={setUserInfo} cb_csrf={setCsrf_tkn} />
			<input name="_csrf" value={csrf_tkn} type="hidden" />


			<p className="col-start-1 col-end-2">
			CRUD Category
			</p>

			<TextField
				id="outlined-textarea"
				label="Category Name"
				placeholder=""
				variant="filled"
				value={categoryCreate}
				onChange={ (e) => { setCategoryCreate(e.target.value) }}
				    style={{
				    	width : '100%', height: '100%',
				    	backgroundColor: "#CCCCCC"
				}}
			/>
		
			<Button 
				className="col-start-3 col-end-5" 
				variant="contained" 
				size="large"
				type="submit"
				onClick={onClickCreateCategory}
			>
			CREATE
			</Button>


			<div id="categoryListDom" className="grid grid-cols-2 gap-2 place-items-start">

		    	<GetUserData cb_usr={setUserInfo} />
				


		    	<Button variant="contained" 
		    		className="col-start-1 col-end-3" 
					component="label" 
					size="large"
					style={{ width : '100%', height: '100%'}}
					onClick={getListFromDB} >
					LOAD CATEGORY
				</Button>
		    	{categoryList && 

					<Stack 
					    className="grid grid-cols-3 gap-2"
						direction="row"
						sx={{
							width: 500
						}}
						spacing={2}
					>
				        {	
				        	// ----------------------------------------------------------------------
				        	// < HOW TO GET INDEX NUMBEr WHEN USING mpa FUNCTION >
				        	// https://stackoverflow.com/questions/38364400/index-inside-map-function

				        	// < WE DO NOT USE key WITH NON-UNIQUE VALUE !!!! >
				        	// https://zenn.dev/luvmini511/articles/f7b22d93e9c182


				        	categoryList && categoryList.map((category, index) => (
					        	<div className="w-[100%] bg-gray-900" key={category._id}>
					        		<input
										className="w-[100%] p-2 text-center text-sm col-start-3 col-end-5" 
										value={`${index} - ${category._id}`}
										disabled
									/>
									<input 
										type="text"
										className="p-5 bg-gray-600 w-[100%] text-center text-1xl col-start-3 col-end-5" 
							 	   		value={categoryList[index]?.name} 
							 	   		onChange={(e) => onEditCategory(e, index, category._id)}
									/>
					        		<Button onClick={(e) => onEditCategoryConfirm(e, index, category._id)} >EDIT</Button>
					        	   	<Button onClick={(e) => onDeleteCategory(e, index, category._id)} >DELETE</Button>
					        	</div>
				      	))}
					</Stack>

				}

			</div>

		</div>

	)

}



export default CRUDCategory