import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  // base: "/91APP_front-end-class",
  base: "./",
  plugins: [react()],
});
