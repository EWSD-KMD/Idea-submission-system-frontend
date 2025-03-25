"use client";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="w-20 h-20">
        <DotLottieReact
          src="https://lottie.host/fce7f0b5-ed51-4cf5-b87c-c54e181f2423/Q5CUbjHeB0.lottie"
          loop
          autoplay
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      </div>
    </div>
  );
};

export default Loading;
