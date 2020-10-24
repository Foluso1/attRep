const   express         =   require("express")
    ,   router          =   express.Router()
    ,   helper          =   require("./../../controller/api")
    ;


router.get("/", helper.workersDetails);

module.exports = router;