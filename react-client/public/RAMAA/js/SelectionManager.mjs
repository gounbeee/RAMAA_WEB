'use strict'

import { Security }         from "./Security.mjs"
import { LocalStorage }     from "./LocalStorage.mjs"




class SelectionManager {

	constructor(settings, stateObj) {

		console.log('%% SelectionManager.mjs :: SelectionManager CONSTRUCTOR EXECUTED')



	}


	add(obj) {


		console.log("ADDING TO LIST")
		console.log(obj.groupId)

		gl_SELECTEDLIST[obj.groupId] = obj


		console.log("gl_SELECTEDLIST IS")
		console.log(gl_SELECTEDLIST)

	}


	removeFromList(obj) {


		if(this.selectedList) {
			console.log("DELETE FROM LIST")
			//console.log(obj)
			delete gl_SELECTEDLIST[obj.groupId]
		}

		console.log("gl_SELECTEDLIST IS")
		console.log(gl_SELECTEDLIST)

	}


}


export { SelectionManager }
