const disciple = require("../models/disciple");

const       express         =       require("express")
,           router          =       express.Router()
,           passport        =       require("passport")
,           Worker          =       require("../models/worker")
,           Disciple        =       require("../models/disciple")
,           middleWare      =       require("../middleware")
,           nodemailer      =       require("nodemailer")
,           crypto          =       require("crypto")
,           methodOverride  =       require("method-override")


router.use(methodOverride("_method"));



router.get("/", (req, res) => {
    res.render("index");
});

router.get("/home", middleWare.isLoggedIn, async (req, res) => {
    try {        
        let thisUser = await Worker.findById({ _id: req.user.id })
            .populate({
                path: "evangelism",
                options: {sort: {date: -1}, limit: 1}
            })
            .populate({
                path: "prayerReport",
                options: {sort: {date: -1}, limit: 1}
            })
            .populate({
                path: "prayerChainReport",
                options: {sort: {date: -1}, limit: 1}
            })
            .populate({
                path: "reports",
                populate: {path: 'disciples'},
                options: {sort: {date: -1}, limit: 1}
            })
            .populate({
                path: "attendance",
                populate: {path: 'disciples'},
                options: {sort: {date: -1}, limit: 1}
            })
            .populate("disciples");
        
        if (thisUser.disciples && thisUser.disciples.length > 0) {
            let arr = [];
            let i = 0
            while(!(arr.length == thisUser.disciples.length)){
                // for(let i=0; i < thisUser.disciples.length; i++){
                    discipleId = thisUser.disciples[i]._id;
                    let foundDisciple = await Disciple.findById({_id: discipleId});
                    foundDisciple.discipler = req.user.id;
                    let saved = await foundDisciple.save()
                    // console.log(saved);
                    if(saved){
                        arr.push("saved");
                    }
                    i++
                // }
            }
        }
        
        await thisUser.save()
        console.log(thisUser.disciples);
        let evangelism = thisUser.evangelism;
        let prayerGroupReport = thisUser.prayerReport;
        let prayerChainReport = thisUser.prayerChainReport;
        let reports = thisUser.reports;
        let attendance = thisUser.attendance;
        res.render("home", {reports, evangelism, prayerChainReport, prayerGroupReport, attendance});
    } catch (e) {
        console.log(e)
    }
});

router.get("/discipleship", middleWare.isLoggedIn, (req, res) => {
    res.redirect("/discipleship")
})

router.get("/discipleship/:id", middleWare.isLoggedIn, (req, res) => {
    let id = req.params.id
    res.redirect(`/discipleship/${id}`)
})

router.get("/login", (req, res) => {
    res.render("login");
});



router.post("/login", passport.authenticate("local", {
    successRedirect: "/validatemail",
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
            let abc = crypto.randomBytes(20);
            let token = abc.toString('hex');
            let user = await Worker.findById({ _id: req.user.id });
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

            let email = Buffer.from(req.body.email, 'binary').toString('base64');//btoa(req.body.email);
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

                // console.log("Message sent: %s", info.messageId);
                // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

                // Preview only available when sending through an Ethereal account
                // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
            }

            main().catch(console.error);
            res.render("emailSent", {givenEmail: req.body.email});
        } else {
            req.flash("error", "Email mismatch!");
            res.redirect("/home")
        }
    } catch (e) {
        console.log(e);
        req.flash("error", "Something went wrong! Try again or contact the admin");
        res.redirect("/home")
    }
});


