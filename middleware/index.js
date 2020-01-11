module.exports = {
        isLoggedIn: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next()
        }
        req.flash("error", "You have to log in first");
        res.redirect("/login");
    },
    isLMA: (req, res, next) => {
        if(req.user.isLMA) {
            return next()
        }
        console.log("Access Denied!")
        req.flash("error", "Access denied. You have to be in the LMA to do this");
        res.send("Not in LMA!");
    }
}