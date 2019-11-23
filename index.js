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
    next();
})

app.use('/report', reportRouter);
app.use('/disciple', discipleRouter);
app.use('/prayer', prayerRouter);
app.use('/prayerchain', prayerChainRouter);
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


app.listen(PORT, IP, () => console.log(`The server is listening at ${PORT}`));


