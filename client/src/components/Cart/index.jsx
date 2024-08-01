import { useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useLazyQuery } from "@apollo/client";
import { QUERY_CHECKOUT } from "../../utils/queries";
import { idbPromise } from "../../utils/helpers";
import ProductItem from "../ProductItem";
import Auth from "../../utils/auth";
import { useStoreContext } from "../../utils/GlobalState";
import { TOGGLE_CART, ADD_MULTIPLE_TO_CART } from "../../utils/actions";
import "./Cart.css";

const stripePromise = loadStripe("pk_test_TYooMQauvdEDq54NiTphI7jx");

const Cart = () => {
  const [state, dispatch] = useStoreContext();
  const [getCheckout, { data }] = useLazyQuery(QUERY_CHECKOUT);

  // Redirect to Stripe Checkout when data is available
  useEffect(() => {
    if (data) {
      stripePromise.then((stripe) => {
        stripe.redirectToCheckout({ sessionId: data.checkout.session });
      });
    }
  }, [data]);

  // Load cart items from IndexedDB if cart is empty
  useEffect(() => {
    const loadCart = async () => {
      const cartItems = await idbPromise("cart", "get");
      dispatch({ type: ADD_MULTIPLE_TO_CART, products: cartItems });
    };

    if (!state.cart.length) {
      loadCart();
    }
  }, [state.cart.length, dispatch]);

  // Calculate total price of items in the cart
  const calculateTotal = () => {
    return state.cart
      .reduce((total, item) => total + item.price * item.purchaseQuantity, 0)
      .toFixed(2);
  };

  // Handle checkout process
  const handleCheckout = () => {
    getCheckout({ variables: { products: state.cart } });
  };

  if (!state.cartOpen) return null;

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2>Shopping Cart</h2>
        <button
          className="close-button"
          onClick={() => dispatch({ type: TOGGLE_CART })}
        >
          Close
        </button>
      </div>
      {state.cart.length ? (
        <div>
          {state.cart.map((item) => (
            <ProductItem key={item._id} item={item} />
          ))}
          <div className="cart-footer">
            <strong>Total: ${calculateTotal()}</strong>
            {Auth.loggedIn() ? (
              <button className="checkout-button" onClick={handleCheckout}>
                Checkout
              </button>
            ) : (
              <span>(log in to check out)</span>
            )}
          </div>
        </div>
      ) : (
        <h3>
          <span role="img" aria-label="shocked">
            😱
          </span>{" "}
          You haven't added anything to your cart yet!
        </h3>
      )}
    </div>
  );
};

export default Cart;
