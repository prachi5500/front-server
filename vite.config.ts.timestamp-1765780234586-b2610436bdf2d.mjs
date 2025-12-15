// vite.config.ts
import { defineConfig } from "file:///C:/Users/Lenovo/Desktop/New%20folder/Generate-Card/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/Lenovo/Desktop/New%20folder/Generate-Card/node_modules/@vitejs/plugin-react-swc/index.js";
import path from "path";
import obfuscator from "file:///C:/Users/Lenovo/Desktop/New%20folder/Generate-Card/node_modules/vite-plugin-javascript-obfuscator/dist/index.cjs.js";
var __vite_injected_original_dirname = "C:\\Users\\Lenovo\\Desktop\\New folder\\Generate-Card";
var vite_config_default = defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 8080
  },
  plugins: [
    react(),
    mode === "production" && obfuscator({
      // Moderate settings: strong obfuscation without extreme build time
      compact: true,
      controlFlowFlattening: true,
      controlFlowFlatteningThreshold: 0.75,
      deadCodeInjection: true,
      deadCodeInjectionThreshold: 0.4,
      disableConsoleOutput: true,
      identifierNamesGenerator: "hexadecimal",
      rotateStringArray: true,
      shuffleStringArray: true,
      splitStrings: true,
      stringArray: true,
      stringArrayEncoding: ["rc4"],
      stringArrayThreshold: 0.75,
      transformObjectKeys: true,
      unicodeEscapeSequence: false
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  optimizeDeps: {
    exclude: ["@google/generative-ai"]
  },
  build: {
    sourcemap: false,
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      },
      format: {
        comments: false
      }
    }
  },
  define: {
    "process.env": {}
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxMZW5vdm9cXFxcRGVza3RvcFxcXFxOZXcgZm9sZGVyXFxcXEdlbmVyYXRlLUNhcmRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXExlbm92b1xcXFxEZXNrdG9wXFxcXE5ldyBmb2xkZXJcXFxcR2VuZXJhdGUtQ2FyZFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvTGVub3ZvL0Rlc2t0b3AvTmV3JTIwZm9sZGVyL0dlbmVyYXRlLUNhcmQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xyXG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0LXN3Y1wiO1xyXG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xyXG5pbXBvcnQgb2JmdXNjYXRvciBmcm9tIFwidml0ZS1wbHVnaW4tamF2YXNjcmlwdC1vYmZ1c2NhdG9yXCI7XHJcbmltcG9ydCB7IGNvbXBvbmVudFRhZ2dlciB9IGZyb20gXCJsb3ZhYmxlLXRhZ2dlclwiO1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4gKHtcclxuICBzZXJ2ZXI6IHtcclxuICAgIGhvc3Q6IFwiMC4wLjAuMFwiLFxyXG4gICAgcG9ydDogODA4MCxcclxuICB9LFxyXG4gIHBsdWdpbnM6IFtcclxuICAgIHJlYWN0KCksXHJcbiAgICBtb2RlID09PSBcInByb2R1Y3Rpb25cIiAmJlxyXG4gICAgICBvYmZ1c2NhdG9yKHtcclxuICAgICAgICAvLyBNb2RlcmF0ZSBzZXR0aW5nczogc3Ryb25nIG9iZnVzY2F0aW9uIHdpdGhvdXQgZXh0cmVtZSBidWlsZCB0aW1lXHJcbiAgICAgICAgY29tcGFjdDogdHJ1ZSxcclxuICAgICAgICBjb250cm9sRmxvd0ZsYXR0ZW5pbmc6IHRydWUsXHJcbiAgICAgICAgY29udHJvbEZsb3dGbGF0dGVuaW5nVGhyZXNob2xkOiAwLjc1LFxyXG4gICAgICAgIGRlYWRDb2RlSW5qZWN0aW9uOiB0cnVlLFxyXG4gICAgICAgIGRlYWRDb2RlSW5qZWN0aW9uVGhyZXNob2xkOiAwLjQsXHJcbiAgICAgICAgZGlzYWJsZUNvbnNvbGVPdXRwdXQ6IHRydWUsXHJcbiAgICAgICAgaWRlbnRpZmllck5hbWVzR2VuZXJhdG9yOiBcImhleGFkZWNpbWFsXCIsXHJcbiAgICAgICAgcm90YXRlU3RyaW5nQXJyYXk6IHRydWUsXHJcbiAgICAgICAgc2h1ZmZsZVN0cmluZ0FycmF5OiB0cnVlLFxyXG4gICAgICAgIHNwbGl0U3RyaW5nczogdHJ1ZSxcclxuICAgICAgICBzdHJpbmdBcnJheTogdHJ1ZSxcclxuICAgICAgICBzdHJpbmdBcnJheUVuY29kaW5nOiBbXCJyYzRcIl0sXHJcbiAgICAgICAgc3RyaW5nQXJyYXlUaHJlc2hvbGQ6IDAuNzUsXHJcbiAgICAgICAgdHJhbnNmb3JtT2JqZWN0S2V5czogdHJ1ZSxcclxuICAgICAgICB1bmljb2RlRXNjYXBlU2VxdWVuY2U6IGZhbHNlLFxyXG4gICAgICB9KSxcclxuICBdLmZpbHRlcihCb29sZWFuKSxcclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczoge1xyXG4gICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcclxuICAgIH0sXHJcbiAgfSxcclxuICBvcHRpbWl6ZURlcHM6IHtcclxuICAgIGV4Y2x1ZGU6IFsnQGdvb2dsZS9nZW5lcmF0aXZlLWFpJ11cclxuICB9LFxyXG4gIGJ1aWxkOiB7XHJcbiAgICBzb3VyY2VtYXA6IGZhbHNlLFxyXG4gICAgbWluaWZ5OiBcInRlcnNlclwiLFxyXG4gICAgdGVyc2VyT3B0aW9uczoge1xyXG4gICAgICBjb21wcmVzczoge1xyXG4gICAgICAgIGRyb3BfY29uc29sZTogdHJ1ZSxcclxuICAgICAgICBkcm9wX2RlYnVnZ2VyOiB0cnVlLFxyXG4gICAgICB9LFxyXG4gICAgICBmb3JtYXQ6IHtcclxuICAgICAgICBjb21tZW50czogZmFsc2UsXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgZGVmaW5lOiB7XHJcbiAgICAncHJvY2Vzcy5lbnYnOiB7fVxyXG4gIH1cclxufSkpO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWdWLFNBQVMsb0JBQW9CO0FBQzdXLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFDakIsT0FBTyxnQkFBZ0I7QUFIdkIsSUFBTSxtQ0FBbUM7QUFPekMsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE9BQU87QUFBQSxFQUN6QyxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsRUFDUjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sU0FBUyxnQkFDUCxXQUFXO0FBQUE7QUFBQSxNQUVULFNBQVM7QUFBQSxNQUNULHVCQUF1QjtBQUFBLE1BQ3ZCLGdDQUFnQztBQUFBLE1BQ2hDLG1CQUFtQjtBQUFBLE1BQ25CLDRCQUE0QjtBQUFBLE1BQzVCLHNCQUFzQjtBQUFBLE1BQ3RCLDBCQUEwQjtBQUFBLE1BQzFCLG1CQUFtQjtBQUFBLE1BQ25CLG9CQUFvQjtBQUFBLE1BQ3BCLGNBQWM7QUFBQSxNQUNkLGFBQWE7QUFBQSxNQUNiLHFCQUFxQixDQUFDLEtBQUs7QUFBQSxNQUMzQixzQkFBc0I7QUFBQSxNQUN0QixxQkFBcUI7QUFBQSxNQUNyQix1QkFBdUI7QUFBQSxJQUN6QixDQUFDO0FBQUEsRUFDTCxFQUFFLE9BQU8sT0FBTztBQUFBLEVBQ2hCLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxJQUN0QztBQUFBLEVBQ0Y7QUFBQSxFQUNBLGNBQWM7QUFBQSxJQUNaLFNBQVMsQ0FBQyx1QkFBdUI7QUFBQSxFQUNuQztBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsV0FBVztBQUFBLElBQ1gsUUFBUTtBQUFBLElBQ1IsZUFBZTtBQUFBLE1BQ2IsVUFBVTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsZUFBZTtBQUFBLE1BQ2pCO0FBQUEsTUFDQSxRQUFRO0FBQUEsUUFDTixVQUFVO0FBQUEsTUFDWjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixlQUFlLENBQUM7QUFBQSxFQUNsQjtBQUNGLEVBQUU7IiwKICAibmFtZXMiOiBbXQp9Cg==
