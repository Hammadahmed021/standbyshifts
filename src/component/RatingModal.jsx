import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import Button from './Button';

const RatingModal = ({ isOpen, onClose, onSubmit, Rating }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState('');

  const handleSubmit = () => {
    onSubmit({ rating, feedback, RateeId: Rating.id }); // Include booking info in the submit
    onClose();
    setRating(0);
    setFeedback('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-8 shadow-lg w-11/12 sm:w-2/3 md:w-1/2 lg:w-1/3">
        <h2 className="text-2xl font-semibold mb-4 text-center capitalize">Rate {Rating?.name}</h2> {/* Display booking info */}
        <div className="flex justify-center mb-6">
          {[...Array(5)].map((_, index) => {
            const starValue = index + 1;
            return (
              <FaStar
                key={index}
                size={30}
                className={`cursor-pointer ${starValue <= (hover || rating) ? 'text-yellow-500' : 'text-gray-300'}`}
                onClick={() => setRating(starValue)}
                onMouseEnter={() => setHover(starValue)}
                onMouseLeave={() => setHover(0)}
              />
            );
          })}
        </div>
        <textarea
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="4"
          placeholder="Leave your feedback (optional)"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 focus:outline-none"
          >
            Cancel
          </button>
          <Button
            onClick={handleSubmit}
            className="px-4 py-2 bg-tn_primary text-white rounded-lg hover:bg-opacity-90 focus:outline-none"
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
