import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { Button, TextField, Stack } from '@mui/material'

import GetUserData from './GetUserData'



function CRUDCategory() {




	const [userInfo, setUserInfo] = useState(null);
	const [csrf_tkn, setCsrf_tkn] = useState("");
	

	// STATES FOR CATEGORY
	const [categoryCreate, setCategoryCreate] = useState("");
	const [categoryDescriptions, setCategoryDescriptions] = useState("");
	const [categoryTargetUrl, setCategoryTargetUrl] = useState("");

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
	const onEditCategory = async (ev, index, id, propName) => {

		//console.log('EDITING CATEGORY START')

		const clone = [...categoryList];

	    let obj = clone[index];
	    //console.log(obj)


	    switch(propName) {

	    	case 'name':

	    		obj.name = ev.target.value;

	    	break

	    	case 'descriptions':

	    		obj.descriptions = ev.target.value;

	    	break	    	

	    	case 'targetUrl':

	    		obj.targetUrl = ev.target.value;

	    	break

	    }

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
			name: categoryList[index].name,
			descriptions: categoryList[index].descriptions,
			targetUrl: categoryList[index].targetUrl
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
					descriptions: categoryDescriptions,
					targetUrl: categoryTargetUrl,
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
								setCategoryDescriptions('')
								setCategoryTargetUrl('')
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
				label="New Category Name"
				placeholder=""
				variant="filled"
				value={categoryCreate}
				onChange={ (e) => { setCategoryCreate(e.target.value) }}
				    style={{
				    	width : '100%', height: '100%',
				    	backgroundColor: "#CCCCCC"
				}}
			/>
			<TextField
				id="outlined-textarea"
				label="New Descriptions"
				placeholder=""
				variant="filled"
				value={categoryDescriptions}
				onChange={ (e) => { setCategoryDescriptions(e.target.value) }}
				    style={{
				    	width : '100%', height: '100%',
				    	backgroundColor: "#CCCCCC"
				}}
			/>
			<TextField
				id="outlined-textarea"
				label="New Target Url"
				placeholder=""
				variant="filled"
				value={categoryTargetUrl}
				onChange={ (e) => { setCategoryTargetUrl(e.target.value) }}
				    style={{
				    	width : '100%', height: '100%',
				    	backgroundColor: "#CCCCCC"
				}}
			/>
			<Button 
				sx={{ fontSize: 16 }}
				color="primary_bg"
				className="col-start-2 col-end-5" 
				variant="contained" 
				size="large"
				type="submit"
				onClick={onClickCreateCategory}
			>
			CREATE
			</Button>



	    	<Button 
	    		color="secondary_bg"
	    		sx={{ fontSize: 16 }}
	    		variant="contained" 
	    		className="col-start-1 col-end-5" 
				component="label" 
				size="large"
				style={{ width : '100%', height: '100%'}}
				onClick={getListFromDB} >
				LOAD MY CATEGORIES
			</Button>
	    	{categoryList && 

				<Stack 
				    className="col-start-1 col-end-5"
					direction="row"
					sx={{
						width: '100%'
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
						 	   		onChange={(e) => onEditCategory(e, index, category._id, 'name')}
								/>
								<input 
									type="text"
									className="p-5 bg-gray-600 w-[100%] text-center text-1xl col-start-3 col-end-5" 
						 	   		value={categoryList[index]?.descriptions} 
						 	   		onChange={(e) => onEditCategory(e, index, category._id, 'descriptions')}
								/>
								<input 
									type="text"
									className="p-5 bg-gray-600 w-[100%] text-center text-1xl col-start-3 col-end-5" 
						 	   		value={categoryList[index]?.targetUrl} 
						 	   		onChange={(e) => onEditCategory(e, index, category._id, 'targetUrl')}
								/>
				        		<Button 
				        			sx={{ ml: 4, fontSize: 16 }}
				        			color="primary_bg"
				        			variant="contained"
				        			onClick={(e) => onEditCategoryConfirm(e, index, category._id)} >EDIT NOW</Button>
				        	   	<Button 
				        	   		sx={{ ml: 4, fontSize: 16, fontWeight: 'bold' }}
				        	   		color="critical_bg"
				        	   		onClick={(e) => onDeleteCategory(e, index, category._id)} >DELETE</Button>
				        	</div>
			      	))}
				</Stack>

			}

			

		</div>

	)

}



export default CRUDCategory
