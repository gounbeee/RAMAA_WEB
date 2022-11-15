'strict mode'




class PointerInput {
	
  constructor(settings) {

    this.id = -1

    this.targetElem = settings.target

    this.penPressure = 1.0


	  this.process_id = (event) => {
	    // Process this event based on the event's identifier
	    // console.log(event)


	  }


	  this.process_mouse = (event) => {
	    // Process the mouse pointer event
			// console.log(event)
			this.penPressure = 1.0

	  }


	  this.process_pen = (event) => {
	    // Process the pen pointer event
	    // console.log(event)

	  }



	  this.process_touch = (event) => {
	    // Process the touch pointer event
	    // console.log(event)



	  }



	  this.process_tilt = (tiltX, tiltY) => {
	    // Tilt data handler
	    // console.log(tiltX)
	    // console.log(tiltY)



	  }




	  this.process_pressure = (pressure) => {
	    // Pressure handler
	    // console.log(pressure)



	  }



	  this.process_non_primary = (event) => {
	    // Non primary handler
	    // console.log(event)


	  }



		this.move_handler = (ev) => {
		  // Calculate the touch point's contact area
		  var area = ev.width * ev.height;

		  // Compare cached id with this event's id and process accordingly
		  if (this.id == ev.identifier) this.process_id(ev);

		  // Call the appropriate pointer type handler
		  switch (ev.pointerType) {
		    case "mouse":
		      this.process_mouse(ev);
		      break;
		    case "pen":
		      this.process_pen(ev);
		      break;
		    case "touch":
		      this.process_touch(ev);
		      break;
		    default:
		      console.log("pointerType " + ev.pointerType + " is Not supported");
		  }

		  // Call the tilt handler
		  if (ev.tiltX != 0 && ev.tiltY != 0) this.process_tilt(ev.tiltX, ev.tiltY);

		  // Call the pressure handler
		  this.process_pressure(ev.pressure);

		  this.penPressure = ev.pressure

		  // If this event is not primary, call the non primary handler
		  if (!ev.isPrimary) this.process_non_primary(ev);


		}


    // Register pointerdown handler
    this.targetElem.addEventListener('pointermove',this.move_handler, false)





  }






	remove() {

		this.targetElem.removeEventListener('pointermove',this.down_handler)



	}



}

export {PointerInput}