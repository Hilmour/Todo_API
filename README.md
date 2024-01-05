# Todo API

# Application Installation and Usage Instructions
- Clone the repository/download the zip file
- Open the project in your IDE (Visual Studio Code)
- Open the terminal and run 'npm install' to install all the dependencies
- Create a .env file in the root folder and add the environment variables (see Environment Variables below)
- Create a database in MySQL Workbench with the name 'myTodo'
- Create a JWT token: Firstly enter "node" in the terminal, Then "require('crypto').randomBytes(64).toString('hex')"
- Copy the token and paste it into the .env file as the value for TOKEN_SECRET
- Run 'npm start' in the terminal to start the server
- NOTE: Application needs to started (npm start), then cancelled(control + c), then started again(npm start) for statuses to appear.

Testing with Postman:
- Signup and login with a user using the POST method.
- Use POST method to create a category and todos in the correct format as outlined in the swagger documentation.
- Use GET method to get all categories and todos, with different endpoints as outlined in the swagger documentation.
- Use PUT method to update a category and todos as outlined in the swagger documentation.
- Use DELETE method to delete a categories as outlined in the swagger documentation.
- Use DELETE method to change the todo item status to delete as outlined in the swagger documentation.

Endpoints for testing:
- /categories
- /todos

Integration tests:
- Before running tests, make sure to add a valid user from the db into the credentials where stated within the 'Todos.test.js' file.
- Add categories and todos to the db before running tests.


Package.json scripts:
- Change scripts in package.json In order to run the tests:
"scripts": {
		"start": "node swagger",
		"test": "jest"
	},
- Then, open Todos.test.js in 'tests' folder.
- Open a new terminal and run 'npm test' in the terminal to run the tests



# Additional Libraries/Packages
dotenv: ^16.0.3,
ejs: ^3.1.8,
express: ^4.18.2,
jest: ^29.7.0,
jsend: ^1.1.0,
jsonwebtoken: ^9.0.2,
mysql: ^2.18.1,
mysql2: ^3.1.2,
sequelize: ^6.29.0,
supertest: ^6.3.3,
swagger-autogen: ^2.23.6,
swagger-ui-express: ^5.0.0"


# NodeJS Version Used
- Node.js v19.4.0.

# Swagger Documentation link
http://localhost:3000/doc




