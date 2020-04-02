const    express         =   require("express")
    ,    reportRouter    =   express.Router()
    ,    helper          =   require("../controller/report")
    ,    middleware      =   require("../middleware")
    ,    methodOverride  =   require("method-override")
    ,    flash           =   require("connect-flash")
    ;

reportRouter.use(express.urlencoded({ extended: true }));
reportRouter.use(flash());
reportRouter.use(methodOverride("_method"));


reportRouter.route("/")
    // .get(middleware.isLoggedIn, middleware.signInWithGoogle, helper.getReports)
    .get(middleware.isLoggedIn, middleware.validator, middleware.signInWithGoogle, middleware.signInWithFacebook, helper.getReports)
    .post(middleware.isLoggedIn, helper.postNewReport);

reportRouter.route("/new")
    .get(middleware.isLoggedIn, helper.newReport)
    .delete(middleware.isLoggedIn, helper.removeDisciple);

reportRouter.route("/:id")
    .get(middleware.isLoggedIn, helper.getOneReport)
    .delete(middleware.isLoggedIn, helper.deleteReport);

reportRouter.route("/:id/edit")
    .get(middleware.isLoggedIn, helper.editOneReport)
    .post(middleware.isLoggedIn, helper.addDisciple)
    .delete(middleware.isLoggedIn, helper.removeDisciple);

module.exports = reportRouter;