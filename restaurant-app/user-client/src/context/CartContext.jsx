import React, { createContext, useContext, useReducer } from "react";

const CartContext = createContext();

const initialState = {
  items: [], // { menuItem, name, price, qty }
  cookingInstructions: "",
  orderType: "TAKEAWAY", // or DINE_IN
  customer: {}
};

function reducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find(i => String(i.menuItem) === String(action.payload.menuItem));
      if (existing) {
        return {
          ...state,
          items: state.items.map(i => i.menuItem === existing.menuItem ? { ...i, qty: i.qty + action.payload.qty } : i)
        };
      }
      return { ...state, items: [...state.items, action.payload] };
    }
    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter(i => String(i.menuItem) !== String(action.payload)) };
    case "UPDATE_QTY":
      return { ...state, items: state.items.map(i => i.menuItem === action.payload.menuItem ? { ...i, qty: action.payload.qty } : i) };
    case "SET_INSTRUCTIONS":
      return { ...state, cookingInstructions: action.payload };
    case "SET_ORDER_TYPE":
      return { ...state, orderType: action.payload };
    case "SET_CUSTOMER":
      return { ...state, customer: action.payload };
    case "CLEAR_CART":
      return initialState;
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const addItem = (item) => dispatch({ type: "ADD_ITEM", payload: item });
  const removeItem = (menuItemId) => dispatch({ type: "REMOVE_ITEM", payload: menuItemId });
  const updateQty = (menuItemId, qty) => dispatch({ type: "UPDATE_QTY", payload: { menuItem: menuItemId, qty } });
  const setInstructions = (text) => dispatch({ type: "SET_INSTRUCTIONS", payload: text });
  const setOrderType = (t) => dispatch({ type: "SET_ORDER_TYPE", payload: t });
  const setCustomer = (c) => dispatch({ type: "SET_CUSTOMER", payload: c });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  const subtotal = state.items.reduce((s, it) => s + (it.price || 0) * (it.qty || 1), 0);

  return (
    <CartContext.Provider value={{
      state, addItem, removeItem, updateQty, setInstructions, setOrderType, setCustomer, clearCart,
      subtotal
    }}>
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  return useContext(CartContext);
}
