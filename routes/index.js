const       express         =       require("express")
,           router          =       express.Router()
,           passport        =       require("passport")
,           Worker          =       require("../models/worker")
,           middleWare      =       require("../middleware")
,           async           =       require("async")
,           nodemailer      =       require("nodemailer")
,           crypto          =       require("crypto")
,           methodOverride  =       require("method-override")


router.use(methodOverride("_method"));



router.get("/", (req, res) => {
    res.render("index");
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.get("/register", (req, res) => {
    res.render("register");
});


router.post("/register", async (req, res) => {
    try {
        if (!req.body.username) throw { name: "Error", message: "Please provide your firstname" };
        if (!req.body.password) throw { name: "Error", message: "Please provide a password" };
        if (!req.body.surname) throw { name: "Error", message: "Please provide your surname" };
        if (req.body.password != req.body.password2) throw { name: "Error", message: "Password mismatch. Please, try again!" };

        await Worker.register(new Worker({
            username: req.body.username.trim(),
            // password: req.body.password,
            firstname: req.body.firstname.trim(),
            surname: req.body.surname.trim(),
            church: req.body.church,
            fellowship: req.body.fellowship,
            department: req.body.department,
            prayerGroup: req.body.prayerGroup
        }), req.body.password)
        req.flash("success", "Successfully Registered! Now login");
        res.redirect("/login");
    } catch (err) {
        console.log(err)
        req.flash("error", err.message);
        res.redirect("/register");
    }
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/report",
    failureRedirect: "/login",
    failureFlash: true
}), (req, res) => {
    req.flash("error", "Something is Wrong")
})


router.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});


router.get("/profile", middleWare.isLoggedIn, async (req, res) => {
    try {
        let foundWorker = await Worker.findById({ _id: req.user._id })
        let profile = {
            username: foundWorker.username,
            firstname: foundWorker.firstname,
            surname: foundWorker.surname,
            church: foundWorker.church,
            fellowship: foundWorker.fellowship,
            department: foundWorker.department,
            prayerGroup: foundWorker.prayerGroup
        }
        res.render("profile", { profile });
    } catch (err) {
        console.log(err);
    }
});

router.put("/profile", middleWare.isLoggedIn, async (req, res) => {
    let profile = {
        username: req.body.username.trim(),
        firstname: req.body.firstname.trim(),
        surname: req.body.surname.trim(),
        church: req.body.church,
        fellowship: req.body.fellowship,
        department: req.body.department,
        prayerGroup: req.body.prayerGroup
    }
    try {
        await Worker.findByIdAndUpdate({ _id: req.user._id }, profile)
        req.logout();
        res.redirect("/login");
    } catch (err) {
        console.log(err);
    }
});

//MAIL SETUP

//Add mail to account
router.post("/mail", async (req, res, next) => {
    try {
        if (req.body.email === req.body.email2) {
            console.log(req.body.email);
            let abc = crypto.randomBytes(20);
            let token = abc.toString('hex');
            let user = await Worker.findById({ _id: req.user.id });
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

            let email = Buffer.from(req.body.email, 'binary').toString('base64');//btoa(req.body.email);
            console.log("email encoded", email);
            user.emailCheck = email;

            await user.save();

            const main = async () => {
                let testAccount = await nodemailer.createTestAccount();

                let transporter = nodemailer.createTransport({
                    host: "mail.foz.ng",
                    port: 465,
                    secure: true, // true for 465, false for other ports
                    auth: {
                        user: process.env.user, // generated ethereal user
                        pass: process.env.pass // generated ethereal password
                    }, 
                    debug: true, // show debug output
                    logger: true // log information in console
                });
                console.log("user.email", user.email);
                // send mail with defined transport object
                let info = await transporter.sendMail({
                    // from: '"Foluso Ogunfile String.codePoint(0x1F637) String.codePoint(0x128567) 👻" <no-reply@scc.foz.ng>', // sender address; 0x1F637 is UNICODE CODEPOINT
                    from: `"Report App" <no-reply@foz.ng>`, // sender address; 0x1F637 is UNICODE CODEPOINT
                    to: req.body.email, // list of receivers
                    subject: 'Report App | Confirm Email', // Subject line
                    // text: 'You are receiving this because you (or someone else) is registering this email on the Report App.\n\n' +
                    //     'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    //     'http://' + req.headers.host + '/mail/' + token + '/' + email + '\n\n' +
                    //     'If you did not request this, please ignore this email and this email will not be registered.\n', // plain text body
                    // html: `<b>${req.body.message}</b>` // html body
                    html: `<p>Hello, ${user.firstname} ${user.surname}</p>
                            <p>You are receiving this because you (or someone else) is registering this email on the Report App.</p>
                            <p>Please click the button below to complete the process:</p><br>
                            <a style="background-color:rgb(0, 114, 245); border-radius: 4px; text-decoration: none; color: white; padding: 5px 12px; font-size: 12pt;" href="http://${req.headers.host}/mail/${token}/${email}">Confirm Mail</a>
                            <br>
                            <p>If you are not ${user.firstname} ${user.surname}, please ignore this email and this email will not be registered.</p>`
                });

                console.log("Message sent: %s", info.messageId);
                // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

                // Preview only available when sending through an Ethereal account
                console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
            }

            main().catch(console.error);
            res.render("emailSent", {givenEmail: req.body.email});
        } else {
            req.flash("error", "Email mismatch!");
            res.redirect("/report")
        }
    } catch (e) {
        console.log(e);
        req.flash("error", "Something went wrong! Try again or contact the admin");
        res.redirect("/report")
    }
});


