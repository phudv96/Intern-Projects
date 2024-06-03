import React, {useState} from 'react';
import TagInput from '../../components/Input/TagInput';
import {MdClose} from 'react-icons/md'
import axiosInstance from '../../utils/axiosInstance';

const AddEditNotes = ({bookData, type, getAllBooks, onClose}) => {

    const [title, setTitle] = useState(bookData?.title||"");
    const [content, setContent] = useState(bookData?.content||"");
    const [tags, setTags] = useState(bookData?.tags||[]);
    const [error, setError] = useState(null);
//Add New Book
    const addNewNote = async () => {
      try{
        const response = await axiosInstance.put("/add-book",{
          title,
          content,
          tags,
        });
        if (response.data && response.data.book){
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
    const editNote = async () => {
      const bookId = bookData._id;
      try{
        const response = await axiosInstance.put("/edit-book/" + bookId,{
          title,
          content,
          tags,
        });
        if (response.data && response.data.book){
          getAllBooks();
          onClose();
        }
      }catch(error){
        if (error.response && error.response.data && error.response.data.message){
          setError(error.response.data.message);
        }
      }
    };

    const handleAddNode = () => {
        if (!title) {
            setError("Please enter the title");
            return;
        }
        if (!content){
            setError("Please enter the content");
            return;
        }
        if (tags.length===0){
            setError("Please enter the genre");
            return;
        }

        setError("");

        if(type==='edit'){
            editNote();
        } else{
            addNewNote();
        }
    }
  return (
    <div className='relative'>
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
        className='text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded'
        placeholder='A short summary of the book'
        row={10}
        value={content}
        onChange={({target})=>setContent(target.value)}
        />
      </div>

      <div className='mt-3'>
        <label className='input-label'>GENRES</label>
        <TagInput tags={tags} setTags={setTags} />
      </div>
      
      {error && <p className='text-red-500 text-xs pt-4'>{error}</p>}

      <button className='btn-primary font-medium mt-5 p-3' onClick={handleAddNode}>
        {type==='edit' ? 'UPDATE' : 'ADD'}
      </button>
    </div>
  )
}

export default AddEditNotes
