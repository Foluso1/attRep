const    express         =   require("express")
    ,    reportRouter    =   express.Router()
    ,    helper          =   require("../controller/report")
         ;


reportRouter.use("/report", (req, res, next) => {
    res.locals.req = req;
    next();
});


reportRouter.route("/")
    .get(helper.getReports)
    .post(helper.postReport);


reportRouter.route("/new")
    .get(helper.newReport);

reportRouter.route("/:id")
    .get(helper.getOneReport);


module.exports = reportRouter;