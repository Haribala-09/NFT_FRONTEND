import React from 'react'
import './Searchbar.css'
import { FaSearch } from "react-icons/fa";

const Searchbar = () => {
  return (
    <div className="Searchbar">
        <div className="Searchbar-box">
            <input className='Searchbar-input' type="text" placeholder='Search...'/>
            <FaSearch className='Searchbar-icon'/>
        </div>
    </div>
  )
}

export default Searchbar