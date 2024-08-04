import {
  UPDATE_PRODUCTS,
  ADD_TO_CART,
  ADD_MULTIPLE_TO_CART,
  REMOVE_FROM_CART,
  UPDATE_CART_QUANTITY,
  CLEAR_CART,
  TOGGLE_CART,
  UPDATE_CATEGORIES,
  UPDATE_CURRENT_CATEGORY,
} from "./actions";

export const reducer = (state, action) => {
  console.log("Reducer action:", action);
  switch (action.type) {
    case UPDATE_PRODUCTS:
      console.log("Updating products:", action.products);
      return {
        ...state,
        products: [...action.products],
      };

    case ADD_TO_CART:
      console.log("Adding to cart:", action.product);
      return {
        ...state,
        cartOpen: true,
        cart: [...state.cart, action.product],
      };

    case ADD_MULTIPLE_TO_CART:
      console.log("Adding multiple to cart:", action.products);
      return {
        ...state,
        cart: [...state.cart, ...action.products],
      };

    case UPDATE_CART_QUANTITY:
      console.log("Updating cart quantity:", action);
      return {
        ...state,
        cartOpen: true,
        cart: state.cart.map((product) => {
          if (action._id === product._id) {
            product.purchaseQuantity = action.purchaseQuantity;
          }
          return product;
        }),
      };

    case REMOVE_FROM_CART:
      console.log("Removing from cart:", action._id);
      let newState = state.cart.filter((product) => {
        return product._id !== action._id;
      });

      return {
        ...state,
        cartOpen: newState.length > 0,
        cart: newState,
      };

    case CLEAR_CART:
      console.log("Clearing cart");
      return {
        ...state,
        cartOpen: false,
        cart: [],
      };

    case TOGGLE_CART:
      console.log("Toggling cart");
      return {
        ...state,
        cartOpen: !state.cartOpen,
      };

    case UPDATE_CATEGORIES:
      console.log("Updating categories:", action.categories);
      return {
        ...state,
        categories: [...action.categories],
      };

    case UPDATE_CURRENT_CATEGORY:
      console.log("Updating current category:", action.currentCategory);
      return {
        ...state,
        currentCategory: action.currentCategory,
      };

    default:
      console.log("Unknown action type:", action.type);
      return state;
  }
};
