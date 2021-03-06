# Bloglist App

## Objectives
1. Allow users to add their favourite blogs on the webapp.
2. Only allow logged-in users to add a blog to the webapp.
3. Only allow the user who added the blog be able to delete the blog off the webapp.

Live Preview: https://bloglist-dzr.herokuapp.com/

## Technologies used
- MongoDB Atlas
- React
- ExpressJS
- Axios
- JsonWebToken
- Jest

## The Process
- Firstly, wrote the code for the backend using ExpressJS and Axios. Then linked the MongoDB database to the backend
- Secondly, Tested the backend with Jest to see if the backend was working as intended
- Thirdly, wrote the frontend code and tested the frontend with Jest as well

### Webapp was made using a local mongoDB database first, then hooked the webapp up with mongoDB atlas cloud database

# Notes

github repo is in diniezikryy under blog-list.

local mongoDB database used to develop the application. Once it is in finished state, will shift to MongoDB Atlas cloud database.

LOCAL DB! -> mongodb://localhost/bloglist

- DB is bloglist, collection is blogs

GIT!

1. Once changes have been commited, 'git status' to check files
2. 'git add .' to add the files to the commit
3. 'git commit -m '<enter message>' to add your message
4. 'git push -u origin main' to push the commits into ur main branch
5. refresh github repo to check if it commited

only will deploy the app with heroku once the app is fully finished.

15/01/22

- reorganised the backend structure of the program
- included testing for the app using jest

For Testing

- Always define separate modes for development & testing
- Set a new mongoDB DB for testing purposes
- Reset the test DB before every test using test_helper.js, dont forget to import into api_test!

16/01/22

- Never forget to test the operations
- Never forget to throw errors when something you feel will go wrong
  - Helpful to use status codes
  - Avoid using short abbreviations like res or req!

23/01/22

- When implementing delete feature, try to reference the data using the id
- To join queries, can implement by having it in our application code and making multiple queries taken care by mongoose
  - By containing a reference key to the user who created the blog
- Implementing a way to allow users to login and authenticate the users.
- Will use JsonWebToken, Mongoose Unique Validator and BCrypt to encrypt the passwords.

25/01/22

- Added the user administration to app.
- NEVER FORGET TO DO TRY CATCH OR ELSE THERE WILL ALWAYS BE ERRORS IN TEST! (JEST INFINITE LOOPS).

29/01/22

- Time to tag the user information to the blog post
- Used express async errors pkg to catch errors instead of try-catch
- Use populate to link two different document models across API
- Implementing token auth to the bloglist
- Only when the username and the password is correct, the server generates a token and return it as a response
- Order of the middleware must be correct! In this case, since the middleware involved is meant to get the token from the request, it should come before the loginRouter/blogRouter controller
- Addding the functionality of only user with valid token to be able to delete his/her blog post.
- Need to practice on using Jest to test api w/ token auth
  - Refer to this for the used fix https://github.com/visionmedia/supertest/issues/398
- Need to figure out how to extract the user from the token
