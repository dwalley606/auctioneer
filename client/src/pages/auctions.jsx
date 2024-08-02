import React, { useEffect, useState } from 'react';

const Auctions = () => {
  const [userAuctions, setUserAuctions] = useState([]);
  const [startedAuctions, setStartedAuctions] = useState([]);

  useEffect(() => {
    // Fetch user auctions
 const fetchUserAuctions = async () => {
        try {
            const response = await fetch('/api/auctions/user');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching user auctions:', error);
        }
        };
    // Fetch started auctions
const fetchStartedAuctions = async () => {
        try {
            const response = await fetch('/api/auctions/started');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching started auctions:', error);
        }
        };

    // Set the state with fetched data
    setUserAuctions(fetchUserAuctions);
    setStartedAuctions(fetchStartedAuctions);
    // setStartedAuctions(startedAuctions);
  }, []);

  return (
    <div>
      <h1>User Auctions</h1>
      <ul>
        {userAuctions.map((auction) => (
          <li key={auction.id}>{auction.name}</li>
        ))}
      </ul>

      <h1>Started Auctions</h1>
      <ul>
        {startedAuctions.map((auction) => (
          <li key={auction.id}>{auction.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Auctions;
