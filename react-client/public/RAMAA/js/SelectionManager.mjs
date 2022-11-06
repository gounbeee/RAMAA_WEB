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


		document.getElementById('ramaaApp_overlay').addEventListener('updateSelectBox', (ev) => {

			//console.log("UPDATING SELECT BOX ARRIVED !!!!")
			//console.log(ev.target)
			//console.log(ev.detail)


			this.updateOverlayBox(ev)

		})

	}


	add(obj) {


		//console.log("ADDING TO LIST")
		//console.log(obj.groupId)

		gl_SELECTEDLIST[obj.groupId] = obj


		//console.log("gl_SELECTEDLIST IS")
		//console.log(gl_SELECTEDLIST)

	}


	removeFromList(obj) {


		if(this.selectedList) {
			//console.log("DELETE FROM LIST")
			//console.log(obj)
			delete gl_SELECTEDLIST[obj.groupId]
		}

		//console.log("gl_SELECTEDLIST IS")
		//console.log(gl_SELECTEDLIST)

	}



	drawOverlayBox() {

		//console.log("drawOverlayBox EXECUTED")

		//console.log(gl_SELECTEDLIST)

		for( let grpId in gl_SELECTEDLIST ) {
			//console.log(gl_SELECTEDLIST[grpId])

			//console.log(this.svgDom)
			let overlayBoxCoords = gl_SELECTEDLIST[grpId].boundBoxCoords

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
			this.overlayBoxList[grpId].style.zIndex = '5';

			// < POINTER EVENT NONE --> TRANSPARENTLY CLICKABLE >
			//https://stackoverflow.com/questions/16492401/javascript-setting-pointer-events
			this.overlayBoxList[grpId].style.pointerEvents = 'none';

			document.getElementById('ramaaApp_overlay').appendChild(this.overlayBoxList[grpId])

			//console.log(this.overlayBoxList[grpId])

		}

  	}



  	updateOverlayBox(ev) {

  		//console.log("updateOverlayBox")
  		//console.log(ev)

   		const selectBox = document.getElementById(ev.detail.obj.groupId + '_bbox')

   		//console.log(ev.detail.obj.textAreaObject.posX)

		const canvasPosX = parseInt(document.getElementById('canvas_dom').getAttribute('data-x-saved'))
		const canvasPosY = parseInt(document.getElementById('canvas_dom').getAttribute('data-y-saved'))


		selectBox.style.top = `${ev.detail.obj.textAreaObject.posY + ev.detail.obj.svgDom.getBBox().y + canvasPosY}px`;
		selectBox.style.left = `${ev.detail.obj.textAreaObject.posX + canvasPosX}px`;
		selectBox.style.width = `${ev.detail.obj.svgDom.getBBox().width}px`;
		selectBox.style.height = `${ev.detail.obj.svgDom.getBBox().height}px`;


  	}



  	deleteOverlayBox() {
  		this.overlayBoxList = {}
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
