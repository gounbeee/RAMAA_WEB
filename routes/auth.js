const express = require("express");
const router = express.Router();

const User = require("../models/User");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const sendEmail = require("../utils/sendEmail");

const Token = require("../models/tokenModel");

const csurf = require('csurf')
const csrfProtection = csurf({cookie:true})



router.get("/make-account", csrfProtection, async (req,res) => {

	try {

		console.log("DISPLAYING MAKE ACCOUNT PAGE")
		console.log(req.csrfToken())
		res.status(200).send({

			success: true,
			message: "Displaying Make Account Page",
			csrfToken: req.csrfToken()

		});


	} catch { (err) => {

		console.log(err)

		}
	}


});



// WHEN USER PRESSED MAKE ACCOUNT BUTTON
router.post("/make-account", csrfProtection, async (req, res) => {

	try {

		console.log(req.body.email)
		

		// SEARCHING DATABASE WITH INPUT REQUEST,
		// THAN IF THERE IS PRE-EXISTED USER,
		// THEN RETURN IMMEDIATELY !
		const existingUser = await User.findOne({ email: req.body.email });
		
		if (existingUser) {

			return res.status(200)
				.send({ success: false, message: "User Already Registered" });

		}


		// *********************************
		// PASSWORD MUST BE HASHED !!!!!!!!
		// USING bcrypt MODULE
		const password = req.body.password;

		const salt = await bcrypt.genSalt(10);

		const hashedPassword = await bcrypt.hash(password, salt);

		req.body.password = hashedPassword;


		// ---------------------------------
		// CREATING USER WITH User MODULE
		const newuser = new User(req.body);

		const result = await newuser.save();


		await sendEmail(result, "emailverify");


		res.status(200).send({

			success: true,
			message: "Thank you for making account! Please verify your email!",

		});

	} catch (error) {

		console.log(error);
		res.status(400).send(error);

	}

});





// FOR GET REQUEST FOR LOGIN PAGE !
router.get("/login", csrfProtection, async (req,res) => {

	try {

		console.log("DISPLAYING LOGIN PAGE")
		console.log(req.csrfToken())

		//res.redirect('/')

		res.status(200).send({

			success: true,
			message: "Displaying LOGIN Page",
			csrfToken: req.csrfToken()
		})


	} catch { (err) => {

		console.log(err)

		}
	}


})




// FOR POST REQUEST FOR LOGIN PAGE
router.post("/login", csrfProtection, async (req, res) => {

	try {

		const user = await User.findOne({
			email: req.body.email,
		});


		if (user) {

			
			
			const passwordsMatched = await bcrypt.compare(
				req.body.password,
				user.password
			);


			if (passwordsMatched) {

				if (user.isMember) {

					const dataToBeSentToFrontend = {
						_id: user._id,
						email: user.email,
						name: user.name,
					};

					const token = jwt.sign(dataToBeSentToFrontend, "RAMAA", {
						expiresIn: 60 * 60,
					});


					res.status(200).send({
						success: true,
						message: "User Login Successfull",
						data: token,
					});


				} else {
					res
					.status(200)
					.send({ success: false, message: "You Email is not verified yet" });
				}

			} else {

				res.status(200).send({ success: false, message: "Password is not corrected" });

			}

		} else {

			res
			.status(200)
			.send({ success: false, message: "There is no matched user", data: null });

		}

	} catch (error) {

		res.status(400).send(error);

	}

});




router.get("/send-password-reset-link", csrfProtection, async (req,res) => {
	try {
		console.log("DISPLAYING send-password-reset-link PAGE")
		console.log(req.csrfToken())
		res.status(200).send({
			success: true,
			message: "Displaying send-password-reset-link Page",
			csrfToken: req.csrfToken()
		});
	} catch { (err) => {
		console.log(err)
		}
	}
});


router.post("/send-password-reset-link", csrfProtection, async (req, res) => {

	try {

		// console.log(req.body)

		const result = await User.findOne({ email: req.body.email });

		// console.log(result)


		// SETTING MAILTYPE FOR 
		await sendEmail(result, "resetpassword");

		res.send({
			success: true,
			message: "Password reset link sent to your email successfully",
		});

	} catch (error) {

		res.status(500).send(error);

	}

});



