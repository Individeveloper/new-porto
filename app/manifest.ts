import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Jayden Dwi Naufal — Portfolio",
    short_name: "Jayden Portfolio",
    description:
      "Portfolio of Jayden Dwi Naufal — Full-Stack Developer & Data Scientist.",
    start_url: "/",
    display: "standalone",
    background_color: "#F2F2F2",
    theme_color: "#000000",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
