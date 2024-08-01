import React from 'react';

import React, { useEffect, useState } from 'react';

const CurrentBids = () => {
    const [userBids, setUserBids] = useState([]);

    useEffect(() => {
        const fetchUserBids = async () => {
            try {
                const response = await fetch('/api/user/bids'); // Not 100% sure that the fetch link will be correct
                const data = await response.json();
                setUserBids(data);
            } catch (error) {
                console.error('Error fetching user bids:', error);
            }
        };

        fetchUserBids();
    }, []);

    return (
        <div>
            <h1>Current Bids</h1>
            {userBids.map((bid) => (
                <div key={bid.id}>
                    <p>Item: {bid.itemName}</p>
                    <p>Amount: {bid.amount}</p>
                </div>
            ))}
        </div>
    );
};

export default CurrentBids;
