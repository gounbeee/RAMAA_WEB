
const path = require('path')
const fs = require('fs')


function copyFile(source, destination) {

  const input = fs.createReadStream(source);
  const output = fs.createWriteStream(destination);
  return new Promise((resolve, reject) => {

      output.on('error', reject);
      input.on('error', reject);
      input.on('end', resolve);
      input.pipe(output);
  });

}



exports.postCreateYrCntPg = (req, res, next) => {

  console.log('CREATE YOUR CONTENTS PAGE REQUIRED')
  //console.log(req.body)

  let jsonDataArray = req.body

  console.log(`DOCUMENT COUNT IS ::    ${jsonDataArray.length}`)

  // SAVING JSON DATA TO DB
  console.log(`source.js ::    req.session.user   ->  ${req.session.user.email}`)

  // < FILE STORING USING Promise >
  // https://stackoverflow.com/questions/45040277/nodejs-write-multiple-files-in-for-loop?noredirect=1&lq=1
  const promises = jsonDataArray.map(file => {
    console.log(file.fileName)
    const source = file.fileName
    const midPath = '../userData/' + req.session.user.email
    const filePath = path.join(__dirname, midPath ,file.fileName)

    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, file.data, (err) => {
        if(err) {
          console.log(err)
          return
        }
        console.log('FILE STORED SUCCESSFULLY')
      })
    })
  })

  //debugger;

  Promise.all(promises).then( _ => {
    // do what you want
    console.log('done');
    res.redirect('/your-contents')
  })
  .catch(err => {
    // handle I/O error
    console.error(err)
  })


}




exports.getYourContents = (req, res, next) => {

  console.log('YOUR CONTENTS PAGE CALLED')


  res.render('your-contents.ejs')



}





exports.getSaveToJson = (req, res, next) => {
	
  console.log('getSaveToJson() EXECUTED')

  res.send({  
    "result": "getSaveToJson GET REQUEST OK"
  })



}




exports.postSaveToJson = (req, res, next) => {
  console.log('----------------------------------------------')
  console.log('source.js ::  SAVING TO JSON !!')

  //console.log(req.body)
  const fileName = req.body.fileName

  // WE TEMPORARILY STORE JSON FILE THEN TRANSFER TO USER !
  const midPath = '../tempData/'

  const filePath = path.join(__dirname, midPath ,fileName)
  let dataJson = JSON.stringify(req.body, undefined, 2)
  //dataJson.replaceAll('\\', '')
  //dataJson.replaceAll(path.sep, '')

  fs.writeFileSync(filePath, dataJson)

  console.log(filePath)

  // http://expressjs.com/en/api.html
  var options = {
    root: path.join(__dirname, midPath),
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  }

  res.sendFile(fileName, options, function (err) {
    if (err) {
      next(err)
    } else {
      console.log('Sent:', fileName)

      // DELETE THE TEMP FILE
      fs.unlink(filePath, err => {
		if(err) { 
			console.log(err)
			return
		} else { 
			console.log('FILE IS DELETED')
		}
	  })
      
    }
  })


}
