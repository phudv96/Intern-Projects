const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Book = require("./bookModel");

const userSchema = new Schema({
    fullName: {type: String},
    email: {type: String},
    password: {type: String},
    role: {type: String},
    pinnedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
    createdOn: {type: Date, default: new Date().getTime()},
});

module.exports = mongoose.model("User", userSchema);