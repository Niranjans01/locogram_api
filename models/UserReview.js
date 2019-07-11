const mongoose = require('mongoose');


const UserReview = mongoose.model('UserReview', {
    reviewedpost: {
        type: String
    },
    reviewer: {
        type: String
    },
    reviewdesc: {
        type: String
    },
    nostars: {
        type: Number
    },
    reviewlocation: {
        type: String
    },
    upvotes: {
        type: Array
    },
    downvotes: {
        type: Array
    },
    reviewdate: {
        type: String
    }
});

module.exports = UserReview