"use client";

import { useState } from "react";
import Image from "next/image";

const HERO_IMAGES = [
  "/assets/gfl-hero-random-1.png",
  "/assets/gfl-hero-random-2.png",
  "/assets/gfl-hero-random-3.png",
  "/assets/gfl-hero-random-4.png",
  "/assets/gfl-hero-random-5.png",
  "/assets/gfl-hero-random-6.png",
  "/assets/gfl-hero-random-7.png",
];

/**
 * Rendered client-only (dynamic import with ssr:false) so the random pick
 * happens in a useState initializer without any hydration mismatch.
 */
export default function HeroArt() {
  const [heroImage] = useState(
    () => HERO_IMAGES[Math.floor(Math.random() * HERO_IMAGES.length)]
  );

  return (
    <Image
      src={heroImage}
      alt=""
      fill
      priority
      sizes="100vw"
      style={{ objectFit: "cover", objectPosition: "center" }}
    />
  );
}
