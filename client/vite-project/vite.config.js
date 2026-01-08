import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@components": path.resolve(__dirname, "src/components"),
      "@models": path.resolve(__dirname, "src/models"),
      "@api": path.resolve(__dirname, "src/api"),
      "@services": path.resolve(__dirname, "src/api/service"),
      "@styles": path.resolve(__dirname, "src/styles"),
      "@pages": path.resolve(__dirname, "src/pages"),
    },
  },
  optimizeDeps: {
    // ✅ EXCLUDE tất cả Node.js built-in và backend modules
    exclude: [
      "crypto",
      "fs",
      "path",
      "os",
      "http",
      "https",
      "stream",
      "util",
      "events",
      "buffer",
      "url",
      "querystring",
      "zlib",
      "child_process",
      "net",
      "tls",
      "dotenv",
      "express",
      "sequelize",
      "mysql2",
      "firebase-admin",
      "argon2",
      "jsonwebtoken",
      "multer",
      "nodemailer",
      "qs",
      "@payos/node",
    ],
    // ✅ CHỈ INCLUDE frontend dependencies
    include: ["react", "react-dom", "axios"],
    esbuildOptions: {
      target: "es2020",
    },
  },
  build: {
    target: "es2020",
    commonjsOptions: {
      transformMixedEsModules: true,
      exclude: [
        /node_modules\/dotenv/,
        /node_modules\/express/,
        /node_modules\/sequelize/,
      ],
    },
  },
  server: {
    port: 5173,
    strictPort: true,

    watch: {
      ignored: ["**/node_modules/**", "**/.git/**", "**/backend/**"],
    },
  },
});
