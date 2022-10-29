
import React, { useState } from "react";
import axios from "axios";


import {TextField, Stack } from '@mui/material';
import Button from '@mui/material/Button';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

import GetUserData from './GetUserData'




function CRUDCategoryList() {


	// USING STATE FOR GETTING USER
	const [userInfo, setUserInfo] = useState(null)
	const [categoryList, setCategoryList] = useState()
	const [isEditting, setIsEditting] = useState(false)


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










	// ---------------------------------------------------------------------------------------
	// < Under the Hood of React useEffect Dependencies >
	// https://blog.bitsrc.io/understanding-dependencies-in-useeffect-7afd4df37c96
	//
	// It’s optional. If you don’t specify it, the effect 
	// runs after each render.
	// If it’s empty ([]), the effect runs once, after the 
	// initial render.
	// It must — or as we’ll see later, should — 
	// contain the list of values used in the effect. 
	// The effect runs after any of these values changes 
	// (and after the initial render).
	// The array of dependencies is not passed as argument 
	// to the effect function.


	// ------------------------------------------------
	// < / IS CRIITCAL !!!! >
	// src={`/${item.imgPath}`}
	//       *
	//
	// THIS WILL CHANGE THE PATH WE WILL SEARCH !!!!


	return(

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

	)


}




export default CRUDCategoryList