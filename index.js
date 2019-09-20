require("dotenv").config();
const       express                 =   require("express"),
            app                     =   express(),
            Worker                  =   require("./models/worker")
        ,   flash                   =   require("connect-flash")
        // ,   LocalStrategy           =   require('passport-local').Strategy
        ,   db                      =   require("./models")
        ,   passport                =   require("passport")
        ,   passportLocal           =   require("passport-local")
        ,   passportLocalMongoose   =   require("passport-local-mongoose")
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


// app.use("/api/workers", workerRouter);
app.use(function(req, res, next){
    res.locals.loggedInWorker = req.user;
    res.locals.cdn = process.env.css_cdn;
    next();
})

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

app.get("/report", isLoggedIn, (req, res) => {
    res.render("report");
});

app.post("/report", isLoggedIn, (req, res) => {
    res.send("post route for reports");
});

app.get("/report/new", isLoggedIn, (req, res) => {
    res.send("report form here!");
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


app.get("/:id", isLoggedIn, (req, res) => {
    let id = req.params.id;
    console.log(req.params.id)
    Worker.findById({ _id: id })
        .then((foundWorker) => {
            res.render("report");
            // res.redirect(`$`);
        })
        .catch((err) => {
            console.log(err);
        })
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect("/login");
};

app.listen(PORT, IP, () => console.log(`The server is listening at ${PORT}`));


