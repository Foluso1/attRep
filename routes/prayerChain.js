const       express              =   require("express")
        ,   prayerChainRouter    =   express.Router()
        // ,   PrayerChain          =   require("../models/prayerChain")
        ,   controller           =   require("../controller/prayerChain")
        ,   middleware           =   require("../middleware")
        ;

    


prayerChainRouter.route("/new")
    .get(middleware.isLoggedIn, controller.newPrayerReport);

prayerChainRouter.route("/")
    .get(middleware.isLoggedIn, controller.getPrayerReports)
    .post(middleware.isLoggedIn, controller.postPrayerReport);

prayerChainRouter.route("/:id")
    .put(middleware.isLoggedIn, controller.updatePrayerReport);

module.exports = prayerChainRouter;
