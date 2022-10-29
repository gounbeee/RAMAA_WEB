import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { Button, TextField } from '@mui/material'

import GetUserData from './GetUserData'



function UploadImage() {


	const [userInfo, setUserInfo] = useState(null);
	const [imgUpPath, setImgUpPath] = useState('');
	const [csrf_tkn, setCsrf_tkn] = useState("");


	// STATES FOR FILE NAME TEXTFIELD
	// 
	// https://qiita.com/FumioNonaka/items/0b4771fdce748e0d67ce
	// :: BELOW STATE SETS THE VALUE OF 'input' ELEMENT
	//    SO WE NEED TO GIVE A INITIAL VALUE !!!!
	const [filenm, setFilenm] = useState('');

	// STATE OF IMAGE FOr PREVIEWING WHEN UPLOADING
	const [previewImg, setPreviewImg] = useState(null)
	const [formImg, setFormImg] = useState(null)



	const [st_imgTitle, setSt_imgTitle] = useState('')
	const [st_imgDesc, setSt_imgDesc] = useState('')
	const [st_imgAlt, setSt_imgAlt] = useState('')




	// -------------------------------------------------------
	// < USING useRef TO MAKE PERSISTED OBJECT >
 	// https://reactjs.org/docs/hooks-reference.html#useref
	// const inputImgRef = useRef(null);




	// < RESETTING STATES >
	const resetAllStates = () => {

		setImgUpPath('')
		setFilenm('')
		setPreviewImg(null)
		setFormImg(null)
		setSt_imgTitle('')
		setSt_imgDesc('')
		setSt_imgAlt('')

	}






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



			// --------------------------------
			// GETTING VALUE FOR OUR IMAGE 


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

		    imgFormData.append('email', userInfo.email )
		    imgFormData.append('fileName', e.target.files[0].name)
		    imgFormData.append('fileSize', e.target.files[0].size)
		    imgFormData.append('imgAlt', st_imgAlt)
		    imgFormData.append('imgTitle', st_imgTitle)
		    imgFormData.append('imgDesc', st_imgDesc)
		    imgFormData.append('uploadingImage', e.target.files[0]);
		    

		    //console.log(imgFormData)
		    setFormImg(imgFormData);
		     

		}
	}


	// < UPLOADING IMAGE FILE TO SEF¥RVER IN REACT, MULTER AND CORS >
	// https://omarshishani.medium.com/how-to-upload-images-to-a-server-with-react-and-express-%EF%B8%8F-cbccf0ca3ac9
	const onClickUploadImg = (e) => {
		console.log("onClickUploadImg EXECUTED !!!!")
		console.log(e)


		if(filenm !== '') {
			
			try {

				//console.log(formImg)

				axios.post(imgUpPath, formImg)
						.then( (res) => {
							console.log(res)
							//resetAllStates()

							// IF FILE UPLOADING SUCCEEDED,
							//
							if( res.status === 200 ) {

								console.log('FILE UPLOADING IS OK !!!!')

							}

						})


			} catch (error) {
					console.log(error)
			}

		}


	}




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

	    	<GetUserData cb_usr={setUserInfo} cb_csrf={setCsrf_tkn} cb_imgPath={setImgUpPath} />
			<input name="_csrf" value={csrf_tkn} type="hidden" />


			<p className="col-start-1 col-end-2">
			Upload Image
			</p>

			<TextField
				id="outlined-textarea"
				label="Image_Title"
				placeholder=""
				variant="filled"
				value={st_imgTitle}
				onChange={ (e) => { setSt_imgTitle(e.target.value) }}
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
				value={st_imgDesc}
				onChange={ (e) => { setSt_imgDesc(e.target.value) }}
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
				value={st_imgAlt}
				onChange={ (e) => { setSt_imgAlt(e.target.value) }}
				multiline
				style={{
					width : '100%', height: '100%',
				    	backgroundColor: "#CCCCCC"
				    }}
			/>
			<Button
				color='primary_bg'
				className="col-start-2 col-end-3"
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
				className="col-start-3 col-end-5" 
				value={filenm}
				variant="filled"
				disabled
				style={{
					width: '100%',
						backgroundColor: "#CCCCCC"
				}}
			/>

			<Button 
				color='primary_bg'
				className="col-start-2 col-end-5 h-[5em]" 
				variant="contained" 
				size="large"
				type="submit"
				onClick={onClickUploadImg}
			>
			UPLOAD
			</Button>

			<img className="col-start-2 col-end-3 h-[10em]" 
				src={previewImg} />

		</div>

	)

}



export default UploadImage
