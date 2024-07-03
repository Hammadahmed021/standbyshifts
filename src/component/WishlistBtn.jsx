import React, { useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const WishlistButton = () => {
  const [inWishlist, setInWishlist] = useState(false);

  return (
    <button onClick={() => setInWishlist(!inWishlist)}>
      {inWishlist ? <FaHeart className="text-red-500" /> : <FaRegHeart className="text-black" />}
    </button>
  );
};

export default WishlistButton;
