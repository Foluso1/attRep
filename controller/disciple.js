const           Worker      =   require("../models/worker")
            ,   Disciple      =   require("../models/disciple")
            ;


module.exports = {
    getDisciples: async (req, res) => {
        try {
            let foundWorker = await Worker.findById(req.user._id);
            res.render("disciple", {foundWorker});
        } catch (e) {
            console.log(e);
            req.flash("error", "There was an error");
            res.redirect("/home");
        }
    },

    postDisciple: async (req, res) => {
        try {
            let idWorker = {_id: req.user.id};
            let data = {
                name: req.body.name,
                discipler: req.user.id,
            };
            let disc1 = await Disciple.create(data)
            let foundWorker = await Worker.findById(idWorker)
            foundWorker.disciples.push(disc1);
            foundWorker.save();
            req.flash("success", `${req.body.name} has been added successfully!`);
            res.redirect("/discipleship/new");
        } catch (error) {
            req.flash("error", "There was a problem! Please, try again!")
            console.log(error);
        }
    },

    createNewDiscple: async (req, res) => {
        try {
             foundWorker = await Worker.findById(req.user._id);
             res.render("disciple/disciple_new", {foundWorker});
        } catch (e) {
            console.log(e)
        }
    },

}
