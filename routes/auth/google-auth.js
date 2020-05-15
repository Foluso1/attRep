require("dotenv").config();
const express          =   require("express")
    ,       googleRouter          =   express.Router()
    ,       passport              =   require("passport")
    ,       Worker                =   require("./../../models/worker")
    ,       GoogleStrategy        =   require("passport-google-oauth").OAuth2Strategy
    ,       expressSession        =   require("express-session")
;



passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/google/auth/google/callback"
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            let googleProfile = {
                googleId: profile.id,
                googleDisplayName: profile.displayName,
                googleMail: profile.emails[0].value,
                provider: profile.provider,
            }
            return done(null, googleProfile);
        } catch (e) {
            console.log(e);
        }
    }
));


passport.serializeUser((worker, done) => {
    try {
    let obj;
    if (worker.id) {
        ("At serialize", worker.id);
        obj = worker.id;
    } else if (worker.googleId) {
        obj = { id: worker.googleId, provider: worker.provider};
    } else if (worker.facebookId) {
        obj = { id: worker.facebookId, provider: worker.provider };
    } else {
        obj = worker;
    }
    done(null, obj);
    } catch (e) {
        console.log(e);
    }
});
passport.deserializeUser(async(workerId, done) => {
    try {
        let foundWorker;
        if (typeof(workerId) == "object"){
            if (workerId.provider == "google") {
                foundWorker = await Worker.findOne({ googleIdentity: workerId.id });
            } else if (workerId.provider == "facebook") {
                foundWorker = await Worker.findOne({ facebookIdentity: workerId.id })
            }
        } else if (isNaN(workerId)) {
            foundWorker = await Worker.findById({ _id: workerId }); 
        } else {
            foundWorker = "User Not Found"
        }
        done(null, foundWorker);
    } catch (e) {
        console.log(e);
    }
});



googleRouter.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

googleRouter.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login', failureFlash: true }),
    async (req, res) => {
        try {
            // SIGN UP WITH GOOGLE // check if user is logged in
            if (res.locals.loggedInWorker !== undefined && res.locals.loggedInWorker._id !== undefined) {
                // findByIdAndUpdate
                let googleProfile = {
                    googleIdentity: req.user.googleId,
                    googleName: req.user.googleDisplayName,
                    googleMail: req.user.googleMail
                }
                let workerId = res.locals.loggedInWorker._id;
                await Worker.findByIdAndUpdate({ _id: workerId }, googleProfile, { new: true });
                req.flash("success", "You have successfully linked your Google account")
                res.redirect('/profile');
            } else {
                // SIGN IN WITH GOOGLE //check if user's google account is associated
                let foundWorker = await Worker.findOne({ googleIdentity: req.user.googleId });
                if (foundWorker == null){
                    req.flash("error", "Sorry, your account is not linked with Google. Please, try another login method")
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

module.exports = googleRouter;