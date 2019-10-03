const    express         =   require("express")
    ,    reportRouter    =   express.Router()
    ,    helper          =   require("../controller/report")
    ,    middleware      =   require("../middleware")
         ;

reportRouter.use(express.urlencoded({ extended: true }));

// reportRouter.use(expressSession({
//     secret: "The workers application",
//     resave: false,
//     saveUninitialized: false
// }));
// reportRouter.use(flash());
// reportRouter.use(passport.initialize());
// reportRouter.use(passport.session());

// passport.use(new passportLocal(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// reportRouter.use("/report");


reportRouter.route("/")
    .get(middleware.isLoggedIn, helper.getReports)
    .post(middleware.isLoggedIn, helper.postReport);


reportRouter.route("/new")
    .get(middleware.isLoggedIn, helper.newReport);

reportRouter.route("/:id")
    .get(middleware.isLoggedIn, helper.getOneReport);


module.exports = reportRouter;