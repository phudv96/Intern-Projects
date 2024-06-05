import React, {useState, useEffect} from 'react';
import Navbar from '../../components/Navbar/Navbar';
import NoteCard from '../../components/Cards/NoteCard';
import {MdAdd} from 'react-icons/md';
import AddEditNotes from './AddEditNotes';
import Modal from 'react-modal';
import {useNavigate} from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import Toast from '../../components/ToastMessage/Toast';
import noResult from '../../../public/noRecord.png';

const Home = () => {

  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message:"",
    type: "add",
  });

  const [userInfo, setUserInfo] = useState(null);
  const [allBooks, setAllBooks] = useState([]);
  const [isSearch, setIsSearch] = useState(false);

  const navigate = useNavigate();

  const handleEdit = (bookDetails) => {
    setOpenAddEditModal({isShown: true, data: bookDetails, type: "edit"});
  };

  const handleClearSearch = () =>{
    setIsSearch(false);
    getAllBooks();
  };

  const showToastMessage=(message,type) => {
    setShowToastMsg({
      isShown: true,
      message,  
      type,
    });
  };

  const handleCloseToast=() => {
    setShowToastMsg({
      isShown: false,
      message: "",  
    });
  };

  //get user info

  const getUserInfo = async() => {
    try{
      const response = await axiosInstance.get("/get-user");
      if(response.data && response.data.user){
        setUserInfo(response.data.user);
      }
    }catch(error){
      if(error.response.status === 401){
        localStorage.clear();
        navigate("login");
      }
    }
  };
  //Get all Books
  const getAllBooks = async () => {
    try{
      const response = await axiosInstance.get("/get-all-books");

      if(response.data && response.data.books){
        setAllBooks(response.data.books);
      }
    } catch(error){
      console.log("An unexpected error occurred. Please try again");
    }
  };

  //Delete a book
  const deleteBook = async(data) => {
    const bookId = data._id;
    console.log(`button is clicked: ${bookId}`);
    try{
      const response = await axiosInstance.delete("/delete-book/" + bookId);
      if (response.data && !response.data.error){
        showToastMessage("Book Deleted Successfully", 'delete');
        getAllBooks();
      }
    }catch(error){
      if (error.response && error.response.data && error.response.data.message){
        console.log("An unexpected error occurred. Please try again");
      }
    }
  }

  //Search for a book
  const onSearchBook = async (query) => {
    try{
      const response = await axiosInstance.get("/search-books", {
        params: {query},
      });
      
      if (response.data && response.data.books){
        setIsSearch(true);
        setAllBooks(response.data.books);
      }
    } catch(error){
      console.log(error);
    }
  }

  const updateIsPinned = async (bookData) =>{
  };

  useEffect(() => {
    getAllBooks();
    getUserInfo();
    return()=>{};
  }, []);

  return (
    <>
    <Navbar userInfo={userInfo} onSearchBook={onSearchBook} handleClearSearch = {handleClearSearch}/>

    <div className='container mx-auto'>
      <div className='grid grid-cols-3 gap-4 mt-8'>
        {allBooks.map((item, index) => (
          <NoteCard
            key={item._id}
            title={item.title}
            publishedYear={item.publishedYear}
            author={item.author}
            content={item.content}
            tags={item.tags}
            isPinned={item.isPinned}
            onEdit={() => handleEdit(item)}
            onDelete={() => deleteBook(item)}
            onPinNote={() => {}}
          />          
        ))};
      </div>
    </div>
    
    <button className='w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10' 
    onClick={()=>{
      setOpenAddEditModal({isShown: true, type: "add", data: null});
    }}
    >
      <MdAdd className='text-[32px] text-white' />
    </button>

    <Modal
      isOpen={openAddEditModal.isShown}
      onRequestClose={()=>{}}
      style={{
        overlay: {
          backgroundColor: 'rgba(0,0,0,0.2)',
        },
      }}
      contentLabel=''
      className='w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll'
    >
      <AddEditNotes
        type={openAddEditModal.type}
        bookData={openAddEditModal.data}
        onClose={()=>{setOpenAddEditModal({isShown: false, type: "add", data: null});}}
        getAllBooks={getAllBooks}
        showToastMessage={showToastMessage}
      />
    </Modal>

    <Toast 
      isShown={showToastMsg.isShown}
      message={showToastMsg.message}
      type={showToastMsg.type}
      onClose={handleCloseToast}
    />
    </>
  );
};

export default Home;
