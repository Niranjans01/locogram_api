const mongoose = require('mongoose');


const PostModeration = mongoose.model('PostModeration', {
    actionpost: {
        type: String
    },
    actionrequestby: {
        type: String
    },
    actionlocation: {
        type: String
    },
    report: {
        type: Number
    },
    delete: {
        type: Number
    },
    moddate: {
        type: String
    }
});

module.exports = PostModeration