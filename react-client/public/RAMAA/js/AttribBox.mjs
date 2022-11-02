' use strict'

import { SliderIndicator }      from "./SliderIndicator.mjs"
import { StateEditting }        from "./StateEditting.mjs"



class AttribBox {

  constructor() {
    //-// console.log('%% AttribBox.mjs :: AttribBox CONSTRUCTOR EXECUTED')

    this.groupId = undefined
    this.textAreaHtmlSource = undefined
    this.rectHtmlSource = undefined
    this.arrowHtmlSource = undefined
    this.ballHtmlSource = undefined
    this.HtmlSource = undefined
    this.localTimeline = undefined
    this.rootDom = document.getElementById("attribManager_wrapper")
    this.elRoot = document.createElement("div")
    this.elRoot.setAttribute('id', 'attribManager_inner_' + this.groupId)
    this.rootDom.appendChild(this.elRoot)
    this.timelineLocalWrapper = document.getElementById('timeline_local_wrapper')

    // CLASS MEMBER TO INDICATE TYPES OF SHAPE
    this.allShapeTypes = ['textarea', 'rect', 'arrow', 'ball', 'bitmap']
    this.currentShapeType = undefined


    // DOM SETTINGS
    // BUTTON SETTING
    this.domCfgs = {
      textarea:
        {
        input_1: { id: "attr_textarea_x",
                   attr: "x",
                   evHandles:
                   {
                     mousedown: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                     mouseover: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                     //blur: (ev) => {this.removeLocalTimeline(this.groupId, ev.target.id)}
                   },
                   markers: []
                 },
        input_2: { id: "attr_textarea_y",
                  attr: "y",
                  evHandles:
                  {
                    mousedown: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    mouseover: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    //blur: (ev) => {this.removeLocalTimeline(this.groupId, ev.target.id)}
                  },
                  markers: []
                },
        input_3: { id: "attr_textarea_pos_key_time",
                  attr: "time",
                  evHandles:
                  {
                  },
                  markers: []
                },
        input_4: { id: "attr_textarea_fill",
                  attr: "fill",
                  evHandles:
                  {
                    mousedown: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    mouseover: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    //blur: (ev) => {this.removeLocalTimeline(this.groupId, ev.target.id)}
                  },
                  markers: []
                },
        input_5: { id: "attr_textarea_fill_key_time",
                  attr: "time",
                  evHandles:
                  {
                  },
                  markers: []
                },
        input_6: { id: "attr_textarea_opacity",
                  attr: "opacity",
                  evHandles:
                  {
                    mousedown: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    mouseover: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    //blur: (ev) => {this.removeLocalTimeline(this.groupId, ev.target.id)}
                  },
                  markers: []
                },
        input_7: { id: "attr_textarea_opacity_key_time",
                  attr: "time",
                  evHandles:
                  {
                  },
                  markers: []
                },
        input_8: { id: "attr_textarea_content_key_time",
                  attr: "time",
                  evHandles:
                  {
                  },
                  markers: []
                },
        input_9: { id: "attr_textarea_textContent",
                  attr: "textContent",
                  evHandles:
                  {
                    mousedown: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    mouseover: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    //blur: (ev) => {this.removeLocalTimeline(this.groupId, ev.target.id)}
                  },
                  markers: []
                },
        input_10: { id: "attr_textarea_fontFamily",
                  attr: "fontFamily",
                  evHandles:
                  {
                    mousedown: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    mouseover: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    //blur: (ev) => {this.removeLocalTimeline(this.groupId, ev.target.id)}
                  },
                  markers: []
                },
        button_1: { id: "attr_textarea_pos_key",
                  attr: "key_posistion",
                  evHandles:
                  {
                    click: (ev) => {this.setKeybutton_pos(ev.target.id)}
                  }
                },
        button_2: { id: "attr_textarea_fill_key",
                  attr: "key_fill",
                  evHandles:
                  {
                    click: (ev) => {this.setKeybutton_color(ev.target.id)}
                  }
                },
        button_3: { id: "attr_textarea_content_key",
                  attr: "key_textContent",
                  evHandles:
                  {
                    click: (ev) => {this.setKeybutton_textContent(ev.target.id)}
                  }
                },
        button_4: { id: "attr_textarea_opacity_key",
                  attr: "key_opacity",
                  evHandles:
                  {
                    click: (ev) => {this.setKeybutton_opacity(ev.target.id)}
                  }
                },
        button_5: { id: "attr_textarea_delete",
                  attr: "delete",
                  evHandles:
                  {
                    click: (ev) => {this.setDeletebutton(ev.target.id)}
                  }
                },
        button_6: { id: "attr_textarea_fontFamily_key",
                  attr: "key_fontFamily",
                  evHandles:
                  {
                    click: (ev) => {this.setKeybutton_fontFamily(ev.target.id)}
                  }
                },
        button_7: { id: "attr_textarea_duplicate",
                  attr: "duplicate",
                  evHandles:
                  {
                    click: (ev) => {this.setDuplicatebutton(ev.target.id)}
                  }
                },
        },

      rect:
        {
        input_1: { id: "attr_rect_x",
                   attr: "x",
                   evHandles:
                   {
                     mousedown: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                     mouseover: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                     //blur: (ev) => {this.removeLocalTimeline(this.groupId, ev.target.id)}
                   },
                   markers: []
                 },
        input_2: { id: "attr_rect_y",
                  attr: "y",
                  evHandles:
                  {
                    mousedown: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    mouseover: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    //blur: (ev) => {this.removeLocalTimeline(this.groupId, ev.target.id)}
                  },
                  markers: []
                },
        input_3: { id: "attr_rect_pos_key_time",
                  attr: "time",
                  evHandles:
                  {
                  },
                  markers: []
                },
        input_4: { id: "attr_rect_width",
                  attr: "width",
                  evHandles:
                  {
                    mousedown: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    mouseover: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    //blur: (ev) => {this.removeLocalTimeline(this.groupId, ev.target.id)}
                  },
                  markers: []
                },
        input_5: { id: "attr_rect_height",
                  attr: "height",
                  evHandles:
                  {
                    mousedown: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    mouseover: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    //blur: (ev) => {this.removeLocalTimeline(this.groupId, ev.target.id)}
                  },
                  markers: []
                },
        input_6: { id: "attr_rect_widhgt_key_time",
                  attr: "time",
                  evHandles:
                  {
                  },
                  markers: []
                },
        input_7: { id: "attr_rect_fill",
                  attr: "fill",
                  evHandles:
                  {
                    mousedown: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    mouseover: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    //blur: (ev) => {this.removeLocalTimeline(this.groupId, ev.target.id)}
                  },
                  markers: []
                },
        input_8: { id: "attr_rect_fill_key_time",
                  attr: "time",
                  evHandles:
                  {
                  },
                  markers: []
                },
        input_9: { id: "attr_rect_opacity",
                  attr: "opacity",
                  evHandles:
                  {
                    mousedown: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    mouseover: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    //blur: (ev) => {this.removeLocalTimeline(this.groupId, ev.target.id)}
                  },
                  markers: []
                },
        input_10: { id: "attr_rect_opacity_key_time",
                  attr: "time",
                  evHandles:
                  {
                  },
                  markers: []
                },
        button_1: { id: "attr_rect_pos_key",
                  attr: "key_posistion",
                  evHandles:
                  {
                    click: (ev) => {this.setKeybutton_pos(ev.target.id)}
                  }
                },
        button_2: { id: "attr_rect_widhgt_key",
                  attr: "key_size",
                  evHandles:
                  {
                    click: (ev) => {this.setKeybutton_widhgt(ev.target.id)}
                  }
                },
        button_3: { id: "attr_rect_fill_key",
                  attr: "key_fill",
                  evHandles:
                  {
                    click: (ev) => {this.setKeybutton_color(ev.target.id)}
                  }
                },
        button_4: { id: "attr_rect_opacity_key",
                  attr: "key_opacity",
                  evHandles:
                  {
                    click: (ev) => {this.setKeybutton_opacity(ev.target.id)}
                  }
                },
        button_5: { id: "attr_rect_delete",
                  attr: "delete",
                  evHandles:
                  {
                    click: (ev) => {this.setDeletebutton(ev.target.id)}
                  }
                },
        button_6: { id: "attr_rect_duplicate",
                  attr: "duplicate",
                  evHandles:
                  {
                    click: (ev) => {this.setDuplicatebutton(ev.target.id)}
                  }
                },
        },

      bitmap:
        {
        input_1: { id: "attr_bitmap_x",
                   attr: "x",
                   evHandles:
                   {
                     mousedown: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                     mouseover: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                     //blur: (ev) => {this.removeLocalTimeline(this.groupId, ev.target.id)}
                   },
                   markers: []
                 },
        input_2: { id: "attr_bitmap_y",
                  attr: "y",
                  evHandles:
                  {
                    mousedown: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    mouseover: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    //blur: (ev) => {this.removeLocalTimeline(this.groupId, ev.target.id)}
                  },
                  markers: []
                },
        input_3: { id: "attr_bitmap_pos_key_time",
                  attr: "time",
                  evHandles:
                  {
                  },
                  markers: []
                },
        input_4: { id: "attr_bitmap_width",
                  attr: "width",
                  evHandles:
                  {
                    mousedown: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    mouseover: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    //blur: (ev) => {this.removeLocalTimeline(this.groupId, ev.target.id)}
                  },
                  markers: []
                },
        input_5: { id: "attr_bitmap_height",
                  attr: "height",
                  evHandles:
                  {
                    mousedown: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    mouseover: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    //blur: (ev) => {this.removeLocalTimeline(this.groupId, ev.target.id)}
                  },
                  markers: []
                },
        input_6: { id: "attr_bitmap_widhgt_key_time",
                  attr: "time",
                  evHandles:
                  {
                  },
                  markers: []
                },
        input_7: { id: "attr_bitmap_opacity",
                  attr: "opacity",
                  evHandles:
                  {
                    mousedown: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    mouseover: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    //blur: (ev) => {this.removeLocalTimeline(this.groupId, ev.target.id)}
                  },
                  markers: []
                },
        input_8: { id: "attr_bitmap_opacity_key_time",
                  attr: "time",
                  evHandles:
                  {
                  },
                  markers: []
                },
        button_1: { id: "attr_bitmap_pos_key",
                  attr: "key_posistion",
                  evHandles:
                  {
                    click: (ev) => {this.setKeybutton_pos(ev.target.id)}
                  }
                },
        button_2: { id: "attr_bitmap_widhgt_key",
                  attr: "key_size",
                  evHandles:
                  {
                    click: (ev) => {this.setKeybutton_widhgt(ev.target.id)}
                  }
                },
        button_3: { id: "attr_bitmap_opacity_key",
                  attr: "key_opacity",
                  evHandles:
                  {
                    click: (ev) => {this.setKeybutton_opacity(ev.target.id)}
                  }
                },
        button_4: { id: "attr_bitmap_delete",
                  attr: "delete",
                  evHandles:
                  {
                    click: (ev) => {this.setDeletebutton(ev.target.id)}
                  }
                },
        button_5: { id: "attr_bitmap_edit",
                  attr: "edit",
                  evHandles:
                  {
                    click: (ev) => {this.setEditbutton(ev.target.id)}
                  }
                },
        button_6: { id: "attr_bitmap_duplicate",
                  attr: "duplicate",
                  evHandles:
                  {
                    click: (ev) => {this.setDuplicatebutton(ev.target.id)}
                  }
                },
        },

      arrow:
        {
        input_1: { id: "attr_arrow_fill",
                   attr: "fill",
                   evHandles:
                   {
                     mousedown: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                     mouseover: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                     //blur: (ev) => {this.removeLocalTimeline(this.groupId, ev.target.id)}
                   },
                   markers: []
                 },
        input_2: { id: "attr_arrowArect_x",
                  attr: "rectAx",
                  evHandles:
                  {
                    mousedown: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    mouseover: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    //blur: (ev) => {this.removeLocalTimeline(this.groupId, ev.target.id)}
                  },
                  markers: []
                },
        input_3: { id: "attr_arrowArect_y",
                  attr: "rectAy",
                  evHandles:
                  {
                    mousedown: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    mouseover: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    //blur: (ev) => {this.removeLocalTimeline(this.groupId, ev.target.id)}
                  },
                  markers: []
                },
        input_4: { id: "attr_arrowAcir1_x",
                  attr: "cir1Ax",
                  evHandles:
                  {
                    mousedown: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    mouseover: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    //blur: (ev) => {this.removeLocalTimeline(this.groupId, ev.target.id)}
                  },
                  markers: []
                },
        input_5: { id: "attr_arrowAcir1_y",
                  attr: "cir1Ay",
                  evHandles:
                  {
                    mousedown: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    mouseover: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    //blur: (ev) => {this.removeLocalTimeline(this.groupId, ev.target.id)}
                  },
                  markers: []
                },
        input_6: { id: "attr_arrowAcir2_x",
                  attr: "cir2Ax",
                  evHandles:
                  {
                    mousedown: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    mouseover: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    //blur: (ev) => {this.removeLocalTimeline(this.groupId, ev.target.id)}
                  },
                  markers: []
                },
        input_7: { id: "attr_arrowAcir2_y",
                  attr: "cir2Ay",
                  evHandles:
                  {
                    mousedown: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    mouseover: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    //blur: (ev) => {this.removeLocalTimeline(this.groupId, ev.target.id)}
                  },
                  markers: []
                },
        input_8: { id: "attr_arrowBrect_x",
                  attr: "rectBx",
                  evHandles:
                  {
                    mousedown: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    mouseover: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    //blur: (ev) => {this.removeLocalTimeline(this.groupId, ev.target.id)}
                  },
                  markers: []
                },
        input_9: { id: "attr_arrowBrect_y",
                  attr: "rectBy",
                  evHandles:
                  {
                    mousedown: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    mouseover: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    //blur: (ev) => {this.removeLocalTimeline(this.groupId, ev.target.id)}
                  },
                  markers: []
                },
        input_10: { id: "attr_arrowBcir1_x",
                  attr: "cir1Bx",
                  evHandles:
                  {
                    mousedown: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    mouseover: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    //blur: (ev) => {this.removeLocalTimeline(this.groupId, ev.target.id)}
                  },
                  markers: []
                },
        input_11: { id: "attr_arrowBcir1_y",
                  attr: "cir1By",
                  evHandles:
                  {
                    mousedown: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    mouseover: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    //blur: (ev) => {this.removeLocalTimeline(this.groupId, ev.target.id)}
                  },
                  markers: []
                },
        input_12: { id: "attr_arrowBcir2_x",
                  attr: "cir2Bx",
                  evHandles:
                  {
                    mousedown: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    mouseover: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    //blur: (ev) => {this.removeLocalTimeline(this.groupId, ev.target.id)}
                  },
                  markers: []
                },
        input_13: { id: "attr_arrowBcir2_y",
                  attr: "cir2By",
                  evHandles:
                  {
                    mousedown: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    mouseover: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    //blur: (ev) => {this.removeLocalTimeline(this.groupId, ev.target.id)}
                  },
                  markers: []
                },
        input_14: { id: "attr_arrowCrect_x",
                  attr: "rectCx",
                  evHandles:
                  {
                    mousedown: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    mouseover: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    //blur: (ev) => {this.removeLocalTimeline(this.groupId, ev.target.id)}
                  },
                  markers: []
                },
        input_15: { id: "attr_arrowCrect_y",
                  attr: "rectCy",
                  evHandles:
                  {
                    mousedown: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    mouseover: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    //blur: (ev) => {this.removeLocalTimeline(this.groupId, ev.target.id)}
                  },
                  markers: []
                },
        input_16: { id: "attr_arrowCcir1_x",
                  attr: "cir1Cx",
                  evHandles:
                  {
                    mousedown: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    mouseover: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    //blur: (ev) => {this.removeLocalTimeline(this.groupId, ev.target.id)}
                  },
                  markers: []
                },
        input_17: { id: "attr_arrowCcir1_y",
                  attr: "cir1Cy",
                  evHandles:
                  {
                    mousedown: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    mouseover: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    //blur: (ev) => {this.removeLocalTimeline(this.groupId, ev.target.id)}
                  },
                  markers: []
                },
        input_18: { id: "attr_arrowCcir2_x",
                  attr: "cir2Cx",
                  evHandles:
                  {
                    mousedown: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    mouseover: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    //blur: (ev) => {this.removeLocalTimeline(this.groupId, ev.target.id)}
                  },
                  markers: []
                },
        input_19: { id: "attr_arrowCcir2_y",
                  attr: "cir2Cy",
                  evHandles:
                  {
                    mousedown: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    mouseover: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    //blur: (ev) => {this.removeLocalTimeline(this.groupId, ev.target.id)}
                  },
                  markers: []
                },
        input_20: { id: "attr_arrow_fill_key_time",
                  attr: "time",
                  evHandles:
                  {
                  }
                },
        input_21: { id: "attr_arrowArect_pos_key_time",
                  attr: "time",
                  evHandles:
                  {
                  }
                },
        input_22: { id: "attr_arrowAcir1_pos_key_time",
                  attr: "time",
                  evHandles:
                  {
                  }
                },
        input_23: { id: "attr_arrowAcir2_pos_key_time",
                  attr: "time",
                  evHandles:
                  {
                  }
                },
        input_24: { id: "attr_arrowBrect_pos_key_time",
                  attr: "time",
                  evHandles:
                  {
                  }
                },
        input_25: { id: "attr_arrowBcir1_pos_key_time",
                  attr: "time",
                  evHandles:
                  {
                  }
                },
        input_26: { id: "attr_arrowBcir2_pos_key_time",
                  attr: "time",
                  evHandles:
                  {
                  }
                },
        input_27: { id: "attr_arrowCrect_pos_key_time",
                  attr: "time",
                  evHandles:
                  {
                  }
                },
        input_28: { id: "attr_arrowCcir1_pos_key_time",
                  attr: "time",
                  evHandles:
                  {
                  }
                },
        input_29: { id: "attr_arrowCcir2_pos_key_time",
                  attr: "time",
                  evHandles:
                  {
                  }
                },
        input_30: { id: "attr_arrow_opacity",
                  attr: "opacity",
                  evHandles:
                  {
                    mousedown: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    //blur: (ev) => {this.removeLocalTimeline(this.groupId, ev.target.id)}
                  },
                  markers: []
                },
        input_31: { id: "attr_arrow_opacity_key_time",
                  attr: "time",
                  evHandles:
                  {
                  },
                  markers: []
                },
        button_1: { id: "attr_arrow_fill_key",
                  attr: "key_fill",
                  evHandles:
                  {
                    click: (ev) => {this.setKeybutton_color(ev.target.id)}
                  }
                },
        button_2: { id: "attr_arrowArect_pos_key",
                  attr: "key_posistion",
                  evHandles:
                  {
                    click: (ev) => {this.setKeybutton_pos(ev.target.id)}
                  }
                },
        button_3: { id: "attr_arrowAcir1_pos_key",
                  attr: "key_posistion",
                  evHandles:
                  {
                    click: (ev) => {this.setKeybutton_pos(ev.target.id)}
                  }
                },
        button_4: { id: "attr_arrowAcir2_pos_key",
                  attr: "key_posistion",
                  evHandles:
                  {
                    click: (ev) => {this.setKeybutton_pos(ev.target.id)}
                  }
                },
        button_5: { id: "attr_arrowBrect_pos_key",
                  attr: "key_posistion",
                  evHandles:
                  {
                    click: (ev) => {this.setKeybutton_pos(ev.target.id)}
                  }
                },
        button_6: { id: "attr_arrowBcir1_pos_key",
                  attr: "key_posistion",
                  evHandles:
                  {
                    click: (ev) => {this.setKeybutton_pos(ev.target.id)}
                  }
                },
        button_7: { id: "attr_arrowBcir2_pos_key",
                  attr: "key_posistion",
                  evHandles:
                  {
                    click: (ev) => {this.setKeybutton_pos(ev.target.id)}
                  }
                },
        button_8: { id: "attr_arrowCrect_pos_key",
                  attr: "key_posistion",
                  evHandles:
                  {
                    click: (ev) => {this.setKeybutton_pos(ev.target.id)}
                  }
                },
        button_9: { id: "attr_arrowCcir1_pos_key",
                  attr: "key_posistion",
                  evHandles:
                  {
                    click: (ev) => {this.setKeybutton_pos(ev.target.id)}
                  }
                },
        button_10: { id: "attr_arrowCcir2_pos_key",
                  attr: "key_posistion",
                  evHandles:
                  {
                    click: (ev) => {this.setKeybutton_pos(ev.target.id)}
                  }
                },
        button_11: { id: "attr_arrow_all_key",
                  attr: "key_all",
                  evHandles:
                  {
                    click: (ev) => {this.setKeybutton_all(ev.target.id)}
                  }
                },
        button_12: { id: "attr_arrow_opacity_key",
                  attr: "key_opacity",
                  evHandles:
                  {
                    click: (ev) => {this.setKeybutton_opacity(ev.target.id)}
                  }
                },
        button_13: { id: "attr_arrow_delete",
                  attr: "delete",
                  evHandles:
                  {
                    click: (ev) => {this.setDeletebutton(ev.target.id)}
                  }
                },
        button_14: { id: "attr_arrow_duplicate",
                  attr: "duplicate",
                  evHandles:
                  {
                    click: (ev) => {this.setDuplicatebutton(ev.target.id)}
                  }
                },
        },
    
      ball:
        {
        input_1: { id: "attr_ball_x",
                   attr: "cx",
                   evHandles:
                   {
                     mousedown:  (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                     mouseover:  (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                     // mouseleave: (ev) => {this.hideLocalTimeline(this.groupId, ev.target.id)},
                     //blur: (ev) => {this.removeLocalTimeline(this.groupId, ev.target.id)}
                   },
                   markers: []
                 },
        input_2: { id: "attr_ball_y",
                  attr: "cy",
                  evHandles:
                  {
                    mousedown: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    mouseover: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    //blur: (ev) => {this.removeLocalTimeline(this.groupId, ev.target.id)}
                  },
                  markers: []
                },
        input_3: { id: "attr_ball_pos_key_time",
                  attr: "time",
                  evHandles:
                  {
                  },
                  markers: []
                },
        input_4: { id: "attr_ball_width",
                  attr: "rx",
                  evHandles:
                  {
                    mousedown: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    mouseover: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    //blur: (ev) => {this.removeLocalTimeline(this.groupId, ev.target.id)}
                  },
                  markers: []
                },
        input_5: { id: "attr_ball_height",
                  attr: "rx",
                  evHandles:
                  {
                    mousedown: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    mouseover: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    //blur: (ev) => {this.removeLocalTimeline(this.groupId, ev.target.id)}
                  },
                  markers: []
                },
        input_6: { id: "attr_ball_widhgt_key_time",
                  attr: "time",
                  evHandles:
                  {
                  },
                  markers: []
                },
        input_7: { id: "attr_ball_fill",
                  attr: "fill",
                  evHandles:
                  {
                    mousedown: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    mouseover: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    //blur: (ev) => {this.removeLocalTimeline(this.groupId, ev.target.id)}
                  },
                  markers: []
                },
        input_8: { id: "attr_ball_fill_key_time",
                  attr: "time",
                  evHandles:
                  {
                  },
                  markers: []
                },
        input_9: { id: "attr_ball_opacity",
                  attr: "opacity",
                  evHandles:
                  {
                    mousedown: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    mouseover: (ev) => {this.displayLocalTimeline(this.groupId, ev.target.id)},
                    //blur: (ev) => {this.removeLocalTimeline(this.groupId, ev.target.id)}
                  },
                  markers: []
                },
        input_10: { id: "attr_ball_opacity_key_time",
                  attr: "time",
                  evHandles:
                  {
                  },
                  markers: []
                },
        button_1: { id: "attr_ball_pos_key",
                  attr: "key_posistion",
                  evHandles:
                  {
                    click: (ev) => {this.setKeybutton_pos(ev.target.id)}
                  }
                },
        button_2: { id: "attr_ball_widhgt_key",
                  attr: "key_size",
                  evHandles:
                  {
                    click: (ev) => {this.setKeybutton_widhgt(ev.target.id)}
                  }
                },
        button_3: { id: "attr_ball_fill_key",
                  attr: "key_fill",
                  evHandles:
                  {
                    click: (ev) => {this.setKeybutton_color(ev.target.id)}
                  }
                },
        button_4: { id: "attr_ball_opacity_key",
                  attr: "key_opacity",
                  evHandles:
                  {
                    click: (ev) => {this.setKeybutton_opacity(ev.target.id)}
                  }
                },
        button_5: { id: "attr_ball_delete",
                  attr: "delete",
                  evHandles:
                  {
                    click: (ev) => {this.setDeletebutton(ev.target.id)}
                  }
                },
        button_6: { id: "attr_ball_duplicate",
                  attr: "duplicate",
                  evHandles:
                  {
                    click: (ev) => {this.setDuplicatebutton(ev.target.id)}
                  }
                },
        },
    }



    this.updateMainTime = (ev) => {
      //-// console.log(this)
      let pickedup = this.domCfgs[this.currentShapeType]

      for(let elemName in pickedup) {

        if(pickedup[elemName].id.includes('_time')) {
          let target = document.getElementById(pickedup[elemName].id)

          if(target) target.value = Math.floor(ev.detail.timePercent)
        }
      }
    }


  }




  initialize(type, grpId) {
    // GETTING TIMELINE PERCENT
    this.stateEditting = new StateEditting()
    this.timelinePercent = Math.floor(this.stateEditting.timelinePercent)


    this.groupId = grpId
    this.elRoot.setAttribute('id', 'attribManager_inner_' + this.groupId)

    
    // HTML SOURCE
    this.textAreaHtmlSource = `
    <div class="bl_attribManager_container" id="attribManager_textarea" data-id=${this.groupId}>
      <h3>Text Area</h3>
      <div class="bl_attribManager ly_attribManager">
        <!-- TEXT AREA ZINDEX -->
        <label class="bl_attribManager_label ly_attribManager_label">
          <span class="bl_attr_span ly_attr_span">LAYER No.</span>
          <input class="bl_attr_input ly_attr_input" id="attr_textarea_zindex" type="number" />
        </label>
      </div>
      <!-- DELETE + DUPLICATE BUTTON -->
      <div class="bl_attribManager ly_attribManager">
        <!-- TEXT AREA DELETE -->
        <button class="bl_btn_delete ly_btn_delete" id="attr_textarea_delete" type="button">Delete Object</button>
        <!-- TEXT AREA DUPLICATE -->
        <button class="bl_btn_duplicate ly_btn_duplicate" id="attr_textarea_duplicate" type="button">Duplicate Object</button>
      </div>

      <div class="bl_attribManager ly_attribManager">
        <!-- TEXT AREA FONT -->
        <label class="bl_attribManager_label ly_attribManager_label">
          <span class="bl_attr_span ly_attr_span">FONT</span>
          <select class="bl_attr_font" id="attr_textarea_fontFamily" >
            <option value="nsjp">Noto Sans JP</option>
            <option value="sawa_m">Sawarabi_Mincho</option>
            <option value="dot_g">DotGothic16</option>
          </select>
        </label>
        <!-- CREATE KEYFRAME -->
        <button class="bl_keyframe_btn ly_keyframe_btn" id="attr_textarea_fontFamily_key" type="button">Keyframe</button>
        <!-- KEYFRAME'S TIME -->
        <input class="bl_attr_input_key_time ly_attr_input_key_time" id="attr_textarea_fontFamily_key_time" type="number" value=${this.timelinePercent} />
      </div>
      <div class="bl_attribManager ly_attribManager">
        <!-- TEXT AREA CONTENT -->
        <label class="bl_attribManager_label ly_attribManager_label">
          <span class="bl_attr_span ly_attr_span">TEXT AREA</span>
          <textarea class="bl_attr_textArea" id="attr_textarea_textContent" rows="10" cols="18">WRITE TEXT HERE &#13;&#10;YOU CAN USE ENTER KEY</textarea>
        </label>
        <!-- CREATE KEYFRAME -->
        <button class="bl_keyframe_btn ly_keyframe_btn" id="attr_textarea_content_key" type="button">Keyframe</button>
        <!-- KEYFRAME'S TIME -->
        <input class="bl_attr_input_key_time ly_attr_input_key_time" id="attr_textarea_content_key_time" type="number" value=${this.timelinePercent} />
      </div>
      <div class="bl_attribManager ly_attribManager">
        <!-- TEXT AREA WIDTH -->
        <label class="bl_attribManager_label ly_attribManager_label">
          <span class="bl_attr_span ly_attr_span">TEXT WIDTH</span>
          <input class="bl_attr_input ly_attr_input" id="attr_textarea_width" type="number" />
        </label>
      </div>
      <div class="bl_attribManager ly_attribManager">
        <!-- TEXT AREA FONTSIZE -->
        <label class="bl_attribManager_label ly_attribManager_label">
          <span class="bl_attr_span ly_attr_span">TEXT FONTSIZE</span>
          <input class="bl_attr_input ly_attr_input" id="attr_textarea_fontsize" type="number" />
        </label>
      </div>
      <div class="bl_attribManager ly_attribManager">
        <!-- TEXT AREA LINEMARGIN -->
        <label class="bl_attribManager_label ly_attribManager_label">
          <span class="bl_attr_span ly_attr_span">TEXT LINEMARGIN</span>
          <input class="bl_attr_input ly_attr_input" id="attr_textarea_linemargin" type="number" />
        </label>
      </div>
      <div class="bl_attribManager ly_attribManager">
        <!-- X POSITION -->
        <label class="bl_attribManager_label ly_attribManager_label">
          <span class="bl_attr_span ly_attr_span">X</span>
          <input class="bl_attr_input ly_attr_input" id="attr_textarea_x" type="number" />
        </label>
        <!-- Y POSITION -->
        <label class="bl_attribManager_label ly_attribManager_label">
          <span class="bl_attr_span ly_attr_span">Y</span>
          <input class="bl_attr_input ly_attr_input" id="attr_textarea_y" type="number" />
        </label>
        <!-- CREATE KEYFRAME -->
        <button class="bl_keyframe_btn ly_keyframe_btn" id="attr_textarea_pos_key" type="button">Keyframe</button>
        <!-- KEYFRAME'S TIME -->
        <input class="bl_attr_input_key_time ly_attr_input_key_time" id="attr_textarea_pos_key_time" type="number" value=${this.timelinePercent} />
      </div>
      <div class="bl_attribManager ly_attribManager">
        <!-- FILL COLOR -->
        <label class="bl_attribManager_label ly_attribManager_label">
          <span class="bl_attr_span ly_attr_span">Fill</span>
          <input class="bl_attr_input ly_attr_input" id="attr_textarea_fill" type="color" />
        </label>
        <!-- CREATE KEYFRAME -->
        <button class="bl_keyframe_btn ly_keyframe_btn" id="attr_textarea_fill_key" type="button">Keyframe</button>
        <!-- KEYFRAME'S TIME -->
        <input class="bl_attr_input_key_time ly_attr_input_key_time" id="attr_textarea_fill_key_time" type="number" value=${this.timelinePercent} />
      </div>
      <div class="bl_attribManager ly_attribManager">
        <!-- OPACITY COLOR -->
        <label class="bl_attribManager_label ly_attribManager_label">
          <span class="bl_attr_span ly_attr_span">Opacity</span>
          <input class="bl_attr_input ly_attr_input" id="attr_textarea_opacity" type="number" step="0.1" min="0.0" max="1.0" />
        </label>
        <!-- CREATE KEYFRAME -->
        <button class="bl_keyframe_btn ly_keyframe_btn" id="attr_textarea_opacity_key" type="button">Keyframe</button>
        <!-- KEYFRAME'S TIME -->
        <input class="bl_attr_input_key_time ly_attr_input_key_time" id="attr_textarea_opacity_key_time" type="number" value=${this.timelinePercent} />
      </div>
    </div>
    `


    this.rectHtmlSource = `
    <div class="bl_attribManager_container" id="attribManager_rect" data-id=${this.groupId}>
      <h3>Rectangle</h3>
      <div class="bl_attribManager ly_attribManager">
        <!-- RECT ZINDEX -->
        <label class="bl_attribManager_label ly_attribManager_label">
          <span class="bl_attr_span ly_attr_span">LAYER No.</span>
          <input class="bl_attr_input ly_attr_input" id="attr_rect_zindex" type="number" />
        </label>
      </div>
      <div class="bl_attribManager ly_attribManager">
        <!-- TEXT AREA DELETE -->
        <button class="bl_btn_delete ly_btn_delete" id="attr_rect_delete" type="button">Delete Object</button>
        <!-- TEXT AREA DUPLICATE -->
        <button class="bl_btn_duplicate ly_btn_duplicate" id="attr_rect_duplicate" type="button">Duplicate Object</button>
      </div>
      <!-- SHAPE -->
      <div class="bl_attribManager ly_attribManager">
        <!-- X POSITION -->
        <label class="bl_attribManager_label ly_attribManager_label">
          <span class="bl_attr_span ly_attr_span">X</span>
          <input class="bl_attr_input ly_attr_input" id="attr_rect_x" type="number" />
        </label>
        <!-- Y POSITION -->
        <label class="bl_attribManager_label ly_attribManager_label">
          <span class="bl_attr_span ly_attr_span">Y</span>
          <input class="bl_attr_input ly_attr_input" id="attr_rect_y" type="number" />
        </label>
        <!-- CREATE KEYFRAME -->
        <button class="bl_keyframe_btn ly_keyframe_btn" id="attr_rect_pos_key" type="button">Keyframe</button>
        <!-- KEYFRAME'S TIME -->
        <input class="bl_attr_input_key_time ly_attr_input_key_time" id="attr_rect_pos_key_time" type="number" value=${this.timelinePercent} />
      </div>
      <div class="bl_attribManager ly_attribManager">
        <!-- WIDTH -->
        <label class="bl_attribManager_label ly_attribManager_label">
          <span class="bl_attr_span ly_attr_span">Width</span>
          <input class="bl_attr_input ly_attr_input" id="attr_rect_width" type="number" />
        </label>
        <!-- HEIGHT -->
        <label class="bl_attribManager_label ly_attribManager_label">
          <span class="bl_attr_span ly_attr_span">Height</span>
          <input class="bl_attr_input ly_attr_input" id="attr_rect_height" type="number" />
        </label>
        <!-- CREATE KEYFRAME -->
        <button class="bl_keyframe_btn ly_keyframe_btn" id="attr_rect_widhgt_key" type="button">Keyframe</button>
        <!-- KEYFRAME'S TIME -->
        <input class="bl_attr_input_key_time ly_attr_input_key_time" id="attr_rect_widhgt_key_time" type="number" value=${this.timelinePercent} />
      </div>
      <div class="bl_attribManager ly_attribManager">
        <!-- FILL COLOR -->
        <label class="bl_attribManager_label ly_attribManager_label">
          <span class="bl_attr_span ly_attr_span">Fill</span>
          <input class="bl_attr_input ly_attr_input" id="attr_rect_fill" type="color" />
        </label>
        <!-- CREATE KEYFRAME -->
        <button class="bl_keyframe_btn ly_keyframe_btn" id="attr_rect_fill_key" type="button">Keyframe</button>
        <!-- KEYFRAME'S TIME -->
        <input class="bl_attr_input_key_time ly_attr_input_key_time" id="attr_rect_fill_key_time" type="number" value=${this.timelinePercent} />
      </div>
      <div class="bl_attribManager ly_attribManager">
        <!-- OPACITY COLOR -->
        <label class="bl_attribManager_label ly_attribManager_label">
          <span class="bl_attr_span ly_attr_span">Opacity</span>
          <input class="bl_attr_input ly_attr_input" id="attr_rect_opacity" type="number" step="0.1" min="0.0" max="1.0" />
        </label>
        <!-- CREATE KEYFRAME -->
        <button class="bl_keyframe_btn ly_keyframe_btn" id="attr_rect_opacity_key" type="button">Keyframe</button>
        <!-- KEYFRAME'S TIME -->
        <input class="bl_attr_input_key_time ly_attr_input_key_time" id="attr_rect_opacity_key_time" type="number" value=${this.timelinePercent} />
      </div>
    </div>
    `


    this.bitmapHtmlSource = `
    <div class="bl_attribManager_container" id="attribManager_bitmap" data-id=${this.groupId}>
      <div class="bl_attribManager ly_attribManager">
        <button class="bl_attribManager_edit_btn ly_attribManager_edit_btn" id="attr_bitmap_edit" type="button">Edit</button>
      </div>
      <h3>Drawing</h3>
      <div class="bl_attribManager ly_attribManager">
        <!-- BITMAP ZINDEX -->
        <label class="bl_attribManager_label ly_attribManager_label">
          <span class="bl_attr_span ly_attr_span">LAYER No.</span>
          <input class="bl_attr_input ly_attr_input" id="attr_bitmap_zindex" type="number" />
        </label>
      </div>
      <div class="bl_attribManager ly_attribManager">
        <!-- TEXT AREA DELETE -->
        <button class="bl_btn_delete ly_btn_delete" id="attr_bitmap_delete" type="button">Delete Object</button>
        <!-- TEXT AREA DUPLICATE -->
        <button class="bl_btn_duplicate ly_btn_duplicate" id="attr_bitmap_duplicate" type="button">Duplicate Object</button>
      </div>
      <!-- SHAPE -->
      <div class="bl_attribManager ly_attribManager">
        <!-- X POSITION -->
        <label class="bl_attribManager_label ly_attribManager_label">
          <span class="bl_attr_span ly_attr_span">X</span>
          <input class="bl_attr_input ly_attr_input" id="attr_bitmap_x" type="number" />
        </label>
        <!-- Y POSITION -->
        <label class="bl_attribManager_label ly_attribManager_label">
          <span class="bl_attr_span ly_attr_span">Y</span>
          <input class="bl_attr_input ly_attr_input" id="attr_bitmap_y" type="number" />
        </label>
        <!-- CREATE KEYFRAME -->
        <button class="bl_keyframe_btn ly_keyframe_btn" id="attr_bitmap_pos_key" type="button">Keyframe</button>
        <!-- KEYFRAME'S TIME -->
        <input class="bl_attr_input_key_time ly_attr_input_key_time" id="attr_bitmap_pos_key_time" type="number" value=${this.timelinePercent} />
      </div>
      <div class="bl_attribManager ly_attribManager">
        <!-- WIDTH -->
        <label class="bl_attribManager_label ly_attribManager_label">
          <span class="bl_attr_span ly_attr_span">Width</span>
          <input class="bl_attr_input ly_attr_input" id="attr_bitmap_width" type="number" />
        </label>
        <!-- HEIGHT -->
        <label class="bl_attribManager_label ly_attribManager_label">
          <span class="bl_attr_span ly_attr_span">Height</span>
          <input class="bl_attr_input ly_attr_input" id="attr_bitmap_height" type="number" />
        </label>
        <!-- CREATE KEYFRAME -->
        <!-- DISPLAY : NONE -->
        <button class="bl_keyframe_btn ly_keyframe_btn" id="attr_bitmap_widhgt_key" type="button" style="display:none;">Keyframe</button>
        <!-- KEYFRAME'S TIME -->
        <input class="bl_attr_input_key_time ly_attr_input_key_time" id="attr_bitmap_widhgt_key_time" type="number" value=${this.timelinePercent} />
      </div>
      <div class="bl_attribManager ly_attribManager">
        <!-- OPACITY COLOR -->
        <label class="bl_attribManager_label ly_attribManager_label">
          <span class="bl_attr_span ly_attr_span">Opacity</span>
          <input class="bl_attr_input ly_attr_input" id="attr_bitmap_opacity" type="number" step="0.1" min="0.0" max="1.0" />
        </label>
        <!-- CREATE KEYFRAME -->
        <button class="bl_keyframe_btn ly_keyframe_btn" id="attr_bitmap_opacity_key" type="button">Keyframe</button>
        <!-- KEYFRAME'S TIME -->
        <input class="bl_attr_input_key_time ly_attr_input_key_time" id="attr_bitmap_opacity_key_time" type="number" value=${this.timelinePercent} />
      </div>
    </div>
    `

    this.arrowHtmlSource = `
    <div class="bl_attribManager_container" id="attribManager_arrow" data-id=${this.groupId}>
      <h3>Bridge</h3>
      <div class="bl_attribManager ly_attribManager">
        <!-- ARROW ZINDEX -->
        <label class="bl_attribManager_label ly_attribManager_label">
          <span class="bl_attr_span ly_attr_span">LAYER No.</span>
          <input class="bl_attr_input ly_attr_input" id="attr_arrow_zindex" type="number" />
        </label>
      </div>
      <div class="bl_attribManager ly_attribManager">
        <!-- ARROW DELETE -->
        <button class="bl_btn_delete ly_btn_delete" id="attr_arrow_delete" type="button">Delete Object</button>
        <!-- ARROW DUPLICATE -->
        <button class="bl_btn_duplicate ly_btn_duplicate" id="attr_arrow_duplicate" type="button">Duplicate Object</button>
      </div>
      <div style="display:none;" class="bl_attribManager ly_attribManager">
        <!-- CREATE KEYFRAME ALL -->
        <button class="bl_keyframe_btn ly_keyframe_btn keyAll" id="attr_arrow_all_key" type="button">Keyframe ALL Belows</button>
      </div>
      <div class="bl_attribManager ly_attribManager">
        <!-- FILL COLOR -->
        <label class="bl_attribManager_label ly_attribManager_label">
          <span class="bl_attr_span ly_attr_span">Fill</span>
          <input class="bl_attr_input ly_attr_input" id="attr_arrow_fill" type="color" value="#ff0000" />
        </label>
        <!-- CREATE KEYFRAME -->
        <button class="bl_keyframe_btn ly_keyframe_btn" id="attr_arrow_fill_key" type="button">Keyframe</button>
        <!-- KEYFRAME'S TIME -->
        <input class="bl_attr_input_key_time ly_attr_input_key_time" id="attr_arrow_fill_key_time" type="number" value=${this.timelinePercent} />
      </div>
      <div class="bl_attribManager ly_attribManager">
        <!-- OPACITY COLOR -->
        <label class="bl_attribManager_label ly_attribManager_label">
          <span class="bl_attr_span ly_attr_span">Opacity</span>
          <input class="bl_attr_input ly_attr_input" id="attr_arrow_opacity" type="number" step="0.1" min="0.0" max="1.0" />
        </label>
        <!-- CREATE KEYFRAME -->
        <button class="bl_keyframe_btn ly_keyframe_btn" id="attr_arrow_opacity_key" type="button">Keyframe</button>
        <!-- KEYFRAME'S TIME -->
        <input class="bl_attr_input_key_time ly_attr_input_key_time" id="attr_arrow_opacity_key_time" type="number" value=${this.timelinePercent} />
      </div>
      <div style="display:none;" class="bl_attribManager ly_attribManager">
        <!-- HANDLE A : RECT X POSITION -->
        <label class="bl_attribManager_label ly_attribManager_label">
          <span class="bl_attr_span ly_attr_span">Handle A RECT: X</span>
          <input class="bl_attr_input ly_attr_input" id="attr_arrowArect_x" type="number" />
        </label>
        <!-- HANDLE A : RECT Y POSITION -->
        <label class="bl_attribManager_label ly_attribManager_label">
          <span class="bl_attr_span ly_attr_span">Handle A RECT : Y</span>
          <input class="bl_attr_input ly_attr_input" id="attr_arrowArect_y" type="number" />
        </label>
        <!-- CREATE KEYFRAME -->
        <button class="bl_keyframe_btn ly_keyframe_btn" id="attr_arrowArect_pos_key" type="button">Keyframe</button>
        <!-- KEYFRAME'S TIME -->
        <input class="bl_attr_input_key_time ly_attr_input_key_time" id="attr_arrowArect_pos_key_time" type="number" value=${this.timelinePercent} />
      </div>

      <div style="display:none;" class="bl_attribManager ly_attribManager">
        <!-- HANDLE A : CIRCLE1 X POSITION -->
        <label class="bl_attribManager_label ly_attribManager_label">
          <span class="bl_attr_span ly_attr_span">Handle A CIRCLE1 : X</span>
          <input class="bl_attr_input ly_attr_input" id="attr_arrowAcir1_x" type="number" />
        </label>
        <!-- HANDLE A : CIRCLE1 Y POSITION -->
        <label class="bl_attribManager_label ly_attribManager_label">
          <span class="bl_attr_span ly_attr_span">Handle A CIRCLE1 : Y</span>
          <input class="bl_attr_input ly_attr_input" id="attr_arrowAcir1_y" type="number" />
        </label>
        <!-- CREATE KEYFRAME -->
        <button class="bl_keyframe_btn ly_keyframe_btn" id="attr_arrowAcir1_pos_key" type="button">Keyframe</button>
        <!-- KEYFRAME'S TIME -->
        <input class="bl_attr_input_key_time ly_attr_input_key_time" id="attr_arrowAcir1_pos_key_time" type="number" value=${this.timelinePercent} />
      </div>

      <div style="display:none;" class="bl_attribManager ly_attribManager" style="display:none;">
        <!-- HANDLE A : CIRCLE2 X POSITION -->
        <label class="bl_attribManager_label ly_attribManager_label">
          <span class="bl_attr_span ly_attr_span">Handle A CIRCLE2 : X</span>
          <input class="bl_attr_input ly_attr_input" id="attr_arrowAcir2_x" type="number" />
        </label>
        <!-- HANDLE A : CIRCLE2 Y POSITION -->
        <label class="bl_attribManager_label ly_attribManager_label">
          <span class="bl_attr_span ly_attr_span">Handle A CIRCLE2 : Y</span>
          <input class="bl_attr_input ly_attr_input" id="attr_arrowAcir2_y" type="number" />
        </label>
        <!-- CREATE KEYFRAME -->
        <button class="bl_keyframe_btn ly_keyframe_btn" id="attr_arrowAcir2_pos_key" type="button">Keyframe</button>
        <!-- KEYFRAME'S TIME -->
        <input class="bl_attr_input_key_time ly_attr_input_key_time" id="attr_arrowAcir2_pos_key_time" type="number" value=${this.timelinePercent} />
      </div>


      <div style="display:none;" class="bl_attribManager ly_attribManager">
        <!-- HANDLE B : RECT X POSITION -->
        <label class="bl_attribManager_label ly_attribManager_label">
          <span class="bl_attr_span ly_attr_span">Handle B RECT : X</span>
          <input class="bl_attr_input ly_attr_input" id="attr_arrowBrect_x" type="number" />
        </label>
        <!-- HANDLE B : RECT Y POSITION -->
        <label class="bl_attribManager_label ly_attribManager_label">
          <span class="bl_attr_span ly_attr_span">Handle B RECT : Y</span>
          <input class="bl_attr_input ly_attr_input" id="attr_arrowBrect_y" type="number" />
        </label>
        <!-- CREATE KEYFRAME -->
        <button class="bl_keyframe_btn ly_keyframe_btn" id="attr_arrowBrect_pos_key" type="button">Keyframe</button>
        <!-- KEYFRAME'S TIME -->
        <input class="bl_attr_input_key_time ly_attr_input_key_time" id="attr_arrowBrect_pos_key_time" type="number" value=${this.timelinePercent} />
      </div>

      <div style="display:none;" class="bl_attribManager ly_attribManager">
        <!-- HANDLE B : CIRCLE1 X POSITION -->
        <label class="bl_attribManager_label ly_attribManager_label">
          <span class="bl_attr_span ly_attr_span">Handle B CIRCLE1 : X</span>
          <input class="bl_attr_input ly_attr_input" id="attr_arrowBcir1_x" type="number" />
        </label>
        <!-- HANDLE B : CIRCLE1 Y POSITION -->
        <label class="bl_attribManager_label ly_attribManager_label">
          <span class="bl_attr_span ly_attr_span">Handle B CIRCLE1 : Y</span>
          <input class="bl_attr_input ly_attr_input" id="attr_arrowBcir1_y" type="number" />
        </label>
        <!-- CREATE KEYFRAME -->
        <button class="bl_keyframe_btn ly_keyframe_btn" id="attr_arrowBcir1_pos_key" type="button">Keyframe</button>
        <!-- KEYFRAME'S TIME -->
        <input class="bl_attr_input_key_time ly_attr_input_key_time" id="attr_arrowBcir1_pos_key_time" type="number" value=${this.timelinePercent} />
      </div>

      <div style="display:none;" class="bl_attribManager ly_attribManager" style="display:none;">
        <!-- HANDLE B : CIRCLE2 X POSITION -->
        <label class="bl_attribManager_label ly_attribManager_label">
          <span class="bl_attr_span ly_attr_span">Handle B CIRCLE2 : X</span>
          <input class="bl_attr_input ly_attr_input" id="attr_arrowBcir2_x" type="number" />
        </label>
        <!-- HANDLE B : CIRCLE2 Y POSITION -->
        <label class="bl_attribManager_label ly_attribManager_label">
          <span class="bl_attr_span ly_attr_span">Handle B CIRCLE2 : Y</span>
          <input class="bl_attr_input ly_attr_input" id="attr_arrowBcir2_y" type="number" />
        </label>
        <!-- CREATE KEYFRAME -->
        <button class="bl_keyframe_btn ly_keyframe_btn" id="attr_arrowBcir2_pos_key" type="button">Keyframe</button>
        <!-- KEYFRAME'S TIME -->
        <input class="bl_attr_input_key_time ly_attr_input_key_time" id="attr_arrowBcir2_pos_key_time" type="number" value=${this.timelinePercent} />
      </div>

      <div style="display:none;" class="bl_attribManager ly_attribManager">
        <!-- HANDLE C : RECT X POSITION -->
        <label class="bl_attribManager_label ly_attribManager_label">
          <span class="bl_attr_span ly_attr_span">Handle C RECT : X</span>
          <input class="bl_attr_input ly_attr_input" id="attr_arrowCrect_x" type="number" />
        </label>
        <!-- HANDLE C : RECT Y POSITION -->
        <label class="bl_attribManager_label ly_attribManager_label">
          <span class="bl_attr_span ly_attr_span">Handle C RECT : Y</span>
          <input class="bl_attr_input ly_attr_input" id="attr_arrowCrect_y" type="number" />
        </label>
        <!-- CREATE KEYFRAME -->
        <button class="bl_keyframe_btn ly_keyframe_btn" id="attr_arrowCrect_pos_key" type="button">Keyframe</button>
        <!-- KEYFRAME'S TIME -->
        <input class="bl_attr_input_key_time ly_attr_input_key_time" id="attr_arrowCrect_pos_key_time" type="number" value=${this.timelinePercent} />
      </div>

      <div style="display:none;" class="bl_attribManager ly_attribManager">
        <!-- HANDLE C : CIRCLE1 X POSITION -->
        <label class="bl_attribManager_label ly_attribManager_label">
          <span class="bl_attr_span ly_attr_span">Handle C CIRCLE1 : X</span>
          <input class="bl_attr_input ly_attr_input" id="attr_arrowCcir1_x" type="number" />
        </label>
        <!-- HANDLE C : CIRCLE1 Y POSITION -->
        <label class="bl_attribManager_label ly_attribManager_label">
          <span class="bl_attr_span ly_attr_span">Handle C CIRCLE1 : Y</span>
          <input class="bl_attr_input ly_attr_input" id="attr_arrowCcir1_y" type="number" />
        </label>
        <!-- CREATE KEYFRAME -->
        <button class="bl_keyframe_btn ly_keyframe_btn" id="attr_arrowCcir1_pos_key" type="button">Keyframe</button>
        <!-- KEYFRAME'S TIME -->
        <input class="bl_attr_input_key_time ly_attr_input_key_time" id="attr_arrowCcir1_pos_key_time" type="number" value=${this.timelinePercent} />
      </div>

      <div style="display:none;" class="bl_attribManager ly_attribManager" style="display:none;">
        <!-- HANDLE C : CIRCLE2 X POSITION -->
        <label class="bl_attribManager_label ly_attribManager_label">
          <span class="bl_attr_span ly_attr_span">Handle C CIRCLE2 : X</span>
          <input class="bl_attr_input ly_attr_input" id="attr_arrowCcir2_x" type="number" />
        </label>
        <!-- HANDLE C : CIRCLE2 Y POSITION -->
        <label class="bl_attribManager_label ly_attribManager_label">
          <span class="bl_attr_span ly_attr_span">Handle C CIRCLE2 : Y</span>
          <input class="bl_attr_input ly_attr_input" id="attr_arrowCcir2_y" type="number" />
        </label>
        <!-- CREATE KEYFRAME -->
        <button class="bl_keyframe_btn ly_keyframe_btn" id="attr_arrowCcir2_pos_key" type="button">Keyframe</button>
        <!-- KEYFRAME'S TIME -->
        <input class="bl_attr_input_key_time ly_attr_input_key_time" id="attr_arrowCcir2_pos_key_time" type="number" value=${this.timelinePercent} />
      </div>

    </div>
    `


    this.ballHtmlSource = `
    <div class="bl_attribManager_container" id="attribManager_ball" data-id=${this.groupId}>
      <h3>Ball</h3>
      <div class="bl_attribManager ly_attribManager">
        <!-- BALL ZINDEX -->
        <label class="bl_attribManager_label ly_attribManager_label">
          <span class="bl_attr_span ly_attr_span">LAYER No.</span>
          <input class="bl_attr_input ly_attr_input" id="attr_ball_zindex" type="number" />
        </label>
      </div>
      <div class="bl_attribManager ly_attribManager">
        <!-- BALL DELETE -->
        <button class="bl_btn_delete ly_btn_delete" id="attr_ball_delete" type="button">Delete Object</button>
        <!-- BALL DUPLICATE -->
        <button class="bl_btn_duplicate ly_btn_duplicate" id="attr_ball_duplicate" type="button">Duplicate Object</button>
      </div>
      <!-- SHAPE -->
      <div class="bl_attribManager ly_attribManager">
        <!-- X POSITION -->
        <label class="bl_attribManager_label ly_attribManager_label">
          <span class="bl_attr_span ly_attr_span">X</span>
          <input class="bl_attr_input ly_attr_input" id="attr_ball_x" type="number" />
        </label>
        <!-- Y POSITION -->
        <label class="bl_attribManager_label ly_attribManager_label">
          <span class="bl_attr_span ly_attr_span">Y</span>
          <input class="bl_attr_input ly_attr_input" id="attr_ball_y" type="number" />
        </label>
        <!-- CREATE KEYFRAME -->
        <button class="bl_keyframe_btn ly_keyframe_btn" id="attr_ball_pos_key" type="button">Keyframe</button>
        <!-- KEYFRAME'S TIME -->
        <input class="bl_attr_input_key_time ly_attr_input_key_time" id="attr_ball_pos_key_time" type="number" value=${this.timelinePercent} />
      </div>
      <div class="bl_attribManager ly_attribManager">
        <!-- WIDTH -->
        <label class="bl_attribManager_label ly_attribManager_label">
          <span class="bl_attr_span ly_attr_span">Width</span>
          <input class="bl_attr_input ly_attr_input" id="attr_ball_width" type="number" />
        </label>
        <!-- HEIGHT -->
        <label class="bl_attribManager_label ly_attribManager_label">
          <span class="bl_attr_span ly_attr_span">Height</span>
          <input class="bl_attr_input ly_attr_input" id="attr_ball_height" type="number" />
        </label>
        <!-- CREATE KEYFRAME -->
        <button class="bl_keyframe_btn ly_keyframe_btn" id="attr_ball_widhgt_key" type="button">Keyframe</button>
        <!-- KEYFRAME'S TIME -->
        <input class="bl_attr_input_key_time ly_attr_input_key_time" id="attr_ball_widhgt_key_time" type="number" value=${this.timelinePercent} />
      </div>
      <div class="bl_attribManager ly_attribManager">
        <!-- FILL COLOR -->
        <label class="bl_attribManager_label ly_attribManager_label">
          <span class="bl_attr_span ly_attr_span">Fill</span>
          <input class="bl_attr_input ly_attr_input" id="attr_ball_fill" type="color" />
        </label>
        <!-- CREATE KEYFRAME -->
        <button class="bl_keyframe_btn ly_keyframe_btn" id="attr_ball_fill_key" type="button">Keyframe</button>
        <!-- KEYFRAME'S TIME -->
        <input class="bl_attr_input_key_time ly_attr_input_key_time" id="attr_ball_fill_key_time" type="number" value=${this.timelinePercent} />
      </div>
      <div class="bl_attribManager ly_attribManager">
        <!-- OPACITY COLOR -->
        <label class="bl_attribManager_label ly_attribManager_label">
          <span class="bl_attr_span ly_attr_span">Opacity</span>
          <input class="bl_attr_input ly_attr_input" id="attr_ball_opacity" type="number" step="0.1" min="0.0" max="1.0" />
        </label>
        <!-- CREATE KEYFRAME -->
        <button class="bl_keyframe_btn ly_keyframe_btn" id="attr_ball_opacity_key" type="button">Keyframe</button>
        <!-- KEYFRAME'S TIME -->
        <input class="bl_attr_input_key_time ly_attr_input_key_time" id="attr_ball_opacity_key_time" type="number" value=${this.timelinePercent} />
      </div>
    </div>
    `


    // TYPE CHECKING
    switch(type){
      case 'TEXTAREA':
        this.HtmlSource = this.textAreaHtmlSource
        this.currentShapeType = 'textarea'
        break
      case 'RECTANGLE':
        this.HtmlSource = this.rectHtmlSource
        this.currentShapeType = 'rect'
        break
      case 'ARROW':
        this.HtmlSource = this.arrowHtmlSource
        this.currentShapeType = 'arrow'
        break
      case 'BALL':
        this.HtmlSource = this.ballHtmlSource
        this.currentShapeType = 'ball'
        break
      case 'BITMAP':
        this.HtmlSource = this.bitmapHtmlSource
        this.currentShapeType = 'bitmap'
        break
    }

    this.elRoot.innerHTML = this.HtmlSource



    // ===========================================================
    // SETTING EVENT LISTENERS
    // ===========================================================




    // ---------------------------------------------
    // DISPLAYING LOCAL TIMELINE
    this.displayLocalTimeline = (id, controlId) => {
      //-// console.log(`AttribBox ::  displayLocalTimeline ::    ${id}    ${controlId}`)
      //-// console.log(this.localTimelineMarker)

      if(this.localTimeline) this.localTimeline.remove()

      const groupId = id

      // CREATING LOCAL TIMELINE WITH ABOVE INFORMATION
      this.localTimeline = new SliderIndicator({
        id: groupId + '_' + controlId,
        target: this.timelineLocalWrapper,
        width: '70%',
        height: 30,
        posX: 10,
        posY: 0,
        pointerWid: 14,
        pointerHgt: 24,
        lineWidth: 3,
        canDrag: false,
        pointerOn: false
      })



      // ==============================================
      // DISPLAYING KEYFRAMES ON THE LOCAL TIMELINE
      const splittedId = controlId.split('_')
      let attrName = splittedId[2]
      const domName = 'attr_' + this.currentShapeType + '_' + attrName

      let shapeType
      if(domName.includes('arrow')) shapeType = 'ARROW'
      else if(domName.includes('rect')) shapeType = 'RECTANGLE'
      else if(domName.includes('textarea')) shapeType = 'TEXTAREA'
      else if(domName.includes('ball')) shapeType = 'BALL'
      else if(domName.includes('bitmap')) shapeType = 'BITMAP'


      // ADJUSTING ATTRNAME FOR BALL OBJECT (CX, CY)
      if(shapeType === 'BALL') {
        if(attrName === 'x') attrName = 'cx'
        if(attrName === 'y') attrName = 'cy'
      }


      // GETTING DATA FROM STORAGE
      const str = localStorage
      const storageData = JSON.parse(str[groupId + '_attrbox'])

      let keyfrmArray = []


      // CREATING KEYFRAME ARRAY
      switch(shapeType) {
        case 'ARROW':

          if(!(splittedId.includes('opacity') || splittedId.includes('fill')) ) {
            // TODO :: SAME AS ATTRIBMANAGER'S this.setAttribBox()
            let hndIdRaw = splittedId[1]                    // arrowArect
            let hndIndex = hndIdRaw.slice(5,6)              // A,B OR C
            let shapeType = hndIdRaw.slice(6)               // rect

            // CONSTRUCT KEYNAME FOR ATTIBBOX STORAGE
            const attrKeyName = shapeType + hndIndex + attrName           // rectAx

            for(let attrKeynm in storageData) {
              // SEARCHING PROPER CHANNEL
              if(attrKeynm === attrKeyName) {
                keyfrmArray = storageData[attrKeynm][attrName]
              }
            }
          } else {
            // FOR OPACITY AND FILL ATTRIBUTES

            // TODO :: SAME AS ATTRIBMANAGER'S this.setAttribBox()
            let shapeType = splittedId[1]
            let attrName = splittedId[2]                     
              
            // CONSTRUCT KEYNAME FOR ATTIBBOX STORAGE
            //const attrKeyName = shapeType + hndIndex + attrName           // rectAx

            for(let attrKeynm in storageData) {
              // SEARCHING PROPER CHANNEL
              if(attrKeynm === attrName) {
                keyfrmArray = storageData[attrName]
              }
            }
          }
        break

        // FOR OTHER SHAPES
        default:
          for(let attrKeynm in storageData) {
            // SEARCHING PROPER CHANNEL
            if(attrKeynm === attrName) {
              keyfrmArray = storageData[attrKeynm]
            }
          }
        break

      }

      // SO FAR,
      //
      // WE GOT KEYFRAMES ABOUT PARTICULAR ATTRIBUTE ('x', 'width' etc.)
      // 0: {when: '0', value: 388}
      // 1: {when: '21', value: 458}

      // DISPLAYING MARKERS
      let timeArray = []

      if(keyfrmArray !== undefined) {
        for(let i=0; i < keyfrmArray.length; i++) {
          timeArray.push(keyfrmArray[i].when)
        }
      }
      this.localTimeline.makeMarkerPercent(timeArray)
    }



    this.hideLocalTimeline = (id, controlId) => {
      console.log(`AttribBox ::  hideLocalTimeline ::    ${id}    ${controlId}`)
      console.log(this.localTimelineMarker)

      if(this.localTimeline) this.localTimeline.remove()

    }


    this.setLocalTimelineEvHnd = (shapeType) => {
      for(let elemName in this.domCfgs[shapeType]) {

        // < GETTING KEY NAME OF OBJECT >
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
        for(let evHndKeyName of Object.keys(this.domCfgs[shapeType][elemName].evHandles)){
          const domTarget = document.getElementById(this.domCfgs[shapeType][elemName].id)

          // console.log(domTarget)

          domTarget.addEventListener(
            evHndKeyName,
            this.domCfgs[shapeType][elemName].evHandles[evHndKeyName])
        }
      }
    }


    this.unsetLocalTimelineEvHnd = (shapeType) => {
      for(let elemName in this.domCfgs[shapeType]) {

        // < GETTING KEY NAME OF OBJECT >
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
        for(let evHndKeyName of Object.keys(this.domCfgs[shapeType][elemName].evHandles)){
          const controlId = this.domCfgs[shapeType][elemName].id
          let controlDom = document.getElementById(controlId)

          // IF THERE IS DOM CONTROLLER DISPLAYED,
          // REMOVE THE EVENT LISTENER
          if(controlDom) controlDom.removeEventListener( evHndKeyName, this.domCfgs[shapeType][elemName].evHandles[evHndKeyName])

        }
      }
    }



    // ---------------------------------------------
    // RESET PROCESSES

    this.resetAllMarkers = () => {
      // FOR MARKERS
      for(let shape of this.allShapeTypes) {
        let domObjs = this.domCfgs[shape]
        for(let domKey in domObjs) {
          // INITIALIZE MARKERS
          if(domObjs[domKey].markers) domObjs[domKey].markers = []
        }
      }
    }

    this.remove = () => {

      // RESETTING domCfgs'S EVENTLISTENERS AND MARKER ARRAYS
      // FOR EVENT LISTENERS
      this.unsetLocalTimelineEvHnd(this.currentShapeType)
      this.resetAllMarkers()

      if(this.elRoot) {
        this.elRoot.innerHTML = ``
        //this.elRoot.remove()
      }

      if(this.localTimeline) this.localTimeline.remove()
      this.unsetMainTimeEvHnd()


      // DELETE ALL CHILDS UNDER LOCAL TIMELINE SVG ROOT
      for(let lcTmln of this.timelineLocalWrapper.childNodes) {
        lcTmln.remove()
      }
    }


    // ----------------------------------------------------
    // BUTTON FOR KEYFRAME MAKING
    this.setKeybutton_pos = (controlId) => {

      //-// console.log(this.domCfgs)

      //-// console.log(`----  this.setKeybutton_pos ::    ${controlId}`)
      // controlId -> attr_rect_pos_key , attr_arrowArect_x
      let splittedId = controlId.split('_')
      let type = splittedId[1]


      // EVENT HANDLER FOR BUTTON TO CREATE KEYFRAME

      // GETTING VALUE FROM ATTRIB BOX
      let time = document.getElementById(controlId + '_time').value
      let xPos = document.getElementById('attr_' + type + '_x').value
      let yPos = document.getElementById('attr_' + type + '_y').value

      //-// console.log(time)

      // TOGGLE KEYFRAME
      //-// console.log(this.groupId)

      let targetSvgDom = document.getElementById(this.groupId)
      //-// console.log(targetSvgDom)

      let evToKeyframe
      if(type.includes('arrow')) {

        evToKeyframe = new CustomEvent('createKeyFrame', {
          bubbles: true,
          detail: {
            id: this.groupId + '_' + type,
            time: time,
            type: 'POSITION',
            value: {
              x: xPos,
              y: yPos,
              hndId: type               // ******** SPECIALIZED HERE
            }
          }
        })

      } else if(type.includes('ball')) {

        evToKeyframe = new CustomEvent('createKeyFrame', {
          bubbles: true,
          detail: {
            id: this.groupId + '_' + type,
            time: time,
            type: 'POSITION',
            value: {
              cx: xPos,
              cy: yPos
            }
          }
        })

      } else {

        evToKeyframe = new CustomEvent('createKeyFrame', {
          bubbles: true,
          detail: {
            id: this.groupId + '_' + type,
            time: time,
            type: 'POSITION',
            value: {
              x: xPos,
              y: yPos
            }
          }
        })

      }


      // EVENT DISPATCHING
      targetSvgDom.dispatchEvent(evToKeyframe)


      // ------------------------------------------------------------
      // STORING TIME VALUE FOR DISPLAYING MARKER TO LOCAL TIMELINE

      // TYPE NAME ADJUSTING
      // ESPECIALLY ARROW SHAPE
      let shapeType

      if(splittedId[1].includes('arrow')) {
        shapeType = 'arrow'
      } else if(splittedId[1].includes('ball')) {
        shapeType = 'ball'  
      } else {
        shapeType = splittedId[1]
      }

      let domObjs = this.domCfgs[shapeType]


      for(let domKey in domObjs) {
        // FOR X POSITION
        if(domObjs[domKey].id === 'attr_' + type + '_x') {
          domObjs[domKey].markers.push(time)
        } else if(domObjs[domKey].id === 'attr_' + type + '_y') {
          domObjs[domKey].markers.push(time)
        }
      }


    }

    this.setKeybutton_widhgt = (controlId) => {

      //-// console.log(this.domCfgs)

      //-// console.log(`----  this.setKeybutton_pos ::    ${controlId}`)
      // controlId -> attr_rect_pos_key
      let splittedId = controlId.split('_')
      let type = splittedId[1]

      // EVENT HANDLER FOR BUTTON TO CREATE KEYFRAME

      // GETTING VALUES FROM ATTRIB BOX
      let time = document.getElementById(controlId + '_time').value
      let width = document.getElementById('attr_' + type + '_width').value
      let height = document.getElementById('attr_' + type + '_height').value

      //-// console.log(time)

      // TOGGLE KEYFRAME
      //-// console.log(this.groupId)

      let targetSvgDom = document.getElementById(this.groupId)
      //-// console.log(targetSvgDom)

      let evToKeyframe = new CustomEvent('createKeyFrame', {
        bubbles: true,
        detail: {
          id: this.groupId + '_' + type,
          time: time,
          type: 'SIZE',
          value: {
            width: width,
            height: height
          }
        }
      })

      // EVENT DISPATCHING
      targetSvgDom.dispatchEvent(evToKeyframe)

      // STORING TIME VALUE FOR DISPLAYING MARKER TO LOCAL TIMELINE
      //document.getElementById('attr_' + type + '_x').dataset[]
      let domObjs = this.domCfgs[type]
      for(let domKey in domObjs) {
        // FOR X POSITION
        if(domObjs[domKey].id === 'attr_' + type + '_width') {
          domObjs[domKey].markers.push(time)
        } else if(domObjs[domKey].id === 'attr_' + type + '_height') {
          domObjs[domKey].markers.push(time)
        }
      }
    }

    this.setKeybutton_color = (controlId) => {

      //-// console.log(this.domCfgs)

      //-// console.log(`----  this.setKeybutton_pos ::    ${controlId}`)
      // controlId -> attr_rect_pos_key
      let splittedId = controlId.split('_')
      let type = splittedId[1]

      // EVENT HANDLER FOR BUTTON TO CREATE KEYFRAME

      // GETTING VALUES FROM ATTRIB BOX
      let time = document.getElementById(controlId + '_time').value
      let color = document.getElementById('attr_' + type + '_fill').value

      //-// console.log(time)

      // TOGGLE KEYFRAME
      //-// console.log(this.groupId)

      let targetSvgDom = document.getElementById(this.groupId)
      //-// console.log(targetSvgDom)

      let evToKeyframe = new CustomEvent('createKeyFrame', {
        bubbles: true,
        detail: {
          id: this.groupId + '_' + type,
          time: time,
          type: 'COLOR',
          value: {
            fill: color               // fill IS CRITICAL !
          }
        }
      })

      // EVENT DISPATCHING
      targetSvgDom.dispatchEvent(evToKeyframe)

      // STORING TIME VALUE FOR DISPLAYING MARKER TO LOCAL TIMELINE
      //document.getElementById('attr_' + type + '_x').dataset[]
      let domObjs = this.domCfgs[type]
      for(let domKey in domObjs) {
        // FOR X POSITION
        if(domObjs[domKey].id === 'attr_' + type + '_fill') {
          domObjs[domKey].markers.push(time)
        }
      }
    }

    this.setKeybutton_opacity = (controlId) => {
      //-// console.log(`----  this.setKeybutton_opacity ::    ${controlId}`)

      //-// console.log(this.domCfgs)

      //-// console.log(`----  this.setKeybutton_pos ::    ${controlId}`)
      // controlId -> attr_rect_pos_key
      let splittedId = controlId.split('_')
      let type = splittedId[1]

      // EVENT HANDLER FOR BUTTON TO CREATE KEYFRAME
      // GETTING VALUES FROM ATTRIB BOX
      let time = document.getElementById(controlId + '_time').value
      let opacity = parseFloat(document.getElementById('attr_' + type + '_opacity').value)

      //-// console.log(time)

      // TOGGLE KEYFRAME
      //-// console.log(this.groupId)

      let targetSvgDom = document.getElementById(this.groupId)
      //-// console.log(targetSvgDom)

      let evToKeyframe = new CustomEvent('createKeyFrame', {
        bubbles: true,
        detail: {
          id: this.groupId + '_' + type,
          time: time,
          type: 'OPACITY',
          value: {
            opacity: opacity
          }
        }
      })

      // EVENT DISPATCHING
      targetSvgDom.dispatchEvent(evToKeyframe)

      // STORING TIME VALUE FOR DISPLAYING MARKER TO LOCAL TIMELINE
      //document.getElementById('attr_' + type + '_x').dataset[]
      let domObjs = this.domCfgs[type]
      for(let domKey in domObjs) {
        // FOR X POSITION
        if(domObjs[domKey].id === 'attr_' + type + '_opacity') {
          domObjs[domKey].markers.push(time)
        }
      }
    }

    this.setKeybutton_textContent = (controlId) => {
      //-// console.log(`----  this.setKeybutton_textContent ::    ${controlId}`)

      //-// console.log(document.getElementById('attribManager_textarea').dataset.id)
      //-// console.log(this.domCfgs)

      // controlId -> attr_rect_pos_key   -----------
      //                                            |
      let splittedId = controlId.split('_') //      V
      let type = splittedId[1]              // -> rect

      // EVENT HANDLER FOR BUTTON TO CREATE KEYFRAME

      // GETTING VALUES FROM ATTRIB BOX
      let time = document.getElementById(controlId + '_time').value
      let textContent = document.getElementById('attr_' + type + '_textContent').value


      //-// console.log(` FOLLOWING TEXTS WILL BE KEY-FRAMED -->    ${textContent}`)


      // TOGGLE KEYFRAME
      //-// console.log(this.groupId)

      let targetSvgDom = document.getElementById(this.groupId)
      //-// console.log(targetSvgDom)

      let evToKeyframe = new CustomEvent('createKeyFrame', {
        bubbles: true,
        detail: {
          id: this.groupId + '_' + type,
          time: time,
          type: 'TEXTCONTENT',
          value: {
            textContent: textContent,
          }
        }
      })

      // EVENT DISPATCHING
      targetSvgDom.dispatchEvent(evToKeyframe)

      // STORING TIME VALUE FOR DISPLAYING MARKER TO LOCAL TIMELINE
      //document.getElementById('attr_' + type + '_x').dataset[]
      let domObjs = this.domCfgs[type]
      for(let domKey in domObjs) {
        // FOR TEXT CONTENT
        if(domObjs[domKey].id === 'attr_' + type ) {
          domObjs[domKey].markers.push(time)
        }
      }
    }

    this.setKeybutton_fontFamily = (controlId) => {
      //-// console.log(`----  this.setKeybutton_fontFamily ::    ${controlId}`)


      //-// console.log(document.getElementById('attribManager_textarea').dataset.id)
      //-// console.log(this.domCfgs)

      // controlId -> attr_rect_pos_key   -----------
      //                                            |
      let splittedId = controlId.split('_') //      V
      let type = splittedId[1]              // -> rect

      // EVENT HANDLER FOR BUTTON TO CREATE KEYFRAME

      // GETTING VALUES FROM ATTRIB BOX
      let time = document.getElementById(controlId + '_time').value
      let fontFamily = document.getElementById('attr_' + type + '_fontFamily').value


      //-// console.log(` FOLLOWING TEXTS WILL BE KEY-FRAMED -->    ${fontFamily}`)


      // // TOGGLE KEYFRAME
      // //-// console.log(this.groupId)

      // let targetSvgDom = document.getElementById(this.groupId)
      // //-// console.log(targetSvgDom)

      // let evToKeyframe = new CustomEvent('createKeyFrame', {
      //   bubbles: true,
      //   detail: {
      //     id: this.groupId + '_' + type,
      //     time: time,
      //     type: 'TEXTCONTENT',
      //     value: {
      //       textContent: textContent,
      //     }
      //   }
      // })

      // // EVENT DISPATCHING
      // targetSvgDom.dispatchEvent(evToKeyframe)

      // // STORING TIME VALUE FOR DISPLAYING MARKER TO LOCAL TIMELINE
      // //document.getElementById('attr_' + type + '_x').dataset[]
      // let domObjs = this.domCfgs[type]
      // for(let domKey in domObjs) {
      //   // FOR TEXT CONTENT
      //   if(domObjs[domKey].id === 'attr_' + type ) {
      //     domObjs[domKey].markers.push(time)
      //   }
      // }
    }

    this.setKeybutton_all = (controlId) => {

      console.log(this.domCfgs)

      console.log(`----  this.setKeybutton_all ::    ${controlId}`)
      // controlId -> attr_rect_pos_key
      let splittedId = controlId.split('_')
      let type = splittedId[1]

      let targetSvgDom = document.getElementById(this.groupId)

      //-// console.log(`targetSvgDom ::   ${targetSvgDom}`)


      // ------------------------------------------------------------
      // STORING TIME VALUE FOR DISPLAYING MARKER TO LOCAL TIMELINE

      // TYPE NAME ADJUSTING
      // ESPECIALLY ARROW SHAPE
      let shapeType

      if(splittedId[1].includes('arrow')) {
        shapeType = 'arrow'
      } else {
        shapeType = splittedId[1]
      }

      let domObjs = this.domCfgs[shapeType]

      // RUN ALL OTHER 'BUTTON' TO KEYFRAMING
      for(let domKey in domObjs) {

        if(domKey.includes('button') 
          && domObjs[domKey].id !== 'attr_arrow_all_key' 
          && domObjs[domKey].id !== 'attr_arrow_delete') {

          domObjs[domKey].evHandles.click(
            {target: {
              id: domObjs[domKey].id
              }
            })
        }
      }
    }

    this.setDeletebutton = (controlId) => {
      //-// console.log(`----  this.setDeletebutton ::    ${controlId}`)

      //-// console.log(document.getElementById('attribManager_textarea').dataset.id)
      //-// console.log(this.domCfgs)

      // controlId -> attr_rect_pos_key   -----------
      //                                            |
      let splittedId = controlId.split('_') //      V
      let type = splittedId[1]              // -> rect

      let targetSvgDom = document.getElementById(this.groupId)
      //-// console.log(targetSvgDom)


      let evToObject = new CustomEvent('deleteObject', {
        bubbles: true,
        detail: {
          id: this.groupId,
          type: 'COMMAND_DELETE'
        }
      })


      // EVENT DISPATCHING
      targetSvgDom.dispatchEvent(evToObject)
    }

    this.setEditbutton = (controlId) => {

      let splittedId = controlId.split('_') //      V
      let type = splittedId[1]              // -> rect

      let targetSvgDom = document.getElementById(this.groupId)
      //-// console.log(targetSvgDom)


      let evToObject = new CustomEvent('editObject', {
        bubbles: true,
        detail: {
          id: this.groupId,
          type: 'COMMAND_EDIT_BITMAP'
        }
      })

      // EVENT DISPATCHING
      targetSvgDom.dispatchEvent(evToObject)
    } 

    this.setDuplicatebutton = (controlId) => {
      //console.log(`----  this.setDuplicatebutton ::    ${controlId}`)

      //-// console.log(document.getElementById('attribManager_textarea').dataset.id)
      //-// console.log(this.domCfgs)

      // controlId -> attr_rect_pos_key   -----------
      //                                            |
      let splittedId = controlId.split('_') //      V
      let type = splittedId[1]              // -> rect

      let targetSvgDom = document.getElementById(this.groupId)
      //-// console.log(targetSvgDom)


      let evToObject = new CustomEvent('duplicateObject', {
        bubbles: true,
        detail: {
          id: this.groupId,
          type: 'COMMAND_DUPLICATE'
        }
      })


      // EVENT DISPATCHING
      targetSvgDom.dispatchEvent(evToObject)
    }



    // --------------------------------------------------------------------
    // DISPLAYING LOCAL TIMELINE WHEN INPUT DOM WAS FOCUSED
    this.setLocalTimelineEvHnd(this.currentShapeType)

    // SYNC TIME VALUE WITH MAINTIMELINE
    this.setMainTimeEvHnd()

    //-// console.log(`CURRENT ATTRIB BOX'S SHAPE TYPE   --->      ${this.currentShapeType}`)



  }






  setMainTimeEvHnd(){
    //document.body.removeEventListener('TIMELINE_MAIN', this.updateMainTime.bind(this), false)

    document.body.addEventListener('TIMELINE_MAIN', this.updateMainTime, false)

  }


  unsetMainTimeEvHnd(){

    document.body.removeEventListener('TIMELINE_MAIN', this.updateMainTime, false)

  }




}




export {AttribBox}
