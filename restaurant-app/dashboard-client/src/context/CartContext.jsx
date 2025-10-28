import React, { createContext, useContext, useReducer } from "react";

/**
 * Lightweight CartContext for dashboard-client.
 * It intentionally mirrors the user-client CartContext API so shared components/imports work.
 * This context is simple: stores cart items, customer, orderType, cookingInstructions, and provides actions.
 */

const CartContext = createContext();

const initialState = {
  items: [], // { menuItem, name, price, qty, imageUrl }
  cookingInstructions: "",
  orderType: "TAKEAWAY",
  customer: {}
};

function reducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find(i => String(i.menuItem) === String(action.payload.menuItem));
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            String(i.menuItem) === String(action.payload.menuItem)
              ? { ...i, qty: i.qty + (action.payload.qty || 1) }
              : i
          )
        };
      }
      return { ...state, items: [...state.items, { ...action.payload, qty: action.payload.qty || 1 }] };
    }

    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter(i => String(i.menuItem) !== String(action.payload)) };

    case "UPDATE_QTY":
      return {
        ...state,
        items: state.items.map(i =>
          String(i.menuItem) === String(action.payload.menuItem) ? { ...i, qty: action.payload.qty } : i
        )
      };

    case "SET_INSTRUCTIONS":
      return { ...state, cookingInstructions: action.payload };

    case "SET_ORDER_TYPE":
      return { ...state, orderType: action.payload };

    case "SET_CUSTOMER":
      return { ...state, customer: action.payload };

    case "CLEAR_CART":
      return { ...initialState };

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // actions
  const addItem = (item) => dispatch({ type: "ADD_ITEM", payload: item });
  const removeItem = (menuItemId) => dispatch({ type: "REMOVE_ITEM", payload: menuItemId });
  const updateQty = (menuItemId, qty) => dispatch({ type: "UPDATE_QTY", payload: { menuItem: menuItemId, qty } });
  const setInstructions = (text) => dispatch({ type: "SET_INSTRUCTIONS", payload: text });
  const setOrderType = (t) => dispatch({ type: "SET_ORDER_TYPE", payload: t });
  const setCustomer = (c) => dispatch({ type: "SET_CUSTOMER", payload: c });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  const subtotal = state.items.reduce((s, it) => s + (Number(it.price || 0) * Number(it.qty || 0)), 0);

  return (
    <CartContext.Provider value={{
      state,
      addItem,
      removeItem,
      updateQty,
      setInstructions,
      setOrderType,
      setCustomer,
      clearCart,
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
