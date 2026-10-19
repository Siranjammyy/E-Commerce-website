import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_UPDATE_ITEM_QTY,
  CART_CLEAR_ITEMS,
  CART_SAVE_SHIPPING_ADDRESS,
  CART_SAVE_PAYMENT_METHOD,
} from '../constants/cartConstants';

const initialState = {
  cartItems: [],
  shippingAddress: {},
  paymentMethod: 'Demo Payment',
};

export const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case CART_ADD_ITEM: {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x.product === item.product);

      if (existItem) {
        return {
          ...state,
          cartItems: state.cartItems.map((x) =>
            x.product === existItem.product ? item : x
          ),
        };
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, item],
        };
      }
    }

    case CART_UPDATE_ITEM_QTY: {
      const { id, qty } = action.payload;
      return {
        ...state,
        cartItems: state.cartItems.map((x) =>
          x.product === id ? { ...x, qty } : x
        ),
      };
    }

    case CART_REMOVE_ITEM: {
      return {
        ...state,
        cartItems: state.cartItems.filter((x) => x.product !== action.payload),
      };
    }

    case CART_SAVE_SHIPPING_ADDRESS: {
      return {
        ...state,
        shippingAddress: action.payload,
      };
    }

    case CART_SAVE_PAYMENT_METHOD: {
      return {
        ...state,
        paymentMethod: action.payload,
      };
    }

    case CART_CLEAR_ITEMS: {
      return {
        ...state,
        cartItems: [],
      };
    }

    default:
      return state;
  }
};
