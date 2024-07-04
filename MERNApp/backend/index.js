require("dotenv").config();

const config = require("./config.json");
const mongoose = require("mongoose");

mongoose.connect(config.connectionString);

const User = require('./model/userModel');
const Book = require('./model/bookModel');
const express = require ("express");
const cors = require ("cors");
const app = express();
const checkAdminRole = require("./middleware/checkRole");
const validateNotBlankQuery = require("./middleware/blankCheckerQuery");
const validateNotBlankQueryBody = require("./middleware/blankCheckerBody");
const jwt = require("jsonwebtoken");
const {authenticateToken} = require("./middleware/authenticateToken");

app.use(express.json());

app.use(
    cors({
        origin: "*",
    })
);

app.get("/",(req,res)=>{
    res.json({data: "hello"});
});

//Create Account
app.post("/create-account", async (req,res)=>{
    const {fullName, email, password, role} = req.body;

    if(!fullName){
        return res
        .status(400)
        .json({error: true, message: "Full Name is required"});
    }

    if(!email){
        return res.status(400).json({error: true, message: "Email is required"});
    }

    if(!password){
        return res
        .status(400)
        .json({error: true, message: "Password is required"});
    }

    if(!role){
        return res
        .status(400)
        .json({error: true, message: "Role is required"});
    }


    const isUser = await User.findOne({ email: email});

    if(isUser){
        return res.json({
            error: true,
            message: "User already exist",
        });
    }

    const user = new User({
        fullName,
        email,
        password,
        role,
        pinnedBooks: [],
    });

    await user.save();

    // Generate an access token
    const accessToken = jwt.sign({user}
        , process.env.ACCESS_TOKEN_SECRET //// The secret key used to sign the token
        , {expiresIn: "3600m", 
    });

    return res.json({
        error: false,
        user,
        accessToken,
        message: "Registration Successful",
    });
});
//Login
app.post("/login", async (req,res)=>{
    const {email, password} = req.body;

    if(!email){
        return res.status(400).json({message: "Email is required"});
    }

    if(!password){
        return res.status(400).json({message: "Password is required"});
    }

    const userInfo = await User.findOne({email: email});

    if(!userInfo){
        return res.status(400).json({message: "User not found"});
    }

    if(userInfo.email == email && userInfo.password == password){
        const user = {user: userInfo};
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET,{
            expiresIn:"3600m",
        });
        
        return res.json({
            error: false,
            message: "Login Successful",
            email,
            accessToken,
        });
    }else{
        return res.status(400).json({
            error: true,
            message: "Invalid Credentials",
        });
    }
})
//Get User
app.get("/get-user", authenticateToken, async (req,res)=>{
    const {user} = req.user;

    const isUser = await User.findOne({_id: user._id});

    if(!isUser){
        return res.sendStatus(401);
    }

    return res.json({
        user: {
            fullName: isUser.fullName, 
            email: isUser.email, 
            "_id": isUser._id, 
            role: isUser.role,
            pinnedBooks: isUser.pinnedBooks,
            createdOn: isUser.createdOn},
            message: "",
    });

})
//Add Book
app.post("/add-book", authenticateToken, checkAdminRole, async (req, res) => {
    const { title, content, tags, author, publishedYear, imageUrl } = req.body;
    const { user } = req.user;
  
    if (!title) {
      return res.status(400).json({ error: true, message: "Title is required" });
    }
  
    if (!content) {
      return res.status(400).json({ error: true, message: "Content is required" });
    }
  
    try {
      const book = new Book({
        title,
        content,
        tags: tags || [],
        author,
        publishedYear,
        imageUrl,
        userId: user._id,
        comments: [],
        score: [],
      });
  
      await book.save();
  
      return res.json({
        error: false,
        book,
        message: "Book added successfully",
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: "Internal Server Error When Adding Book",
      });
    }
  });
