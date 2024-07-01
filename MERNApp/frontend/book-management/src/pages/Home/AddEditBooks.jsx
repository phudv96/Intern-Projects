import React, {useState} from 'react';
import TagInput from '../../components/Input/TagInput';
import {MdClose} from 'react-icons/md'
import axiosInstance from '../../utils/axiosInstance';

const AddEditBooks = ({bookData, type, getAllBooks, onClose, showToastMessage}) => {

    const [title, setTitle] = useState(bookData?.title||"");
    const [content, setContent] = useState(bookData?.content||"");
    const [publishedYear, setPublishedYear] = useState(bookData?.publishedYear||"");
    const [author, setAuthor] = useState(bookData?.author||"");
    const [tags, setTags] = useState(bookData?.tags||[]);
    const [imageUrl, setImageUrl] = useState('');
    const [error, setError] = useState(null);

//Add New Book
    const addNewBook = async () => {
      try{
        const response = await axiosInstance.post("/add-book",{
          title,
          content,
          tags,
          author,
          publishedYear,
          imageUrl,
        });
        if (response.data && response.data.book){
          showToastMessage("Book Added Successfully");
          getAllBooks();
          onClose();
        }
      }catch(error){
        if (error.response && error.response.data && error.response.data.message){
          setError(error.response.data.message);
        }
      }
    };
//Edit Book
    const editBook = async () => {
      const bookId = bookData._id;
      try{
        const response = await axiosInstance.put("/edit-book/" + bookId,{
          title,
          content,
          tags,
          author,
          publishedYear,
          imageUrl,
        });
        if (response.data && response.data.book){
          showToastMessage("Book Updated Successfully");
          getAllBooks();
          onClose();
        }
      }catch(error){
        if (error.response && error.response.data && error.response.data.message){
          setError(error.response.data.message);
        }
      }
    };

    const handleAddBook = () => {
        if (!title) {
            setError("Please enter the title");
            return;
        }
        if (!content){
            setError("Please enter the content");
            return;
        }
        if (!author) {
          setError("Please enter the name of the author");
          return;
        }
        if (!publishedYear) {
          setError("Please enter published year");
          return;
        }
        if (tags.length===0){
            setError("Please enter the genre");
            return;
        }

        setError("");

        if(type==='edit'){
            editBook();
        } else{
            addNewBook();
        }
    }
  return (
    <div className='relative z-50'>
        <button 
            className='w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50'
            onClick={onClose}
        >
            <MdClose className='text-xl text-slate-400'/>
        </button>
      <div className='flex flex-col gap-2'>
        <label className='input-label'>TITLE</label>
        <input 
        type='text'
        className='text-2xl text-slate-950 outline-none'
        placeholder='Title of your book'
        value={title}
        onChange={({target})=>setTitle(target.value)}
        />
      </div>

      <div className='flex flex-col gap-2 mt-4'>
        <label className='input-label'>CONTENT</label>
        <textarea 
        type='text'
        className='text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded h-40'
        placeholder='A short summary of the book'
        row={10}
        value={content}
        onChange={({target})=>setContent(target.value)}
        />
      </div>

      <div className='flex flex-col gap-2 mt-4'>
        <label className='input-label'>AUTHOR</label>
        <textarea 
        type='text'
        className='text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded'
        placeholder='Who wrote the book'
        row={10}
        value={author}
        onChange={({target})=>setAuthor(target.value)}
        />
      </div>

      <div className='flex flex-col gap-2 mt-4'>
        <label className='input-label'>PUBLISHED YEAR</label>
        <textarea 
        type='number'
        className='text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded'
        placeholder='When was the book published'
        row={10}
        value={publishedYear}
        onChange={({target})=>setPublishedYear(target.value)}
        />
      </div>

      <div className='flex flex-col gap-2 mt-4'>
        <label className='input-label'>Image URL</label>
        <textarea 
        type='text'
        className='text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded'
        placeholder='Put the URL to your image in this section'
        row={10}
        value={imageUrl}
        onChange={({target})=>setImageUrl(target.value)}
        />
      </div>

      <div className='mt-3'>
        <label className='input-label'>GENRES</label>
        <TagInput tags={tags} setTags={setTags} />
      </div>
      
      {error && <p className='text-red-500 text-xs pt-4'>{error}</p>}

      <button className='btn-primary font-medium mt-5 p-3' onClick={handleAddBook}>
        {type==='edit' ? 'UPDATE' : 'ADD'}
      </button>
    </div>
  )
}

export default AddEditBooks
