import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

import Modal from './Modal'

import SubjectCard from './SubjectCard'


function Subjects() {

	const navigate = useNavigate();


	const getSubjects = () => {

		try {
			console.log("SUBJECT PANEL CALLED")


			// const targetURL = `/subjects`
			// console.log("UserAdmin ::  TARGET URL IS ")
			// console.log(targetURL)

			// axios.get(targetURL)
			//      .then( res => {

			//      	// SO FAR WE GOT USER INFORMATION FROM DATABASE,
			//      	// AND CSRF TOKEN !!!
			// 	 	console.log( res )

			// 	 	// SETTING UP CSRF TOKEN FROM SERVER TO THIS ELEMENT
				 	

			// 	 })

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
		hideWorkArea()
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





  return (
    <div className="animate-fade-in absolute top-0 left-0 w-full h-[550px] z-20 bg-slate-500">
	    <h2 className="p-10 font-semibold text-2xl">
	      Account settings
	    </h2>

		<Link className="hover:text-ramaa_buttonHover p-10" 
			  to="/"
			  onClick={bckBtn}
			  >Back
		</Link>


		<div className="grid grid-cols-3 gap-4 place-items-start bg-slate-500 p-10 space-y-7">

			{modalView && ( <Modal id="modal" question={modalQues} /> )}

			<SubjectCard />

			

      	</div>
    </div>

  );          // END OF RETURN



}



export default Subjects;
