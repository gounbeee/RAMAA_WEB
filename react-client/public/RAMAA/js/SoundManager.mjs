'use strict'


import { Sound } from "./Sound.mjs"




class SoundManager {


  constructor(name) {
    //-// console.log('%%  SoundManager.js : SoundManager CONSTRUCTOR EXECUTED')

    const instance = this.constructor.instance
    if( instance ) {
      return instance
    }

    this.constructor.instance = this



    // ---------------------------------------------------------------

    this.canUse = undefined
    this.canOgg = false
    this.canMp3 = false
    this.ext = ""
    this.timeout = 3000;

    this.sounds = {}

    // MAXIMUM COUNT OF 
    this.soundFxMax = 8         

    this.bgmCurrent = undefined


  }



  initialize() {

    if(this.canUse) {
      return
    }

    // CHECK IF WE CAN USE OGG, MP3 FILE TYPE
    try {
      const audio = new Audio('')
      this.canOgg = audio.canPlayType('audio/ogg') === 'maybe'
      this.canMp3 = audio.canPlayType('audio/mpeg') === 'maybe'

    } catch(e) {
      //-// console.log(e)
    }

    // FLAG WILL BE TRUE IF ONE OF BELOW TYPE IS AVAILABLE
    this.canUse = this.canOgg || this.canMp3
    // DEFINE FILE EXTENSION
    this.ext = this.canOgg ? '.ogg' : (this.canMp3 ? '.mp3' : '')


    // TODO ::
    // MOBILE CHECK REQUIRED

    //if (! game.core.ua.pc) {_t.canUse = false}  // モバイル時は不能


  }




  load(name, url, type) {
    //-// console.log('%%  SoundManager.js : load FUNCTION EXECUTED')

    return new Promise((resolve, reject) => {


      this.initialize()


      // IF WE CANNOT USE SOUND
      // RETURN
      if(!this.canUse) {

        const resultMessage = 'CANNOT USE SOUND :: ' + name
        //-// console.log(resultMessage)
        resolve(resultMessage)
        return
      }


      // IF WE CAN USE SOUND (CHECK ABOVE)
      // AND INCOMING FILE IS FOR 'AUDIO'
      if(type != 'se') {

        // CALLBACK FUNCTION WHEN PRE-LOADING WAS COMPLETED
        const cb = e => {

          // IF THE EXECUTION IS ALREADY DONE BEFORE
          if(e.currentTarget.dataset.triggered) { return }
          e.currentTarget.dataset.triggered = true


          const resultMessege = 'LOADED SOUND : ' + name
          //-// console.log(resultMessege)
          resolve(resultMessage)
        
        }

        // INITIALIZATION OF SOUND
        const snd = this.sounds[name] = new Sound()
        snd.audio = new Audio('')
        snd.audio.preload = 'auto'
        snd.audio.addEventListener('playSound', cb)
        snd.audio.src = url + this.ext

      } else {
        // AND INCOMING FILE IS FOR 'SOUND'

        // LOAD FILES
        this.sounds[name] = new Sound()

        const arr = []
        for(let i=0; i < this.soundFxMax; i++) {
          arr.push(this.load(name + '-' + i, url))
        }

        // RECURSIVE CALL OF THIS FUNCTION
        Promise.all(arr).then( () => {
          resolve()
        })

      }

    })

  }






  //------------------------------------------------------------

  // 無効確認
  chckUnbl(name) {
    if (this.canUse === false) {return true}
    if (this.sounds[name] === undefined) {return true}
    return false
  }


  // 再生位置を0に
  rstCurTm(au, cmd) {

    if (cmd) {au[cmd]()}          // 命令実行
    au.currentTime = 0;           // 再生位置を0に

  }



  //------------------------------------------------------------

  // 再生
  play(nm, cb) {

    if (this.chckUnbl(nm)) {return} // 無効確認

    const au = this.sounds[nm].audio; // オーディオ取り出し

    this.rstCurTm(au, 'pause');   // 再生位置を0に


    // コールバックの設定
    au.removeEventListener('ended', au.cb);  // 削除

    if (cb) {
      au.cb = cb;
      au.addEventListener('ended', au.cb); // 終了時の処理
    }

    au.play();    // 再生

  }



  // ループ再生
  playLoop(nm) {

    if (this.chckUnbl(nm)) {return} // 無効確認

    const au = this.sounds[nm].audio; // オーディオ取り出し

    this.rstCurTm(au, 'pause');   // 再生位置を0に

    // ループあり
    au.removeEventListener('ended', au.cb);     // 削除
    au.cb = () => au.play();                    // ループ用の再生
    au.addEventListener('ended', au.cb);        // 終了時の処理を追加
    au.play();                                  // 再生

  }



  // 一時停止
  pause(nm) {

    if (_t.chckUnbl(nm)) {return} // 無効確認

    this.sounds[nm].audio.pause();    // 一時停止
  }




  // 再開
  restart(nm) {

    if (this.chckUnbl(nm)) {return} // 無効確認

    this.sounds[nm].audio.play();   // 再生

  }



  // 停止
  stop(nm) {
    if (this.chckUnbl(nm)) {return} // 無効確認

    const au = this.sounds[nm].audio; // オーディオ取り出し

    au.removeEventListener('ended', au.cb);  // 終了時の処理を削除

    this.rstCurTm(au, 'pause');   // 再生位置を0に

  };



  // ボリューム変更
  vol(nm, vol) {
    if (this.chckUnbl(nm)) {return} // 無効確認
    this.sounds[nm].audio.volume = vol; // 0～1.0
  };



  //------------------------------------------------------------

  // SE再生
  playSE(nm) {
    if (this.chckUnbl(nm)) {return} // 無効確認

    const snd = this.sounds[nm];

    this.play(nm + '-' + snd.soundFxCurrent);  // 再生

    snd.soundFxCurrent = (snd.soundFxCurrent + 1) % this.soundFxMax;

  }



  // BGM再生
  playBGM(nm, cb) {

    if (this.chckUnbl(nm)) {return} // 無効確認

    const au = this.sounds[nm].audio; // オーディオ取り出し

    if (nm != this.bgmCurrent) {

     this.stop(this.bgmCurrent);   // 名前が異なるなら停止

    } else if (! au.ended) {

     return;         // 名前が同じで再生中なら関数終了

    }

    // BGMの更新とループ再生
    this.bgmCurrent = nm;

    if (cb) {this.play(nm, cb)}
    else    {this.playLoop(nm)}

  }

}





export {SoundManager}
