import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './css/auctions.css';

const Auctions = () => {
    const [auctions, setAuctions] = useState([]);
    const [highestBid, setHighestBid] = useState(null);
    
    useEffect(() => {
        // Fetch the auctions from the server
        const fetchAuctions = async () => {
        try {
            const response = await fetch('/api/auctions');
            const data = await response.json();
            setAuctions(data.auctions);
            setHighestBid(data.highestBid);
        } catch (error) {
            console.error('Error fetching auctions:', error);
        }
        };
    
        fetchAuctions();
    }, []);
    
    return (
        <div className='auctions'>
        <h1>Auctions</h1>
        {auctions.length === 0 ? (
            <p>No auctions found.</p>
        ) : (
            <ul>
            {auctions.map((auction) => (
                <li key={auction.id}>
                Auction ID: {auction.id} - Current Bid: {auction.currentBid}
                {highestBid === auction.currentBid && <span> - Highest bid!</span>}
                </li>
            ))}
            </ul>
        )}
        </div>
    );
    }

export default Auctions;