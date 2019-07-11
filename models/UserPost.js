const mongoose = require('mongoose');


const UserPost = mongoose.model('UserPost', {
    postcreator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
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
    updatedlocation: {
        type: String
    },
    postsaved: {
        type: Array
    },
    postdate: {
        type: String
    },
    active: {
        type: Boolean
    }
});

module.exports = UserPost