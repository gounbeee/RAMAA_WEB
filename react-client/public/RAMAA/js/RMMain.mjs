'use strict'


import { StateMachine }       from "./StateMachine.mjs"
import { State }              from "./State.mjs"
import { StateEditting }      from "./StateEditting.mjs"





class RMMain {


  constructor() {
    //-// console.log('%% RMMain.mjs :: RMMain CONSTRUCTOR EXECUTED')

    const instance = this.constructor.instance
    if( instance ) {
      return instance
    }
    this.constructor.instance = this

  }


  initialize(){
    //-// console.log('%% RMMain.mjs :: initialize FUNCTION EXECUTED')

    // -------------------------------------------
    // SETTING STATES
    this.stateList = {
      NOSTATE:          new State("nostate"),
      DEMO:             new State("demo"),
      LOGGEDIN:         new State("loggedin"),
      LOGGEDOUT:        new State("loggedout"),
      SIGNINGUP:        new State("signingup"),
      LOADDATABASE:     new State("loaddatabase"),
      EDITTING:         new StateEditting("editting"),
      QUITTING:         new State("quitting")
    }


    // ======================================================================
    // STATE MACHINE
    this.stateMachine = new StateMachine()
    this.stateMachine.initialize(this.stateList)
    this.stateMachine.changeState('NOSTATE')

    //this.stateMachine.changeState('LOADDATABASE')


    this.demo = false  // TODO : CHANGE THIS LATER !


    // ERROR HANDLING FOR WINDOW
    window.onError = function(error){
			console.error(JSON.stringify(error))
		}


    //-// console.log('%% RMMain.mjs :: RMMain INITIALIZATION OK')



    if ( this.demo ) {
      //this.state.currentState= 'DEMO'

      // DEMO DISPLAY ON
      //let dmDisp = document.getElementById('demoDisplay')
      //dmDisp.style.display = 'block'

      // DEMO PLAYING

      // 1 GETTING DEMO WALKER FROM SERVER
      // 2 DISPLAYING SOME TUTORIAL THINGS



    } else {

      this.stateMachine.changeState('EDITTING')   // TODO :: FIX THIS TO MOVING
      //this.stateMachine.changeState('MOVING')   // TODO :: FIX THIS TO MOVING
      //this.stateMachine.changeState('PRESENTATION')   // TODO :: FIX THIS TO MOVING



    }



  }




}


export {RMMain}
