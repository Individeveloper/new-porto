"use client";

import { useState } from "react";
import Image from "next/image";

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
          <Image
            src={url}
            alt={caption || "Project preview screenshot"}
            width={1200}
            height={675}
            priority={index === 0}
            unoptimized={url.endsWith(".svg")}
            className="project-detail__screenshot-img"
            onError={() => setHasError(true)}
          />
        )}
      </div>
      {caption && <figcaption className="project-detail__screenshot-caption">{caption}</figcaption>}
    </figure>
  );
}
