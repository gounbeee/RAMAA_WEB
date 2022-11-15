'use strict'


import {State} from "./State.js"


class StateMachine {

  constructor() {
    //-// console.log('%% StateMachine.js :: StateMachine CONSTRUCTOR EXECUTED')

    const instance = this.constructor.instance
    if( instance ) {
      return instance
    }
    this.constructor.instance = this
  }


  initialize(stateObjs) {
    //-// console.log('%% StateMachine.js :: initialize FUNCTION EXECUTED')
    this.stateList = {};
    this.stateStack = [];


    // ITERATION FOR OBJECT
    // https://flaviocopes.com/how-to-iterate-object-properties-javascript/
    let count = 0;
    for( const obj in stateObjs) {
      this.stateList[obj] = stateObjs[obj]
      count++
    }
  }



  getCurrentState() {
    //-// console.log(`%%  StateMachine.js : getCurrentState FUNCTION -- CURRENT --- ${this.stateStack[0].name}`)

    if( this.stateStack.length > 0) return this.stateStack[0]
    else {
      //-// console.log('%% StateMachine.js :: THERE IS NO STATE !!!!')
    }
  }


  changeState(key, SCENEINDEX, SHIFTKEYPRESSED, SELECTEDLIST) {
    //-// console.log("====================")
    //-// console.log('%% StateMachine.js :: changeState FUNCTION EXECUTED')

    // IF THERE IS NO ELEMENT IN ARRAY,
    // PUSH THE STATE AND RUN
    if( this.stateStack.length < 1 ) {

      this.pushState(this.stateList[key])

    } else {
      // OR THERE IS ONE,
      // FIRST, POP THE STATE THEN PUSH THE NEW ONE
      for( const st of this.stateStack ) st.onExit()
      for(let i = 0 ; i < this.stateStack.length ; i++ ) this.popState()

      this.pushState(this.stateList[key])

    }

    this.stateList[key].onEnter(SCENEINDEX, SHIFTKEYPRESSED, SELECTEDLIST)

    //-// console.log(`%% StateMachine.js :: CURRENT STATE IS --->  ${key}`)

  }



  pushState(state) {
    //-// console.log('%% StateMachine.js :: pushState FUNCTION EXECUTED')
    this.stateStack.push(state)
  }



  // POP ALL STATES WE HAVE
  popState() {
    //-// console.log('%% StateMachine.js :: popState FUNCTION EXECUTED')

    this.stateStack.pop()
  }



  // UPDATE THE CURRENT STATE
  update() {
    //-// console.log('%% StateMachine.js :: update FUNCTION EXECUTED')
    if( this.stateStack.length > 0) this.stateStack[0].update()
  }


  // RENDER STATE 'IF IT IS UPDATED'
  render() {
    //-// console.log('%% StateMachine.js :: render FUNCTION EXECUTED')
    if( this.stateStack.length > 0) this.stateStack[0].render()
  }

}




export {StateMachine}
