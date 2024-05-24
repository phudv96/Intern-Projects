import {Book} from '../Model/bookSchema';

//Function to get all book 
async function getAllBook (req, res){
    try{
        const books = await Book.find({});
        return res.status(200).json({
            count: books.length,
            data: books,
        });
    } 
    catch(error) {
        console.log(error.message);
        res.status(500).send({message: error.message});
    }
}
//Function to get one book by ID
async function getOneBook(req, res){
    try{
        const {id} = req.params;
        const book = await Book.findById({id});
        if(!book){
            return res.status(400).json({msg: `There is no book with id ${id}`});
        }
        return res.status(200).json({book});
    }
    catch(error){
        res.status(500).json({msg: error});
    }
}

async function uploadBook(req, res){
    try{
        const title = res.body.title;
        const author = res.body.author;
        const publishYear = res.body.publishYear;

        if(!title || !author || !publishYear){
            return res.status(400).send({message: 'Fill out all the required fields'});
        }

        const newBook = {
            title: title,
            author: author,
            publishYear: publishYear,
        };

        const book = await Book.create(newBook);
        return res.status(201).send({book});
    }
    catch(error){
        console.log(error.message);
        res.status(500).send({message: error.message});
    }
}

async function updateBook(req, res){
    try{
        const {id} = req.params;
        const result = await Book.findByIdAndUpdate(
            {id: id}, 
            {$set: request.body},
            {new: true, runValidators: true, context: 'query'};
        if(!result){
            return res.status(400).json({message: 'Book not found'});
        }

        return res.status(200).send({message: 'Book updated successfully'});
    }
    catch(error){
        console.log(error.message);
        res.status(500).send({message: error.message});
    }
}

async function deleteBook(req, res){
    try{
        const {id} = req.params;
        const result = await findByIdAndDelete(id);
        if(!result){
            return res.status(400).json({message: 'Book not found'});
        }

        return res.status(200).send({message: 'Book deleted successfully'});
    }
    catch(error){
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
}

module.exports = {getAllBook, getOneBook, uploadBook, updateBook, deleteBook};
