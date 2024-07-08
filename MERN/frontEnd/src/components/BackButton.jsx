//renders a button with a back arrow icon to navigate to a destination
import { Link } from 'react-router-dom';
import { BsArrowLeft } from 'react-icons/bs'; //importing arrow icon from react-icons lib

const BackButton = ({ destination = '/' }) => {
  return (
    <div className='flex'>
      <Link
        to={destination}
        className='bg-sky-800 text-white px-4 py-1 rounded-lg w-fit'
      >
        <BsArrowLeft className='text-2xl' />
      </Link>
    </div>
  );
};

export default BackButton;
