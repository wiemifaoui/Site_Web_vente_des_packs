import React from "react";

function Rating(props) {
  const { rating, numReviews, caption } = props;

  return (
    <div className="rating">
      <span>
        <i
          className={
            props.rating >= 1
              ? "fas fa-star"
              : props.rating >= 0.5
              ? "fas fa-star-half-alt"
              : "far fa-star"
          }
        />
      </span>
      <span>
        <i
          className={
            props.rating >= 2
              ? "fas fa-star"
              : props.rating >= 1.5
              ? "fas fa-star-half-alt"
              : "far fa-star"
          }
        />
      </span>
      <span>
        <i
          className={
            props.rating >= 3
              ? "fas fa-star"
              : props.rating >= 2.5
              ? "fas fa-star-half-alt"
              : "far fa-star"
          }
        />
      </span>
      <span>
        <i
          className={
            props.rating >= 4
              ? "fas fa-star"
              : props.rating >= 3.5
              ? "fas fa-star-half-alt"
              : "far fa-star"
          }
        />
      </span>
      <span>
        <i
          className={
            props.rating >= 5
              ? "fas fa-star"
              : props.rating >= 4.5
              ? "fas fa-star-half-alt"
              : "far fa-star"
          }
        />
      </span>
      {caption ? (
        <span>{caption}</span>
      ) : (
        <span>{" " + numReviews + " reviews"}</span>
      )}{" "}
    </div>
  );
}

export default Rating;
//sss
