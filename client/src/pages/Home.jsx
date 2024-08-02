// client/src/pages/Home.jsx

import Banner from "../components/Banner/Banner";
import MockList from "../components/ProductList/MockList";

const Home = () => {
  return (
    <div>
      {/* <h1>Welcome to Auctioneer</h1>
      <p>
        The place to find whatever you may need! From furniture, clothing,
        tools, gadgets, and more, Auctioneer is where you can find it!
      </p> */}
      <Banner />
      <MockList />
    </div>
  );
};

export default Home;
