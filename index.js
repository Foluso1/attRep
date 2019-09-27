require("dotenv").config();
const       express                 =   require("express")
        ,   app                     =   express()
        ,   Worker                  =   require("./models/worker")
        ,   flash                   =   require("connect-flash")
        ,   passport                =   require("passport")
        ,   passportLocal           =   require("passport-local")
        ,   reportRouter            =   require("./routes/report")
        ,   discipleRouter          =   require("./routes/disciple")
        ,   expressSession          =   require("express-session")
            ;


const PORT = process.env.PORT;
const IP = process.env.IP;

app.use((req, res, next) => {
    console.log("////////////////At res.locals");
    console.log(req.isAuthenticated());
    console.log("////////////////@@@@@@");
    console.log(res.locals);
    let user = req.user;
    console.log(user);
    res.locals.authenticated = req.user;
    res.locals.loggedInWorker = req.user;
    res.locals.cdn = process.env.css_cdn;
    console.log("~~~~~~~~~~~~");
    console.log(res.locals);
    next();
    console.log("lllllllllllllllllllllll");
    console.log(res.locals);
})

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




app.use('/report', isLoggedIn, reportRouter);
app.use('/disciple', isLoggedIn, discipleRouter);
// app.use("/api/workers", workerRouter);


app.get("/", (req, res) => {
    console.log(req.worker);
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




function isLoggedIn(req, res, next) {
    console.log("////////////////At isloggedin");
    console.log(req.isAuthenticated());
    console.log(req)
    
    // if (res.locals.authenticated) {
    // if (req.isAuthenticated()) {
    //     console.log(res.locals.authenticated);
        return next()
    // }
    // console.log(res.locals);
    // res.redirect("/login");
};

app.listen(PORT, IP, () => console.log(`The server is listening at ${PORT}`));


