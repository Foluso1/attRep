const       express         =   require("express")
        ,   router  =   express.Router()
        ,   helper          =   require("../controller/disciple")
        ,   middleware      =   require("../middleware")
        ,   methodOverride  =   require("method-override")
        ;

router.use(methodOverride("_method"));
        
router.use("/disciple", (req, res, next) => {
    res.locals.req = req;
    next();
});

router.route("/")
    .get(middleware.isLoggedIn, helper.getDisciples)
    .post(middleware.isLoggedIn, helper.postDisciple);

router.route("/new")
    .get(middleware.isLoggedIn, helper.createNewDiscple);

router.route("/:id")
    .put(middleware.isLoggedIn, helper.editDisciple)
    .delete(middleware.isLoggedIn, helper.deleteDisciple)

router.route("/:id/edit")
    .get(middleware.isLoggedIn, helper.getOneDisciple)

module.exports = router;
