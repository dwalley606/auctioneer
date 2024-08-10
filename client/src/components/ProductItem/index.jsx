import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addToCart, selectCartItems } from "../../redux/cart/cartSlice";
import { placeBid, selectAuctions } from "../../redux/auction/auctionSlice";
import { pluralize } from "../../utils/helpers";
import { useGetProductDetails, useCreateFeedback } from "../../utils/actions";
import { getAuthHeaders } from "../../utils/auth";
import socket from "../../utils/socket";
import "./ProductItem.css";
import { useMutation } from "@apollo/client";
import { CREATE_FEEDBACK } from "../../utils/mutations";

const ProductItem = () => {
  const { id } = useParams();
  const { product, loading, error, refetch } = useGetProductDetails(id);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
const [createFeedback] = useMutation(CREATE_FEEDBACK);

  const dispatch = useDispatch();
  const cart = useSelector(selectCartItems);
  const auctions = useSelector(selectAuctions);
  const [bidAmount, setBidAmount] = useState("");
  const [highestBid, setHighestBid] = useState(0);
  const [highestBidUser, setHighestBidUser] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [auctionActive, setAuctionActive] = useState(false);

  useEffect(() => {
    console.log("Product from useGetProductDetails:", product); // Log to ensure data is received
    if (product && product.id === id) {
      setCurrentProduct(product);
      const auction = auctions.find((a) => a.product.id === product.id);
      if (auction && auction.status === "active") {
        setHighestBid(auction.highestBid || auction.startingPrice);
        setHighestBidUser(auction.highestBidUser || null);
        const endTime = new Date(auction.endTime);
        setTimeLeft(Math.floor((endTime.getTime() - Date.now()) / 1000));
        setAuctionActive(true);
        console.log("Auction is active with time left:", timeLeft, "seconds");
      } else {
        setAuctionActive(false);
      }
    }
  }, [product, auctions, id]);

  useEffect(() => {
    if (timeLeft > 0 && auctionActive) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft <= 0 && auctionActive) {
      setAuctionActive(false);
      console.log("Auction has ended.");
      const auction = auctions.find((a) => a.product.id === id);
      if (auction && auction.bids && auction.bids.length > 0) {
        const highestBid = auction.bids.reduce((max, bid) => {
          return bid.amount > max.amount ? bid : max;
        }, auction.bids[0]);
        setHighestBidUser(highestBid.user);
        console.log(
          `Auction ended. User ${highestBid.user.username} has the highest bid of $${highestBid.amount}.`
        );
        toast.success(
          `Auction ended. User ${highestBid.user.username} won with a bid of $${highestBid.amount}.`,
          {
            position: "top-center",
            autoClose: 5000,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
          }
        );
      } else {
        console.warn("Auction ended, but no bids were placed.");
        toast.info("Auction ended with no bids.", {
          position: "top-center",
          autoClose: 5000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
      }
    }
  }, [timeLeft, auctionActive, auctions, id]);

  useEffect(() => {
    const handleBidChange = async (change) => {
      console.log("Bid change detected:", change);
      if (change.fullDocument?.product.id === id) {
        try {
          console.log("Refetching product data due to bid change...");
          const { data } = await refetch();
          setCurrentProduct(data.product);
          console.log("Refetched product data:", data.product);
        } catch (err) {
          console.error("Error during refetch:", err);
        }
      }
    };

    socket.on("bidChange", handleBidChange);

    return () => {
      socket.off("bidChange", handleBidChange);
    };
  }, [id, refetch]);

  const addToCartHandler = () => {
    const itemInCart = cart.find((cartItem) => cartItem.id === id);
    if (itemInCart) {
      dispatch(
        addToCart({ ...currentProduct, quantity: itemInCart.quantity + 1 })
      );
    } else {
      dispatch(addToCart({ ...currentProduct, quantity: 1 }));
    }
    notifyAddedToCart(currentProduct);
  };

  const notifyAddedToCart = (item) => {
    toast.success(`${item.name} added to cart!`, {
      position: "top-center",
      autoClose: 2000,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });
  };

  const placeBidHandler = async () => {
    console.log("Attempting to place a bid...");
    const headers = getAuthHeaders();

    if (!headers.Authorization) {
      console.log("No auth token found, redirecting to login...");
      window.location.href = "/login";
      return;
    }

    const numericBidAmount = parseFloat(bidAmount);
    if (isNaN(numericBidAmount) || numericBidAmount <= highestBid) {
      console.warn(
        `Bid of $${numericBidAmount} is invalid or not higher than current highest bid of $${highestBid}`
      );
      toast.error(`Bid must be a valid number and higher than $${highestBid}`, {
        position: "top-center",
        autoClose: 2000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      return;
    }

    try {
      console.log(`Placing bid of $${numericBidAmount} for product ID: ${id}`);
      const result = await placeBid({
        variables: { productId: id, amount: numericBidAmount },
        context: {
          headers: headers,
        },
      });

      const newHighestBidUser = result.data.placeBid.user;
      setHighestBid(numericBidAmount);
      setHighestBidUser(newHighestBidUser);

      toast.success(`New highest bid: $${numericBidAmount}`, {
        position: "top-center",
        autoClose: 2000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });

      dispatch(placeBid({ productId: id, bidAmount: numericBidAmount }));
      console.log(
        `Bid of $${numericBidAmount} placed successfully. Highest bid is now $${numericBidAmount} by user ${newHighestBidUser.username}.`
      );
    } catch (error) {
      console.error("Error placing bid:", error);
      toast.error(`Error placing bid: ${error.message}`, {
        position: "top-center",
        autoClose: 2000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    }
  };

  const handleBidChange = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setBidAmount(value);
    } else {
      setBidAmount("");
    }
  };

  const submitFeedbackHandler = async () => {
  if (rating < 1 || rating > 5) {
    toast.error("Rating must be between 1 and 5", {
      position: "top-center",
      autoClose: 2000,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });
    return;
  }

  try {
    console.log(`Submitting feedback for product ID: ${currentProduct.id}`);
    console.log(`Rating: ${rating}, Comment: ${comment}`);

    const { data } = await createFeedback({
      variables: {
        productId: currentProduct.id,
        rating: parseInt(rating),
        comment,
      },
      context: {
        headers: getAuthHeaders(),
      },
    });

    if (data &&eedback) {
      console.log("Feedback submitted:", data.createFeedback);
      setFeedbackSubmitted(true);

      toast.success("Feedback submitted successfully!", {
        position: "top-center",
        autoClose: 2000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    } else {
      throw new Error("No data returned from createFeedback mutation");
    }
  } catch (error) {
    console.error("Error submitting feedback:", error);
    toast.error(`Error submitting feedback: ${error.message}`, {
      position: "top-center",
      autoClose: 2000,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });
  }
};



  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  console.log("Current Product:", currentProduct);

  if (!currentProduct || !currentProduct.id)
    return (
      <div className="product-not-found">
        <h2>Product Not Found</h2>
        <p>Sorry, we couldn't find the product you're looking for.</p>
        <Link to="/products">Back to Products</Link>
      </div>
    );

  return (
    <div className="product-detail-container">
      <ToastContainer />
      <div className="product-detail-card">
        <Link to={`/products/${id}`}>
          <img
            src={currentProduct.image}
            alt={currentProduct.name}
            className="product-detail-image"
          />
        </Link>
        <div className="product-detail-info">
          <h1 className="product-detail-title">{currentProduct.name}</h1>
          <p className="product-detail-description">
            {currentProduct.description}
          </p>
          <p className="product-detail-price">${currentProduct.price}</p>
          <div>
            {currentProduct.quantity}{" "}
            {pluralize("item", currentProduct.quantity)} in stock
          </div>
          <button className="product-detail-button" onClick={addToCartHandler}>
            Add to cart
          </button>
          {auctionActive ? (
            <div>
              <h2>Current Highest Bid: ${highestBid}</h2>
              <h2>
                Time Left: {Math.floor(timeLeft / 60)}:{timeLeft % 60}
              </h2>
              <h3>
                Highest Bidder:{" "}
                {highestBidUser ? highestBidUser.username : "None"}
              </h3>
              <input
                type="number"
                value={bidAmount}
                onChange={handleBidChange}
              />
              <button onClick={placeBidHandler}>Place Bid</button>
            </div>
          ) : (
            <div>
              <h2>No active auction for this product</h2>
            </div>
          )}
        </div>
      </div>

      {/* Feedback Section */}
      <div className="feedback-section">
        <h2>Leave Feedback</h2>
        {feedbackSubmitted ? (
          <p>Thank you for your feedback!</p>
        ) : (
          <>
            <div className="rating">
              <label htmlFor="rating">Rating (1-5):</label>
              <input
                type="number"
                id="rating"
                value={rating}
                onChange={(e) => setRating(parseInt(e.target.value))}
                min="1"
                max="5"
              />
            </div>
            <div className="comment">
              <label htmlFor="comment">Comment:</label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
            <button onClick={submitFeedbackHandler}>Submit Feedback</button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductItem;
