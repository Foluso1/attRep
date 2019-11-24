const       express         =   require("express")
        ,   discipleRouter  =   express.Router()
        ,   helper          =   require("../controller/disciple")
        ,   middleware      =   require("../middleware")
        ;

discipleRouter.use("/disciple", (req, res, next) => {
    res.locals.req = req;
    next();
});

discipleRouter.route("/")
    .get(helper.getDisciples)
    .post(middleware.isLoggedIn, helper.postDisciple);


discipleRouter.route("/new")
    .get(helper.createNewDiscple);


module.exports = discipleRouter;