router.get("/reset-password", csrfProtection, async (req,res) => {
	try {
		console.log("DISPLAYING reset-password PAGE")
		console.log(req.csrfToken())
		res.status(200).send({
			success: true,
			message: "Displaying reset-password Page",
			csrfToken: req.csrfToken()
		});
	} catch { (err) => {
		console.log(err)
		}
	}
});

router.post("/reset-password", async (req, res) => {
	try {

		const tokenData = await Token.findOne({ token: req.body.token });

		// IF TOKEN VALUE IN PARAMETER IN URL IS EXISTED IN OUR DATABASE...
		if (tokenData) {

			// GETTING THE INPUT DATA FROM USER
			const password = req.body.password;
			const confirmedPassword = req.body.confirmedPassword;
			
			// CHECK ABOVE INPUT IS MATCHED
			if(password === confirmedPassword && password !== "" && confirmedPassword !== "") {

				// ENCRUPT THE PASSWORD AND UPDATE OUR DATABASE
				const salt = await bcrypt.genSalt(10);
				const hashedNewPassword = await bcrypt.hash(password, salt);
				

				const theUser = await User.findOne({ _id: tokenData.userid});
				// console.log(theUser)
				theUser.set({password: hashedNewPassword})
				await theUser.save();

				//await User.findOneAndUpdate({ _id: tokenData.userid, password: hashedPassword });
				await Token.findOneAndDelete({ token: req.body.token });
				
				res.send({ success: true, message: "Password reset successfull" });

			} else {

				// SO USER INPUT IS NOT MATCHED
				res.send({ success: false, message: "Your input is not proper" });

			}


		} else {

			res.send({ success: false, message: "Your token value is not proper" });

		}

	} catch (error) {

		res.status(500).send(error);

	}

});



// router.get("/emailverify", async (req,res) => {
// 	try {
// 		console.log("DISPLAYING EMAIL VERIFICATION PAGE")
// 		console.log(req.csrfToken())
// 		res.status(200).send({
// 			success: true,
// 			message: "Displaying email verification Page",
// 			csrfToken: req.csrfToken()
// 		});
// 	} catch { (err) => {
// 		console.log(err)
// 		}
// 	}
// });



router.post("/emailverify", async (req, res) => {

	try {

		// console.log(req.body.token)

		// GETTING TOKEN DATA AND SEARCH TO DATABASE
		const tokenData = await Token.findOne({ token: req.body.token });

		// console.log(tokenData)

		// CHANGEG isMember ATTRIBUTE OF USER TO false TO true
		if (tokenData) {

			// ---------------------------------
			// < FIND ONE AND CHANGE THE VALUE > 
			// https://stackoverflow.com/questions/19021549/how-to-update-a-object-in-mongodb-via-mongoose
			//
			const theUser = await User.findOne({ _id: tokenData.userid});
			// console.log(theUser)
			theUser.set({isMember: true})
			await theUser.save();
			// console.log(theUser)
			
			// **** THERE IS AN ISSUE TO DO BELOW
			//      IT JUST DID NOT UPDATED THE VALUE
			//await User.findOneAndUpdate({ _id: tokenData.userid, isMember: true });

			// -----------------------------------------------
			// THIS TOKEN IS FOR VERIFYING EMAIL ADDRESS ****
			//  				 ~~~~~~~~~~~~~~~~~~~~~~~
			// SO WE DELETE IT AFTER UPDATE
			await Token.findOneAndDelete({ token: req.body.token });

			// SEND RESULT TO CLIENT
			res.send({ success: true, message: "Email Verified Successlly" });

		} else {

			// OR, IF THERE IS AN ERROR, SEND THE RESULT FOR ERROR TO CLIENT
			res.send({ success: false, message: "Invalid token" });
		}

	} catch (error) {

		// OR IF ANY SERVER ERROR IS OCCURED,
		// SEND THAT ERROR CODE TO CLIENT
		res.status(500).send(error);

	}

});




module.exports = router;
