import React from "react";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Rating from "./Rating";
import axios from "axios";
import { useContext } from "react";
import { Store } from "../Store";

function Pack(props) {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === props.pack._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/packs/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert("Sorry Pack is out of stock");
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, quantity },
    });
  };
  return (
    <Card>
      <Link to={`/pack/${props.pack.slug}`}>
        <img
          src={props.pack.image}
          className="card-img-top"
          alt={props.pack.name}
        />
      </Link>
      <Card.Body>
        <Link to={`/pack/${props.pack.slug}`}>
          <Card.Title>{props.pack.name}</Card.Title>
        </Link>
        <Rating rating={props.pack.rating}>
          {" "}
          numReviews={props.pack.numReviews}
        </Rating>
        <Card.Text>${props.pack.price}</Card.Text>
        {props.pack.countInStock === 0 ? (
          <Button variant="light" disabled className="btn-danger">
            Out of stock
          </Button>
        ) : (
          <Button
            className="btn-outline-primary
                        "
            onClick={() => addToCartHandler(props.pack)}
          >
            Add to cart
          </Button>
        )}{" "}
      </Card.Body>
    </Card>
  );
}

export default Pack;
