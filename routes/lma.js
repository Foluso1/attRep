const       express     =   require("express")
        ,   lmaRouter   =   express.Router()
        ,   Worker      =   require("../models/worker")
        ,   controller  =   require("../controller/lma")
        ,   middleware  =   require("../middleware")

;


lmaRouter.route("/")
    .get(middleware.isLoggedIn, middleware.isLMA, controller.getWorkers)
    .post(middleware.isLoggedIn, middleware.isLMA, controller.postWorker)
    .put(middleware.isLoggedIn, middleware.isLMA, controller.editWorker)
    .delete(middleware.isLoggedIn, middleware.isLMA, controller.removeWorker);

lmaRouter.route("/all")
    .get(middleware.isLoggedIn, middleware.isLMA, controller.getAll)

lmaRouter.route("/:id")
    .delete(middleware.isLoggedIn, middleware.isLMA, controller.deleteWorker);

lmaRouter.route("/new")
    .get(middleware.isLoggedIn, middleware.isLMA, controller.addRemoveOrDelWorker);

lmaRouter.route("/prayer/:id")
    .get(middleware.isLoggedIn, middleware.isLMA, controller.getLma);


lmaRouter.get("/report/:id", (req, res) => {
    let worker = {
        _id: req.params.id
    }
    Worker.findById(worker).
        populate({ path: 'reports', populate: { path: 'disciples' } })
        .then((presentWorkers) => {
            let reports = presentWorkers.reports;
            let dayWeek = [];
            let month = [];
            let arrDay = [[0, "Sunday"], [1, "Monday"], [2, "Tuesday"], [3, "Wednesday"], [4, "Thursday"], [5, "Friday"], [6, "Saturday"]];
            reports.forEach((report) => {
                let j = report.date.getDay();
                let reportDay = arrDay[j];
                month.push(report.date.getMonth() + 1);
            })
            res.render("report", { reports, dayWeek, month });
        })
        .catch((err) => {
            console.log(err);
        });
    // res.send("Good here!");
})

module.exports = lmaRouter;

// Do a looop
// find the worker
// populate the prayer report
// Get the "yes" of the array
// 