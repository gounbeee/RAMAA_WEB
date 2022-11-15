'use strict'


// THIS CLASS DEFINES THE HTML AND
class ModalBox {

  constructor(setting) {

    //-// console.log('%% ModalBox.js :: ModalBox CONSTRUCTOR EXECUTED')

    // < LOGICAL OR WITH FUNCTIONS >
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_OR
    //
    // :: function A(){ //-// console.log('called A'); return false; }     X
    //    function B(){ //-// console.log('called B'); return true; }      O
    //
    //    //-// console.log( B() || A() );                                 O
    //
    //    1. LOGS "called B" due to the function call,
    //    2. then LOGS "true" (which is the resulting value of the operator)
    //
    // :: SO IF setting OBJECT HAS cb (CALLBACK FUNCTION),
    //    IT WILL BE EXECUTED AND this.callback WILL BE 'true'
    // this.confirm = setting.confirm || function() {}
    // this.decline = setting.decline  || function() {}


    // SETTING DOMS
    this.elRoot = document.createElement("div")
    // MAKE THE DOM HIDDEN WITH CSS
    this.elRoot.classList.add("modal", "hidden")
    this.boxHtml = document.createElement("div")

    // setting IS OBJECT WHICH IS CONSISTED OF { html: , js: }
    this.boxHtml.innerHTML = setting.html
    this.boxHtml.classList.add("modal-item")
    this.elRoot.appendChild(this.boxHtml)

    // IF THE OTHER PLACE IS CLICKED,
    // HIDE THE  DIALOG BOX
    this.hideBox = (ev) =>{
      this.elRoot.classList.add("hidden")
    }
    this.elRoot.addEventListener('click', this.hideBox)

    // WHEN CLICKED DIALOG BOX ITSELF
    this.showBox = (ev) => {
      ev.stopPropagation()
    }
    this.boxHtml.addEventListener('click', this.showBox)

    document.getElementById("ramaaApp").appendChild(this.elRoot)

    
    // EXECUTE INITIALIZE FUNTCION IF SETTINGS HAVE
    if(setting.initialize !== undefined) {
      setting.initialize(this)
    }


    // SETTING EVENT LISTENERS
    if(setting.buttons !== undefined) {
      if(Object.keys(setting.buttons).length > 0 ) {
        for(let btnName in setting.buttons) {
          // CREATING EVENT LISTENER FOR BUTTONS
          document.getElementById(btnName).addEventListener('click', setting.buttons[btnName])
        }  
      }
    }







    
  }


  open() {
    this.elRoot.classList.remove("hidden")
  }


  confirm(callback) {
    if(callback) {
      callback()

      this.close()
    }

  }


  close () {

    this.hideBox()

  }


  remove() {
    this.elRoot.removeEventListener('click', this.hideBox)
    this.boxHtml.removeEventListener('click', this.showBox)


    this.boxHtml.remove()
    this.elRoot.remove()


  }


}


export {ModalBox}
