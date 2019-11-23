module.exports = {
        isLoggedIn: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next()
        }
        res.redirect("/login");
    },
    isLMA: (req, res, next) => {
        if(req.user.isLMA) {
            return next()
        }
        console.log("Access Denied!")
        res.send("Not in LMA!");
    }
}