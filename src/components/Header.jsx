import { NavLink, Link } from "react-router"
import reactLogo from '../assets/react-logo.png'
import './Header.css'
import React from "react"

export function Header(props) {

    const [showMenu, setShowMenu] = React.useState(false)

    const activeStyles = {
        fontWeight: '600',
        color: '#7DD3FC',
        borderBottom: '3px solid #7DD3FC',
        paddingBottom: '6px',
    }

    function searchPost(event) {
        const searchValue = event.currentTarget.value
        props.setSearchInput(searchValue)
    }

    function handleMenu() {
        setShowMenu(function(prevState) {
            return !prevState
        })
    }

    return (
        <header>
            <Link
                to='/'  
                className="site-logo"  
            >
                {/* <h1>#HobbyHub</h1> */}
                <img className="react-logo" src={reactLogo} alt="React logo." />
                <h1>ReactHub</h1>
            </Link>

            <input 
                className="search-bar"
                type="text"
                value={props.searchInput}
                onChange={searchPost}
                placeholder="Search"
            />

            <button 
                className="menu-button"
                onClick={handleMenu}
            >
                {showMenu ? 'x' : '☰'}
            </button>

            
            <nav className={`${showMenu ? 'show-menu' : 'hide-menu'}`}>
                <ul>
                    <li>
                        <NavLink
                            to='/'
                            style={({isActive}) => isActive ? activeStyles : null}
                            className='nav-link'
                        >
                            Home
                        </NavLink>
                    </li>
                    
                    <li>
                        <NavLink
                            to='/create'
                            style={({isActive}) => isActive ? activeStyles : null}
                            className='nav-link'
                        >
                            Create New Post
                        </NavLink>
                    </li>
                </ul>
            </nav>
            
        </header>
    )
}