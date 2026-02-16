import React, { useEffect, useState } from "react";

const ClothifyLoader = ({ onFinish, minDuration = 2200 }) => {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    let hideTimer;
    const timer = setTimeout(() => {
      setFadeOut(true);
      hideTimer = setTimeout(() => {
        setVisible(false);
        document.body.style.overflow = "";
        onFinish?.();
      }, 500);
    }, minDuration);
    return () => {
      document.body.style.overflow = "";
      clearTimeout(timer);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, [minDuration, onFinish]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gray-100 transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Logo / Brand name */}
      <div className="flex flex-col items-center gap-5">
        <h1
          className={`text-4xl md:text-6xl font-semibold tracking-widest uppercase text-gray-800 transition-all duration-700 ${
            fadeOut ? "opacity-0 scale-95" : "opacity-100 scale-100"
          }`}
        >
          Clothify
        </h1>
        <p
          className={`text-xs md:text-sm tracking-[0.3em] uppercase text-gray-500 transition-opacity duration-500 delay-200 ${
            fadeOut ? "opacity-0" : "opacity-100"
          }`}
        >
          Fashion & Lifestyle
        </p>
      </div>

      {/* Loader bar - light gray theme */}
      <div className="absolute bottom-[22%] left-1/2 -translate-x-1/2 w-44 md:w-56 h-1 bg-gray-300 rounded-full overflow-hidden">
        <div className="clothify-loader-bar h-full bg-gray-600 rounded-full" />
      </div>

      <style>{`
        .clothify-loader-bar {
          width: 0%;
          animation: clothifyLoaderProgress 2.2s ease-out forwards;
        }
        @keyframes clothifyLoaderProgress {
          0% { width: 0%; }
          70% { width: 85%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default ClothifyLoader;
