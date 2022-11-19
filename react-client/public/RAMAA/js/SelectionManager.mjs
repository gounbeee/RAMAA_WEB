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

			// console.log("UPDATING SELECT BOX ARRIVED !!!!")
			// console.log(ev.target)
			// console.log(ev.detail)

			this.updateSelectingObj(ev)



		})


	}


	// ADDING OBJECT TO SELECTING LIST
	add(obj) {

		this.deleteDuplicated()

		//console.log("ADDING TO LIST")
		//console.log(obj.groupId)

		gl_SELECTEDLIST[obj.groupId] = obj


		//console.log("gl_SELECTEDLIST IS")
		//console.log(gl_SELECTEDLIST)

	}



	updateSelectingObj(ev) {
		//console.log("UPDATING SELECTING OBJ")
		//console.log(ev.detail.obj.groupId)
		//console.log(ev)

		this.deleteDuplicated()

   		const panScl = parseFloat(document.getElementById('zoom_select').dataset.panScaler)
        //console.log( 1 / panScl )


		//console.log(this.overlayBoxList)
		//console.log(this.overlayBoxList[ev.detail.obj.groupId])
		//console.log(gl_SELECTEDLIST[ev.detail.obj.groupId])


		const canvasPosX = parseInt(document.getElementById('canvas_dom').getAttribute('data-x-saved'))
		const canvasPosY = parseInt(document.getElementById('canvas_dom').getAttribute('data-y-saved'))



		this.overlayBoxList[ev.detail.obj.groupId].style.top    = `${(gl_SELECTEDLIST[ev.detail.obj.groupId].textAreaObject.posY + ev.detail.obj.svgDom.getBBox().y + canvasPosY) * ( 1 / panScl ) }px`;
		this.overlayBoxList[ev.detail.obj.groupId].style.left   = `${(gl_SELECTEDLIST[ev.detail.obj.groupId].textAreaObject.posX + canvasPosX) * ( 1 / panScl ) }px`;
		this.overlayBoxList[ev.detail.obj.groupId].style.width  = `${gl_SELECTEDLIST[ev.detail.obj.groupId].svgDom.getBBox().width * ( 1 / panScl ) }px`;
		this.overlayBoxList[ev.detail.obj.groupId].style.height = `${gl_SELECTEDLIST[ev.detail.obj.groupId].svgDom.getBBox().height * ( 1 / panScl ) }px`;


	}





	deleteDuplicated() {

		const container = document.getElementById('ramaaApp_overlay')

	    // DELETE ALL line ELEMENTS
	    for( let obj of container.children ) {
			
					// SEARCHING AND COUNTING DUPLICATION
	    	let counter = 0
	    	let collector = []

	    	for( let objSearch of container.children ) {
	    		if(obj.getAttribute('id') === objSearch.getAttribute('id')) {
	    			counter++
	    			collector.push(objSearch)

	    			//console.log("SAME ID APPEARED !!")
	    			//console.log(objSearch.getAttribute('id'))
	    		}
	    	}

	    	//console.log('counter')
	    	//console.log(counter)
	    	//console.log('collector')
	    	//console.log(collector)

	    	// DELETE LEAVE 1 OBJECT (DO NOT ENTIRE DOM!)
	    	// counter -1 MEANS --> WE 
	    	if(counter > 1) {
	    		//console.log("DELETE DUPLICATION !!!!")
	    		//console.log(document.getElementById(obj.getAttribute('id')))

	    		for( let i=0; i < collector.length; i++) {
	    			//console.log("DELETING...")
	    			//console.log(collector[i])

	    			// WITH OUR SELECTION PATTERN,
	    			// THE DOM OBJECTS EXCEPT INDEX NUMBER 0, WILL BE DUPLECATED OBJECT
	    			// SO WE DELETE THEM

	    			if(i>0) collector[i].remove()
	    		}

	    	}

	    }

	}



	removeSelectingObjsAll() {

		if(Object.keys(this.overlayBoxList).length > 0 ) {

			for( let grpId in this.overlayBoxList ) {

				this.overlayBoxList[grpId].remove()

			}
		}
	
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
   		const panScl = parseFloat(document.getElementById('zoom_select').dataset.panScaler)
        //console.log( 1 / panScl )


		for( let grpId in gl_SELECTEDLIST ) {
			//console.log(gl_SELECTEDLIST[grpId])

			//console.log(this.svgDom)
			let overlayBoxCoords = gl_SELECTEDLIST[grpId].boundBoxCoords

			this.overlayBoxList[grpId] = document.createElement('div')

			const canvasPosX = parseInt(document.getElementById('canvas_dom').getAttribute('data-x-saved'))
			const canvasPosY = parseInt(document.getElementById('canvas_dom').getAttribute('data-y-saved'))

			//console.log(`canvasPosX   ::   ${canvasPosX}`)
			//console.log(`canvasPosY   ::   ${canvasPosY}`)

			this.overlayBoxList[grpId].id = gl_SELECTEDLIST[grpId].groupId + '_bbox'
			this.overlayBoxList[grpId].style.position = 'fixed';
			this.overlayBoxList[grpId].style.top    = `${(overlayBoxCoords.y + canvasPosY * panScl ) * ( 1 / panScl ) }px`;
			this.overlayBoxList[grpId].style.left   = `${(overlayBoxCoords.x + canvasPosX * panScl ) * ( 1 / panScl ) }px`;
			this.overlayBoxList[grpId].style.width  = `${overlayBoxCoords.width  * ( 1 / panScl ) }px`;
			this.overlayBoxList[grpId].style.height = `${overlayBoxCoords.height * ( 1 / panScl ) }px`;


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
