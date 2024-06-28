import React, {useState, useEffect} from 'react';
import { MdCreate, MdDelete} from 'react-icons/md';
import { HiBookmark } from "react-icons/hi2";
import axiosInstance from '../../utils/axiosInstance';
import imagePlaceHolder from '../../assets/No-Image-Placeholder.svg'
import { MdComment } from "react-icons/md";

const BookCard = ({title, publishedYear, author, content, tags, commentNumb, imageUrl, isPinned, onEdit, onDelete, onPinNote, onClickBook}) => {
  const [userData, setUserData] = useState(null); //to check if admin or not, allowing edit and delete respectively

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get('/get-user');
        setUserData(response.data.user);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);
  
  const handleClick = () => {
    onClickBook(title);
  };

  return ( 
    <div className='border rounded p-4 bg-white hover:shadow-xl transition-all ease-in-out cursor-pointer relative' 
      onClick={handleClick}>
      <div className='flex items-center justify-between'>
        <div>
          <h6 className='text-sm font-bold'>{title}</h6>
          <span className='text-xs text-slate-500'>{publishedYear}</span>
        </div>
        <div className="flex-shrink-0">
          <HiBookmark className={`icon-btn ${isPinned ? 'text-primary' : 'text-slate-300'}`} 
            onClick={(e) => {
              e.stopPropagation();
              onPinNote();
            }} 
          />
        </div>
      </div>

      <p className='text-xs text-slate-600 mt-2'>{author}</p>

      <div className="w-full max-w-sm aspect-w-5 overflow-hidden my-4 mx-auto">
      <img src={imageUrl ? imageUrl : imagePlaceHolder} alt="Book cover" className="w-full h-full object-cover"/>
      </div>
      

      <div className='flex-1 my-2'>
        <p className='text-xs text-slate-600'>
          {content.length > 140 ? `${content.slice(0, 140)}...` : content}
        </p>
      </div>

      <div className='flex flex-col items-center justify-between mt-auto flex-grow'>
        <div className='text-xs text-slate-500 flex flex-wrap gap-1'>
          {tags.map((item) => (
            <span key={item}>{`#${item}`}</span>
          ))}
        </div>
      </div>

      {userData && userData.role === 'admin' && (
        <div className="absolute bottom-4 right-4 flex items-center gap-2">
          <MdCreate className="icon-btn hover:text-green-600" 
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }} 
          />
          <MdDelete className="icon-btn hover:text-red-500" 
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }} 
          />
        </div>
    )}

      <div className="absolute bottom-4 left-4 flex items-center gap-2">
        <MdComment className="icon text-xl text-slate-400"/>
        <span>{commentNumb}</span>
      </div>
    </div>
  );
};

export default BookCard;