router.get("/mail/:token/:email", async (req, res)=>{
    try {
        let email = Buffer.from(req.params.email, 'base64').toString('binary')//atob(req.params.email);
        console.log("email after decoding", email)
        let foundWorker = await Worker.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } })
        console.log("Hey here!!!");
        if (!foundWorker || foundWorker.emailCheck !== req.params.email ){
            req.flash('error', 'Email token is invalid or has expired OR the link has been tampered with');
            return res.redirect('/report');
        } else {
            req.logIn(foundWorker, async () => {
                foundWorker.email = email;
                foundWorker.resetPasswordToken = undefined;
                foundWorker.resetPasswordExpires = undefined;
                foundWorker.emailCheck = undefined;
                await foundWorker.save()
                req.flash("success", `Your email, ${email} has been added successfully. Thank you!`);
                res.redirect("/report");
            });
        }
    } catch (e) {
        console.log(e)
    }
})






// FORGOT PASSWORD
router.get('/forgot', (req, res) => {
    res.render('forgot');
});


router.post('/forgot',  async (req, res, next) => {
    try {
        if(req.body.email === req.body.confirm) {
            let givenEmail = req.body.email;
            console.log(req.body.email);
            let user = await Worker.findOne({email: req.body.email});
            if(!user){
                req.flash("error", "Email not found");
                res.redirect("/forgot");
            } else {
                let abc = crypto.randomBytes(20);
                let token = abc.toString('hex');
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                await user.save()

                async function main() {
                    let testAccount = await nodemailer.createTestAccount();

                    let transporter = nodemailer.createTransport({
                        host: "mail.foz.ng",
                        port: 465,
                        secure: true, // true for 465, false for other ports
                        auth: {
                            user: process.env.user, // generated ethereal user
                            pass: process.env.pass // generated ethereal password
                        },
                        debug: true, // show debug output
                        logger: true // log information in console
                    });
                    console.log("user.email", user.email);
                    // send mail with defined transport object
                    let info = await transporter.sendMail({
                        // from: '"Foluso Ogunfile String.codePoint(0x1F637) String.codePoint(0x128567) 👻" <no-reply@scc.foz.ng>', // sender address; 0x1F637 is UNICODE CODEPOINT
                        from: `"Report App" <no-reply@foz.ng>`, // sender address; 0x1F637 is UNICODE CODEPOINT
                        to: req.body.email, // list of receivers
                        subject: 'SCC Report App | Password Change', // Subject line
                        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                            'If you did not request this, please ignore this email and your password will remain unchanged.\n', // plain text body
                        html: `<p>Hello</p>
                            <p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
                            <p>Please click the button below to change your password.</p>
                            <br>
                            <a style="background-color:rgb(0, 114, 245); border-radius: 4px; text-decoration: none; color: white; padding: 5px 14px; font-size: 12pt;" href="http://${req.headers.host}/reset/${token}">Confirm Mail</a>
                            <br>
                            <p>If you did not request this, please ignore this email and the password will not be changed.</p>`
                    });

                    console.log("Message sent: %s", info.messageId);
                    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

                    // Preview only available when sending through an Ethereal account
                    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
                }

                main().catch(console.error);
                res.render("emailSent", {givenEmail});
            }
        } else {
            req.flash("error", "Password mismatch!");
            res.redirect("/forgot");
        }
    } catch(e) {
        console.log(e);
    }
});


router.get('/reset/:token', function (req, res) {
    Worker.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
        if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('/forgot');
        }
        res.render('reset', { token: req.params.token });
    });
});

router.post('/reset/:token', async (req, res) => {
    try {
        let foundWorker = await Worker.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } });
        if (!foundWorker) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('/forgot');
        }
        if (req.body.password === req.body.confirm) {
            await foundWorker.setPassword(req.body.password);
            foundWorker.resetPasswordToken = undefined;
            foundWorker.resetPasswordExpires = undefined;

            await foundWorker.save();
            console.log("before login");
            req.logIn(foundWorker, () => {
                async function main() {
                    let testAccount = await nodemailer.createTestAccount();

                    let transporter = nodemailer.createTransport({
                        host: "mail.foz.ng",
                        port: 465,
                        secure: true, // true for 465, false for other ports
                        auth: {
                            user: process.env.user, // generated ethereal user
                            pass: process.env.pass // generated ethereal password
                        },
                        debug: true, // show debug output
                        logger: true // log information in console
                    });
                    // send mail with defined transport object
                    let info = await transporter.sendMail({
                        // from: '"Foluso Ogunfile String.codePoint(0x1F637) String.codePoint(0x128567) 👻" <no-reply@scc.foz.ng>', // sender address; 0x1F637 is UNICODE CODEPOINT
                        from: `"Report App" <no-reply@scc.foz.ng>`, // sender address; 0x1F637 is UNICODE CODEPOINT
                        to: foundWorker.email, // list of receivers
                        subject: 'Report App | Password Change Confirmation', // Subject line
                        text: 'Hello,\n\n' +
                            'This is a confirmation that the password for your account ' + foundWorker.email + ' has just been changed.\n' // plain text body
                        // html: `<b>${req.body.message}</b>` // html body
                    });

                    console.log("Message sent: %s", info.messageId);
                    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

                    // Preview only available when sending through an Ethereal account
                    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
                }

                main().catch(console.error);
                req.flash("success", "Password changed successfully");
                res.redirect("/report")
            });
        } else {
            req.flash("error", "Passwords do not match.");
            return res.redirect('forgot');
        }

        

    } catch (e) {
        console.log(e);
    }
});


module.exports = router;