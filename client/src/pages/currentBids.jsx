import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import './css/currentBids.css';

const CurrentBids = () => {
  const [bids, setBids] = useState([]);
  const [wonBidId, setWonBidId] = useState(null);

  useEffect(() => {
    // Fetch the user's bids from the server
    const fetchBids = async () => {
      try {
        const response = await fetch('/api/bids');
        const data = await response.json();
        setBids(data.bids);
        setWonBidId(data.wonBidId);
      } catch (error) {
        console.error('Error fetching bids:', error);
      }
    };

    fetchBids();
  }, []);

  return (
    <div className='current'>
      <h1>Current Bids</h1>
      {bids.length === 0 ? (
        <p>No bids found.</p>
      ) : (
        <ul>
          {bids.map((bid) => (
            <li key={bid.id}>
              Bid ID: {bid.id} - Amount: {bid.amount}
              {wonBidId === bid.id && <span> - You won this bid!</span>}
            </li>
          ))}
        </ul>
      )}
      <Link to="/currentBids">Go to Current Bids</Link>
    </div>
  );
};

export default CurrentBids;