# Locogram
Name: Niranjan Subedi

CollegeID: 160346

Batch: Jan19D

My Porject name is Locogram, it is simply like a social media platform to share the views and experiences of a place with the world while this media also helps promote the locally important things and make peoples who are new to the place aware of the necessary things about particular place.

# List of Main Features
User will be able to add posts
Users will be able to rate other post, and make comments
User comments can be rated with upvote & downvote
View posts on the feed
User can report post
User can edit own post
API Documentation
server starts at port no : 90 and can be accessed locally through : localhost:90

## All GET APIs without authorization
- /userprofile/:id This api will get particular users profile through user id

- /allusers This api will give all users information

- /reportedposts This api will give list off all reported posts

- /deletedposts This api will give all posts information deleted by user

- /feeds This api will give all feed posts

- /allreviews This api will give all reviews in feeds

- /postreviews/:postid This api will give all post reviews based on id passed as params

- /singlefeed/:id This api will give single feed post based on id passed as params to the api

- /userprofile/:id This api will give information of user/profile based on id passed as params

## POST APIs without authorization
- /register will register

## APIs with authorization access
- /users/authed this api will give user information based on authorization available/ must be logged in/ tokenized

- /login it is a login api which will return user token , user type and other user information

- /upload with this api and file name as 'upload' user can upload images

- /createpost this api will be creating new post

- /myfeeds this api will give logged in user's feed post

- /saved/:id

- /createreview this api will create review

- /updatereview this api will help to update review with upvotes and down votes

- /report report and delete request by users is tracked here

- /deleteuser/:id user is deleted with this api and params id passed with it

- /deletepost/:id post is deleted with this api

- /updatepost/:id posts are updated with this api in put request

- /updateprofile self profile update carried out from this api

- /updateuser/:id user's type (admin/user previllege) is updated from this api
