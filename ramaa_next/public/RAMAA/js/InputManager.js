'use strict'

import { Security }         from "./Security.js"
import { LocalStorage }     from "./LocalStorage.js"

let gl_SHIFTKEYPRESSED = undefined;


class InputManager {

	constructor(settings, stateObj) {

		console.log('%% InputManager.js :: InputManager CONSTRUCTOR EXECUTED')



		this.selectedList = {}


		this.currentKeyPressed


		this.isShiftPressed = false


		this.isShiftKeyCheck = () => {

			if(this.currentKeyPressed === 'ShiftLeft' || this.currentKeyPressed === 'ShiftRight') {
				this.isShiftKeyPressed = true
				gl_SHIFTKEYPRESSED = true
				console.log(`gl_SHIFTKEYPRESSED   IS     ->    ${gl_SHIFTKEYPRESSED}`)
				return true
			} else {
				this.isShiftKeyPressed = false
				gl_SHIFTKEYPRESSED = undefined
				console.log(`gl_SHIFTKEYPRESSED   IS     ->    ${gl_SHIFTKEYPRESSED}`)
				return false
			}
		}



	}







	onGlobalKeyCheck() {

		document.addEventListener('keydown', (event)=> {    
		    // console.log(event); // all event related info
		    // console.log(event.type);
		    // console.log(event.key);
		    //console.log(event.code);

		    this.currentKeyPressed = event.code

		    this.isShiftKeyCheck() 

		    console.log(this.currentKeyPressed)
		});

		document.addEventListener('keyup', (event)=> {
		    // console.log(event); // all event related info
		    // console.log(event.type);
		    // console.log(event.key);
		    //console.log(event.code);

		    if (this.currentKeyPressed === event.code ) this.currentKeyPressed = undefined

			this.isShiftKeyCheck() 

		    console.log(this.currentKeyPressed)

		});


	}



}


export { InputManager }