router.get("/mail/:token/:email", async (req, res)=>{
    try {
        let email = Buffer.from(req.params.email, 'base64').toString('binary')//atob(req.params.email);
        let foundWorker = await Worker.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } })
        if (!foundWorker || foundWorker.emailCheck !== req.params.email ){
            req.flash('error', 'Email token is invalid or has expired OR the link has been tampered with');
            return res.redirect('/discipleship');
        } else {
            req.logIn(foundWorker, async () => {
                foundWorker.email = email;
                foundWorker.resetPasswordToken = undefined;
                foundWorker.resetPasswordExpires = undefined;
                foundWorker.emailCheck = undefined;
                await foundWorker.save()
                req.flash("success", `Your email, ${email} has been added successfully. Thank you!`);
                res.redirect("/home");
            });
        }
    } catch (e) {
        console.log(e)
        req.flash("error", `Something went wrong`);
        res.redirect("/home");
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

                    // console.log("Message sent: %s", info.messageId);
                    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

                    // Preview only available when sending through an Ethereal account
                    // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
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

                    // console.log("Message sent: %s", info.messageId);
                    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

                    // Preview only available when sending through an Ethereal account
                    // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
                }

                main().catch(console.error);
                req.flash("success", "Password changed successfully");
                res.redirect("/home")
            });
        } else {
            req.flash("error", "Passwords do not match.");
            return res.redirect('forgot');
        }

        

    } catch (e) {
        console.log(e);
    }
});



////////////////////VALIDATE MAIL///////////////////////

router.get("/validatemail", async (req, res) => {
    try {
        let thisUser = await req.user;
        if (!thisUser.email){
            req.logOut();
            res.render("validatemail/regMail", {thisUser});
        } else {
            res.redirect("/home")
        }
    } catch (e) {
        console.log(e)
        req.flash("error", "There was a problem");
        res.redirect("/login");
    }
})

router.post("/validatemail/:id", async (req, res) => {
    let host = "mail.foz.ng"
    let email = req.body.email;
    try {
        // console.log("req.user 2//", req.user);
        let foundUser = await Worker.findById({ _id: req.params.id });
        if (!foundUser) {
            console.log("user not found!")
            req.flash("error", "User not found");
            res.redirect("/login");
        } else {
            let token = crypto.randomBytes(20).toString('hex');
            foundUser.email = email;
            foundUser.resetPasswordToken = token;
            foundUser.resetPasswordExpires = Date.now() + 3600000; // 1 hour
            await foundUser.save();

            let testAccount = await nodemailer.createTestAccount();

            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                host: host,
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
                subject: 'Report App | Email Validation', // Subject line
                text: 'This is to validate your account on the Report App.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + '/validatemailtrue/' + token + '\n\n',
                html: `<p>Hello</p>
                        <p>This is to validate your account on the Report App.</p>
                        <p>Please click the button below to complete the process.</p>
                        <br>
                        <a style="background-color:rgb(0, 114, 245); border-radius: 4px; text-decoration: none; color: white; padding: 5px 14px; font-size: 12pt;" href="http://${req.headers.host}/validatemailtrue/${token}">Confirm Mail</a>
                        <br>`
            });
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
            console.log("Message sent: %s", info.messageId);
            res.render("emailSent", {givenEmail: email});
        }
    } catch (e) {
        console.log(e)
        if (host !== e.hostname && e.hostname !== undefined) {
            req.flash("error", "There was a problem. Check your network connection");
            res.send("There was a problem. Check your network connection");
        } else if (e.hostname === undefined && (e.errno === 'ECONNRESET' || e.errno === 'ETIMEDOUT')) {
            req.flash("error", "There was a problem. Check your network connection");
            res.redirect("/validatemail");
        } else {
            req.flash("error", "There was a problem. Contact Admin");
            res.redirect("/validatemail");
        }
    }
})

router.get("/validatemailtrue/:token", async (req, res) => {
    try {
        let token = req.params.token

        let foundWorker = await Worker.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
        if (!foundWorker) {
            req.flash('error', 'Email token is invalid or has expired.');
            return res.redirect('validatemail/regMail');
        }

        foundWorker.resetPasswordToken = undefined;
        foundWorker.resetPasswordExpires = undefined;
        await foundWorker.save()
        req.logIn(foundWorker, () => {
            req.flash("success", "Email validated successfully")
            res.redirect("/home");
        })
    } catch (e) {
        console.log(e)
        req.flash("error", "There was a problem")
        res.redirect("/home")
    }

})



module.exports = router;