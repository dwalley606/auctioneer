import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../redux/categories/categoriesSlice";
import { Link, useNavigate } from "react-router-dom";
import { BsFacebook, BsTwitter, BsInstagram } from "react-icons/bs";
import {
  IoSearchOutline,
  IoPersonOutline,
  IoHeartOutline,
  IoBagHandleOutline,
} from "react-icons/io5";
import { signoutSuccess } from "../../redux/user/userSlice";
import { Button } from "flowbite-react";
import Cart from "../Cart";
import "./Nav.css";

const Nav = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const {
    items: categories,
    loading,
    error,
  } = useSelector((state) => state.categories);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 992);
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

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
    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL.replace(/\/+$/, ""); // Remove trailing slash if exists
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
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <header>
      <div className="navbar-top">
        <div className="container">
          <ul className="navbar-social-container">
            <li key="facebook">
              <a href="#" className="social-link">
                <BsFacebook />
              </a>
            </li>
            <li key="twitter">
              <a href="#" className="social-link">
                <BsTwitter />
              </a>
            </li>
            <li key="instagram">
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
            <select name="currency" key="currency">
              <option value="usd">USD &dollar;</option>
              <option value="eur">EUR &euro;</option>
            </select>
            <select name="language" key="language">
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
              key="search-input"
            />
            <button className="search-btn" key="search-button">
              <IoSearchOutline />
            </button>
          </div>
          <div className="navbar-user-actions">
            {currentUser ? (
              <div className="relative" key="user-actions">
                <button
                  className="action-btn"
                  onClick={toggleDropdown}
                  key="person-btn"
                >
                  <IoPersonOutline />
                </button>
                {isDropdownOpen && (
                  <div className="dropdown-menu" key="dropdown-menu">
                    <div className="dropdown-header" key="dropdown-header">
                      <span className="block text-sm" key="username">
                        @{currentUser.username}
                      </span>
                      <span
                        className="block text-sm font-medium truncate"
                        key="user-email"
                      >
                        {currentUser.email}
                      </span>
                    </div>
                    <Link
                      to={"/dashboard?tab=profile"}
                      className="dropdown-item"
                      key="profile-link"
                    >
                      Profile
                    </Link>
                    <div className="dropdown-divider" key="divider" />
                    <button
                      onClick={handleSignout}
                      className="dropdown-item"
                      key="signout-btn"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" key="login-link">
                <Button gradientDuoTone="purpleToBlue" outline key="login-btn">
                  Sign In
                </Button>
              </Link>
            )}
            <button className="action-btn" key="heart-btn">
              <IoHeartOutline />
              <span className="count">0</span>
            </button>
            <button className="action-btn" onClick={toggleCart} key="cart-btn">
              <IoBagHandleOutline />
              <span className="count">0</span>
            </button>
            {isCartOpen && (
              <div className="cart-dropdown" key="cart-dropdown">
                <Cart showModal={isCartOpen} toggle={toggleCart} />
              </div>
            )}
          </div>
        </div>
      </div>

      <nav
        className={`desktop-navigation-menu ${isNavbarOpen ? "active" : ""}`}
      >
        <div className="container">
          <ul className="desktop-menu-category-list" key="menu-category-list">
            <li className="menu-category" key="home">
              <Link to="/" className="menu-title">
                Home
              </Link>
            </li>
            <li className="menu-category" key="categories">
              <Link to="/categories" className="menu-title">
                Categories
              </Link>
              <div className="dropdown-panel" key="dropdown-panel">
                {loading && <p key="loading">Loading...</p>}
                {error && <p key="error">Error: {error.message}</p>}
                {Array.isArray(categories) &&
                  categories.length > 0 &&
                  categories.map((category) => (
                    <div key={category.id} className="dropdown-panel-list">
                      <div
                        className="menu-title"
                        key={`category-${category.id}`}
                      >
                        <Link
                          to={`/categories/${category.id}`}
                          key={`category-link-${category.id}`}
                        >
                          {category.name}
                        </Link>
                      </div>
                      {Array.isArray(category.subcategories) &&
                        category.subcategories.map((subcategory) => (
                          <div key={subcategory.id} className="panel-list-item">
                            <Link
                              to={`/categories/${category.id}/${subcategory.id}`}
                              key={`subcategory-link-${subcategory.id}`}
                            >
                              {subcategory.name}
                            </Link>
                          </div>
                        ))}
                    </div>
                  ))}
              </div>
            </li>
            <li className="menu-category" key="currentBids">
              <Link to="/currentBids" className="menu-title">
                Current Bids
              </Link>
            </li>
            <li className="menu-category" key="services">
              <Link to="/auctions" className="menu-title">
                Auctions
              </Link>
            </li>
            <li className="menu-category" key="contact">
              <Link to="/contact" className="menu-title">
                Contact
              </Link>
            </li>
            <li className="menu-category" key="list-item">
              <Link to="/posting" className="menu-title">
                List an Item
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Nav;
