import dayjs from "dayjs";
import React, { useState } from "react";
import { useTimer } from "react-timer-hook";
import PropTypes from "prop-types";

const AuctionTimer = ({ date }) => {
  const [expired, setExpired] = useState(false);
  const expiryDate = dayjs(date).toDate();

   const { seconds, minutes, hours, days } = useTimer({
     expiryTimestamp: expiryDate,
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
  date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)])
    .isRequired,
};

export default AuctionTimer;
