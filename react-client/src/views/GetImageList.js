
import React, { useState } from "react";
import axios from "axios";


import Button from '@mui/material/Button';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

import GetUserData from './GetUserData'





function GetImageList() {


	// USING STATE FOR GETTING USER
	const [userInfo, setUserInfo] = useState(null)

	const [imgList, setImgList]   = useState()



	const getListFromDB = async() => {


		// const userEmail = props.email


		console.log('getListFromDB EXECUTED !!!!')
		console.log(userInfo)


		// WE IMPORT USER INFO HERE USING STATE
		// ADN THEN RETRIVE THE DATA FROM DATABASE


		try {

			if(userInfo) {

				const usrNm = userInfo.name

				const targetUrl = `/member-area/${usrNm}/get_imagelist`

				console.log(targetUrl)

				const response = await axios.post(targetUrl, userInfo)

				console.log(response.data.foundImages)
				setImgList(response.data.foundImages)

				// itemData = response.data.foundImages
				// console.log(itemData)
			}


		} catch( error ) {

			console.log(error)

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

		<div className="grid grid-cols-2 gap-2 place-items-start">

		    <p>Images in Database</p>

	    	<GetUserData cb_usr={setUserInfo} />
			
	    	<Button variant="contained" 
	    		className="col-start-1 col-end-3" 
				component="label" 
				size="large"
				style={{ width : '100%', height: '100%'}}
				onClick={getListFromDB} >
				LOAD IMAGES
			</Button>
	    	{imgList && 
				<ImageList 
				className="col-start-1 col-end-3" variant="quilted"

				sx={{ width: '100%', height: '100%' }} cols={10} rowHeight={164}
				>
			        {imgList && imgList.map((item) => (
			        	<ImageListItem 
			        		key={item._id}
			        	>
			          		<img
					            src={`/${item.imgPath}`}
					            alt={item.imgAlt}
					            loading="lazy"
			          		/>
			        	</ImageListItem>
			      	))}
				</ImageList>
			}

		</div>

	)


}




export default GetImageList