import React, { useEffect, useState } from 'react';

const Auctions = () => {
  const [auctions, setAuctions] = useState([]);

  useEffect(() => {
    // Fetch auctions data from the server
    const fetchAuctions = async () => {
      try {
        const response = await fetch('/api/user/auctions'); // Not 100% sure that the fetch link will be correct
        const data = await response.json();
        setAuctions(data);
      } catch (error) {
        console.error('Error fetching auctions:', error);
      }
    };

    fetchAuctions();
  }, []);

  return (
    <div>
      <h1>Auctions</h1>
      {auctions.map((auction) => (
        <div key={auction.id}>
          <h2>{auction.title}</h2>
          <p>{auction.description}</p>
          <p>Current Bid: ${auction.currentBid}</p>
        </div>
      ))}
    </div>
  );
};
export default Auctions;
