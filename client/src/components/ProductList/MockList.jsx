import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  addToCart,
  removeFromCart,
  selectCartItems,
} from "../../redux/cart/cartSlice";
import Cart from "../Cart/MockCart";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { selectAuctions } from "../../redux/auction/auctionSlice";
import "./MockList.css"; // Import the CSS file

export default function Products() {
  const [showModal, setShowModal] = useState(false);
  const [products, setProducts] = useState([]);
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const auctions = useSelector(selectAuctions);

  const toggle = () => {
    setShowModal(!showModal);
  };

  async function getProducts() {
    console.log("Fetching products from dummy API");
    const response = await fetch("https://dummyjson.com/products");
    const data = await response.json();
    console.log("Products fetched: ", data.products);
    setProducts(data.products);
  }

  useEffect(() => {
    getProducts();
  }, []);

  const notifyAddedToCart = (item) => {
    console.log("Adding to cart: ", item);
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

  const notifyRemovedFromCart = (item) => {
    console.log("Removing from cart: ", item);
    toast.error(`${item.title} removed from cart!`, {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
      style: {
        backgroundColor: "#000",
        color: "#fff",
      },
    });
  };

  const handleRemoveFromCart = (product) => {
    console.log("Dispatching removeFromCart action for: ", product);
    dispatch(removeFromCart(product));
    notifyRemovedFromCart(product);
  };

  return (
    <div className="products-container">
      <ToastContainer />
      <div className="products-header">
        <h1 className="products-title">Shop</h1>
        {!showModal && (
          <button className="products-cart-button" onClick={toggle}>
            Cart ({cartItems.length})
          </button>
        )}
      </div>
      <div className="products-grid">
        {products.map((product) => {
          const auction = auctions.find((a) => a.productId === product.id);
          return (
            <div key={product.id} className="product-card">
              <Link to={`/products/${product.id}`}>
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="product-image"
                />
              </Link>
              <div className="product-info">
                <h1 className="product-title">{product.title}</h1>
                <p className="product-description">
                  {product.description.slice(0, 40)}...
                </p>
                <p className="product-price">${product.price}</p>
                {auction && (
                  <div>
                    <p className="product-bid">
                      Highest Bid: ${auction.highestBid}
                    </p>
                    <p className="product-time">
                      Time Left: {Math.floor(auction.timeLeft / 60)}:
                      {auction.timeLeft % 60}
                    </p>
                  </div>
                )}
              </div>
              <div className="product-actions">
                {!cartItems.find((item) => item.id === product.id) ? (
                  <button
                    className="product-button"
                    onClick={() => {
                      console.log("Adding product to cart: ", product);
                      dispatch(addToCart(product));
                      notifyAddedToCart(product);
                    }}
                  >
                    Add to cart
                  </button>
                ) : (
                  <div className="product-quantity">
                    <button
                      className="product-button"
                      onClick={() => dispatch(addToCart(product))}
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
          );
        })}
      </div>
      <Cart showModal={showModal} toggle={toggle} />
    </div>
  );
}
