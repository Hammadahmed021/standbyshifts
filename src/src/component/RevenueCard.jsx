import React from "react";

function RevenueCard({ items }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            {items.map((item, index) => (
                <div key={index} className="text-start mt-2">
                    <img
                        src={item.icon}
                        alt={`Icon ${index + 1}`}
                        className="w-10 h-10 mb-2"
                    />
                    <h3 className="text-lg text-white font-semibold mb-2">{item.title}</h3>
                    <p className="text-tn_text_grey text-base">{item.description}</p>
                </div>
            ))}
        </div>
    );
}

export default RevenueCard;
