import React, { useState, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const WishlistButton = ({ defaultInWishlist, onToggleWishlist }) => {
  const [inWishlist, setInWishlist] = useState(defaultInWishlist);

  useEffect(() => {
    setInWishlist(defaultInWishlist);
  }, [defaultInWishlist]);

  const handleClick = () => {
    const newStatus = !inWishlist;
    setInWishlist(newStatus);
    onToggleWishlist(); // Pass no argument since status is handled in CardCarousel
  };

  return (
    <button
      onClick={handleClick}
      className="focus:outline-none"
      aria-label={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
    >
      {inWishlist ? (
        <FaHeart className="text-red-500" />
      ) : (
        <FaRegHeart className="text-gray-500" />
      )}
    </button>
  );
};

export default WishlistButton;
