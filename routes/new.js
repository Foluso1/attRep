const    express         =   require("express")
    ,    newRouter    =   express.Router()
    ,    helper          =   require("../controller/new")
    ,    middleware      =   require("../middleware")
    ,    methodOverride  =   require("method-override")
    ,    flash           =   require("connect-flash")
    ;

newRouter.use(express.urlencoded({ extended: true }));
newRouter.use(flash());
newRouter.use(methodOverride("_method"));


newRouter.route("/lockdown")
    .get(middleware.isLoggedIn, middleware.validator, middleware.signInWithGoogle, helper.getReports)
    .post(middleware.isLoggedIn, helper.postNewReport);

newRouter.route("/lockdown/new")
    .get(middleware.isLoggedIn, helper.newReport)
    // .delete(middleware.isLoggedIn, helper.removeDisciple);

// newRouter.route("/:id")
//     .get(middleware.isLoggedIn, helper.getOneReport)
//     .delete(middleware.isLoggedIn, helper.deleteReport);

// newRouter.route("/:id/edit")
//     .get(middleware.isLoggedIn, helper.editOneReport)
//     .post(middleware.isLoggedIn, helper.addDisciple)
//     .delete(middleware.isLoggedIn, helper.removeDisciple);

module.exports = newRouter;