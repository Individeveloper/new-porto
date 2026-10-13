"use client";

import { useState } from "react";

interface ProjectScreenshotProps {
  url: string;
  caption: string;
  index: number;
}

export default function ProjectScreenshot({ url, caption, index }: ProjectScreenshotProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <figure className="project-detail__screenshot-item">
      <div className="project-detail__screenshot-frame">
        {hasError ? (
          <div className="project-detail__screenshot-placeholder">
            <div className="placeholder-icon">📷</div>
            <p className="placeholder-title">{caption}</p>
            <span className="placeholder-path">Path: <code>public{url}</code></span>
            <span className="placeholder-hint">Simpan file gambar screenshot kamu di path di atas untuk menampilkannya di sini.</span>
          </div>
        ) : (
          <img
            src={url}
            alt={caption}
            loading={index === 0 ? "eager" : "lazy"}
            className="project-detail__screenshot-img"
            onError={() => setHasError(true)}
          />
        )}
      </div>
      {caption && <figcaption className="project-detail__screenshot-caption">{caption}</figcaption>}
    </figure>
  );
}
