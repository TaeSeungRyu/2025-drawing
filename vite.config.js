import { defineConfig } from "vite";

export default defineConfig({
  // 생략
  server: {
    allowedHosts: ["", "localhost", "127.0.0.1"],
  },
});
