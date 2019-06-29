const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('./db/mongoos');
const Users = require('./models/userAuthModel');
const UserPost = require('./models/UserPost');

const multer = require('multer')
app.use(express.static('./images'))
const path = require('path');

const cors = require('cors');
const jwt = require('jsonwebtoken');
const auth = require('./middleware/auth');
app.use(cors());
const middleware = require('./middleware/middleware');


app.use(bodyParser.urlencoded({ extended: false }));

app.get('/mytest', auth, function () {
    res.send("this is my private page")
})

//image upload part
var storage = multer.diskStorage(
    {
        destination: "images",
        filename: (req, file, callback) => {
            let ext = path.extname(file.originalname);
            callback(null, file.fieldname + "-" + Date.now() + ext);
        }
    });

var imageFileFilter = (req, file, cb) => {
    if
        (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) { return cb(newError("You can upload only image files!"), false); }
    cb(null, true);
};

var upload = multer({
    storage: storage,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 1000000
    }
});




app.get('/users/authed', auth, function (req, res) {
    res.send(req.user);
})

app.get('/userprofile/:id', function (req, res) {

    id = req.params.id;

    Users.findOne({ _id: id }).then(function (userData) {
        res.send(userData);
        console.log(userData);
    }).catch(function () {
        console.log('error');
    })

});

app.post("/login", async function (req, res) {

    const user = await Users.checkCrediantialsDb(req.body.email, req.body.password);
    const token = await user.generateAuthToken();
    res.send({ token: token, usertype: user.usertype });



})

app.post('/upload', upload.single('upload'), (req, res) => {
    res.send({ Filename: req.file.filename });
    console.log(req.file.filename)
})

app.post("/register", (req, res) => {
    var myData = new Users(req.body);
    myData.save().then(function () {
        res.send('fine');
    }).catch(function (e) {
        res.send(e)
    });


});

app.post("/createpost", auth, (req, res) => {
    console.log(req.user._id);
    var myData = new UserPost({ ...req.body, postcreator: req.user._id });
    console.log(myData);
    myData.save().then(function () {
        res.send('fine');
    }).catch(function (e) {
        res.send(e)
    });


});

app.get("/feeds", (req, res) => {
    UserPost.find().then(function (feeddata) {
        res.send(feeddata);
        console.log(feeddata);
    }).catch(function () {
        console.log('error');
    })
})

app.listen(90);