//Get a book
app.get("/books/:title", authenticateToken, async (req, res) => {
  const { title } = req.params;

  try {
    const book = await Book.findOne({
      title: title,
    });

    if (!book) {
      return res.status(404).json({
        error: true,
        message: "Book not found",
      });
    }

    return res.json({
      error: false,
      book,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error When Fetching Book",
    });
  }
});
//Edit Book
app.put("/edit-book/:bookId", authenticateToken, checkAdminRole, async(req, res)=>{
    const bookId=req.params.bookId;
    const {title, content, tags, author, publishedYear, imageUrl} = req.body;
    // const {user} = req.user;

    if(!title && !content && !tags){
        return res
        .status(400)
        .json({error: true, message: "No changes provided"});
    }

    try{
        const book = await Book.findOne({_id: bookId});

        if(!book){
            return res.status(404).json({error: true, message: "Book not found"});
        }

        if(title) book.title = title;
        if(content) book.content = content;
        if(tags) book.tags =tags;
        if(author) book.author =author;
        if(publishedYear) book.publishedYear =publishedYear;
        if(imageUrl) book.imageUrl = imageUrl;

        await book.save();
        
        return res.json({
            error: false,
            book,
            message: "Book updated successfully",
        });
    } catch(error){
        return res.status(500).json({
            error: true,
            message: "Internal Server Error When Updating Book",
        });
    }
});
//Adding Comments
app.put("/add-comment/:bookId", authenticateToken, validateNotBlankQueryBody, async (req, res) => {
  const bookId = req.params.bookId;
  const { user } = req.user;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: true, message: "Comment is required"});
  }

  try {
    const book = await Book.findOne({ _id: bookId });

    if (!book) {
      return res.status(404).json({ error: true, message: "Book not found" });
    }

    const comment = {
      userId: user._id,
      userName: user.fullName,
      content,
    };

    book.comments.push(comment);
    await book.save();

    return res.json({
      error: false,
      book,
      message: "Comment added successfully",
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    return res.status(500).json({
      error: true,
      message: "Internal Server Error When Adding Comment",
    });
  }
});
//Deleting Comments
app.delete("/delete-comment/:bookId/:commentId", authenticateToken, async (req, res) => {
  const bookId = req.params.bookId;
  const commentId = req.params.commentId;

  try {
    const book = await Book.findOne({ _id: bookId });

    if (!book) {
      return res.status(404).json({ error: true, message: "Book not found" });
    }

    const commentIndex = book.comments.findIndex((comment) => comment._id.toString() === commentId);

    if (commentIndex === -1) {
      return res.status(404).json({ error: true, message: "Comment not found" });
    }

    book.comments.splice(commentIndex, 1);
    await book.save();

    return res.json({
      error: false,
      book,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error When Deleting Comment",
    });
  }
});
//Rating a book
app.put("/update-score/:bookId", authenticateToken, async (req, res) => {
  const bookId = req.params.bookId;
  const { user } = req.user;
  const { score } = req.body;

  if (score !== 1 && score !== -1) {
    return res.status(400).json({ error: true, message: "Invalid score value" });
  }

  try {
    const book = await Book.findOne({ _id: bookId });

    if (!book) {
      return res.status(404).json({ error: true, message: "Book not found" });
    }

    const existingScoreIndex = book.score.findIndex((s) => s.userId === user._id);

    if (existingScoreIndex !== -1) {
      // User's score already exists
      if (book.score[existingScoreIndex].value === score) {
        // If the sent score matches the existing score value, reset it to 0
        book.score[existingScoreIndex].value = 0;
      } else {
        // If the sent score is different, update it to the new value
        book.score[existingScoreIndex].value = score;
      }
    } else {
      // User's score doesn't exist, add a new score object
      book.score.push({ userId: user._id, value: score });
    }

    await book.save();

    return res.json({
      error: false,
      book,
      message: "Score updated successfully",
    });
  } catch (error) {
    console.error("Error updating score:", error);
    return res.status(500).json({
      error: true,
      message: "Internal Server Error When Updating Score",
    });
  }
});
//Helper function to fetch user by role
async function getUserIdsByRole(role) {
    const users = await User.find({ role }, { _id: 1 });
    return users.map((user) => user._id);
};
  
