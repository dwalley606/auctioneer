import dayjs from "dayjs";
import React, { useState } from "react";
import { useTimer } from "react-timer-hook";
import PropTypes from "prop-types";

const AuctionTimer = ({ date }) => {
  const [expired, setExpired] = useState(false);
  const { seconds, minutes, hours, days } = useTimer({
    expiryTimestamp: dayjs(date).toDate(),
    onExpire: () => setExpired(true),
  });

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
  date: PropTypes.string.isRequired,
};

export default AuctionTimer;
