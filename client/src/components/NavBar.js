import React, { useContext, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { UserContext } from '../App'

const NavBar = () => {
  const history = useHistory()
  const { state, dispatch } = useContext(UserContext)

  const logOut = () => {
    localStorage.clear()
    dispatch({type: 'CLEAR'})
    history.push('/signin')
  }

  const renderList = () => {
    if (state) {
      return [
        <li key="1"><Link to="/profile">Profile</Link></li>,
        <li key="2"><Link to="/create">Create Post</Link></li>,
        <li key="3">
          <button className="btn red darken-3 waves-effect waves-light" onClick={() => logOut()}>Log Out</button>
        </li>
      ]
    }
    else {
      return [
        <li key="4"><Link to="/signin">Sign In</Link></li>,
        <li key="5"><Link to="/signup">Sign Up</Link></li>
      ]
    }
  }
  return (
    <nav>
      <div className="nav-wrapper white">
        <Link to={state ? '/' : '/signin'} className="brand-logo left">BookGram</Link>
        <ul id="nav-mobile" className="right">
            {renderList()}
        </ul>
      </div>
    </nav>
  )
}

export default NavBar