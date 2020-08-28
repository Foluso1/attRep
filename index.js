require("dotenv").config({ path: `${__dirname}/../../Google\ Drive/Node/attRep/.env` });
const       express                 =   require("express")
        ,   app                     =   express()
        ,   db                      =   require("./models")
        ,   Worker                  =   require("./models/worker")
        ,   GoogleStrategy          =   require('passport-google-oauth').OAuth2Strategy
        ,   flash                   =   require("connect-flash")
        ,   passport                =   require("passport")
        ,   LocalStrategy           =   require("passport-local").Strategy
        ,   discipleshipRouter      =   require("./routes/discipleship_route")
        ,   attendanceRouter        =   require("./routes/attendance_route")
        ,   expectedRouter          =   require("./routes/expected_attendance_route")
        ,   evangelismRouter        =   require("./routes/evangelism_route")
        ,   discipleRouter          =   require("./routes/disciple")
        ,   prayerRouter            =   require("./routes/prayer")
        ,   prayerChainRouter       =   require("./routes/prayerChain")
        ,   lmaRouter               =   require("./routes/lma")
        ,   newRouter               =   require("./routes/new")
        ,   indexRouter             =   require("./routes/index")
        ,   registerRouter          =   require("./routes/register_route")
        ,   methodOverride          =   require("method-override")
        ,   expressSession          =   require("express-session")
        ,   googleRouter            =   require("./routes/auth/google-auth")
        ,   facebookRouter          =   require("./routes/auth/facebook-auth")
        ,   moment                  =   require("moment");

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
app.use('/attendance', attendanceRouter);
app.use('/expected', expectedRouter);
app.use('/discipleship', discipleshipRouter);
app.use('/evangelism', evangelismRouter);
app.use('/disciple', discipleRouter);
app.use('/prayer', prayerRouter);
app.use('/prayerChain', prayerChainRouter);
app.use('/lma', lmaRouter);
app.use('/new', newRouter);
app.use('/google', googleRouter);
app.use('/facebook', facebookRouter);
app.use('/', indexRouter);
app.use('/', registerRouter);
app.use(methodOverride("_method"));
moment.locale("en-gb");
app.locals.moment = moment; 


app.listen(PORT, () => console.log(`The server is listening at ${PORT}`));