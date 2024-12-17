/* eslint-disable no-undef */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import vitePluginDebugger from "./vite-plugin-debugger.js";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  plugins: [react(), vitePluginDebugger(process.env.VITE_API_KEY)],
  define: {
    "process.env": process.env,
  },
});
