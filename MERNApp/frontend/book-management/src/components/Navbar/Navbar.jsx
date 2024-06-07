import React, {useState} from 'react';
import ProfileInfo from '../Cards/ProfileInfo';
import {useNavigate} from 'react-router-dom';
import SearchBar from '../SearchBar/SearchBar';

const NavBar = ({userInfo, onSearchBook, handleClearSearch}) => {
  const [searchQuery, setSearchQuery] = useState("");
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

  return (
    <div className='bg-white flex items-center justify-between px-6 py-2 drop-shadow'>
        <h2 className='text-xl font-medium text-black py-2'>Book Management</h2>

        <SearchBar value ={searchQuery} 
        onChange={({target})=>{
          setSearchQuery(target.value);
        }} 
        handleSearch={handleSearch}
        onClearSearch={onClearSearch}
        />

        <ProfileInfo userInfo={userInfo} onLogOut={onLogOut}/>
    </div>
  )
}

export default NavBar
