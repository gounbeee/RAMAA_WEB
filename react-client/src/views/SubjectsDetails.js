import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Backdrop, Breadcrumbs } from '@mui/material'

// MATERIAL UI
import { Card, 
	       CardActions,
	       CardContent,
	       CardMedia,
	       Button,
	       Typography,
	       CardActionArea
  } from '@mui/material'



// OUR ORIGINAL UI PARTS
import ModalConfirmZ from './ModalConfirmZ'




function SubjectsDetails(props) {


	const [subjectList, setSubjectList] = useState()
	const [open, setOpen] = React.useState(true)

	const navigate = useNavigate();

	// const categoryList = []


	const [csrf_tkn, setCsrf_tkn] = useState("");



	const getSubjects = () => {



		try {

			console.log("BELOW VALUE PASSED FROM PREVIOUS ROUTE")
			console.log(props.pathName)

			console.log("SUBJECT PANEL CALLED")
			console.log("1. GETTING DATA LIST FROM DATABASE")

			
			const targetURL = '/subjects/' + props.pathName
			console.log("UserAdmin ::  TARGET URL IS ")
			console.log(targetURL)



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



						console.log(res)

						if(res.status === 200) {

							const foundSubjects = res.data.foundSubjects
							console.log(foundSubjects)


							setSubjectList(foundSubjects)




						}



					})

		} catch (err) {

			console.log(err)

		}



	}



	const loadJsonSubject = async (e, subject) => {

		console.log("LOAD THE JSON FILE !!!")

		console.log(e)
		console.log(subject)


		// https://stackoverflow.com/questions/40385133/retrieve-data-from-a-readablestream-object
		// 
		await fetch(subject.json_path)
			.then((res) => {

				console.log(res)

				console.log(res.body)

				return res.json()

		})
			.then((data) => {

				console.log(data)

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



	}




	// WHEN BACK BUTTON PRESSED
	const bckBtn = async () => {


		console.log("BACK BUTTON IS PRESSED")

		//displayWorkArea()
		navigate('/')

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
		getSubjects()


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



	// < REACT'S MATERIAL UI :: CARD >
	// https://mui.com/material-ui/react-card/
	// https://www.pluralsight.com/guides/load-and-render-json-data-into-react-components

  return (
    <div className="absolute z-20 bg-slate-500 overflow-y-scroll">
	    
    		<Backdrop
				className=""
				open={open}
				>      

				<div className="w-[90%] h-full">


				    <h2 className="p-10 font-semibold text-3xl">
				      {props.pathName}
				    </h2>

					<Link className="text-2xl hover:text-ramaa_buttonHover p-10" 
						  to="/subjects"
						  onClick={bckBtn}
						  >BACK
					</Link>




					<div className="mt-10 grid grid-cols-3 gap-4 place-items-start">

						<input name="_csrf" value={csrf_tkn} type="hidden" />

						{ subjectList &&
							// map FUNCTION TO ITERATE CREATION OF MULTIPLE CARDS
							subjectList.map( (subject, index) => {  

							// -----------------------------------------------------
							// < ABOUT UNIQUE 'key' WARNING WHEN WE USE map FUNCTION >
							// https://abillyz.com/moco/studies/380
							return (
								
								<Card key={subject._id} sx={{ minWidth: 200, minHeight: 200 }}>
									<Link onClick={ (e) => { loadJsonSubject(e, subject) }} >
							      <CardContent sx={{ minWidth: 200, minHeight: 200 }}>
							        <Typography gutterBottom variant="h5" component="div">
							          {subject.title}
							        </Typography>
							        <Typography variant="body1" color="text.secondary">
							          {subject?.descriptions}
							        </Typography>
							        <Typography variant="body1" color="text.secondary">
							          {subject?.liked}
							        </Typography>
							        
							      </CardContent>
						      </Link>
						    </Card>

								)
							})
						}

				  </div>
				</div>  
			</Backdrop>
    </div>

  );          // END OF RETURN



}



export default SubjectsDetails;
