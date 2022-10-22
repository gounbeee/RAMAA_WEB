'use strict'


class State {


  constructor(name) {
    //-// console.log('%%  State.js : State CONSTRUCTOR EXECUTED')
    this.name = name
    // MAKING THE INPUT SYMBOL TO 'FREEZED ONE' !
    this.state = Object.freeze(Symbol(name))
    //-// console.log( `%%  State.js : THE STATE CREATED --  ${name}` )

  }


  update() {
    //-// console.log('%%  State.js : update FUNCTION EXECUTED')


  }


  // RENDER ELEMENT 'IF IT IS UPDATED'
  render() {
    //-// console.log('%%  State.js : render FUNCTION EXECUTED')


  }



  onEnter() {
    //-// console.log(`%%  State.js : onEnter FUNCTION OF ==  ${this.name}  ==  EXECUTED`)

  }


  onExit() {
    //-// console.log(`%%  State.js : onExit FUNCTION OF ==  ${this.name}  == EXECUTED`)


  }




}





export {State}
