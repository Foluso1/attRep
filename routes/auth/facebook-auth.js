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



// facebookRouter.get('/auth/facebook', passport.authenticate('facebook', { scope: ['read_stream', 'publish_actions']}));
facebookRouter.get('/auth/facebook', passport.authenticate('facebook'));

facebookRouter.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login', failureFlash: true }),
    async (req, res) => {
        try {
            // SIGN UP WITH FACEBOOK // check if user is logged in
            if (res.locals.loggedInWorker !== undefined && res.locals.loggedInWorker._id !== undefined) {
                // findByIdAndUpdate
                let facebookProfile = {
                    facebookIdentity: req.user.facebookId,
                    facebookName: req.user.facebookDisplayName
                }
                let workerId = res.locals.loggedInWorker._id;
                let foundWorker = await Worker.findByIdAndUpdate({ _id: workerId }, facebookProfile, { new: true });
                req.flash("success", "You have successfully linked your facebook account")
                res.redirect('/profile');
            } else {
                // SIGN IN WITH FACEBOOK //check if user's facebook account is associated
                let foundWorker = await Worker.findOne({ facebookIdentity: req.user.facebookId });
                if (foundWorker == null){
                    req.flash("error", "Sorry, your account is not linked with facebook. Please, try another login method")
                    res.redirect("/login");
                } else {
                    res.redirect('/discipleship');
                }
            }
        } catch (err) {
            console.log(err);
        }

    });

    /////////

module.exports = facebookRouter;