import React, {useState} from 'react';
import ProfileInfo from '../Cards/ProfileInfo';
import {useNavigate} from 'react-router-dom';
import SearchBar from '../SearchBar/SearchBar';
import { FaSortAmountDown } from 'react-icons/fa';

const NavBar = ({userInfo, onSearchBook, handleClearSearch, onSortBooks}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSorted, setIsSorted] = useState(false);
  const navigate = useNavigate();

  const onLogOut = () =>{
    localStorage.clear(); 
    navigate("/login");
  };

  const handleSearch = (option) => {
    if(searchQuery){
      onSearchBook(searchQuery, option)
    }
  };

  const onClearSearch = () => {
    setSearchQuery("");
    handleClearSearch();
  };

  const handleSortClick = () => {
    setIsSorted(!isSorted);
    onSortBooks(!isSorted);
  };


  return (
    <div className='bg-white flex items-center justify-between px-6 py-2 drop-shadow z-50 fixed w-full top-0 left-0'>
      <h2 className='text-xl font-medium text-black py-2'>Book Management</h2>

      <SearchBar value ={searchQuery} 
      onChange={({target})=>{
        setSearchQuery(target.value);
      }} 
      handleSearch={handleSearch}
      onClearSearch={onClearSearch}
      />

      <FaSortAmountDown
      className={`cursor-pointer ${isSorted ? 'text-blue-500' : 'text-gray-500'}`}
      onClick={handleSortClick}
      title="Sort by high score"
      />

      <ProfileInfo userInfo={userInfo} onLogOut={onLogOut}/>
    </div>
  )
}

export default NavBar
