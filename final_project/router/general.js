const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(400).send("Username or password is missing");
    }

    const userFiltered = users.filter(user => user.username === username);
    const userExists = userFiltered.length > 0 ? true : false;

    if (userExists) {
        return res.status(400).send("User already exist");
    } else {
        users.push({ username, password });
        return res.status(200).send("User registered successfuly");
    }
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    //Write your code here
    async function getBooksAsync() {
        const promise = new Promise((resolve, reject) => {
            setTimeout(() => res.status(200).json({ books: JSON.stringify(books) }), 2000);
        });
        await promise;
    }
    getBooksAsync();
    // return res.status(200).json({ books: JSON.stringify(books) });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    //Write your code here
    async function getBookByIsbnAsync() {
        const isbn = req.params.isbn;
        const book = {};
        book[isbn] = books[isbn];

        setTimeout(() => res.status(200).send(book), 2000);
    }
    getBookByIsbnAsync();
    // return res.status(200).json(book);
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    //Write your code here
    async function getByAuthorAsync() {
        const promise = new Promise((resolve, reject) => {
            const author = req.params.author;
            const book = Object.values(books).filter(book => book.author === author)[0];

            setTimeout(() => res.status(200).send(book), 2000);
        });
        await promise;
    }
    getByAuthorAsync();
    // return res.status(200).send(booksAuthored);
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    //Write your code here
    async function getByTitleAsync() {
        const promise = new Promise((resolve, reject) => {

            const title = req.params.title;
            const booksByTitle = Object.values(books).filter(book => book.title.toLowerCase().includes(title.toLowerCase()));

            setTimeout(() => res.status(200).send(booksByTitle), 2000);
        });
        await promise;
    }
    getByTitleAsync();
    // return res.status(200).send(booksFiltered);
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;

    return res.status(200).json({ reviews: books[isbn].reviews });
});

module.exports.general = public_users;
