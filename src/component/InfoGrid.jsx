import React from "react";

function InfoGrid({ items }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {items.map((item, index) => (
                <div key={index} className="hover:shadow-lg py-8 px-4 rounded-3xl text-center transition duration-500 ease-in-out">
                    <img
                        src={item.icon}
                        alt={`Icon ${index + 1}`}
                        className="w-12 h-12 mx-auto mb-4"
                    />
                    <h3 className="text-xl text-tn_primary font-semibold mb-2">{item.title}</h3>
                    {/* <p className="text-tn_text_grey text-base">{item.description}</p> */}
                </div>
            ))}
        </div>
    );
}

export default InfoGrid;
