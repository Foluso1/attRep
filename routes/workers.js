const express   =   require("express"),
         router =   express.Router(),
         helper =   require("../helper/workers")
         ;

router.route("/")
    .get(helper.getWorker)
    .post(helper.createWorker);

module.exports = router;