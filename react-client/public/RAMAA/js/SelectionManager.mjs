'use strict'

import { Security }         from "./Security.mjs"
import { LocalStorage }     from "./LocalStorage.mjs"




class SelectionManager {

	constructor(settings, stateObj) {

		console.log('%% SelectionManager.mjs :: SelectionManager CONSTRUCTOR EXECUTED')


		this.overlayBoxList = {}


		// this.overlayBoxDom
		// this.overlayBoxCoords = {
		//   x: 0,
		//   y: 0,
		//   width:0,
		//   height:0
		// }

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



	drawOverlayBox() {

		console.log("drawOverlayBox EXECUTED")

		console.log(gl_SELECTEDLIST)

		for( let grpId in gl_SELECTEDLIST ) {
			console.log(gl_SELECTEDLIST[grpId])

			//console.log(this.svgDom)
			let overlayBoxCoords = gl_SELECTEDLIST[grpId].boundBoxCoords
			// overlayBoxCoords.x = parseInt(gl_SELECTEDLIST[grpId].svgDom.getAttribute('x'))
			// overlayBoxCoords.y = parseInt(gl_SELECTEDLIST[grpId].svgDom.getAttribute('y'))
			// overlayBoxCoords.width = gl_SELECTEDLIST[grpId].svgDom.getBBox().width
			// overlayBoxCoords.height = gl_SELECTEDLIST[grpId].svgDom.getBBox().height


			this.overlayBoxList[grpId] = document.createElement('div')

			const canvasPosX = parseInt(document.getElementById('canvas_dom').getAttribute('data-x-saved'))
			const canvasPosY = parseInt(document.getElementById('canvas_dom').getAttribute('data-y-saved'))

			this.overlayBoxList[grpId].id = gl_SELECTEDLIST[grpId].groupId + '_bbox'
			this.overlayBoxList[grpId].style.position = 'fixed';
			this.overlayBoxList[grpId].style.top = `${overlayBoxCoords.y + canvasPosY }px`;
			this.overlayBoxList[grpId].style.left = `${overlayBoxCoords.x + canvasPosX }px`;
			this.overlayBoxList[grpId].style.width = `${overlayBoxCoords.width}px`;
			this.overlayBoxList[grpId].style.height = `${overlayBoxCoords.height}px`;


			//this.overlayBoxList[grpId].style.background = '#FF3322';
			this.overlayBoxList[grpId].style.color = 'black';
			this.overlayBoxList[grpId].style.border = "medium solid #AAEE66";
			this.overlayBoxList[grpId].style.padding = '20px';
			this.overlayBoxList[grpId].style.zIndex = '50';

			document.getElementById('ramaaApp_overlay').appendChild(this.overlayBoxList[grpId])

			console.log(this.overlayBoxList[grpId])

			// // ADDING EVENT LISTENER TO DELETE WHEN CLICKED
			// this.overlayBoxList[grpId].addEventListener('mouseclick', (ev) => {
			// 	console.log("CLICKED")
			// 	document.getElementById(gl_SELECTEDLIST[grpId].groupId).remove()

			// })


		}

  	}



  	updateOverlayBox() {

  		//gl_SELECTEDLIST = {}

  // 		for( let grpId in gl_SELECTEDLIST ) {

  // 			let transform = {

	 //            x: parseInt(gl_SELECTEDLIST[grpId].svgDom.getAttribute('x')),
	 //            y: parseInt(gl_SELECTEDLIST[grpId].svgDom.getAttribute('y')),
	 //            width: gl_SELECTEDLIST[grpId].svgDom.getBBox().width,
	 //            height: gl_SELECTEDLIST[grpId].svgDom.getBBox().height
		// 	}	


		// 	let overlayBoxCoords = gl_SELECTEDLIST[grpId].boundBoxCoords

		// 	// BEFORE SETTING UP BOUNDING BOX, WE WILL GET CANVAS'S POSITION
		// 	const canvasPosX = parseInt(document.getElementById('canvas_dom').getAttribute('data-x-saved'))
		// 	const canvasPosY = parseInt(document.getElementById('canvas_dom').getAttribute('data-y-saved'))

		// 	this.overlayBoxDom.style.top = `${transform.y + canvasPosY }px`;
		// 	this.overlayBoxDom.style.left = `${transform.x + canvasPosX }px`;
		// 	this.overlayBoxDom.style.width = `${transform.width}px`;
		// 	this.overlayBoxDom.style.height = `${transform.height}px`;


		// 	// this.overlayBoxDom.style.top = `${transform.y - (this.overlayBoxCoords.height*0.25/2) + canvasPosY }px`;
		// 	// this.overlayBoxDom.style.left = `${transform.x - (this.overlayBoxCoords.width*0.25/2) + canvasPosX }px`;
		// 	// this.overlayBoxDom.style.width = `${transform.width * 1.25}px`;
		// 	// this.overlayBoxDom.style.height = `${transform.height * 1.25}px`;

		// }

  	}


  	deleteOverlayBox() {

  		const parent = document.getElementById('ramaaApp_overlay')

	    while (parent.firstChild) {
	    	// console.log(parent.firstChild.tagName)
	    	// if(parent.firstChild.tagName !== 'svg') {
	    		parent.removeChild(parent.firstChild);
	    	// } 
	    }
		gl_SELECTEDLIST = {}

  	}










}


export { SelectionManager }
