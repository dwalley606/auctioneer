import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "../../../redux/products/productsSlice";

const DashProducts = () => {
  const dispatch = useDispatch();
  const { items: products, loading: productsLoading } = useSelector(
    (state) => state.products
  );
  const { currentUser, loading: userLoading } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (productsLoading || userLoading) {
    return <div>Loading...</div>;
  }

  if (!products || !currentUser) {
    return <div>No products available</div>;
  }

  const userProducts = products.filter(
    (product) => product.seller && product.seller.id === currentUser.id
  );

  if (userProducts.length === 0) {
    return <div>No products available</div>;
  }

  return (
    <div>
      <h1>My Products</h1>
      <ul>
        {userProducts.map((product) => (
          <li key={product.id}>
            {product.name} - ${product.price.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DashProducts;
