require("dotenv").config();

const config = require("./config.json");
const mongoose = require("mongoose");

mongoose.connect(config.connectionString);


const User = require('./model/userModel');
const Book = require('./model/bookModel');

const express = require ("express");
const cors = require ("cors");
const app = express();

const jwt = require("jsonwebtoken");
const {authenticateToken} = require("./utilities");

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
    const {fullName, email, password} = req.body;

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
    });

    await user.save();

    const accessToken = jwt.sign({user}
        , process.env.ACCESS_TOKEN_SECRET
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
        user: {fullname: isUser.fullName, email: isUser.email, "_id": isUser._id, createdOn: isUser.createdOn},
        message: "",
    });

})
//Add Book
app.post("/add-book", authenticateToken, async(req, res)=>{
    const {title, content, tags} = req.body;
    const {user} = req.user;

    if (!title){
        return res.status(400).json({error: true, message:"Title is required"});
    }

    if (!content){
        return res
        .status(400)
        .json({error: true, message: "Content is required"});
    }

    try{
        const book = new Book({
            title,
            content,
            tags: tags || [],
            userId: user._id,
        });

        await book.save();

        return res.json({
            error: false,
            book,
            message: "Book added successfully",
        });
    } catch (error){
        return res.status(500).json({
            error: true,
            message: "Internal Server Error When Adding Book",
        });
    }
});
//Edit Book
app.put("/edit-book/:bookId", authenticateToken, async(req, res)=>{
    const bookId=req.params.bookId;
    const {title, content, tags, isPinned} = req.body;
    const {user} = req.user;

    if(!title && !content && !tags){
        return res
        .status(400)
        .json({error: true, message: "No changes provided"});
    }

    try{
        const book = await Book.findOne({_id: bookId, userId: user._id});

        if(!book){
            return res.status(404).json({error: true, message: "Book not found"});
        }

        if(title) book.title = title;
        if(content) book.content = content;
        if(tags) book.tags =tags;
        if(isPinned) book.isPinned = isPinned;

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
//Get All Book
app.get("/get-all-books", authenticateToken, async(req, res)=>{
    const {user} = req.user;
    try{
        const books = await Book.find({userId: user._id}).sort({isPinned: -1});
        return res.json({
            error: false,
            books,
            message: "All books retrieved successfully",
        });
    }catch(error){
        return res.status(500).json({
            error: true,
            message: "Internal Server Error When Retrieve All Book"
        })
    }
});
//Delete All Book
app.delete("/delete-book/:bookId", authenticateToken, async(req, res)=>{
    const bookId=req.params.bookId;
    const {user} = req.user;

    try{
        const book = await Book.findOne({_id: bookId, userId: user._id});

        if(!book){
            return res.status(400).json({error: true, message: "Book not found"});
        }
        await Book.deleteOne({_id: bookId, userId: user._id});

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
app.put("/update-pin/:bookId", authenticateToken, async(req,res)=>{
    const bookId = req.params.bookId;
    const {isPinned} = req.body;
    const {user} = req.user;

    // if(!title && !content && !tags){
    //     return res
    //     .status(400)
    //     .json({error: true, message: "No changes provided"});
    // }

    try{
        const book = await Book.findOne({_id: bookId, userId: user._id});

        if(!book){
            return res.status(404).json({error: true, message: "Book not found"});
        }

        if(isPinned) book.isPinned = isPinned||false;

        await book.save();

        return res.json({
            error: false,
            book,
            message: "Pin updated successfully",
        });
    } catch (error){
        return res.status(500).json({
            error: true,
            message: "Internal Server Error When Updating Pin",
        });
    }
});
app.listen(8000);

module.exports = app;