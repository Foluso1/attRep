const           Worker      =   require("../models/worker")
            ,   Disciple      =   require("../models/disciple")
            ;


module.exports = {
    getDisciples: (req, res) => {
        res.render("disciple");
    },

    postDisciple: async (req, res) => {
        let idWorker = {
            _id: req.user.id
        }
        let data = {
            name: req.body.name
        }

        try {
            let disc1 = await Disciple.create(data)
            let worker2 = await Worker.findById(idWorker)
            worker2.disciples.push(disc1);
            worker2.save();
            res.redirect("/report/new");
        } catch (error) {
            console.log(error);
        }
    },

    createNewDiscple: (req, res) => {
        res.render("new");
    }

}
