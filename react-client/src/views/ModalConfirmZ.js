// ----------------------------------------------------------------
// IMPORT TOOLKITS

// WE WANT TO USE REACT'S COMPONENT
import React, { useState, useEffect } from "react"

// FOR DISPLAYING FLASH MESSAGE WHEN USER'S INPUT IS VALID OR NOT
// ON THE SERVER !! NOT CLIENT !!
import toast from "react-hot-toast"

// react-router-dom 
// IS GREAT HELPER OBJECT TO CREATE DOM ELEMENT EASILY !
import { Link, Button } from "react-router-dom"
import { useNavigate } from 'react-router-dom'

// axios
// AXIOS IS FOR MANAGING HTTP CLIENT FUNCTIONALITY (GET / POST)
import axios from "axios"




// DEFINE LOGIN FUNCTION COMPONENT IN REACT
function Modal(props) {

	const [inputValue, setInputValue] = useState(props.value)
	const [question, setQuestion] = useState(props.question)


	const navigate = useNavigate();

	const domId = props.id

	// < insertBefore() FUNCTION >
	// https://stackoverflow.com/questions/2007357/how-to-set-dom-element-as-first-child
	const moveToRoot = (id) => {
		const targetDom = document.getElementById("allArea")
		const dom = document.getElementById(id)
		console.log(dom)

		targetDom.insertBefore(dom, targetDom.firstChild)

	}



	useEffect( () => {

		console.log("Modal CREATED")
		moveToRoot(props.id)


	})

	// < CENTERING ABSOULTE ELEMENT WITH TAILWINDCSS >
	// https://stackoverflow.com/questions/64233478/tailwind-center-an-absolute-element

	return (

		<div id={props.id} className="fixed h-full w-full flex items-center justify-center bg-opacity-50 bg-gray-900 z-50">
			<div className="animate-fade-in bg-opacity-50 bg-ramaa_darkblue ">
				<div className="px-20 py-14 text-center ">
					<h3 className="text-4xl">{props.question}</h3>
					<input className="text-ramaa_inputText border-none focus:outline-none p-3 my-10 text-2xl" 
					 	   type="text" 
					 	   value={inputValue} 
					 	   onChange={(e) => {setInputValue(e.target.value)}}
					/>
					<br />
					<Link className=" mr-10 text-2xl " >Cancel</Link>
					<Link className="ml-10 text-2xl" >Change</Link>
				</div>
			</div>
		</div>

	)



}



export default Modal


