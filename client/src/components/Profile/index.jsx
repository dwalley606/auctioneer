import React from 'react';
import CurrentBids from '../pages/currentBids';
import Auctions from '../pages/auctions';
import OrderHistory from '../pages/orderHistory';

const Profile = () => {
    return (
     <div>
         <div> 
            {/* Current Bids */}
            <h2>Current Bids</h2>
            <CurrentBids />
        </div>
        <div>
            {/* Auctions */}
            <h2>Auctions</h2>
            <Auctions />
        </div>
        <div>
            {/* Order History */}
            <h2>Order History</h2>
            <OrderHistory />
        </div>
    </div>

    );
}

export default Profile;