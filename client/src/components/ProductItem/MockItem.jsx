import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/cart/cartSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  useGetProductDetails,
  useCreateBid,
  useGetAuctions,
} from "../../utils/actions";
import "./MockItem.css"; // Create and import CSS for styling

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [bidAmount, setBidAmount] = useState(0);
  const [highestBid, setHighestBid] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [auctionActive, setAuctionActive] = useState(false);
  const dispatch = useDispatch();

  const {
    data: productData,
    loading: productLoading,
    error: productError,
  } = useGetProductDetails(id);
  const { data: auctionsData, startPolling, stopPolling } = useGetAuctions();
  const [placeBid] = useCreateBid();

  useEffect(() => {
    async function fetchProduct() {
      console.log("Fetching product with id: ", id);
      const response = await fetch(`https://dummyjson.com/products/${id}`);
      const data = await response.json();
      console.log("Product data fetched: ", data);
      setProduct(data);
    }
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (auctionsData) {
      const auction = auctionsData.auctions.find((a) => a.product.id === id);
      if (auction) {
        console.log("Auction data fetched: ", auction);
        setHighestBid(auction.bids[0]?.amount || auction.startingPrice);
        setTimeLeft(
          Math.floor((new Date(auction.endTime).getTime() - Date.now()) / 1000)
        );
        setAuctionActive(auction.status === "active");
      }
    }
  }, [auctionsData, id]);

  useEffect(() => {
    console.log("Starting polling for auction updates");
    startPolling(1000); // Poll every 1 second for auction updates

    return () => {
      console.log("Stopping polling for auction updates");
      stopPolling();
    };
  }, [startPolling, stopPolling]);

  const notifyAddedToCart = (item) => {
    console.log("Adding to cart: ", item);
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

  const handleAddToCart = (product) => {
    console.log("Dispatching addToCart action for: ", product);
    dispatch(addToCart(product));
    notifyAddedToCart(product);
  };

  const startAuction = (startingPrice, duration) => {
    console.log(
      "Starting auction with price: ",
      startingPrice,
      " and duration: ",
      duration
    );
    setHighestBid(startingPrice);
    setTimeLeft(duration);
    setAuctionActive(true);
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setAuctionActive(false);
          // Auction ended logic here
          alert(`Auction ended! Winning bid: $${highestBid}`);
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const placeBidHandler = async () => {
    if (bidAmount > highestBid) {
      try {
        console.log("Placing bid with amount: ", bidAmount);
        await placeBid({ variables: { productId: id, amount: bidAmount } });
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
        console.error("Error placing bid: ", error);
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
      console.log("Bid amount is not higher than highest bid: ", highestBid);
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

  if (productLoading) return <div>Loading...</div>;
  if (productError) return <div>Error: {productError.message}</div>;

  return (
    <div className="product-detail-container">
      <ToastContainer />
      {product && (
        <div className="product-detail-card">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="product-detail-image"
          />
          <div className="product-detail-info">
            <h1 className="product-detail-title">{product.title}</h1>
            <p className="product-detail-description">{product.description}</p>
            <p className="product-detail-price">${product.price}</p>
            <button
              className="product-detail-button"
              onClick={() => handleAddToCart(product)}
            >
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
                  value={bidAmount} // Ensure controlled input
                  onChange={(e) =>
                    setBidAmount(parseFloat(e.target.value) || 0)
                  } // Ensure value is always defined
                />
                <input
                  type="number"
                  placeholder="Duration (seconds)"
                  value={timeLeft} // Ensure controlled input
                  onChange={(e) => setTimeLeft(parseInt(e.target.value) || 0)} // Ensure value is always defined
                />
                <button onClick={() => startAuction(bidAmount, timeLeft)}>
                  Start Auction
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
