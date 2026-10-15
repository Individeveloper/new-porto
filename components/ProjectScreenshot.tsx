"use client";

import { useState, useRef, useEffect } from "react";

interface ProjectScreenshotProps {
  url: string;
  caption: string;
  index: number;
  isMobile?: boolean;
}

export default function ProjectScreenshot({
  url,
  caption,
  index,
  isMobile: isMobileProp,
}: ProjectScreenshotProps) {
  const [hasError, setHasError] = useState(false);
  const [isDetectedMobile, setIsDetectedMobile] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Check dimensions immediately if already cached or completed
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      const { naturalWidth, naturalHeight } = imgRef.current;
      if (naturalWidth > 0 && naturalHeight > 0) {
        if (naturalHeight > naturalWidth * 1.15) {
          setIsDetectedMobile(true);
        }
      }
    }
  }, [url]);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    if (naturalWidth > 0 && naturalHeight > 0) {
      if (naturalHeight > naturalWidth * 1.15) {
        setIsDetectedMobile(true);
      }
    }
  };

  const isMobile = isMobileProp !== undefined ? isMobileProp : isDetectedMobile;

  return (
    <figure
      className={`project-detail__screenshot-item ${
        isMobile ? "project-detail__screenshot-item--mobile" : ""
      }`}
    >
      <div
        className={`project-detail__screenshot-frame ${
          isMobile ? "project-detail__screenshot-frame--mobile" : ""
        }`}
      >
        {hasError ? (
          <div
            className={`project-detail__screenshot-placeholder ${
              isMobile ? "project-detail__screenshot-placeholder--mobile" : ""
            }`}
          >
            <div className="placeholder-icon">📷</div>
            <p className="placeholder-title">{caption}</p>
            <span className="placeholder-path">
              Path: <code>public{url}</code>
            </span>
            <span className="placeholder-hint">
              Simpan file gambar screenshot kamu di path di atas untuk menampilkannya di sini.
            </span>
          </div>
        ) : (
          <img
            ref={imgRef}
            src={url}
            alt={caption}
            loading={index === 0 ? "eager" : "lazy"}
            className={`project-detail__screenshot-img ${
              isMobile ? "project-detail__screenshot-img--mobile" : ""
            }`}
            onLoad={handleImageLoad}
            onError={() => setHasError(true)}
          />
        )}
      </div>
      {caption && (
        <figcaption
          className={`project-detail__screenshot-caption ${
            isMobile ? "project-detail__screenshot-caption--mobile" : ""
          }`}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

