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

  const renderItem = (item: PreviewItem, idx: number) => (
    <div key={idx} className="overflow-hidden rounded-lg aspect-video">
      {isVideo(item.mime) ? (
        <video src={item.url} controls className="w-full h-full object-cover" />
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
    return <div className="w-full">{renderItem(items[0], 0)}</div>;
  }

  // 2 items: two-column grid
  if (count === 2) {
    return (
      <div className="grid grid-cols-2 gap-1 w-full">
        {items.map((it, i) => renderItem(it, i))}
      </div>
    );
  }

  // 3 items: two on top, one full-width below
  if (count === 3) {
    return (
      <div className="w-full space-y-1">
        <div className="grid grid-cols-2 gap-1 w-full">
          {renderItem(items[0], 0)}
          {renderItem(items[1], 1)}
        </div>
        <div className="w-full">{renderItem(items[2], 2)}</div>
      </div>
    );
  }

  // 4+ items: two-column, last odd spans both
  return (
    <div className="grid grid-cols-2 gap-1 w-full">
      {items.map((it, i) => {
        const isLastOdd = count % 2 === 1 && i === count - 1;
        return (
          <div
            key={i}
            className={`overflow-hidden rounded-lg aspect-video ${
              isLastOdd ? "col-span-2" : ""
            }`}
          >
            {isVideo(it.mime) ? (
              <video src={it.url} controls className="w-full h-full object-cover" />
            ) : (
              <Image
                src={it.url}
                alt={`Media ${i + 1}`}
                className="w-full h-full object-cover"
                preview
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MediaGallery;