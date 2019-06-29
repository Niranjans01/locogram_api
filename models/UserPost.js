const mongoose = require('mongoose');


const UserPost = mongoose.model('UserPost', {
    postcreator: {
        type: String
    },
    placeimage: {
        type: String
    },
    posttitle: {
        type: String
    },
    postdesc: {
        type: String
    },
    locationfrom: {
        type: String
    },
    locationabout: {
        type: String
    },
    postdate: {
        type: String
    }
});

module.exports = UserPost