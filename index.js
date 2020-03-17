require("dotenv").config();
const       express                 =   require("express")
        ,   app                     =   express()
        ,   db                      =   require("./models")
        ,   Worker                  =   require("./models/worker")
        ,   User                    =   require("./models/user")
        ,   GoogleStrategy          =   require('passport-google-oauth').OAuth2Strategy
        ,   flash                   =   require("connect-flash")
        ,   passport                =   require("passport")
        ,   passportLocal           =   require("passport-local")
        ,   reportRouter            =   require("./routes/report")
        ,   discipleRouter          =   require("./routes/disciple")
        ,   prayerRouter            =   require("./routes/prayer")
        ,   prayerChainRouter       =   require("./routes/prayerChain")
        ,   middleWare              =   require("./middleware/index")
        ,   lmaRouter               =   require("./routes/lma")
        ,   methodOverride          =   require("method-override")
        ,   expressSession          =   require("express-session")
            ;


const PORT = process.env.PORT;
const IP = process.env.IP;

app.use(flash());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/views"));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
},
    function (accessToken, refreshToken, profile, done) {
        User.create({ googleId: profile.id }, function (err, user) {
            console.log(user);
            return done(err, user);
        });
    }
));

// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: "/auth/google/callback"
// },
//     function (request, accessToken, refreshToken, profile, done) {
//         User.findOne({ oauthID: profile.id }, function (err, user) {
//             if (err) {
//                 console.log(err);  // handle errors!
//             }
//             if (!err && user !== null) {
//                 done(null, user);
//             } else {
//                 user = new User({
//                     oauthID: profile.id,
//                     name: profile.displayName,
//                     created: Date.now()
//                 });
//                 console.log(user);
//                 user.save(function (err) {
//                     if (err) {
//                         console.log(err);  // handle errors!
//                     } else {
//                         console.log("saving user ...");
//                         done(null, user);
//                     }
//                 });
//             }
//         });
//     }
// ));


app.use(expressSession({
    secret: "The workers application",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());

passport.use(new passportLocal(Worker.authenticate()));
passport.serializeUser(Worker.serializeUser());
passport.deserializeUser(Worker.deserializeUser());


passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.loggedInWorker = req.user;
    res.locals.cdn = process.env.css_cdn;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    if (req.baseUrl == "/lma") {
        console.log(req.baseUrl == "/lma")
        res.locals.ownerStatus = false;
    } else {
        console.log("///", req.url)
        console.log(req.originalUrl)
        console.log(req.baseUrl)
        let regExUrl = /([0-9]?[0-9])([0-9][0-9])/;
        res.locals.ownerStatus = true;
    }
    next();
})

app.use(flash());
app.use('/report', reportRouter);
app.use('/disciple', discipleRouter);
app.use('/prayer', prayerRouter);
app.use('/prayerChain', prayerChainRouter);
app.use('/lma', lmaRouter);
app.use(methodOverride("_method"));


app.get("/", (req, res) => {
    res.render("index");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});


/////


app.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
        res.redirect('/report');
    });

    // //////

app.post("/register", async (req, res) => {
    try {
        if (!req.body.username) throw {name: "Error", message: "Please provide your firstname"};
        if (!req.body.password) throw {name: "Error", message: "Please provide a password"};
        if (!req.body.surname) throw {name: "Error", message: "Please provide your surname"};
        if (req.body.password != req.body.password2) throw {name: "Error", message: "Password mismatch. Please, try again!"};

        await Worker.register(new Worker({
            username: req.body.username,
            password: req.body.password,
            firstname: req.body.firstname,
            surname: req.body.surname,
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

app.post("/login", passport.authenticate("local", {
        successRedirect: "/report",
        failureRedirect: "/login",
        failureFlash: true
    }), (req, res) => {
        console.log("Hey, there is a problem here!");
})


app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});


app.get("/profile", middleWare.isLoggedIn, async (req, res) => {
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

app.put("/profile", middleWare.isLoggedIn, async (req, res) => {
    let profile = {
        username: req.body.username,
        firstname: req.body.firstname,
        surname: req.body.surname,
        church: req.body.church,
        fellowship: req.body.fellowship,
        department: req.body.department,
        prayerGroup: req.body.prayerGroup
    }
    try {
        await Worker.findByIdAndUpdate({_id: req.user._id}, profile)
        req.logout();
        res.redirect("/login");
    } catch (err) {
        console.log(err);
    }
});

app.listen(PORT, IP, () => console.log(`The server is listening at ${PORT}`));


