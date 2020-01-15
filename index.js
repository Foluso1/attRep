require("dotenv").config();
const       express                 =   require("express")
        ,   app                     =   express()
        ,   db                      =   require("./models")
        ,   Worker                  =   require("./models/worker")
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


app.use((req, res, next) => {
    res.locals.loggedInWorker = req.user;
    res.locals.cdn = process.env.css_cdn;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

app.use('/report', reportRouter);
app.use('/disciple', discipleRouter);
app.use('/prayer', prayerRouter);
app.use('/prayerChain', prayerChainRouter);
app.use('/lma', lmaRouter);
app.use(flash());
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

app.post("/register", function (req, res) {
    Worker.register(new Worker({ 
        username: req.body.username,
        password: req.body.password
     }), req.body.password)
        .then((user) => {
            res.redirect("/login");
        })
        .catch( (err) => {
            console.log(err);
            if (err.name === "UserExistsError") {
                req.flash("error", "User Already Exists");
                res.redirect("/login");
            } else if (password === "") {
                req.flash("error", "Please, provide a password")
                res.redirect("/register");
            } else if (username === "") {
                req.flash("error", "Please, provide a username")
                res.redirect("/register");
            } else {
                req.flash("error", "Try a different username or password")
                res.redirect("/register");
            }
            console.log(err)
        })
});

app.post("/login", passport.authenticate("local", {
        successRedirect: "/report",
        failureRedirect: "/login",
        failureFlash: true
    }), (req, res) => {
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
    console.log("PUT");
    console.log("req.body////////////");
    console.log(req.body)
    let profile = {
        username: req.body.username,
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


