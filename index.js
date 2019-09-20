require("dotenv").config();
const       express                 =   require("express"),
            app                     =   express(),
            Worker                  =   require("./models/worker")
//          ,   workerRouter        =   require("./routes/workers")
        ,   db                      =   require("./models")
        ,   passport                =   require("passport")
        ,   passportLocal           =   require("passport-local")
        ,   passportLocalMongoose   =   require("passport-local-mongoose")
        ,   expressSession          =   require("express-session")
            ;


const PORT = process.env.PORT;
const IP = process.env.IP;


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
    res.locals.cdn = process.env.css_cdn;
    next();
})

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
    //receive data from req.body
    //post to db
    console.log(req.body);
    Worker.register({ 
        username: req.body.username,
     }, req.body.password)
        .then((user) => {
            console.log("New User Details in DB:" + user);
            res.redirect("/login");
        })
        .catch( (err) => {
            console.log(err)
        })
    // res.send("Hello Post route for register");
});


app.get("/report/:id", isLoggedIn, (req, res) => {
    let id = req.params.id;
    console.log(req.params)
    db.Worker.findById({ _id: id })
        .then( (foundWorker) => {
            console.log(foundWorker);
            res.render("report", {worker: foundWorker});
        })
        .catch( (err) => {
            console.log(err);
        })
});


app.post("/login", passport.authenticate("local", {
        successRediect: "/:id", 
        failureRediect: "/login"
    }), (req, res) => {
})

// app.post("/login", (req, res) => {
//     // console.log(req.body._id);
//     const user = {
//         // id: req.body._id,
//         name: req.body.name
//     };
//     db.Worker.findOne(user)
//         .then( (worker) => {
//             if(!(worker === null)){
//                 res.redirect(`/report/${worker._id}`);
//             } else {
//                 res.json(worker);
//             }
//         })
//         .catch( (err) => {
//             console.log(err);
//         });
// });


function isLoggedIn (req, res, next) {
    if(isAuthenticated){
        return next()
    }
    res.redirect("/login");
};

app.listen(PORT, IP, () => console.log(`The server is listening at ${PORT}`));


