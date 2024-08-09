import React, { useEffect } from "react";
import { Box, Card, CardMedia, CardContent, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAuctions,
  selectAuctions,
} from "../../../redux/auction/auctionSlice";
import AuctionTimer from "../ProductCard/AuctionTimer";

const DashAuctions = () => {
  const dispatch = useDispatch();
  const auctions = useSelector(selectAuctions);
  const loading = useSelector((state) => state.auction.loading);
  const error = useSelector((state) => state.auction.error);

  useEffect(() => {
    dispatch(fetchAuctions());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const currentAuctions = auctions.filter(
    (auction) => auction.status === "active"
  );
  const pastAuctions = auctions.filter(
    (auction) => auction.status !== "active"
  );

  return (
    <div>
      <h1>Dashboard Auctions</h1>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Current Auctions
        </Typography>
        {currentAuctions.length === 0 ? (
          <Typography variant="body1">No active auctions.</Typography>
        ) : (
          currentAuctions.map((auction) => (
            <Card key={auction.id} sx={{ mb: 2 }}>
              {auction.product.image && (
                <CardMedia
                  component="img"
                  height="140"
                  image={auction.product.image}
                  alt={auction.product.name}
                  onError={(e) => {
                    e.target.src = "/path/to/default-image.jpg";
                  }}
                />
              )}
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {auction.product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {auction.product.description}
                </Typography>
                <Typography variant="h6" color="text.primary">
                  Current Bid: $
                  {auction.highestBid ? auction.highestBid.toFixed(2) : "0.00"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Time Left: <AuctionTimer date={auction.endTime} />
                </Typography>
              </CardContent>
            </Card>
          ))
        )}
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Past Auctions
        </Typography>
        {pastAuctions.length === 0 ? (
          <Typography variant="body1">No past auctions.</Typography>
        ) : (
          pastAuctions.map((auction) => (
            <Card key={auction.id} sx={{ mb: 2 }}>
              {auction.product.image && (
                <CardMedia
                  component="img"
                  height="140"
                  image={auction.product.image}
                  alt={auction.product.name}
                  onError={(e) => {
                    e.target.src = "/path/to/default-image.jpg";
                  }}
                />
              )}
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {auction.product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {auction.product.description}
                </Typography>
                <Typography variant="h6" color="text.primary">
                  Winning Bid: $
                  {auction.highestBid ? auction.highestBid.toFixed(2) : "0.00"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Status: {auction.status === "completed" ? "Won" : "Lost"}
                </Typography>
              </CardContent>
            </Card>
          ))
        )}
      </Box>
    </div>
  );
};

export default DashAuctions;
