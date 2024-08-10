import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import spinner from "../../assets/spinner.gif";
import { fetchProducts } from "../../redux/products/productsSlice";
import {
  addToCart,
  removeFromCart,
  selectCartItems,
} from "../../redux/cart/cartSlice";
import { selectAuctions } from "../../redux/auction/auctionSlice";
import "./ProductList.css";
import socket from "../../utils/socket";

const ProductList = () => {
  const dispatch = useDispatch();
  const {
    items: products,
    loading,
    error,
  } = useSelector((state) => state.products);
  const cartItems = useSelector(selectCartItems);
  const auctions = useSelector(selectAuctions);

  useEffect(() => {
    dispatch(fetchProducts());

    socket.on("bidChange", (data) => {
      dispatch(fetchProducts());
    });

    return () => {
      socket.off("bidChange");
    };
  }, [dispatch]);

  const groupProductsByCategory = () => {
    const groupedProducts = {};
    products.forEach((product) => {
      const categoryName = product.category.name;
      if (!groupedProducts[categoryName]) {
        groupedProducts[categoryName] = [];
      }
      groupedProducts[categoryName].push(product);
    });
    return groupedProducts;
  };

  const notifyAddedToCart = (item) => {
    toast.success(`${item.name} added to cart!`, {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
      style: {
        backgroundColor: "#fff",
        color: "#000",
      },
    });
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    notifyAddedToCart(product);
  };

  const handleRemoveFromCart = (product) => {
    dispatch(removeFromCart(product));
  };

  const handleImageError = (event) => {
    event.target.src =
      "https://via.placeholder.com/200x300.png?text=Image+Not+Available";
  };

  const groupedProducts = groupProductsByCategory();

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    
    nextArrow: (
      <div>
        <div className="next-slick-arrow"> ⫸ </div>
      </div>
    ),
    prevArrow: (
      <div>
        <div className="prev-slick-arrow"> ⫷ </div>
      </div>
    ),
  };

  return (
    <div className="product-list-products-container">
      <ToastContainer />
      <h2 className="product-list-header">Our Products:</h2>
      {error && <p>Error: {error}</p>}
      {loading ? (
        <img src={spinner} alt="loading" />
      ) : Object.keys(groupedProducts).length > 0 ? (
        Object.keys(groupedProducts).map((category) => (
          <div key={category} className="product-list-category-section">
            <h3 className="product-list-category-title">Shop {category}</h3>
            <Slider {...settings}>
              {groupedProducts[category].map((product) => {
                const auction = auctions.find(
                  (a) => a.product.id === product.id
                );
                return (
                  <div
                    key={product.id}
                    className="product-list-product-card product-list-container"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-list-product-image product-list-img"
                      onError={handleImageError}
                    />
                    <div className="product-list-product-info product-list-title">
                      <h1 className="product-list-product-title">
                        {product.name}
                      </h1>
                      <p className="product-list-product-description product-list-description">
                        {product.description.slice(0, 40)}...
                      </p>
                      <p className="product-list-product-price">
                        ${product.price}
                      </p>
                      {auction && auction.status === "active" && (
                        <p className="product-list-product-auction">
                          Auction Active: Highest Bid ${auction.highestBid}
                        </p>
                      )}
                    </div>
                    <div className="product-list-product-actions">
                      <button
                        className="product-list-product-button"
                        onClick={() => handleAddToCart(product)}
                      >
                        Add to cart
                      </button>
                      <a
                        href={`/products/${product.id}`}
                        className="product-list-product-details-button"
                      >
                        View Product Details
                      </a>
                    </div>
                  </div>
                );
              })}
            </Slider>
          </div>
        ))
      ) : (
        <h3>No products available.</h3>
      )}
    </div>
  );
};

export default ProductList;
