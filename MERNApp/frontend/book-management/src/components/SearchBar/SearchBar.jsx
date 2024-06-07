import React, {useState} from 'react';
import {FaMagnifyingGlass} from 'react-icons/fa6';
import {IoMdClose} from 'react-icons/io';

const SearchBar = ({value, onChange, handleSearch, onClearSearch}) => {

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('title');

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
    handleSearch(option);
  };


  return (
    <div className='w-80 flex items-center px-4 bg-slate-100 rounded-md'>
      <input 
      type = 'text'
      placeholder = 'Search Books by'
      className='w-full text-xs bg-transparent py-[11px] outline-none'
      value={value}
      onChange={onChange} />

    <div className='relative'>
      <div
        className='text-slate-500 cursor-pointer hover:text-black mr-3'
        onClick={toggleDropdown}
      >
        {selectedOption}
      </div>
      {isDropdownOpen && (
        <div className='absolute z-10 w-40 bg-white shadow-md rounded-md'>
          <div
            className='px-4 py-2 hover:bg-slate-100 cursor-pointer'
            onClick={() => handleOptionSelect('title')}
          >
            Title
          </div>
          <div
            className='px-4 py-2 hover:bg-slate-100 cursor-pointer'
            onClick={() => handleOptionSelect('author')}
          >
            Author
          </div>
          <div
            className='px-4 py-2 hover:bg-slate-100 cursor-pointer'
            onClick={() => handleOptionSelect('tags')}
          >
            Tag
          </div>
        </div>
      )}
      </div>

        <IoMdClose className='text-xl text-slate-500 cursor-pointer hover:text-black mr-3' onClick={onClearSearch} />

        <FaMagnifyingGlass className='text-slate-400 cursor-pointer hover:text-black' onClick={() => handleSearch(selectedOption)} />

    </div>
  )
}

export default SearchBar
