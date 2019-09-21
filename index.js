require("dotenv").config();
const       express                 =   require("express"),
            app                     =   express(),
            Worker                  =   require("./models/worker")
            sundayReport            =   require("./models/sundayReport")
        ,   flash                   =   require("connect-flash")
        ,   cors                    =   require("cors")
        ,   db                      =   require("./models")
        ,   passport                =   require("passport")
        ,   passportLocal           =   require("passport-local")
        ,   passportLocalMongoose   =   require("passport-local-mongoose")
        ,   expressSession          =   require("express-session")
            ;


const PORT = process.env.PORT;
const IP = process.env.IP;

app.use(flash());
app.use(cors());
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
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:27017/workers_scc');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

passport.use(new passportLocal(Worker.authenticate()));
passport.serializeUser(Worker.serializeUser());
passport.deserializeUser(Worker.deserializeUser());

// var whitelist = ['http://localhost:8080', 'mongodb://localhost']
// var corsOptions = {
//     origin: '*'
// }
// var corsOptions = {
//     origin: function (origin, callback) {
//         if (whitelist.indexOf(origin) !== -1 || !origin) {
//                 callback(null, true)
//             } else {
//                 callback(new Error('Not allowed by CORS'))
//             }
//         }
//     }

app.options('/report', cors()) // enable pre-flight request for DELETE request
// app.get('/report', cors(), function (req, res, next) {
//     res.json({ msg: 'This is CORS-enabled for all origins!' })
// })

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

app.get("/report", isLoggedIn, cors(), (req, res) => {
    let worker = {
        _id: req.user.id
    }
    Worker.findById(worker)//.populate("disciples").exec()
        .then((thisDisc) => {
            let disciples = thisDisc.disciples;
            res.render("report", { disciples });
        })
        .catch((err) => {
            console.log(err);
        });
});

app.post("/report", isLoggedIn, (req, res) => {
    // res.send("post route for reports");
    const data = {
        disciple: req.body.disciple
    }
    let worker = {
        _id: req.user.id
    }
    Worker.findById(worker)
        .then( (foundWorker) => {
            console.log(foundWorker.disciples);
            foundWorker.disciples.push(data);
            foundWorker.save()
                .then((worker) => {
                    console.log(worker);
                    res.redirect("/report");
                })
                .catch((err) => {
                    console.log(err);
                })
        })
        .catch( (err) => {
            console.log(err);
        });
});

app.get("/report/new", isLoggedIn, (req, res) => {
    res.render("new");
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


