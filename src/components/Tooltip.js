"use client"

import React from 'react';

const Tooltip = ({ text, children }) => {
    return (
        <>
            <div className="group relative inline-block">
                <span className="text-blue-500 cursor-pointer">{children}</span>
                <div style={{zIndex: 9999}} className='absolute top-8 scale-0 rounded bg-gray-800 p-2 text-sm text-white group-hover:scale-100'>
                    {text}
                </div>
            </div>
        </>
    );
};

export default Tooltip;