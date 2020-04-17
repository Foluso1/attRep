const    express         =   require("express")
    ,    newRouter       =   express.Router()
    ,    helper          =   require("../controller/new")
    ,    middleware      =   require("../middleware")
    ,    methodOverride  =   require("method-override")
    // ,    flash           =   require("connect-flash")
    ;
newRouter.use(methodOverride("_method"));

newRouter.route("/lockdown")
    .get(middleware.isLoggedIn, middleware.validator, middleware.signInWithGoogle, helper.getReports)
    .post(middleware.isLoggedIn, helper.postNewReport);


newRouter
    .route("/lockdown/new")
    .get(middleware.isLoggedIn, helper.newReport);

// newRouter
//     .route("/lockdown/:id/edit")
//     .put(middleware.isLoggedIn, helper.editReport)

newRouter
    .route("/lockdown/:id")
    .delete(middleware.isLoggedIn, helper.delReport)
    .put(middleware.isLoggedIn, helper.newRep);


module.exports = newRouter;