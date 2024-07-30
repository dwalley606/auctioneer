// import {
//     UPDATE_PRODUCTS,
//     // ADD_TO_CART,
//     // UPDATE_CART_QUANTITY,
//     // REMOVE_FROM_CART,
//     // ADD_MULTIPLE_TO_CART,
//     UPDATE_CATEGORIES,
//     UPDATE_CURRENT_CATEGORY,
//     // CLEAR_CART,
//     // TOGGLE_CART,
//   } from './actions';

//   // The reducer is a function that accepts the current state and an action. It returns a new state based on that action.
//   export const reducer = (state, action) => {
//     switch (action.type) {
//       // Returns a copy of state with an update products array. We use the action.products property and spread it's contents into the new array.
//       case UPDATE_PRODUCTS:
//         return {
//           ...state,
//           products: [...action.products],
//         };

//       case UPDATE_CATEGORIES:
//         return {
//           ...state,
//           categories: [...action.categories],
//         };

//       case UPDATE_CURRENT_CATEGORY:
//         return {
//           ...state,
//           currentCategory: action.currentCategory,
//         };

//       // Return the state as is in the event that the `action.type` passed to our reducer was not accounted for by the developers
//       // This saves us from a crash.
//       default:
//         return state;
//     }
//   };
