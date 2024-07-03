import React, { useState } from 'react';

const LoadMore = ({ onLoadMore, hasMore, className }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    // Simulate loading delay
    setTimeout(() => {
      onLoadMore();
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className={`flex justify-center my-5 ${className}`}>
      {hasMore ? (
        <button
          className={`bg-tn_pink text-white px-5 py-2 rounded-lg hover:bg-tn_light_grey hover:text-tn_dark ${isLoading ? 'opacity-20 cursor-not-allowed' : ''}`}
          onClick={handleClick}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Load More'}
        </button>
      ) : (
        null
        // <p>No more items to show</p>
      )}
    </div>
  );
};

export default LoadMore;
