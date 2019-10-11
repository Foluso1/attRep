const       express         =   require("express")
        ,   prayerRouter    =   express.Router()
        ,   Prayer          =   require("../models/prayer")
        ,   controller      =   require("../controller/prayer")
        ,   middleware      =   require("../middleware")
        ;

    


prayerRouter.route("/new")
    .get(middleware.isLoggedIn, controller.newPrayerReport);

prayerRouter.route("/")
    .get(middleware.isLoggedIn, controller.getPrayerReports)
    .post(middleware.isLoggedIn, controller.postPrayerReport);

module.exports = prayerRouter;
