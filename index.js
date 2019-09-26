require("dotenv").config();
const       express                 =   require("express"),
            app                     =   express(),
            Worker                  =   require("./models/worker")
            Report                  =   require("./models/report")
            Disciple                =   require("./models/disciple")
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


//Good to Go
// app.get("/report", isLoggedIn, (req, res) => {
//     let worker = {
//         _id: req.user.id
//     }
//     Worker.findById(worker).populate("disciples")
//         .then((thisWorker) => {
//             let allDisciples = thisWorker.disciples
//             res.render("report", {allDisciples});
//         })
//         .catch((err) => {
//             console.log(err);
//         });
// });

app.get("/report", isLoggedIn, (req, res) => {
    let worker = {
        _id: req.user.id
    }
    Worker.findById(worker).
    populate('reports')
        .then((presentWorkers) => {
            let reports = presentWorkers.reports;
            let dayWeek = [];
            reports.forEach((report) => {
                let arrDay = [[1, "Monday"], [2, "Tuesday"], [3, "Wednesday"], [4, "Thursday"], [5, "Friday"], [6, "Saturday"], [7, "Sunday"]]
                let j = report.date.getDay();
                let reportDay = arrDay[j-1];
                dayWeek.push(reportDay[1]);
            })
            res.render("report", { reports, dayWeek });
        })
        .catch((err) => {
            console.log(err);
        });
});



//Good to Go Sir
app.post("/report", isLoggedIn, (req, res) => {
    console.log("START////////////")
    let ids = req.body.ids;
    let worker = {
        _id: req.user.id
    }
    const delay = () => new Promise(rel => setTimeout(() => rel(), 2000));
    let cur = Promise.resolve()
    Report.create(new Report)
        .then((newReport) => {
    ids.forEach((id) => {
        cur = cur.then(() => {
            console.log("finding");
            Disciple.findById(id)
            .then((foundDisciple) => {
                newReport.disciples.push(foundDisciple);
            return delay().then(() => {
                console.log("saving");
                newReport.save().then((here)=> console.log(here)).catch((err)=> console.log(err));
                return delay().catch(err => console.error(err))  
            })
            .catch((err) => {
                console.log(err);
            })
            })
            .catch((err) => {
                console.log(err);
            }) 
        })
        .catch((err) => {
            console.log(err);
        });
        
    })
    Worker.findById(worker)
        .then((foundWorker) => {
            foundWorker.reports.push(newReport);
            foundWorker.save();
        })
        .catch((err) => {
            console.log(err);
        })
    .catch((err) => {
        console.log(err);
    });
    });
    res.redirect("/report");
    /////////////
    // Report.create(new Report)
    // .then((newReport) => {
    // let i = 0; 
    // i < ids.length;
    //     Disciple.findById(ids[i])
    //     .then((foundDisciple) => {
    //         console.log("///////");
    //         console.log(ids[i]);
    //         newReport.save()
    //         .then((good) => {
    //             newReport.disciples.push(foundDisciple);
    //         // newReport.save()
    //             console.log(good);
    //             good.save();
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         });
    //     }) 
    //     .catch ((err) => {
    //         console.log(err);
    //     })  
    // ids.forEach((id, i) => {
        // })
    // }    
    // })
        // Worker.findById(worker)
        //     .then((foundWorker) => {
        //         foundWorker.reports.push(newReport);
        //         foundWorker.save()
        //         res.redirect("/report");
        //     })
        //     .catch((err) => {
        //         console.log(err);
        //     })
    // })
    // .catch((err) => {
    //     console.log(err);
    // })
});



//Good to Go Sir
app.get("/report/new", isLoggedIn, (req, res) => {
    let worker = {
        _id: req.user.id
    }
    Worker.findById(worker).populate("disciples")
        .then((thisWorker) => {
            let allDisciples = thisWorker.disciples
            res.render("report_new", { allDisciples });
        })
        .catch((err) => {
            console.log(err);
        });
});



app.get("/disciple", isLoggedIn, (req, res) => {
   console.log("Disciple page");
    // let worker = {
    //     _id: req.user.id
    // }
    // Worker.Reports.find()//.populate("disciples").exec()
    //     .then((thisDisc) => {
    //         let reports = thisDisc.report;
    //         // console.log(worker)
    //         // console.log("////////////////")
    //         console.log(thisDisc);
            res.render("disciple");
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //     });
});


//Good to Go
app.post("/disciple", isLoggedIn, (req, res) => {
    let idWorker = {
        _id: req.user.id
    }
    let data = {
        name: req.body.name
    }
    Disciple.create(data)
    .then((disciple) => {
        Worker.findById(idWorker)
        .then((worker) => {
            worker.disciples.push(disciple)
            worker.save();
            res.redirect("/report/new");
        })
        .catch((err) => {
            console.log(err);
        });
    })
    .catch((err) => {
        console.log(err);
    })
});


app.get("/disciple/new", isLoggedIn, (req, res) => {
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


app.get("/report/:id", isLoggedIn, (req, res) => {
    let id = req.params.id;
    console.log(req.params.id)
    Worker.findById({ _id: id })
        .then((foundWorker) => {
            // res.render("report");
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


