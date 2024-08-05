// client/src/components/Cart/index.jsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  addToCart,
  removeFromCart,
  clearCart,
  selectCartItems,
  selectCartTotal,
} from "../../redux/cart/cartSlice";
import "./Cart.css";

const Cart = ({ showModal, toggle }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);

  const notifyRemovedFromCart = (item) =>
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

  const notifyCartCleared = () =>
    toast.error("Cart cleared!", {
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

  const handleRemoveFromCart = (item) => {
    dispatch(removeFromCart(item));
    notifyRemovedFromCart(item);
  };

  return (
    showModal && (
      <div className="cart-modal">
        <ToastContainer />
        <h1 className="cart-title">Cart</h1>
        <div className="cart-close-button">
          <button className="cart-button" onClick={toggle}>
            Close
          </button>
        </div>
        <div className="cart-items">
          {cartItems.map((item) => (
            <div className="cart-item" key={item.id}>
              <div className="cart-item-info">
                <img
                  src={item.image}
                  alt={item.title}
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <h1 className="cart-item-title">{item.title}</h1>
                  <p className="cart-item-price">${item.price}</p>
                </div>
              </div>
              <div className="cart-item-actions">
                <button
                  className="cart-button"
                  onClick={() => dispatch(addToCart(item))}
                >
                  +
                </button>
                <p>{item.quantity}</p>
                <button
                  className="cart-button"
                  onClick={() => {
                    const cartItem = cartItems.find(
                      (product) => product.id === item.id
                    );
                    if (cartItem.quantity === 1) {
                      handleRemoveFromCart(item);
                    } else {
                      dispatch(removeFromCart(item));
                    }
                  }}
                >
                  -
                </button>
              </div>
            </div>
          ))}
        </div>
        {cartItems.length > 0 ? (
          <div className="cart-summary">
            <h1 className="cart-total">Total: ${cartTotal}</h1>
            <button
              className="cart-button"
              onClick={() => {
                dispatch(clearCart());
                notifyCartCleared();
              }}
            >
              Clear cart
            </button>
          </div>
        ) : (
          <h1 className="cart-empty">Your cart is empty</h1>
        )}
      </div>
    )
  );
};

export default Cart;
