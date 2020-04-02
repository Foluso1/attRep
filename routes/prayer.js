const       express         =   require("express")
        ,   prayerRouter    =   express.Router()
        ,   Prayer          =   require("../models/prayer")
        ,   controller      =   require("../controller/prayer")
        ,   middleware      =   require("../middleware")
        ,   flash           =   require("connect-flash")
        ;

    
prayerRouter.use(flash());


prayerRouter.route("/new")
    .get(middleware.isLoggedIn, controller.newPrayerReport);

prayerRouter.route("/")
    .get(middleware.isLoggedIn, controller.getPrayerReports)
    .post(middleware.isLoggedIn, controller.postPrayerReport);

prayerRouter.route("/:id")
    .delete(middleware.isLoggedIn, controller.deletePrayerReport);

module.exports = prayerRouter;
