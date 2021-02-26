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
    .get(middleware.isLoggedIn, controller.getOneReport)                  
    .delete(middleware.isLoggedIn, controller.deleteReport);

prayerGroupRouter.route("/:id/delete/:id2")
    .delete(middleware.isLoggedIn, controller.deleteOneAttendee);
    
module.exports = prayerGroupRouter;
