import React, { useState, useEffect, useContext } from "react";
import toast from "react-hot-toast";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Backdrop, Breadcrumbs } from '@mui/material'

// MATERIAL UI
import { Card, 
	       CardActions,
	       CardContent,
	       CardMedia,
	       Button,
	       Typography,
	       CardActionArea,
	       Box
  } from '@mui/material'



import {hideFooter, showFooter} from './GlobalFunctions'



function SubjectsDetails(props) {

	let {categoryName} = useParams()

	const [subjectList, setSubjectList] = useState()

	const navigate = useNavigate()
	const location = useLocation()

	const setOpenContext = useContext(props.context)


	const [showFlag, setShowFlag] = useState(false)

	const [csrf_tkn, setCsrf_tkn] = useState("");



	const getSubjects = () => {



		try {

			//console.log("setOpenContext  IS ...")
			//console.log(setOpenContext)


			//console.log('PARAMS VALUE IS BELOW...')
			//console.log(categoryName)

			//console.log("BELOW VALUE PASSED FROM PREVIOUS ROUTE")
			//console.log(props.pathName)

			//console.log("SUBJECT PANEL CALLED")
			//console.log("1. GETTING DATA LIST FROM DATABASE")

			
			const targetURL = '/subjects/' + props.pathName
			//console.log("UserAdmin ::  TARGET URL IS ")
			//console.log(targetURL)



			axios.post(targetURL, {
				categoryName: props.pathName
			})
			    .then( res => {

			     	// SO FAR WE GOT USER INFORMATION FROM DATABASE,
			     	// AND CSRF TOKEN !!!

				 		// 	// SETTING UP CSRF TOKEN FROM SERVER TO THIS ELEMENT
						// console.log(res.data.csrfToken)
						// // SETTING UP CSRF USING STATE
						// setCsrf_tkn(res.data.csrfToken)
						// axios.defaults.headers.common['CSRF-TOKEN'] = res.data.csrfToken

						//console.log(res)

						if(res.status === 200) {

							const foundSubjects = res.data.foundSubjects
							//console.log(foundSubjects)


							setSubjectList(foundSubjects)


						}



					})

		} catch (err) {

			console.log(err)

		}



	}



	const loadJsonSubject = async (e, subject) => {
		
		//console.log('loadJsonSubject() IS EXECUTED !')

		//console.log("LOAD THE JSON FILE !!!")

		//console.log(e)
		//console.log(subject)

		// OUR CURRENT PATH IS /subjects/math
		// 										 ~~~~~~~~
		//
		// SO NEEDED TO ADJUST

		// < GETTING CURRENT FULL PATH >
		//https://stackoverflow.com/questions/39823681/read-the-current-full-url-with-react
		// http://localhost:3000/subjects/math

		//console.log(window.location.href)
		
		let currentFullPath = window.location.href
		const pathForJson = currentFullPath.split('/')
		
		//console.log(pathForJson)

		const fullPath = pathForJson[0] + '//' + pathForJson[2] + '/' + subject.json_path
		//console.log(fullPath)


		// console.log(props.history)


		// https://stackoverflow.com/questions/40385133/retrieve-data-from-a-readablestream-object
		// 
		await fetch(fullPath)
			.then((res) => {

				//console.log(res)
				//console.log(res.body)

				return res.json()

		})
			.then((data) => {

				//console.log(data)

				// **** CONNECTION WITH PUBLIC JAVASCRIPT APP ****
				//
				//
				
				// WE HAVE EXPORTED ramaa_app TO window OBJECT
				//console.log(window.ramaa_app)
				
				// STATE OBJECT FROM STATEMACHINE 
				let RM_currentState = window.ramaa_app.instance.stateMachine.stateStack[0]
				//console.log(RM_currentState)

				// SOURCEMANAGER
				let RM_sourceManager = RM_currentState.sourceManager
				//console.log(RM_sourceManager)


				// USE THAT METHOD
				RM_sourceManager.loadFromJsonReact(data, RM_currentState)


				navigate('/')


		})
			.catch(err => {
				console.log(err)

				navigate('/')

			})



	}




	// WHEN BACK BUTTON PRESSED
	const bckBtn = () => {


		console.log("BACK BUTTON IS PRESSED")


		navigate('/subjects')
		setOpenContext(false)


	}



	useEffect(() => {
		//hideWorkArea()
		getSubjects()


	},[])


	const getColor = (genreNm) => {

		switch(genreNm) {

			case "math":
				return "red"
			break

			case "programming":
				return "blue"
			break

			case "concreatepoetry":
				return "green"
			break



		}

	}


	// < REACT'S MATERIAL UI :: CARD >
	// https://mui.com/material-ui/react-card/
	// https://www.pluralsight.com/guides/load-and-render-json-data-into-react-components

  return (

    <div className="">

				  <h2 className="py-10 font-semibold text-5xl">
				      {props.pathName}
				  </h2>


					<input name="_csrf" value={csrf_tkn} type="hidden" />

							{ subjectList &&
								// map FUNCTION TO ITERATE CREATION OF MULTIPLE CARDS
								subjectList.map( (subject, index) => 

									<div
										className="w-[80%] p-12 border border-amber-200 hover:text-ramaa_buttonHover my-10" 
										onClick={ e => { 
											showFooter() 
											loadJsonSubject(e, subject)
										}} 
										key={subject._id} 
									>
										
										<h1 className="text-3xl" >
										{subject.title}
										</h1> 

										<h3>
										{subject.descriptions} 
										</h3>
										<h3>
										{subject.liked} 
										</h3>

									</div>

								)
							}

    </div>

  );          // END OF RETURN

}



export default SubjectsDetails;
