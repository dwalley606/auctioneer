import React from "react";
import "./Banner.css";
import banner1 from "../../assets/images/banner-1.png";
import banner2 from "../../assets/images/banner-2.png";
import banner3 from "../../assets/images/banner-3.png";

const Banner = () => {
  return (
    <div className="banner">
      <div className="container">
        <div className="slider-container has-scrollbar">
          <div className="slider-item">
            <img
              src={banner1}
              alt="women's latest fashion sale"
              className="banner-img"
            />
            <div className="banner-content">
              <p className="banner-subtitle">Trending item</p>
              <h2 className="banner-title">Women's latest fashion sale</h2>
              <p className="banner-text">
                starting at &dollar; <b>20</b>.00
              </p>
              <a href="#" className="banner-btn">
                Shop now
              </a>
            </div>
          </div>

          <div className="slider-item">
            <img src={banner2} alt="modern sunglasses" className="banner-img" />
            <div className="banner-content">
              <p className="banner-subtitle">Trending accessories</p>
              <h2 className="banner-title">Women's latest fashion sale</h2>
              <p className="banner-text">
                starting at &dollar; <b>15</b>.00
              </p>
              <a href="#" className="banner-btn">
                Shop now
              </a>
            </div>
          </div>

           <div className="slider-item">
            <img
              src={banner3}
              alt="Technology products"
              className="banner-img"
            />
            <div className="banner-content">
              <p className="banner-subtitle">Latest tech</p>
              <h2 className="banner-title">Technology products sale</h2>
              <p className="banner-text">
                starting at &dollar; <b>50</b>.00
              </p>
              <a href="#" className="banner-btn">
                Shop now
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
