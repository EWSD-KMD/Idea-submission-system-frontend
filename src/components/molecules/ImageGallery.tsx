import React from "react";
import Image from "../atoms/Image";

interface ImageGalleryProps {
  images: string | string[] | undefined;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  if (!images) return null;

  // Normalize to an array
  const imageArray = Array.isArray(images) ? images : [images];
  const count = imageArray.length;

  // For one image: full width with responsive height.
  if (count === 1) {
    return (
      <div className="w-full">
        <Image
          src={imageArray[0]}
          alt="Idea Image"
          className="w-full object-cover rounded-lg h-48 sm:h-64 md:h-80 lg:h-[300px]"
          preview={true}
        />
      </div>
    );
  }

  // For two images: stack vertically on mobile and two columns on sm and above.
  if (count === 2) {
    return (
      <div className="grid grid-cols-2 gap-1 w-full">
        {imageArray.map((src, index) => (
          <Image
            key={index}
            src={src}
            alt={`Idea Image ${index + 1}`}
            className="w-full object-cover rounded-lg h-48 sm:h-64 md:h-80 lg:h-[300px]"
            preview={true}
          />
        ))}
      </div>
    );
  }

  // For three images: use two images side-by-side on the top row,
  // and one image spanning both columns on the bottom row.
  if (count === 3) {
    return (
      <div className="grid grid-cols-2 gap-1 w-full">
        {/* First two images on the top row */}
        <div className="col-span-1">
          <Image
            src={imageArray[0]}
            alt="Idea Image 1"
            className="w-full object-cover rounded-lg h-48 sm:h-64 md:h-80 lg:h-[300px]"
            preview={true}
          />
        </div>
        <div className="col-span-1">
          <Image
            src={imageArray[1]}
            alt="Idea Image 2"
            className="w-full object-cover rounded-lg h-48 sm:h-64 md:h-80 lg:h-[300px]"
            preview={true}
          />
        </div>
        {/* The third image spans both columns */}
        <div className="col-span-2">
          <Image
            src={imageArray[2]}
            alt="Idea Image 3"
            className="w-full object-cover rounded-lg h-56 sm:h-80 md:h-[350px] lg:h-[400px]"
            preview={true}
          />
        </div>
      </div>
    );
  }

  // For four or more images: Use a two-column grid.
  // If the count is odd (and greater than 3), make the last image span both columns.
  return (
    <div className="grid grid-cols-2 gap-1 w-full">
      {imageArray.map((src, index) => {
        // If odd number of images and this is the last one, span both columns
        if (count % 2 === 1 && index === count - 1) {
          return (
            <div key={index} className="col-span-2">
              <Image
                src={src}
                alt={`Idea Image ${index + 1}`}
                className="w-full object-cover rounded-lg h-24 sm:h-32 md:h-40"
                preview={true}
              />
            </div>
          );
        }
        // Otherwise, render regularly in a two-column grid
        return (
          <Image
            key={index}
            src={src}
            alt={`Idea Image ${index + 1}`}
            className="w-full object-cover rounded-lg h-24 sm:h-32 md:h-40"
            preview={true}
          />
        );
      })}
    </div>
  );
};

export default ImageGallery;
