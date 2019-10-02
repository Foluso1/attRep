const    express         =   require("express")
    ,    reportRouter    =   express.Router()
    , Worker = require("../models/worker")
    ,    helper          =   require("../controller/report")
    , passport = require("passport")
    , passportLocal = require("passport-local")
         ;


reportRouter.use(passport.initialize());
reportRouter.use(passport.session());

passport.use(new passportLocal(Worker.authenticate()));
passport.serializeUser(Worker.serializeUser());
passport.deserializeUser(Worker.deserializeUser());

reportRouter.use("/report", (req, res, next) => {
    res.locals.req = req;
    next();
});


reportRouter.route("/")
    .get(helper.getReports)
    .post(helper.postReport);


reportRouter.route("/new")
    .get(helper.newReport);

reportRouter.route("/:id")
    .get(helper.getOneReport);


module.exports = reportRouter;