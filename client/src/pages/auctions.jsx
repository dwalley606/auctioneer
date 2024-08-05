import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './css/auctions.css';

const Auctions = () => {
    const [userAuctions, setUserAuctions] = useState([]);
    const [itemName, setItemName] = useState('');
    const [itemDescription, setItemDescription] = useState('');
    const [startingBid, setStartingBid] = useState(0);
    const [auctionTimeSlot, setAuctionTimeSlot] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false); // Add state variable for form visibility

    const handleFormSubmit = (event) => {
        event.preventDefault();
        // Handle form submission logic here
    };

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
    }, []);

    return (
        <div className='user-Auctions'>
          <h1>User Auctions</h1>
            <ul>
                {Array.isArray(userAuctions) && userAuctions.map((auction) => (
                    <li key={auction.id}>{auction.name}</li>
                ))}
            </ul>

            {!showCreateForm && ( // Add condition to show/hide form
                <button onClick={() => setShowCreateForm(true)}>Create Auction</button>
            )}

            {showCreateForm && ( // Add condition to show/hide form
                <div>
                    <h1>Create Auction</h1>
                    <form onSubmit={handleFormSubmit}>
                        <label htmlFor="itemName">Item Name:</label>
                        <input type="text" id="itemName" value={itemName} onChange={(e) => setItemName(e.target.value)} />

                        <label htmlFor="itemDescription">Item Description:</label>
                        <textarea id="itemDescription" value={itemDescription} onChange={(e) => setItemDescription(e.target.value)} />

                        <label htmlFor="startingBid">Starting Bid Amount:</label>
                        <input type="number" id="startingBid" value={startingBid} onChange={(e) => setStartingBid(e.target.value)} />

                        <label htmlFor="auctionTimeSlot">Auction Time Slot:</label>
                        <input type="text" id="auctionTimeSlot" value={auctionTimeSlot} onChange={(e) => setAuctionTimeSlot(e.target.value)} />

                        <button type="submit">Create Auction</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Auctions;