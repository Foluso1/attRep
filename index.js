require("dotenv").config();
const       express     =   require("express"),
            app         =   express(),
            Worker      =   require("./models"),
            workerRouter=   require("./routes/workers")
            ;


const PORT = process.env.PORT;
const IP = process.env.IP;


app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/views"));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

app.use("/api/workers", workerRouter);
app.use(function(req, res, next){
    res.locals.cdn = process.env.css_cdn;
    next();
})

app.get("/", (req, res) => {
    res.render("index");
});



app.listen(PORT, IP, () => console.log(`The server is listening at ${PORT}`));


