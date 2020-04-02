require("dotenv").config();
const express          =   require("express")
    ,       facebookRouter          =   express.Router()
    ,       passport              =   require("passport")
    ,       Worker                =   require("../../models/worker")
    ,       FacebookStrategy      =   require("passport-facebook").Strategy
    ,       expressSession        =   require("express-session")
;



passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "/facebook/auth/facebook/callback"
},
    function (accessToken, refreshToken, profile, done) {
        try {
            console.log(profile)
            facebookProfile = {
                facebookId: profile.id,
                facebookDisplayName: profile.displayName,
                provider: profile.provider,
            }
            done(null, facebookProfile)
        } catch (e) {
            console.log(e);
        }
    }
));



// passport.serializeUser((worker, done) => {
//     try {
//         let obj;
//         if (worker.id) {
//             console.log("At serialize", worker.id);
//             obj = worker.id;
//         } else if (worker.googleId) {
//             console.log("At serialize", worker.googleId);
//             obj = { id: worker.googleId, provider: worker.provider };
//         } else if (worker.facebookId) {
//             console.log("At serialize", worker.facebookId);
//             obj = { id: worker.facebookId, provider: worker.provider };
//             console.log(obj);
//         } else {
//             console.log("At serialize", worker);
//             obj = worker;
//         }
//         done(null, obj);
//     } catch (e) {
//         console.log(e);
//     }
// });
// passport.deserializeUser(async (workerId, done) => {
//     try {
//         console.log("workerId", workerId);
//         let foundWorker;
//         if (typeof (workerId) == "object") {
//             console.log("at deserialize, found worker", workerId)
//             if (workerId.provider == "google") {
//                 foundWorker = await Worker.findOne({ googleIdentity: workerId.id });
//             } else if (workerId.provider == "facebook") {
//                 foundWorker = await Worker.findOne({ facebookIdentity: workerId.id })
//             }
//         } else if (isNaN(workerId)) {
//             console.log("at deserialize, found worker")
//             foundWorker = await Worker.findById({ _id: workerId });
//         } else {
//             console.log("at deserialize, nooooo worker")
//             foundWorker = "User Not Found"
//         }
//         done(null, foundWorker);
//     } catch (e) {
//         console.log(e);
//     }
// });


// facebookRouter.get('/auth/facebook', passport.authenticate('facebook', { scope: ['read_stream', 'publish_actions']}));
facebookRouter.get('/auth/facebook', passport.authenticate('facebook'));

facebookRouter.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login', failureFlash: true }),
    async (req, res) => {
        try {
            // SIGN UP WITH FACEBOOK // check if user is logged in
            if (res.locals.loggedInWorker !== undefined && res.locals.loggedInWorker._id !== undefined) {
                // findByIdAndUpdate
                console.log("find and update...")
                console.log(req.user);
                let facebookProfile = {
                    facebookIdentity: req.user.facebookId,
                    facebookName: req.user.facebookDisplayName
                }
                let workerId = res.locals.loggedInWorker._id;
                console.log("hey");
                let foundWorker = await Worker.findByIdAndUpdate({ _id: workerId }, facebookProfile, { new: true });
                console.log(facebookProfile);
                req.flash("success", "You have successfully linked your facebook account")
                res.redirect('/profile');
            } else {
                // SIGN IN WITH FACEBOOK //check if user's facebook account is associated
                console.log("find in database...")
                let foundWorker = await Worker.findOne({ facebookIdentity: req.user.facebookId });
                if (foundWorker == null){
                    req.flash("error", "Sorry, your account is not linked with facebook. Please, try another login method")
                    res.redirect("/login");
                } else {
                    res.redirect('/report');
                }
            }
        } catch (err) {
            console.log(err);
        }

    });

    /////////

module.exports = facebookRouter;