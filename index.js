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
        ,   indexRouter             =   require("./routes/index")
        ,   methodOverride          =   require("method-override")
        ,   expressSession          =   require("express-session")
        ,   googleRouter            =   require("./routes/auth/google-auth")
        ,   facebookRouter          =   require("./routes/auth/facebook-auth")
        ,   moment                  =   require("moment")
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
app.use('/', indexRouter);
app.use(methodOverride("_method"));
app.locals.moment = moment; 



app.listen(PORT, IP, () => console.log(`The server is listening at ${PORT}`));


