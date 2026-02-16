import React, { useEffect, useState } from "react";

const LOADER_DURATION = 1500; // Exactly 1 second

const ClothifyLoader = ({ onFinish }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Reset body overflow immediately
    document.body.style.overflow = "hidden";
    
    // Use a ref to ensure timer always runs
    const timer = setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = "";
      // Call onFinish immediately after hiding
      if (onFinish) {
        onFinish();
      }
    }, LOADER_DURATION);

    // Cleanup: ensure body overflow is restored
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, [onFinish]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gray-100" style={{ transition: 'none' }}>
      {/* Logo / Brand name */}
      <div className="flex flex-col items-center gap-6 mb-12">
        <h1 className="text-4xl md:text-6xl font-semibold tracking-widest uppercase text-gray-800">
          Clothify
        </h1>
        <p className="text-xs md:text-sm tracking-[0.3em] uppercase text-gray-500">
          Fashion & Lifestyle
        </p>
      </div>

      {/* Round Spinner */}
      <div className="relative w-16 h-16 md:w-20 md:h-20">
        <div className="absolute inset-0 border-4 border-gray-300 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default ClothifyLoader;
