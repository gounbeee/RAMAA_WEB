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
	       CardActionArea,
	       Box
  } from '@mui/material'

import SubjectsDetails from './SubjectsDetails'
import {hideFooter, showFooter} from './GlobalFunctions'




function Subjects(props) {

	const UserContext = createContext()


	const [categoryList, setCategoryList] = useState()
	const [open, setOpen] = useState(true)


	const navigate = useNavigate();

	const [nextRoute, setNextRoute] = useState('')
	const [showDetails , setShowDetails] = useState(false)


	const [csrf_tkn, setCsrf_tkn] = useState("");


	const getSubjects = () => {



		try {

			hideFooter()

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
		showFooter()

	}

	useEffect(() => {

		getSubjects()

	},[])





	// < REACT'S MATERIAL UI :: CARD >
	// https://mui.com/material-ui/react-card/
	// https://www.pluralsight.com/guides/load-and-render-json-data-into-react-components

  	return (
	  	<UserContext.Provider value={showDetails} >

	    	<div className="animate-fade-in">
		    
		    	<Backdrop 
		    		className=""
					open={open}
					transitionDuration={0}
				>

					<div className="p-20 w-[30%] h-full">
						<input name="_csrf" value={csrf_tkn} type="hidden" />

						<Link className="text-2xl hover:text-ramaa_buttonHover" to="/" onClick={bckBtn}>
						EXIT
						</Link>

{/*						{ categoryList &&
							// map FUNCTION TO ITERATE CREATION OF MULTIPLE CARDS
							categoryList.map( (category, index) => 

								<Box
									className="hover:text-ramaa_buttonHover my-10" 
									onClick={ e => {
										//console.log(category.targetUrl)
										setNextRoute(category.targetUrl)
										setShowDetails(true)
										navigate(category.targetUrl)

									}} 
									key={category._id} 
									component="div" 
									sx={{ width: 400, height: 100, p: 2, border: '1px dashed red' }}>
									
									<h1 className="text-3xl" >
									{category.name}
									</h1> 

									<h3>
									{category.descriptions} 
									</h3>
								
								</Box>

							)
						}*/}

					</div>

					<div className='w-[80%] h-full p-10 overflow-y-scroll'>							
						{	categoryList &&
							// map FUNCTION TO ITERATE CREATION OF MULTIPLE CARDS
							categoryList.map( (category, index) => 
						
							<SubjectsDetails pathName={category.targetUrl} history={props.history} context={UserContext} />
						
							)
						}
					</div>

				</Backdrop>
		
	    	</div>

	    </UserContext.Provider>

   );   // END OF RETURN



}



						// <div className="mt-20 grid grid-cols-3 gap-4 place-items-start">

						// 	



					 //    </div>




export default Subjects;
