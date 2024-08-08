import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  HiAnnotation,
  HiArrowNarrowUp,
  HiDocumentText,
  HiOutlineUserGroup,
} from "react-icons/hi";
import { Button, Table } from "flowbite-react";
import { Link } from "react-router-dom";
import { getAuthHeaders } from "../../../utils/auth";

const DashComponent = () => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [auctions, setAuctions] = useState([]);
  const [bids, setBids] = useState([]);

  return (
    <div>
      <h1>Dashboard Component</h1>
      {/* Add more content here */}
    </div>
  );
};

export default DashComponent;
