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
app.set("view engine", "html");

app.use("/api/workers", workerRouter);

app.get("/", (req, res) => {
    res.render("index");
});

app.post("/", (req, res) => {
    // res.send("you hit the post route!");
    let newWorker = {name: req.body.name}
    console.log(newWorker);
    Worker.create(newWorker)
        .then((worker) => {
            res.redirect("/");
        })
        .catch((err) => {
            console.log(err);
        })
    // console.log(req.body);
});



app.listen(PORT, IP, () => {console.log(`The server is listening at ${PORT}`)});
