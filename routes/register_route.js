const       express         =       require("express")
,           router          =       express.Router()
,           passport        =       require("passport")
,           Worker          =       require("../models/worker")
,           middleWare      =       require("../middleware")
,           TempUser        =       require("../models/tempUser")
,           nodemailer      =       require("nodemailer")
,           crypto          =       require("crypto")
,           methodOverride  =       require("method-override")


router.use(methodOverride("_method"));

router.get("/register", (req, res) => {
    res.render("register/regMail");
});

router.post("/register", async (req, res) => {
    let host = "mail.foz.ng";
    try {
        let email = req.body.email;
        let userRegister = new TempUser({email})
        let foundTempUser = await TempUser.find({email});
        if(foundTempUser){
            await TempUser.find({email}).deleteMany();
        }
        let regNewUser = await TempUser.create(userRegister);
        
        let foundUser = await Worker.findOne({email});
        if (foundUser){
            req.flash("error", "Email already registered")
            return  res.redirect("/login");
        }

        let token = crypto.randomBytes(20).toString('hex');
        regNewUser.resetPasswordToken = token;
        regNewUser.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await regNewUser.save();

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: "mail.foz.ng",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: process.env.user, // generated ethereal user
                pass: process.env.pass // generated ethereal password
            },
            logger: true, 
            debug: true,
        });
        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: `"Report App" <no-reply@foz.ng>`, // sender address
            to: email, // list of receivers
            subject: 'Report App | Complete Registration', // Subject line
            text: 'Hello,\n\n' +
                'Complete the registration process by clicking on the link below, or paste this into your browser to complete the process:\n\n' +
                'http://' + req.headers.host + '/regmail/' + token + '\n\n', // plain text body
            html: `<p>Hello</p>
            <p>To complete your registration on the Report App,</p>
            <p>Please click on the button below to complete the process.</p>
            <br>
            <a style="background-color:rgb(0, 114, 245); border-radius: 4px; text-decoration: none; color: white; padding: 5px 14px; font-size: 12pt;" href="http://${req.headers.host}/regmail/${token}">Register</a>
            <br>
            <p>If you did not initiate this, please ignore this email.</p>`
            // html body
        });
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        console.log("Message sent: %s", info.messageId);
        res.render("register/emailSent", {givenEmail: email});

    } catch(e) {
        console.log(e);
        let error = {
            name: "UserExistsError",
            message: "A user with the given email is already registered"
        }
        if (host !== e.hostname && e.hostname !== undefined) {
            req.flash("error", "There was a problem. Check your network connection");
            res.send("There was a problem. Check your network connection");
        } else if (e.hostname === undefined && (e.errno === 'ECONNRESET' || e.errno === 'ETIMEDOUT' || e.errno == "-4039")) {
            req.flash("error", "There was a problem. Check your network connection");
            res.redirect("/register");
        } else {
            req.flash("error", "There was a problem. Contact Admin");
            res.redirect("/register");
        }
    }    
});





////////////////FINAL REGISTRATION////////////////
router.get("/regmail/:token", async (req, res) => {
    let token = req.params.token;
    try {
        let foundTempUser = await TempUser.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
            if (!foundTempUser) {
                req.flash('error', 'Password reset token is invalid or has expired.');
                return res.redirect('/register');
            }
        let email = foundTempUser.email
        res.render('register', { email, token });
    } catch (e) {
        console.log(e)
    }
})

router.post("/regmail/:token", async (req, res) => {
    let token = req.params.token;
    try {
        let foundTempUser = await TempUser.findOne({resetPasswordToken: token})
        
        if (!foundTempUser) {
            req.flash("error", "Invalid registration method");
            return res.redirect("/register");
        }
        let userRegister = new Worker({
            username: req.body.username.trim(),
            firstname: req.body.firstname.trim(),
            surname: req.body.surname.trim(),
            email: foundTempUser.email.trim(),
            church: req.body.church,
            fellowship: req.body.fellowship,
            department: req.body.department,
            prayerGroup: req.body.prayerGroup
        });
        if (req.body.password != req.body.password2) {
            req.flash("error", "Password mismatch");
            return res.redirect(`/regmail/${token}`);
        }
        let regNewUser = await Worker.register(userRegister, req.body.password);
        req.logIn(regNewUser, () => {
            res.redirect("/home");
        });
        foundTempUser.remove();
    } catch (e) {
        console.log(e)
        if(e.code == "11000"){
            req.flash("error", "Provide a different username OR Your TRCN is probably in use by another user")
            res.redirect(`/regmail/${token}`);
        } else {
            req.flash("error", "There was a problem");
            res.redirect(`/regmail/${token}`);
        }
        
    }
})


module.exports = router;