import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addToCart, selectCartItems } from "../../redux/cart/cartSlice";
import { placeBid, selectAuctions } from "../../redux/auction/auctionSlice";
import { pluralize } from "../../utils/helpers";
import {
  useGetProductDetails,
  usePlaceBid,
  useGetAuctions,
} from "../../utils/actions";
import getAuthHeaders from "../../utils/auth";
import socket from "../../utils/socket";
import "./ProductItem.css";

const ProductItem = () => {
  const { id } = useParams();
  const { product, loading, error, refetch } = useGetProductDetails(id);
  const [currentProduct, setCurrentProduct] = useState(null);
  const dispatch = useDispatch();
  const cart = useSelector(selectCartItems);
  const auctions = useSelector(selectAuctions);
  const [bidAmount, setBidAmount] = useState(0);
  const [highestBid, setHighestBid] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [auctionActive, setAuctionActive] = useState(false);
  const { data: auctionsData, startPolling, stopPolling } = useGetAuctions();
  const [placeBid] = usePlaceBid();

  useEffect(() => {
    if (product) {
      setCurrentProduct(product);
    }
  }, [product]);

  useEffect(() => {
    if (auctionsData) {
      const auction = auctionsData.auctions.find(
        (a) => a.product && a.product.id === id
      );
      if (auction) {
        setHighestBid(auction.bids[0]?.amount || auction.startingPrice);
        setTimeLeft(
          Math.floor((new Date(auction.endTime).getTime() - Date.now()) / 1000)
        );
        setAuctionActive(auction.status === "active");
      }
    }
  }, [auctionsData, id]);

  useEffect(() => {
    if (timeLeft > 0 && auctionActive) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft <= 0 && auctionActive) {
      setAuctionActive(false);
      const auction = auctionsData.auctions.find((a) => a.product.id === id);
      if (auction) {
        const highestBid = auction.bids.reduce(
          (max, bid) => (bid.amount > max.amount ? bid : max),
          { amount: 0 }
        );
        toast.success(
          `Auction ended. Highest bid: $${highestBid.amount} by ${
            highestBid.user?.username || "unknown user"
          }`,
          {
            position: "top-center",
            autoClose: 2000,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
          }
        );
      }
    }
  }, [timeLeft, auctionActive, auctionsData, id]);

  useEffect(() => {
    const handleBidChange = async (change) => {
      if (change.documentKey._id.toString() === id) {
        try {
          const { data } = await refetch();
          setCurrentProduct(data.product);
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
    const token = await getAuthHeaders();
    if (!token) {
      window.location.href = "/login";
      return;
    }
    if (bidAmount > highestBid) {
      try {
        const result = await placeBid({
          variables: { productId: id, amount: bidAmount },
        });
        setHighestBid(bidAmount);
        toast.success(`New highest bid: $${bidAmount}`, {
          position: "top-center",
          autoClose: 2000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
        dispatch(placeBid({ productId: id, bidAmount }));
      } catch (error) {
        toast.error(`Error placing bid: ${error.message}`, {
          position: "top-center",
          autoClose: 2000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
      }
    } else {
      toast.error(`Bid must be higher than $${highestBid}`, {
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
  if (!currentProduct)
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
          {auctionActive && (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
