"use client";

import Image from "next/image";
import { useState } from "react";

export function HeroImage() {
  const [imgSrc, setImgSrc] = useState("/hero-image-placeholder.png");

  return (
    <Image
      src={imgSrc}
      alt="Split Billz App"
      width={550}
      height={400}
      className="rounded-lg shadow-lg"
      onError={() => {
        setImgSrc(
          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='550' height='400' viewBox='0 0 550 400'%3E%3Crect width='550' height='400' fill='%23f0f0f0'/%3E%3Cpath fill='%23cccccc' d='M280 175 L350 175 L350 225 L280 225 Z'/%3E%3Cpath fill='%23cccccc' d='M200 175 L270 175 L270 225 L200 225 Z'/%3E%3Cpath fill='%23e0e0e0' d='M200 235 L350 235 L350 250 L200 250 Z'/%3E%3Cpath fill='%23e0e0e0' d='M200 260 L350 260 L350 275 L200 275 Z'/%3E%3Cpath fill='%23e0e0e0' d='M200 285 L280 285 L280 300 L200 300 Z'/%3E%3Cpath fill='%23cccccc' d='M350 125 L350 150 L200 150 L200 125 Z'/%3E%3C/svg%3E"
        );
      }}
    />
  );
} 