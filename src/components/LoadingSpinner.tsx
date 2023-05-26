import React from "react";
import { BeatLoader } from "react-spinners";

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <BeatLoader color="#000" />
    </div>
  );
};

export default LoadingSpinner;