//Get All Book
app.get("/get-all-books", authenticateToken, async (req, res) => {
  const { user } = req.user;

  try {
    // Retrieve all books added by admin
    const allBooks = await Book.find();

    // Get the user's pinned books
    const userPin = await User.findOne({ _id: user._id });
    const pinnedBookIds = userPin.pinnedBooks;

    // Sort the books, putting the pinned books first, then sort by alphabetical order
    const sortedBooks = allBooks.map((book) => {
      const isPinned = pinnedBookIds.includes(book._id.toString());
      return {
        ...book.toObject(),
        isPinned,
      };
    }).sort((a, b) => {
      // Sort by the 'isPinned' property, with pinned books first
      if (a.isPinned && !b.isPinned) {
        return -1; // a comes first (pinned book)
      } else if (!a.isPinned && b.isPinned) {
        return 1; // b comes first (pinned book)
      } else {
        return a.title.localeCompare(b.title); // Sort alphabetically
      }
    });

    return res.json({
      error: false,
      books: sortedBooks,
      message: "All books retrieved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error When Retrieving All Books",
    });
  }
});
//Delete A Book
app.delete("/delete-book/:bookId", authenticateToken, checkAdminRole, async(req, res)=>{
    const bookId=req.params.bookId;
    // const {user} = req.user;

    try{
        const book = await Book.findOne({_id: bookId});

        if(!book){
            return res.status(400).json({error: true, message: "Book not found"});
        }
        await Book.deleteOne({_id: bookId});

        return res.json({
            error: false,
            message: "Book deleted successfully"
        });
    } catch(error){
        return res.status(500).json({
            error: true,
            message: "Internal Server Error When Deleting",
        });
    }
});
//update Pin status
app.put("/update-pin/:bookId", authenticateToken, async (req, res) => {
    const bookId = req.params.bookId;
    const { user } = req.user;

    const userPin = await User.findOne({_id: user._id});
  
    try {
      // Update the user's pinnedBooks array
      if (userPin.pinnedBooks.includes(bookId)) { //check if book is in the pinnedBook already
        const bookIndex = userPin.pinnedBooks.indexOf(bookId);

        userPin.pinnedBooks.splice(bookIndex, 1);//removing using splice 
        } else {
            userPin.pinnedBooks.push(bookId);//adding using push
      }

      await userPin.save();

      console.log("saved");
  
      return res.json({
        error: false,
        pinnedBooks: userPin.pinnedBooks,
        message: "Pin updated successfully",
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: "Internal Server Error When Updating Pin",
      });
    }
  });
//search API
app.get("/search-books/", authenticateToken, validateNotBlankQuery, async(req,res)=>{
    const { query, option } = req.query;

    if(!query){
        return res.status(400).json({error: true, message: "Search query is required"});
    }

    try {
        let matchingBooks;
        switch (option) {
            case "title":
                matchingBooks = await Book.find({
                title: { $regex: new RegExp(query, "i") },//search using regular expression, case insensitive
                });
                break;
            case "author":
                matchingBooks = await Book.find({
                author: { $regex: new RegExp(query, "i") },
                });
                break;
            case "tags":
                matchingBooks = await Book.find({
                  tags: { $regex: new RegExp(query, "i") },

                });
            break;
          default:
            return res.status(400).json({
              error: true,
              message: "Invalid search option",
            });
        }

        return res.json({
            error: false,
            books: matchingBooks,
            message: `Books matching the search query retrieved successfully. Query: ${query}  Option: ${option}`,
        });
    }catch(error){
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",       
        });
    }
});


app.listen(8000, ()=>{
  console.log("Server is running on port 8000");
});

module.exports = app;