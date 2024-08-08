import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import spinner from "../../assets/spinner.gif";
import "react-toastify/dist/ReactToastify.css";
import { fetchProducts } from "../../redux/products/productsSlice";
import {
  addToCart,
  removeFromCart,
  selectCartItems,
} from "../../redux/cart/cartSlice";
import "./ProductList.css";
import socket from "../../utils/socket";

const ProductList = () => {
  const dispatch = useDispatch();
  const {
    items: products,
    loading,
    error,
  } = useSelector((state) => state.products);
  const { currentCategory } = useSelector((state) => state.categories);
  const cartItems = useSelector(selectCartItems);

  useEffect(() => {
    console.log("Fetching products...");
    dispatch(fetchProducts());

    socket.on("bidChange", (data) => {
      console.log("Received bidChange event:", data);
      dispatch(fetchProducts());
    });

    return () => {
      socket.off("bidChange");
    };
  }, [dispatch]);

  const filterProducts = () => {
    if (!currentCategory) {
      return products;
    }
    return products.filter(
      (product) => product.category.name === currentCategory
    );
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
    console.log(`Adding product ${product.name} to cart.`);
    dispatch(addToCart(product));
    notifyAddedToCart(product);
  };

  const handleRemoveFromCart = (product) => {
    console.log(`Removing product ${product.name} from cart.`);
    dispatch(removeFromCart(product));
  };

  const handleImageError = (event) => {
    console.log("Image not available, setting placeholder.");
    event.target.src =
      "https://via.placeholder.com/200x300.png?text=Image+Not+Available";
  };

  return (
    <div className="products-container">
      <ToastContainer />
      <h2>Our Products:</h2>
      {error && <p>Error: {error}</p>}
      {loading ? (
        <img src={spinner} alt="loading" />
      ) : (
        <>
          {products && products.length ? (
            <div className="products-grid">
              {filterProducts().map((product) => (
                <div key={product.id} className="product-card">
                  <a href={`/products/${product.id}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-image"
                      onError={handleImageError}
                    />
                  </a>
                  <div className="product-info">
                    <h1 className="product-title">{product.name}</h1>
                    <p className="product-description">
                      {product.description.slice(0, 40)}...
                    </p>
                    <p className="product-price">${product.price}</p>
                  </div>
                  <div className="product-actions">
                    {!cartItems.find((item) => item.id === product.id) ? (
                      <button
                        className="product-button"
                        onClick={() => handleAddToCart(product)}
                      >
                        Add to cart
                      </button>
                    ) : (
                      <div className="product-quantity">
                        <button
                          className="product-button"
                          onClick={() => handleAddToCart(product)}
                        >
                          +
                        </button>
                        <p className="product-quantity-text">
                          {
                            cartItems.find((item) => item.id === product.id)
                              .quantity
                          }
                        </p>
                        <button
                          className="product-button"
                          onClick={() => {
                            const cartItem = cartItems.find(
                              (item) => item.id === product.id
                            );
                            if (cartItem.quantity === 1) {
                              handleRemoveFromCart(product);
                            } else {
                              dispatch(removeFromCart(product));
                            }
                          }}
                        >
                          -
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <h3>No products available.</h3>
          )}
        </>
      )}
    </div>
  );
};

export default ProductList;
