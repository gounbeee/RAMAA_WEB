'use strict'


import {State} from "./State.mjs"


class StateMachine {

  constructor() {
    //-// console.log('%% StateMachine.mjs :: StateMachine CONSTRUCTOR EXECUTED')

    const instance = this.constructor.instance
    if( instance ) {
      return instance
    }
    this.constructor.instance = this
  }


  initialize(stateObjs) {
    //-// console.log('%% StateMachine.mjs :: initialize FUNCTION EXECUTED')
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
      //-// console.log('%% StateMachine.mjs :: THERE IS NO STATE !!!!')
    }
  }


  changeState(key) {
    //-// console.log("====================")
    //-// console.log('%% StateMachine.mjs :: changeState FUNCTION EXECUTED')

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

    this.stateList[key].onEnter()

    //-// console.log(`%% StateMachine.mjs :: CURRENT STATE IS --->  ${key}`)

  }



  pushState(state) {
    //-// console.log('%% StateMachine.mjs :: pushState FUNCTION EXECUTED')
    this.stateStack.push(state)
  }



  // POP ALL STATES WE HAVE
  popState() {
    //-// console.log('%% StateMachine.mjs :: popState FUNCTION EXECUTED')

    this.stateStack.pop()
  }



  // UPDATE THE CURRENT STATE
  update() {
    //-// console.log('%% StateMachine.mjs :: update FUNCTION EXECUTED')
    if( this.stateStack.length > 0) this.stateStack[0].update()
  }


  // RENDER STATE 'IF IT IS UPDATED'
  render() {
    //-// console.log('%% StateMachine.mjs :: render FUNCTION EXECUTED')
    if( this.stateStack.length > 0) this.stateStack[0].render()
  }

}




export {StateMachine}
