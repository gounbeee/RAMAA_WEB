import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";




function SubjectCard() {

	const navigate = useNavigate();


	const openSubject = () => {

		try {
			console.log("openSubject CALLED")


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





	const hideWorkArea = () => {
		if(document.getElementById("workarea").style.display !== 'none')
			document.getElementById("workarea").style.display = 'none';

	}

	const displayWorkArea = () => {
		if(document.getElementById("workarea").style.display === 'none')
			document.getElementById("workarea").style.display = '';
	}


	useEffect(() => {

	},[])




  return (
    <div className="">

    SUBJECT CARD

    </div>

  );          // END OF RETURN



}



export default SubjectCard;
