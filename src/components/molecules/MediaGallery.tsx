"use client";
import React from "react";
import Image from "../atoms/Image";

export interface PreviewItem {
  url: string;
  mime: string;
}

interface MediaGalleryProps {
  media: PreviewItem[];
}

const MediaGallery: React.FC<MediaGalleryProps> = ({ media }) => {
  if (!media.length) return null;

  const isVideo = (mime: string) => mime.startsWith("video/");
  const items = media;
  const count = items.length;

  const renderItem = (item: PreviewItem, idx: number, spanCols = 1) => (
    <div
      key={idx}
      className={`overflow-hidden rounded-lg aspect-video ${
        spanCols > 1 ? `col-span-${spanCols}` : ""
      }`}
    >
      {isVideo(item.mime) ? (
        <video
          src={item.url}
          controls
          className="w-full h-full object-cover"
        />
      ) : (
        <Image
          src={item.url}
          alt={`Media ${idx + 1}`}
          className="w-full h-full object-cover"
          preview
        />
      )}
    </div>
  );

  // 1 item: full width
  if (count === 1) {
    return (
      <div className="w-full">
        {renderItem(items[0], 0, 1)}
      </div>
    );
  }

  // 2 items: 2‑column grid
  if (count === 2) {
    return (
      <div className="grid grid-cols-2 gap-1 w-full">
        {items.map((it, i) => renderItem(it, i, 1))}
      </div>
    );
  }

  // 3 items: two top, one spanning bottom
  if (count === 3) {
    return (
      <div className="grid grid-cols-2 gap-1 w-full">
        {renderItem(items[0], 0, 1)}
        {renderItem(items[1], 1, 1)}
        {renderItem(items[2], 2, 2)}
      </div>
    );
  }

  // 4+ items: two‑column, last odd spans both
  return (
    <div className="grid grid-cols-2 gap-1 w-full">
      {items.map((it, i) => {
        const isLastOdd = count % 2 === 1 && i === count - 1;
        return renderItem(it, i, isLastOdd ? 2 : 1);
      })}
    </div>
  );
};

export default MediaGallery;
