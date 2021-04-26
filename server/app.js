const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = process.env.PORT || require("./config/keys").PORT;
const db = require("./config/keys").MongoURI;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
    useCreateIndex: true
}).then( () => {
    console.log("Connected to database...");
}).catch( err => {
    console.log(err);
});

app.use("/api", require("./routes/routes"));

if(process.env.NODE_ENV === 'production') {
    app.use(express.static(__dirname+"/dist/"));
    app.get("*", (req, res) => {
        res.sendFile(__dirname+"/dist/index.html");
    })
}

app.listen(port, () => {
    console.log(`Server running at port ${port}`);
});