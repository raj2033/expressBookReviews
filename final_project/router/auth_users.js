const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
    //write code to check is the username is valid
    const validUsers = users.filter(user => user.username === username);
    return validUsers.length > 0 ? true : false;
}

const authenticatedUser = (username, password) => { //returns boolean
    //write code to check if username and password match the one we have in records.
    for (let i = 0; i < users.length; i++) {
        if ((users[i].username === username) && (users[i].password === password)) {
            return true;
        }
    }
    return false;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(400).send("Username or Password is missing");
    }
    if (authenticatedUser(username, password)) {
        const accessToken = jwt.sign({ password }, 'access', { expiresIn: 60 * 60 });
        req.session.authorization = { accessToken, username };
        return res.status(200).send("User loggedn successfuly");
    } else {
        return res.status(400).send("Invalid username or password.");
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const { username, review } = req.body;
    const isbn = req.params.isbn;
    books[isbn].reviews[username] = review;
    return res.status(200).json({ review: books[isbn].reviews });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.body.username
    delete books[isbn].reviews[username];
    return res.status(200).send(books[isbn].reviews);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
