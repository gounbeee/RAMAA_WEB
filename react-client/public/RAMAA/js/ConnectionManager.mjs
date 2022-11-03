'use strict'

import { Security }         from "./Security.mjs"
import { LocalStorage }     from "./LocalStorage.mjs"




class ConnectionManager {

	constructor(settings, stateObj) {

		console.log('%% ConnectionManager.mjs :: ConnectionManager CONSTRUCTOR EXECUTED')



		this.showDialog = (ev, modalMan, targetBoxHtml) => {

			// console.log(document.getElementById('menu_create_connection'))

			// console.log(localStorage)	
			// console.log(modalMan)	
			// console.log(targetBoxHtml)	


			targetBoxHtml.innerHTML += "<br>"
			//targetBoxHtml.innerHTML += `<div class="text-3xl">`

			for( const key in localStorage) {

				// console.log(key)

				// console.log(localStorage[key])

				if(key.includes('-') && !key.includes('_') ) {
					//targetBoxHtml.innerHTML += `<h2 class="py-10 text-3xl">${key}</h2>`

					targetBoxHtml.innerHTML += `
												<label>${key}</label>
												<input type="text"></input><br>
											   `

				}


			}
			//targetBoxHtml.innerHTML += "</div>"

		}



		this.createTable = () => {

			`



			`


		}









	}




}


export { ConnectionManager }
