github repo is in diniezikryy under blog-list.

local mongoDB database used to develop the application. Once it is in finished state, will shift to MongoDB Atlas cloud database.

LOCAL DB! -> mongodb://localhost/bloglist

cloudDB ->

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
- Use populate to link two different document models across API
- Implementing token auth to the bloglist
- Only when the username and the password is correct, the server generates a token and return it as a response
- Order of the middleware must be correct! In this case, since the middleware involved is meant to get the token from the request, it should come before the loginRouter controller
