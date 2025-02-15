import React from 'react'
import "./Search.css"
import Users from '../Users/Users'
import Logo from "../../images/logo.avif"

const Search = ({modal, setModal}) => {
  return (
    <div className='search-user'>
      <div className="search-box">
        <img width={40} src={Logo} alt="logo_img" className="logo-img" />
        <input type="text" className="search-input" placeholder='Search...'/>

      </div>
      <h1>All Users</h1>

      <Users modal = {modal} setModal = {setModal}/>
    </div>
  )
}

export default Search