import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  CardActions,
  Modal,
  TextField,
} from "@mui/material";
import dayjs from "dayjs";
import AuctionTimer from "./AuctionTimer";
import { startAuction } from "../../../redux/auction/auctionSlice";
import { useCreateAuction, useGetProductDetails } from "../../../utils/actions";
import { selectAuctions } from "../../../redux/auction/auctionSlice";
import socket from "../../../utils/socket";

const ProductCard = ({ product, handleEdit, handleDelete }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [startingPrice, setStartingPrice] = useState("");
  const [duration, setDuration] = useState({ minutes: "", seconds: "" });
  const [createAuction] = useCreateAuction();
  const { product: updatedProduct, refetch } = useGetProductDetails(product.id);
  const auctions = useSelector(selectAuctions);
  const auction = auctions.find((a) => a.product.id === product.id);
  const [highestBid, setHighestBid] = useState(0);

  useEffect(() => {
    if (auction) {
      setHighestBid(auction.startingPrice);
    }
  }, [auction]);

  useEffect(() => {
    socket.on("bidChange", (data) => {
      if (
        data.fullDocument &&
        data.fullDocument.product.toString() === product.id
      ) {
        console.log("Received bidChange event for product:", data);
        refetch();
      }
    });

    return () => {
      socket.off("bidChange");
    };
  }, [product.id, refetch]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const startAuctionHandler = async () => {
    const totalDurationInSeconds =
      parseInt(duration.minutes, 10) * 60 + parseInt(duration.seconds, 10);
    try {
      const startTime = new Date(); // Directly use JavaScript Date object
      const endTime = new Date(
        startTime.getTime() + totalDurationInSeconds * 1000
      ); // Calculate end time

      console.log("Start time (Date object):", startTime);
      console.log("End time (Date object):", endTime);

      const { data, errors } = await createAuction({
        variables: {
          productId: product.id,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          startingPrice: parseFloat(startingPrice),
          status: "active",
        },
      });

      if (errors) {
        console.error("Errors in createAuction response:", errors);
        return;
      }

      if (data && data.createAuction) {
        const auction = {
          ...data.createAuction,
          startTime: new Date(data.createAuction.startTime),
          endTime: new Date(data.createAuction.endTime),
        };
        console.log("Auction started:", auction);
        dispatch(startAuction(auction));
        handleClose();
        await refetch();
      } else {
        console.error("Unexpected response from createAuction:", data);
      }
    } catch (error) {
      console.error("Error starting auction:", error);
    }
  };

  return (
    <Card sx={{ maxWidth: 345, margin: 2 }}>
      {product.image && (
        <CardMedia
          component="img"
          height="140"
          image={product.image}
          alt={product.name}
          onError={(e) => {
            e.target.src = "/path/to/default-image.jpg"; // Fallback image
          }}
        />
      )}
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {product.description}
        </Typography>
        <Typography variant="h6" color="text.primary">
          ${product.price.toFixed(2)}
        </Typography>
        {auction && (
          <Box>
            <Typography variant="body2" color="text.secondary">
              Time Left: <AuctionTimer date={auction.endTime} />
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Highest Bid: ${highestBid.toFixed(2)}
            </Typography>
          </Box>
        )}
      </CardContent>
      <CardActions>
        <Button
          size="small"
          variant="contained"
          color="primary"
          onClick={() => handleEdit(product)}
        >
          Edit
        </Button>
        <Button
          size="small"
          variant="contained"
          color="secondary"
          onClick={() => handleDelete(product.id)}
        >
          Delete
        </Button>
        {!auction && (
          <Button
            size="small"
            variant="contained"
            color="success"
            onClick={handleOpen}
          >
            Start Auction
          </Button>
        )}
        <Modal open={open} onClose={handleClose}>
          <Box
            sx={{
              p: 4,
              bgcolor: "background.paper",
              boxShadow: 24,
              maxWidth: 400,
              mx: "auto",
              mt: 8,
            }}
          >
            <Typography variant="h6" component="h2" gutterBottom>
              Start Auction
            </Typography>
            <TextField
              label="Starting Price"
              fullWidth
              value={startingPrice}
              onChange={(e) => setStartingPrice(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Duration (minutes)"
              fullWidth
              value={duration.minutes}
              onChange={(e) =>
                setDuration({ ...duration, minutes: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              label="Duration (seconds)"
              fullWidth
              value={duration.seconds}
              onChange={(e) =>
                setDuration({ ...duration, seconds: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={startAuctionHandler}
            >
              Confirm
            </Button>
          </Box>
        </Modal>
      </CardActions>
    </Card>
  );
};

ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default ProductCard;
