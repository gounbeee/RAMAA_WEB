import React, { useState, useEffect, useRef, createContext } from "react";
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
	       Typography,
	       CardActionArea
  } from '@mui/material'



// OUR ORIGINAL UI PARTS
import ModalConfirmZ from './ModalConfirmZ'
import SubjectsDetails from './SubjectsDetails'




function Subjects(props) {

	const UserContext = createContext()


	const [categoryList, setCategoryList] = useState()
	const [open, setOpen] = useState(true)


	const navigate = useNavigate();

	const [nextRoute, setNextRoute] = useState('')
	const [showDetails , setShowDetails] = useState(false)


	// const categoryList = []





	const [csrf_tkn, setCsrf_tkn] = useState("");



	const getSubjects = () => {



		try {

			console.log(UserContext)
			
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

						//console.log(res)

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
  	<UserContext.Provider value={showDetails} >

    	<div className="absolute z-20 bg-slate-500">
	    

	    	<Backdrop
					className=""
					open={open}
				>

					<div className="w-[90%] h-full">

				    <h2 className="p-10 font-semibold text-3xl">
				      EXPLORE MORE SUBJECTS!
				    </h2>

						<Link className="text-2xl hover:text-ramaa_buttonHover p-10" 
							  to="/"
							  onClick={bckBtn}
							  >EXIT
						</Link>

						<div className="mt-20 grid grid-cols-3 gap-4 place-items-start">

							<input name="_csrf" value={csrf_tkn} type="hidden" />

							{ categoryList &&
								// map FUNCTION TO ITERATE CREATION OF MULTIPLE CARDS
								categoryList.map( (category, index) => {  

								// -----------------------------------------------------
								// < ABOUT UNIQUE 'key' WARNING WHEN WE USE map FUNCTION >
								// https://abillyz.com/moco/studies/380
								return (
									
									<Card 
										onClick={ e => {
											//console.log(category.targetUrl)
											setNextRoute(category.targetUrl)
											setShowDetails(true)
											navigate(category.targetUrl)

										}} 
									  key={category._id} sx={{ minWidth: 300, minHeight: 200 }}>
										
										<Link>
								      <CardContent sx={{ minWidth: 300, minHeight: 200 }}>
								        <Typography gutterBottom variant="h5" component="div">
								          {category.name}
								        </Typography>
								        <Typography variant="body1" color="text.secondary">
								          {category?.descriptions}
								        </Typography>
								      </CardContent>
							      </Link>

							    </Card>

									)
								})
							}

					  </div>
					</div>
					{ showDetails &&
						<SubjectsDetails pathName={nextRoute} history={props.history} context={UserContext} />
					}


				</Backdrop>

	
    	</div>

    </UserContext.Provider>

  );          // END OF RETURN



}



export default Subjects;
