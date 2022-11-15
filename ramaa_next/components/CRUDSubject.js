import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { Button, TextField, Stack } from '@mui/material'

import GetUserData from './GetUserData'



function CRUDSubject() {




	const [userInfo, setUserInfo] = useState(null);
	const [csrf_tkn, setCsrf_tkn] = useState("");
	

	// STATES FOR CATEGORY
	const [subjectTitle, setSubjectTitle] = useState("");
	const [subjectDescription, setSubjectDescription] = useState("");
	const [subjectKeywords, setSubjectKeywords] = useState("");
	const [subjectLikes, setSubjectLikes] = useState("");

	const [subjectList, setSubjectList] = useState()


	const [filenm, setFilenm] = useState('');
	const [filesz, setFilesz] = useState('');
	const [filedata, setFileData] = useState('');
	const [formJson, setFormJson] = useState(null)

	// -------------------------------------------------------
	// < USING useRef TO MAKE PERSISTED OBJECT >
 	// https://reactjs.org/docs/hooks-reference.html#useref
	// const inputImgRef = useRef(null);



	const onReadSubject = async() => {

		// const userEmail = props.email

		console.log('onReadSubject EXECUTED !!!!')
		console.log(userInfo)


		// WE IMPORT USER INFO HERE USING STATE
		// ADN THEN RETRIVE THE DATA FROM DATABASE

		try {

			if(userInfo) {

				const usrNm = userInfo.name

				const targetUrl = `/member-area/${usrNm}/get_subjectlist`

				console.log(targetUrl)

				const response = await axios.post(targetUrl, userInfo)

				console.log(response.data)
				setSubjectList(response.data.foundSubjects)

			}


		} catch( error ) {

			console.log(error)

		}

	}



	// -------------------------------------------
  	// < EDITTING MAP-ARRAY ELEMENT USINF INDEX > 
   	// https://stackoverflow.com/questions/70832443/how-to-update-the-array-of-objects-using-onchange-handler-in-react-js
	const onEditSubject = async (ev, index, id, propName) => {

		//console.log('EDITING CATEGORY START')

		const clone = [...subjectList];

	    let obj = clone[index];
	    //console.log(obj)



	    switch(propName) {

	    	case 'title':

	    		obj.title = ev.target.value;

	    	break
	    	case 'descriptions':

	    		obj.descriptions = ev.target.value;

	    	break
	    	case 'keywords':

				obj.keywords = ev.target.value;

	    	break
	    	case 'liked':

	    		obj.liked = ev.target.value;

	    	break
	    	case 'json_path':

	    		obj.json_path = ev.target.value;

	    	break

	    }

	    clone[index] = obj;
	    setSubjectList([...clone])

	}





	// ---------------------------------------------------
  	// < CONFIRM CHANGES OF EDITTED ELEMENT TO DATABASE > 
   	// https://stackoverflow.com/questions/70832443/how-to-update-the-array-of-objects-using-onchange-handler-in-react-js
	const onEditSubjectConfirm = async (ev, index, id) => {

		console.log('CHANGES OF CATEGORY CONFIRMED')

		// **** SOME VALIDATION PROCESSES REQUIRED !!!!

		console.log(subjectList[index])


		const userName = userInfo.name
		const targetUrl = '/member-area/' + userName + '/update-subject'
		console.log(targetUrl)
		

		const dataToUpdate = {

			type: 'SUBJECT',
			idToUpdate: subjectList[index]._id,
			title: subjectList[index].title,
			descriptions: subjectList[index].descriptions,
			keywords: subjectList[index].keywords,
			liked: subjectList[index].liked,
			json_path: subjectList[index].json_path,

		}

		console.log(dataToUpdate)

		const response = await axios.post(targetUrl, dataToUpdate)

		if(response.status === 200) {

			console.log("UPDATING CATEGORY IN SERVER IS OK !!!!")


			// REFRESH DISPLAY 
			onReadSubject()

		}

	}



	const onDeleteSubject = async(e, index, id) => {

		console.log('DELETING CATEGORY START')

		// **** SOME VALIDATION PROCESSES REQUIRED !!!!

		console.log(subjectList[index])
		console.log(subjectList[index].name)

		const userName = userInfo.name
		const targetUrl = '/member-area/' + userName + '/delete-subject'
		console.log(targetUrl)
		

		const dataToDelete = {

			type: 'SUBJECT',
			idToUpdate: subjectList[index]._id,
			json_path: subjectList[index].json_path
		}

		console.log(dataToDelete)

		const response = await axios.post(targetUrl, dataToDelete)

		console.log(response)

		if(response.status === 200) {

			console.log("UPDATING CATEGORY IN SERVER IS OK !!!!")


			// REFRESH DISPLAY 

			onReadSubject()




		}

	}




	const onChangeFn = async (e) => {

		console.log(e.target)
		console.log(e.target.files)

		if( e.target.files.length > 0 ) {

			// SETTING NAME FOR DISPLAY
			setFilenm(e.target.files[0].name)
			setFilesz(e.target.files[0].size)


			// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
			// < READING JSON FILE FROM FILE OBJECT USING FileReader API !!!! >
			// https://gomakethings.com/how-to-upload-and-process-a-json-file-with-vanilla-js/
			// Create a new FileReader() object
			let reader = new FileReader(); 
			console.log(e.target.files[0])


			// Setup the callback event to run when the file is read
			reader.onload = prepareForm;


			// Read the file
			reader.readAsText(e.target.files[0]);



		}

	}



	// ================================================================================
	// THIS FUNCTION WILL BE INVOKED AFTER FILE READING IS DONE !!!!
	// https://gomakethings.com/how-to-upload-and-process-a-json-file-with-vanilla-js/
	const prepareForm = (event) => {

		let json_str = event.target.result;
		let json = JSON.parse(json_str);
		console.log('string', json_str);
		console.log('json', json);


		// STORING FILE DATA
		setFileData(json_str)


		// const jsonFormData = new FormData();

	 //    jsonFormData.append('fileName', filenm)
	 //    jsonFormData.append('fileSize', filesz)
	 //    jsonFormData.append('fileData', fileData)

	    	    
	 //    setFormJson(jsonFormData);
	     
		// console.log(jsonFormData)

	}







	// < UPLOADING IMAGE FILE TO SEF¥RVER IN REACT, MULTER AND CORS >
	// https://omarshishani.medium.com/how-to-upload-images-to-a-server-with-react-and-express-%EF%B8%8F-cbccf0ca3ac9
	const onClickCreateSubject = (e) => {


		console.log("onClickCreateSubject EXECUTED !!!!")
		console.log(e)

		// MORE PROPER VALIDATION IS NEEDED !!!!
		if(subjectTitle !== '' && 
		   subjectDescription !== '' && 
		   subjectKeywords !== '' && 
		   subjectLikes !== '' &&
		   filenm !== '' ) {
			
			console.log("OK, EVERY REQUIRED INPUTS ARE FILLED...")
			try {

				const userName = userInfo.name
				const targetUrl = `/member-area/${userName}/create-subject`



				const objForSubject = {
					title: subjectTitle,
					descriptions: subjectDescription,
					keywords: subjectKeywords,
					liked: subjectLikes,
					userEmail: userInfo.email,
					filename: filenm,
					filesize: filesz,
					filedata: filedata,

				}

				console.log("objForSubject IS...")
				console.log(objForSubject)
				
				console.log("formJson IS...")
				console.log(formJson)



				axios.post(targetUrl, objForSubject)
						.then( (res) => {
							console.log(res)
							//resetAllStates()

							// IF FILE UPLOADING SUCCEEDED,
							//
							if( res.status === 200 ) {

								console.log('FILE UPLOADING IS OK !!!!')

								// setSubjectTitle('')
								// setSubjectDescription('')
								// setSubjectKeywords('')
								// setSubjectLikes('')
								// setFilenm('')


							}

						})



			} catch (error) {
					console.log(error)
			}

		} else {


			console.log("ERROR -- THERE IS SOME INPUT FIELD DOES NOT FILLED !!!!")

		}


	}





	const onJsonLoadBtn = (e) => {
		//console.log(inputImgRef.current.files)
		//inputImgRef.current;
		//inputImgRef.current.click()
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
	//
	// 2. USING PROGRAMATICAL WAY TO CONSTRUCT form ELEMENT **** ABOVE ****
	//    < FormData OBJECT >
	// 
	//
	// **** component="label"  IS CRITICAL TO OPEN DIALOG BOX TO CHOOSE FILE ****
	// 
	// 
	// 
	// < accept="application/json"  IS CRITICAL !!!!  >
	// https://stackoverflow.com/questions/46663063/inputs-accept-attribute-doesnt-recognise-application-json
	//
	//
	return(

		<div className="grid grid-cols-4 gap-2">

	    	<GetUserData cb_usr={setUserInfo} cb_csrf={setCsrf_tkn} />
			<input name="_csrf" value={csrf_tkn} type="hidden" />


			<p className="col-start-1 col-end-2">
			CRUD Subject
			</p>

			<TextField
				id="outlined-textarea"
				label="New Subject Title"
				placeholder=""
				variant="filled"
				value={subjectTitle}
				onChange={ (e) => { setSubjectTitle(e.target.value) }}
				    style={{
				    	width : '100%', height: '100%',
				    	backgroundColor: "#CCCCCC"
				}}
			/>
		
			<TextField
				id="outlined-textarea"
				label="New Subject Description"
				placeholder=""
				variant="filled"
				value={subjectDescription}
				onChange={ (e) => { setSubjectDescription(e.target.value) }}
				    style={{
				    	width : '100%', height: '100%',
				    	backgroundColor: "#CCCCCC"
				}}
			/>

			<TextField
				id="outlined-textarea"
				label="New Subject Keywords"
				placeholder=""
				variant="filled"
				value={subjectKeywords}
				onChange={ (e) => { setSubjectKeywords(e.target.value) }}
				    style={{
				    	width : '100%', height: '100%',
				    	backgroundColor: "#CCCCCC"
				}}
			/>

			<TextField
				id="outlined-textarea"
				className="col-start-2 col-end-3" 
				label="New Subject Likes"
				placeholder=""
				variant="filled"
				value={subjectLikes}
				onChange={ (e) => { setSubjectLikes(e.target.value) }}
				    style={{
				    	width : '100%', height: '100%',
				    	backgroundColor: "#CCCCCC"
				}}
			/>

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
				className="col-start-2 col-end-5 h-[3em]" 
				variant="contained" 
				size="large"
				component="label" 
				onClick={onJsonLoadBtn}
			>
			CHOOSE JSON
				<input
					accept="application/JSON"
					style={{ display: 'none' }}
					id="input-upload-json-btn"
					multiple
					type="file"
					onChange={onChangeFn}
					name="uploadingJson"
				/>
			</Button>

			<Button 
				sx={{ fontSize: 16 }}
				color="primary_bg"
				className="col-start-2 col-end-5 h-[5em]" 
				variant="contained" 
				size="large"
				type="submit"
				onClick={onClickCreateSubject}
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
				onClick={onReadSubject} >
				LOAD MY SUBJECTS
			</Button>
	    	{subjectList && 

				<Stack 
				    className="col-start-1 col-end-4"
					direction="column"
					sx={{
						width: '100%'
					}}
					spacing={2} >

			        {	
			        	// ----------------------------------------------------------------------
			        	// < HOW TO GET INDEX NUMBEr WHEN USING mpa FUNCTION >
			        	// https://stackoverflow.com/questions/38364400/index-inside-map-function

			        	// < WE DO NOT USE key WITH NON-UNIQUE VALUE !!!! >
			        	// https://zenn.dev/luvmini511/articles/f7b22d93e9c182

			        	subjectList && subjectList.map((subject, index) => (
				        	<div className="flex flex-col bg-gray-900" key={subject._id}>

				        		<p className="p-2">id</p>
				        		<input
									className="p-2 basis-1/4 text-sm" 
									value={`${index} - ${subject._id}`}
									disabled
								/>
								<p className="p-2">Title</p>
								<input 
									type="text"
									className="p-2 bg-gray-600 basis-1/4 text-1xl" 
						 	   		value={subjectList[index]?.title} 
						 	   		onChange={(e) => onEditSubject(e, index, subject._id, 'title')}
								/>
								<p className="p-2">Descriptions</p>
								<input 
									type="text"
									className="p-2 bg-gray-600 basis-1/4 text-1xl" 
						 	   		value={subjectList[index]?.descriptions} 
						 	   		onChange={(e) => onEditSubject(e, index, subject._id, 'descriptions')}
								/>
								<p className="p-2">Keywords</p>
								<input 
									type="text"
									className="p-2 bg-gray-600 basis-1/4 text-1xl" 
						 	   		value={subjectList[index]?.keywords} 
						 	   		onChange={(e) => onEditSubject(e, index, subject._id, 'keywords')}
								/>
								<p className="p-2">Liked</p>	
								<input 	
									type="text"
									className="p-2 bg-gray-600 basis-1/4 text-1xl" 
						 	   		value={subjectList[index]?.liked} 
						 	   		onChange={(e) => onEditSubject(e, index, subject._id, 'liked')}
								/>
								<p className="p-2">Json</p>
								<input 
									type="text"
									className="p-2 bg-gray-600 basis-1/4 text-1xl" 
						 	   		value={subjectList[index]?.json_path} 
						 	   		onChange={(e) => onEditSubject(e, index, subject._id, 'json_path')}
								/>

				        		<Button 
				        			sx={{ fontSize: 16 }}
				        			color="primary_bg"
				        			variant="contained"
				        			onClick={(e) => onEditSubjectConfirm(e, index, subject._id)} >EDIT NOW</Button>

				        	   	<Button 
				        	   		sx={{ fontSize: 16, fontWeight: 'bold' }}
				        	   		color="critical_bg"
				        	   		onClick={(e) => onDeleteSubject(e, index, subject._id)} >DELETE</Button>
				        	

				        	</div>
        
			      	))}

				</Stack>

			}
			
		</div>

	)

}




export default CRUDSubject
