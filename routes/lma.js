const       express     =   require("express")
        ,   lmaRouter   =   express.Router()
        ,   controller  =   require("../controller/lma")
        ,   middleware  =   require("../middleware")

;


lmaRouter.route("/")
    .get(middleware.isLoggedIn, controller.getWorkers)
    .post(middleware.isLoggedIn, controller.postWorker);

lmaRouter.route("/new")
    .get(middleware.isLoggedIn, controller.newWorker);

module.exports = lmaRouter;