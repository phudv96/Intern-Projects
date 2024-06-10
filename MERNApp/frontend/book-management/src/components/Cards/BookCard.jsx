import React, {useState, useEffect} from 'react';
import { MdCreate, MdDelete} from 'react-icons/md';
import { HiBookmark } from "react-icons/hi2";
import axiosInstance from '../../utils/axiosInstance';
import imagePlaceHolder from '../../assets/No-Image-Placeholder.svg'

const BookCard = ({title, publishedYear, author, content, tags, imageUrl, isPinned, onEdit, onDelete, onPinNote}) => {
  const [userData, setUserData] = useState(null);

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

  return ( 
    <div className='border rounded p-4 bg-white hover:shadow-xl transition-all ease-in-out '>
      <div className='flex items-center justify-between'>
        <div>
            <h6 className='text-sm font-bold'>{title}</h6>
            <span className='text-xs text-slate-500'>{publishedYear}</span>
        </div>
        <div className="flex-shrink-0">
          <HiBookmark className={`icon-btn ${isPinned ? 'text-primary' : 'text-slate-300'}`} onClick={onPinNote} />
        </div>
      </div>

      <p className='text-xs text-slate-600 mt-2'>{author}</p>

      <img src={imageUrl ? imageUrl : imagePlaceHolder} alt="Book cover" className="w-full h-auto my-4" />

      <div className='flex-1 my-2'>
        <p className='text-xs text-slate-600'>{content.slice(0, 60)}</p>
      </div>


      <div className='flex flex-col items-center justify-between mt-auto flex-grow'>
        <div className='text-xs text-slate-500 flex flex-wrap gap-1'>
          {tags.map((item) => (
            <span key={item}>{`#${item}`}</span>
          ))}
        </div>
          <div>
            {userData && userData.role === 'admin' && (
              <div className="flex items-center gap-2 self-end">
                <MdCreate className="icon-btn hover:text-green-600" onClick={onEdit} />
                <MdDelete className="icon-btn hover:text-red-500" onClick={onDelete} />
              </div>
            )}
          </div>
      </div>
    </div>
  );
};

export default BookCard;
