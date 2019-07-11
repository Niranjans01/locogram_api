const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('./db/mongoos');
const Users = require('./models/userAuthModel');
const UserPost = require('./models/UserPost');
const UserReview = require('./models/UserReview');
const PostModeration = require('./models/PostModeration');


const multer = require('multer')
app.use(express.static('./images'))
app.use(express.json());
const path = require('path');

const cors = require('cors');
const jwt = require('jsonwebtoken');
const auth = require('./middleware/auth');
app.use(cors());
const middleware = require('./middleware/middleware');
app.use(bodyParser.urlencoded({ extended: false }));

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
    }).catch(function () {
        console.log('error');
    })

});

app.post("/login", async function (req, res) {
    console.log('logged here')
    const user = await Users.checkCrediantialsDb(req.body.email, req.body.password);
    const token = await user.generateAuthToken();
    res.send({ success: true, token: token, usertype: user.usertype, _id: user._id });



})

app.post('/upload', upload.single('upload'), (req, res) => {
    res.send({ Filename: req.file.filename });
    console.log(req.file.filename)
})

app.post("/register", (req, res) => {
    console.log('hit on register');

    var myData = new Users(req.body);
    myData.save().then(function (o) {
        res.send(true)
    }).catch(function (e) {
        res.send(e)
    });


});

app.post("/createpost", auth, (req, res) => {
    console.log(req.user._id);
    var myData = new UserPost({ ...req.body, postcreator: req.user._id });
    console.log(myData);
    myData.save().then(function () {
        res.send(true);
    }).catch(function (e) {
        res.send(e)
    });


});

app.get("/feeds", (req, res) => {
    // UserPost.find({ active: true }).then(function (feeddata) {
    //     res.send(feeddata);
    // }).catch(function () {
    //     console.log('error');
    // })
    UserPost.find().populate('postcreator', ['username', 'userimage'])
        .exec().then(function (params) {
            if (params) {
                res.json(params);
            }
        })


})

app.get("/myfeeds", auth, (req, res) => {
    UserPost.find({ postcreator: req.user._id, active: true }).then(function (feeddata) {
        res.send(feeddata);
    }).catch(function () {
        console.log('error');
    })


})

app.get("/allreviews", (req, res) => {
    UserReview.find().then(function (reviewdata) {
        console.log(reviewdata);
        res.send(reviewdata);
    }).catch(function () {
        console.log('error');
    })


})

app.get("/postreviews/:postid", (req, res) => {
    console.log(req.params.postid)
    UserReview.find({ reviewedpost: req.params.postid }).then(function (reviewdata) {
        res.send(reviewdata);
    }).catch(function () {
        console.log('error');
    })


})

app.get("/singlefeed/:id", (req, res) => {
    UserPost.findOne({ _id: req.params.id }).then(function (feeddata) {
        res.send(feeddata);
    }).catch(function () {
        console.log('error');
    })


})

app.post("/createreview", auth, (req, res) => {
    console.log(req.user._id);
    var myData = new UserReview({ ...req.body, reviewer: req.user._id });
    console.log(myData);
    myData.save().then(function () {
        res.send('fine');
    }).catch(function (e) {
        res.send(e)
    });
});


app.put("/updatereview", auth, (req, res) => {
    var reviewid = req.body.reviewid;
    var upvote = req.body.upvote;
    var downvote = req.body.downvote;
    console.log(reviewid)
    console.log(upvote)
    console.log(downvote)
    if (upvote) {
        UserReview.findByIdAndUpdate({ _id: reviewid }, { $push: { upvotes: upvote } }, { new: true }, function (params) {
            res.send(true)
        })
    } else if (downvote) {
        UserReview.findByIdAndUpdate({ _id: reviewid }, { $push: { downvotes: downvote } }, { new: true }, function (params) {
            res.send(true)
        })
    }
})

app.post("/report", auth, (req, res) => {

    if (req.body.delete) {

        UserPost.findByIdAndUpdate({ _id: req.body.actionpost }, { active: false }, { new: true }, function (params) {
            var myData = new PostModeration({ ...req.body, actionrequestby: req.user._id });
            console.log(myData);
            myData.save().then(function () {
                res.send(true);
            }).catch(function (e) {
                res.send(e)
            });
        })

    } else if (req.body.report) {

        var myData = new PostModeration({ ...req.body, actionrequestby: req.user._id });

        myData.save().then(function (match) {
            res.send(true);
        }).catch(function (e) {
            res.send(e)
        });
    }


})

app.post("/reportthis", auth, (req, res) => {
    var myData = new PostModeration({ ...req.body, actionrequestby: req.user._id });

    myData.save().then(function (match) {
        res.send(true);
    }).catch(function (e) {
        res.send(e)
    });
})



app.get("/reportedposts", (req, res) => {
    PostModeration.find({ report: 1 }).then(function (data) {
        res.send(data);
    })
})

app.get("/deletedposts", (req, res) => {
    PostModeration.find({ delete: 1 }).then(function (data) {
        res.send(data);
    })
})

app.post("/deleteuser/:id", auth, (req, res) => {
    Users.findByIdAndDelete(req.params.id).then(function (params) {
        res.send(true)
    })
})

app.post("/deletepost/:id", auth, (req, res) => {
    UserPost.findByIdAndDelete(req.params.id).then(function (params) {
        res.send(true)
    })
})

app.put("/updatepost/:id", (req, res) => {

    UserPost.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true }, function () {
        res.send(true)
    })
})

app.put("/saved/:id", auth, (req, res) => {

    UserPost.findByIdAndUpdate({ _id: req.params.id }, { $push: { postsaved: req.user._id } }, { new: true }, function () {
        res.send(true)
    })
})

app.put("/updateprofile", auth, (req, res) => {
    console.log(req.user._id)
    Users.findByIdAndUpdate({ _id: req.user._id }, req.body, { new: true }, function () {
        res.send(true)
    })
})

app.put("/updateuser/:id", auth, (req, res) => {
    Users.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true }, function () {
        res.send(true)
    })
})

app.get("/allusers", (req, res) => {
    Users.find().then(function (userdata) {
        res.send(userdata);
    })
})

app.listen(90);