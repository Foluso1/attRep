const       express                 =   require("express")
        ,   prayerGroupRouter       =   express.Router()
        ,   controller              =   require("../controller/prayerGroupCoord")
        ,   middleware              =   require("../middleware")
        ,   flash                   =   require("connect-flash")
        ;

prayerGroupRouter.use(flash());

prayerGroupRouter.route("/")
    .get(controller.start)
    .post(middleware.codeCheck, controller.checkCode);

prayerGroupRouter.route("/admin")
    .get(middleware.isLoggedIn, middleware.isLMA, controller.admin)
    .post(middleware.isLoggedIn, middleware.isLMA, controller.genCode);

prayerGroupRouter.route("/all")
    .get(controller.getAllReports);

prayerGroupRouter.route("/:id")
    .get(controller.getOneReport);

module.exports = prayerGroupRouter;
