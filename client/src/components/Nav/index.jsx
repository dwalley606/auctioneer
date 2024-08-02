import React, { useState, useEffect } from "react";
import Auth from "../../utils/auth";
import { Link, useNavigate } from "react-router-dom";
import { BsFacebook, BsTwitter, BsInstagram } from "react-icons/bs";
import {
  IoSearchOutline,
  IoPersonOutline,
  IoHeartOutline,
  IoBagHandleOutline,
} from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { signoutSuccess } from "../../redux/user/userSlice";
import { Avatar, Button } from "flowbite-react";
import Cart from "../Cart"; // Import the Cart component
import "./Nav.css";

const Nav = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 992);
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false); // State for cart dropdown

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 992);
      if (window.innerWidth >= 992) {
        setIsNavbarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleSignout = async () => {
    console.log("Signing out...");
    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL.replace(/\/+$/, ""); // Remove trailing slash if exists
      console.log(`API URL: ${apiUrl}/user/signout`);
      const res = await fetch(`${apiUrl}/user/signout`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
        navigate("/login");
      }
    } catch (error) {
      console.log(error.message);
    }
  };


  const toggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };

  const toggleDropdown = () => {
    console.log("Dropdown toggled");
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleCart = () => {
    console.log("Cart toggled");
    setIsCartOpen(!isCartOpen);
  };

  return (
    <header>
      <div className="navbar-top">
        <div className="container">
          <ul className="navbar-social-container">
            <li>
              <a href="#" className="social-link">
                <BsFacebook />
              </a>
            </li>
            <li>
              <a href="#" className="social-link">
                <BsTwitter />
              </a>
            </li>
            <li>
              <a href="#" className="social-link">
                <BsInstagram />
              </a>
            </li>
          </ul>
          <div className="navbar-alert-news">
            <p>
              <b>Free Shipping</b> This Week Order Over - $55
            </p>
          </div>
          <div className="navbar-top-actions">
            <select name="currency">
              <option value="usd">USD &dollar;</option>
              <option value="eur">EUR &euro;</option>
            </select>
            <select name="language">
              <option value="en-US">English</option>
              <option value="es-ES">Espa&ntilde;ol</option>
              <option value="fr">Fran&ccedil;ais</option>
            </select>
          </div>
        </div>
      </div>

      <div className="navbar-main">
        <div className="container">
          <div className="navbar-search-container">
            <input
              type="search"
              name="search"
              className="search-field"
              placeholder="Enter your product name..."
            />
            <button className="search-btn">
              <IoSearchOutline />
            </button>
          </div>
          <div className="navbar-user-actions">
            {currentUser ? (
              <div className="relative">
                <button className="action-btn" onClick={toggleDropdown}>
                  <IoPersonOutline />
                </button>
                {isDropdownOpen && (
                  <div className="dropdown-menu">
                    <div className="dropdown-header">
                      <span className="block text-sm">
                        @{currentUser.username}
                      </span>
                      <span className="block text-sm font-medium truncate">
                        {currentUser.email}
                      </span>
                    </div>
                    <Link
                      to={"/dashboard?tab=profile"}
                      className="dropdown-item"
                    >
                      Profile
                    </Link>
                    <div className="dropdown-divider" />
                    <button onClick={handleSignout} className="dropdown-item">
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login">
                <Button gradientDuoTone="purpleToBlue" outline>
                  Sign In
                </Button>
              </Link>
            )}
            <button className="action-btn">
              <IoHeartOutline />
              <span className="count">0</span>
            </button>
            <button className="action-btn" onClick={toggleCart}>
              <IoBagHandleOutline />
              <span className="count">0</span>
            </button>
            {isCartOpen && (
              <div className="cart-dropdown">
                <Cart />
              </div>
            )}
          </div>
        </div>
      </div>

      <nav
        className={`desktop-navigation-menu ${isNavbarOpen ? "active" : ""}`}
      >
        <div className="container">
          <ul className="desktop-menu-category-list">
            <li className="menu-category">
              <Link to="/" className="menu-title">
                Home
              </Link>
            </li>
            <li className="menu-category">
              <Link to="/categories" className="menu-title">
                Categories
              </Link>
              <div className="dropdown-panel">
                <ul className="dropdown-panel-list">
                  <li className="menu-title">
                    <a href="#">Electronics</a>
                  </li>
                  <li className="panel-list-item">
                    <a href="#">Desktop</a>
                  </li>
                  <li className="panel-list-item">
                    <a href="#">Laptop</a>
                  </li>
                  <li className="panel-list-item">
                    <a href="#">Camera</a>
                  </li>
                  <li className="panel-list-item">
                    <a href="#">Tablet</a>
                  </li>
                  <li className="panel-list-item">
                    <a href="#">Headphone</a>
                  </li>
                </ul>
                <ul className="dropdown-panel-list">
                  <li className="menu-title">
                    <a href="#">Men's</a>
                  </li>
                  <li className="panel-list-item">
                    <a href="#">Formal</a>
                  </li>
                  <li className="panel-list-item">
                    <a href="#">Casual</a>
                  </li>
                  <li className="panel-list-item">
                    <a href="#">Sports</a>
                  </li>
                  <li className="panel-list-item">
                    <a href="#">Jacket</a>
                  </li>
                  <li className="panel-list-item">
                    <a href="#">Sunglasses</a>
                  </li>
                </ul>
                <ul className="dropdown-panel-list">
                  <li className="menu-title">
                    <a href="#">Women's</a>
                  </li>
                  <li className="panel-list-item">
                    <a href="#">Formal</a>
                  </li>
                  <li className="panel-list-item">
                    <a href="#">Casual</a>
                  </li>
                  <li className="panel-list-item">
                    <a href="#">Perfume</a>
                  </li>
                  <li className="panel-list-item">
                    <a href="#">Cosmetics</a>
                  </li>
                  <li className="panel-list-item">
                    <a href="#">Bags</a>
                  </li>
                </ul>
                <ul className="dropdown-panel-list">
                  <li className="menu-title">
                    <a href="#">Electronics</a>
                  </li>
                  <li className="panel-list-item">
                    <a href="#">Smart Watch</a>
                  </li>
                  <li className="panel-list-item">
                    <a href="#">Smart TV</a>
                  </li>
                  <li className="panel-list-item">
                    <a href="#">Keyboard</a>
                  </li>
                  <li className="panel-list-item">
                    <a href="#">Mouse</a>
                  </li>
                  <li className="panel-list-item">
                    <a href="#">Microphone</a>
                  </li>
                </ul>
              </div>
            </li>
            <li className="menu-category">
            <Link to="/currentBids" className="menu-title">
                Current Bids
            </Link>
            </li>
            <li className="menu-category">
              <Link to="/auctions" className="menu-title">
                Auctions
              </Link>
            </li>
            <li className="menu-category">
              <Link to="/pages/contact" className="menu-title">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Nav;