import dayjs from "dayjs";
import React, { useState, useEffect } from "react";
import { useTimer } from "react-timer-hook";
import PropTypes from "prop-types";

const AuctionTimer = ({ date }) => {
  const [expired, setExpired] = useState(false);
  const expiryDate = new Date(date);

  console.log("Auction end time:", expiryDate);

  const { seconds, minutes, hours, days } = useTimer({
    expiryTimestamp: expiryDate,
    onExpire: () => {
      console.log("Auction has expired.");
      setExpired(true);
    },
  });

  useEffect(() => {
    if (expired) {
      console.log(
        "Auction expired on:",
        dayjs(date).format("DD MMM YYYY HH:mm:ss")
      );
    }
  }, [expired, date]);

  if (expired) {
    return `Expired on ${dayjs(date).format("DD MMM YYYY HH:mm:ss")}`;
  }

  return (
    <span>
      {days > 0 && `${days} days `}
      {hours > 0 && `${hours} hours `}
      {minutes} minutes {days === 0 && `${seconds} seconds`} (
      <strong>
        <small>{dayjs(date).format("DD MMM YYYY HH:mm:ss")}</small>
      </strong>
      )
    </span>
  );
};

AuctionTimer.propTypes = {
  date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)])
    .isRequired,
};

export default AuctionTimer;
