import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Backdrop } from '@mui/material'

// MATERIAL UI
import { Card, 
	       CardActions,
	       CardContent,
	       CardMedia,
	       Button,
	       Typography
  } from '@mui/material'



// OUR ORIGINAL UI PARTS
import ModalConfirmZ from './ModalConfirmZ'
import SubjectCard   from './SubjectCard'




function Subjects() {


	const [categoryList, setCategoryList] = useState()
	const [open, setOpen] = React.useState(true)

	const navigate = useNavigate();



	// const categoryList = []





	const [csrf_tkn, setCsrf_tkn] = useState("");



	const getSubjects = () => {



		try {
			console.log("SUBJECT PANEL CALLED")
			console.log("1. GETTING DATA LIST FROM DATABASE")

			
			const targetURL = `/subjects`
			console.log("UserAdmin ::  TARGET URL IS ")
			console.log(targetURL)



			axios.get(targetURL)
			    .then( res => {

			     	// SO FAR WE GOT USER INFORMATION FROM DATABASE,
			     	// AND CSRF TOKEN !!!

				 		// SETTING UP CSRF TOKEN FROM SERVER TO THIS ELEMENT
						console.log(res.data.csrfToken)
						// SETTING UP CSRF USING STATE
						setCsrf_tkn(res.data.csrfToken)
						axios.defaults.headers.common['CSRF-TOKEN'] = res.data.csrfToken



						console.log(res)

						if(res.status === 200) {

							const foundCategories = res.data.foundCategories
							console.log(foundCategories)


							setCategoryList(foundCategories)




						}



					})

		} catch (err) {

			console.log(err)

		}



	}



	// WHEN BACK BUTTON PRESSED
	const bckBtn = async () => {


		console.log("BACK BUTTON IS PRESSED")

		displayWorkArea()


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
    <div className="animate-fade-in absolute z-20 bg-slate-500">
	    
    	<Backdrop
				className=""
				open={open}
			>

				<div className="w-[80%] h-full">

			    <h2 className="p-10 font-semibold text-3xl">
			      EXPLORE MORE SUBJECTS!
			    </h2>

					<Link className="text-2xl hover:text-ramaa_buttonHover p-10" 
						  to="/"
						  onClick={bckBtn}
						  >EXIT
					</Link>


					<div className="grid grid-cols-3 gap-4 place-items-start bg-slate-500 p-10 space-y-7">

						<input name="_csrf" value={csrf_tkn} type="hidden" />

						{ categoryList &&
							// map FUNCTION TO ITERATE CREATION OF MULTIPLE CARDS
							categoryList.map( (mapData, index) => {  

							// -----------------------------------------------------
							// < ABOUT UNIQUE 'key' WARNING WHEN WE USE map FUNCTION >
							// https://abillyz.com/moco/studies/380
							return (
								

								<Card key={index} sx={{ maxWidth: 200 }}>

						      <CardContent>
						        <Typography gutterBottom variant="h7" component="div">
						          {mapData.name}
						        </Typography>
						        <Typography variant="body2" color="text.secondary">
						          {mapData?.desc}
						        </Typography>
						      </CardContent>
						      <CardActions>
						        <Link size="small" to={mapData?.url} >GO INSIDE</Link>
						      </CardActions>
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



export default Subjects;
