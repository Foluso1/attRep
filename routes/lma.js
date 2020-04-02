const       express     =   require("express")
        ,   lmaRouter   =   express.Router()
        ,   Worker      =   require("../models/worker")
        ,   controller  =   require("../controller/lma")
        ,   middleware  =   require("../middleware")
        ,   moment      =   require("moment")

;


lmaRouter
    .route("/")
        .get(middleware.isLoggedIn, middleware.isLMA, controller.getWorkers)
        .post(middleware.isLoggedIn, middleware.isLMA, controller.postWorker)
        .put(middleware.isLoggedIn, middleware.isLMA, controller.editWorker)
        .delete(middleware.isLoggedIn, middleware.isLMA, controller.removeWorker);

lmaRouter
    .route("/all")
        .get(middleware.isLoggedIn, middleware.isLMA, controller.getAllPrayerReports);

lmaRouter
    .route("/new")
        .get(middleware.isLoggedIn, middleware.isLMA, controller.addRemoveOrDelWorker);

lmaRouter
    .route("/:id/prayer")
        .get(middleware.isLoggedIn, middleware.isLMA, controller.getPrayerReport);

lmaRouter
    .route("/:id/report")
        .get(middleware.isLoggedIn, middleware.isLMA, controller.getDiscipleshipReport);

lmaRouter
    .route("/:id/prayerChain")
        .get(middleware.isLoggedIn, middleware.isLMA, controller.getPrayerChainReport)

lmaRouter
    .route("/:id")
        .delete(middleware.isLoggedIn, middleware.isLMA, controller.deleteWorker);

module.exports = lmaRouter;

// Do a looop
// find the worker
// populate the prayer report
// Get the "yes" of the array
// 