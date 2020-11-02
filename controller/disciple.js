const           Worker      =   require("../models/worker")
            ,   Disciple      =   require("../models/disciple")
            ;


module.exports = {
    getDisciples: async (req, res) => {
        try {
            let foundWorker = await Worker.findById({_id: req.user.id}).populate("disciples");
            let disciples = foundWorker.disciples;
            res.render("disciple/disciple", {disciples});
        } catch (e) {
            console.log(e);
            req.flash("error", "There was an error");
            res.redirect("/home");
        }
    },

    getOneDisciple: async (req, res) => {
        try {
            req.params.id
            let foundDisciple = await Disciple.findById({_id: req.params.id}).populate("disciples");
            res.render("disciple/disciple_edit", {foundDisciple});
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
                email: req.body.email,
                mobileNumber: req.body.mobile,
                address: req.body.address,
                believersConventionAccommodation: req.body['believers-convention-accommodation'],
                charisCampmeetingAccommodation: req.body['charis-campmeeting-accommodation']
            };
            let disc1 = await Disciple.create(data)
            let foundWorker = await Worker.findById(idWorker)
            foundWorker.disciples.push(disc1);
            await foundWorker.save();
            req.flash("success", `${req.body.name} has been added successfully!`);
            res.redirect("/disciple");
        } catch (error) {
            req.flash("error", "There was a problem! Please, try again!")
            console.log(error);
        }
    },

    editDisciple: async (req, res) => {
        try {
            let data = {
                name: req.body.name,
                email: req.body.email,
                mobileNumber: req.body.mobile,
                address: req.body.address,
                believersConventionAccommodation: req.body['believers-convention-accommodation'],
                charisCampmeetingAccommodation: req.body['charis-campmeeting-accommodation']
            };
            let foundDisciple = await Disciple.findByIdAndUpdate({_id: req.params.id}, data)
            await foundDisciple.save();
            req.flash("success", `${req.body.name} has been updated!`);
            res.redirect("/disciple");
        } catch (error) {
            req.flash("error", "There was a problem! Please, try again!")
            console.log(error);
        }
    },

    createNewDiscple: async (req, res) => {
        try {
             foundWorker = await Worker.findById(req.user.id);
             res.render("disciple/disciple_new", {foundWorker});
        } catch (e) {
            console.log(e)
        }
    },

    deleteDisciple: async (req, res) => {
        try {
            await Disciple.findByIdAndDelete({_id: req.params.id});
            res.json("Deleted");
        } catch (e) {
            console.log(e)
            res.status(404).json("There was a problem")
        }
    }
}
