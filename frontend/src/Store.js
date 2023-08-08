import { createContext, useReducer } from "react";

export const Store = createContext();

const initialState = {
  fullBox: false,
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,

  cart: {
    shippingAddress: localStorage.getItem("shippingAddress")
      ? JSON.parse(localStorage.getItem("shippingAddress"))
      : { location: {} },
    paymentMethod: localStorage.getItem("paymentMethod")
      ? localStorage.getItem("paymentMethod")
      : "",
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
  },
};
// Dans ce cas, lorsque l'action a pour type "CART_ADD_ITEM", un nouvel élément est ajouté au panier stocké dans
// state.cart.cartItems. Si l'article à ajouter est déjà présent dans le panier,sa quantité est mise à jour.
// Sinon, l'article est ajouté au panier.
function reducer(state, action) {
  switch (action.type) {
    case "CART_ADD_ITEM":
      // add to cart
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item) => item._id === newItem._id
      );
      const cartItems = existItem
        ? state.cart.cartItems.map(
            (item) => (item._id === existItem._id ? newItem : item)
            //  map() est utilisée pour remplacer l'élément existant dans le panier avec le nouvel élément,
          )
        : [...state.cart.cartItems, newItem];
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      // on a deux parametres le premier parametre cartItems is the key and 2éme to CONVERTIR cartItems to string
      // w le conserve dans le  key="cartItems"

      return { ...state, cart: { ...state.cart, cartItems } };

    case "CART_REMOVE_ITEM": {
      const cartItems = state.cart.cartItems.filter(
        (item) => item._id !== action.payload._id
      );
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      // ...state créer une copie
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case "CART_CLEAR":
      return { ...state, cart: { ...state.cart, cartItems: [] } };
    case "USER_SIGNIN":
      return { ...state, userInfo: action.payload };
    // userInfo update the user info based on the data that we get from backend
    case "USER_SIGNOUT":
      return {
        ...state,
        userInfo: null,
        cart: {
          cartItems: [],
          shippingAddress: {},
          paymentMethod: "",
        },
      };
    //nothing change in the state and cart just shippingAdress change
    case "SAVE_SHIPPING_ADDRESS": {
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: action.payload,
        },
      };
    }
    case "SAVE_PAYMENT_METHOD":
      return {
        ...state,
        cart: { ...state.cart, paymentMethod: action.payload },
      };

    default:
      return state;
  }
}

export function StoreProvider(props) {
  // useReducer, vous créez un état géré par un reducer dans votre contexte utilisateur. Le hook retourne l'état actuel (state) et une fonction (dispatch) qui vous permet de déclencher des actions pour mettre à jour cet état. Vous fournissez ensuite cet état et cette fonction aux composants enfants via le contexte utilisateur.
  // state=initialState(tableau cartItems)
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  // Le props.children de Store.Provider est une propriété qui contient les composants enfants que Store.Provider enveloppe et qui ont accès à l'état global de l'application (chkooun ynajim yhezha)
  // l'objet value. Cet objet contient une propriété cart (ili nhebou ykoun mochtarek)
  return <Store.Provider value={value}>{props.children} </Store.Provider>;
}
