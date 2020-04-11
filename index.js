require("dotenv").config();
const       express                 =   require("express")
        ,   app                     =   express()
        ,   db                      =   require("./models")
        ,   Worker                  =   require("./models/worker")
        // ,   User                    =   require("./models/user")
        ,   GoogleStrategy          =   require('passport-google-oauth').OAuth2Strategy
        ,   flash                   =   require("connect-flash")
        ,   passport                =   require("passport")
        ,   LocalStrategy           =   require("passport-local").Strategy
        ,   reportRouter            =   require("./routes/report")
        ,   discipleRouter          =   require("./routes/disciple")
        ,   prayerRouter            =   require("./routes/prayer")
        ,   prayerChainRouter       =   require("./routes/prayerChain")
        ,   middleWare              =   require("./middleware/index")
        ,   lmaRouter               =   require("./routes/lma")
        ,   newRouter               =   require("./routes/new")
        ,   methodOverride          =   require("method-override")
        ,   expressSession          =   require("express-session")
        ,   googleRouter            =   require("./routes/auth/google-auth")
        ,   facebookRouter          =   require("./routes/auth/facebook-auth")
            ;

const PORT = process.env.PORT;
const IP = process.env.IP;

app.use(flash());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/views"));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");



app.use(expressSession({
    secret: process.env.secret,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());



// STRATEGIES

//Local Strategy
passport.use(new LocalStrategy(Worker.authenticate()));

// passport.serializeUser(Worker.serializeUser());
// passport.deserializeUser(Worker.deserializeUser());



////////ROUTES//////////

app.use((req, res, next) => {
    res.locals.loggedInWorker = req.user;
    res.locals.cdn            = process.env.css_cdn;
    res.locals.error          = req.flash("error");
    res.locals.success        = req.flash("success");
    res.locals.baseUrl        = req.baseUrl
    next();
})

app.use(flash());
app.use('/report', reportRouter);
app.use('/disciple', discipleRouter);
app.use('/prayer', prayerRouter);
app.use('/prayerChain', prayerChainRouter);
app.use('/lma', lmaRouter);
app.use('/new', newRouter);
app.use('/google', googleRouter);
app.use('/facebook', facebookRouter);
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


app.post("/register", async (req, res) => {
    try {
        if (!req.body.username) throw {name: "Error", message: "Please provide your firstname"};
        if (!req.body.password) throw {name: "Error", message: "Please provide a password"};
        if (!req.body.surname) throw {name: "Error", message: "Please provide your surname"};
        if (req.body.password != req.body.password2) throw {name: "Error", message: "Password mismatch. Please, try again!"};

        await Worker.register(new Worker({
            username: req.body.username,
            // password: req.body.password,
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
        req.flash("error", "Something is Wrong")
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


