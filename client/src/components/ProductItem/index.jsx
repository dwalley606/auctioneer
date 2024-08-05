import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addToCart, selectCartItems } from "../../redux/cart/cartSlice";
import { pluralize } from "../../utils/helpers";
import {
  useGetProductDetails,
  usePlaceBid,
  useGetAuctions,
} from "../../utils/actions";
import "./ProductItem.css";

const ProductItem = () => {
  const { id } = useParams();
  console.log("Product ID:", id);

  const { product, loading, error, refetch } = useGetProductDetails(id);

  console.log("Product data:", product);

  const dispatch = useDispatch();
  const cart = useSelector(selectCartItems);
  const [bidAmount, setBidAmount] = useState(0);
  const [highestBid, setHighestBid] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [auctionActive, setAuctionActive] = useState(false);

  const { data: auctionsData, startPolling, stopPolling } = useGetAuctions();
  const [placeBid] = usePlaceBid();

  useEffect(() => {
    console.log("Starting auction polling");
    startPolling(1000);

    return () => {
      console.log("Stopping auction polling");
      stopPolling();
    };
  }, [startPolling, stopPolling]);

  useEffect(() => {
    if (auctionsData) {
      console.log("Auctions data:", auctionsData);
      const auction = auctionsData.auctions.find(
        (a) => a.product && a.product.id === id
      );
      if (auction) {
        console.log("Found auction for this product:", auction);
        setHighestBid(auction.bids[0]?.amount || auction.startingPrice);
        setTimeLeft(
          Math.floor((new Date(auction.endTime).getTime() - Date.now()) / 1000)
        );
        setAuctionActive(auction.status === "active");
      } else {
        console.log("No auction found for this product");
      }
    }
  }, [auctionsData, id]);

  const addToCartHandler = () => {
    console.log("Adding to cart:", product);
    const itemInCart = cart.find((cartItem) => cartItem.id === id);
    if (itemInCart) {
      dispatch(addToCart({ ...product, quantity: itemInCart.quantity + 1 }));
    } else {
      dispatch(addToCart({ ...product, quantity: 1 }));
    }
    notifyAddedToCart(product);
  };

  const notifyAddedToCart = (item) => {
    toast.success(`${item.title} added to cart!`, {
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

  const placeBidHandler = async () => {
    console.log("Placing bid:", bidAmount);
    const token = await getAuthHeaders();

    if (!token) {
      console.log("No auth token, redirecting to login");
      window.location.href = "/login";
      return;
    }

    if (bidAmount > highestBid) {
      try {
        const result = await placeBid({
          variables: { productId: id, amount: bidAmount },
        });
        console.log("Bid placed successfully:", result);
        setHighestBid(bidAmount);
        toast.success(`New highest bid: $${bidAmount}`, {
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
      } catch (error) {
        console.error("Error placing bid:", error);
        toast.error(`Error placing bid: ${error.message}`, {
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
      }
    } else {
      console.log("Bid too low");
      toast.error(`Bid must be higher than $${highestBid}`, {
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
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) {
    console.error("Error fetching product:", error);
    return <div>Error: {error.message}</div>;
  }

  if (!product) {
    console.log("Product not found");
    return (
      <div className="product-not-found">
        <h2>Product Not Found</h2>
        <p>Sorry, we couldn't find the product you're looking for.</p>
        <Link to="/products">Back to Products</Link>
      </div>
    );
  }

  console.log("Rendering product:", product);

  return (
    <div className="product-detail-container">
      <ToastContainer />
      <div className="product-detail-card">
        <Link to={`/products/${id}`}>
          <img
            src={product.image}
            alt={product.title}
            className="product-detail-image"
          />
        </Link>
        <div className="product-detail-info">
          <h1 className="product-detail-title">{product.title}</h1>
          <p className="product-detail-description">{product.description}</p>
          <p className="product-detail-price">${product.price}</p>
          <div>
            <div>
              {product.quantity} {pluralize("item", product.quantity)} in stock
            </div>
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
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(parseFloat(e.target.value))}
              />
              <button onClick={placeBidHandler}>Place Bid</button>
            </div>
          ) : (
            <div>
              <h2>Start an Auction</h2>
              <input
                type="number"
                placeholder="Starting Price"
                value={bidAmount}
                onChange={(e) => setBidAmount(parseFloat(e.target.value) || 0)}
              />
              <input
                type="number"
                placeholder="Duration (seconds)"
                value={timeLeft}
                onChange={(e) => setTimeLeft(parseInt(e.target.value) || 0)}
              />
              <button onClick={() => startAuction(bidAmount, timeLeft)}>
                Start Auction
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
