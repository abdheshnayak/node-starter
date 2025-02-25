const esbuild = require("esbuild");

esbuild.build({
  entryPoints: ["src/index.ts"], // Change to your main TypeScript file
  outfile: "dist/index.js", // Output file
  bundle: true, // Bundle dependencies (optional for backend)
  minify: false, // Disable minification for better debugging
  sourcemap: true, // Generate source maps
  platform: "node", // Target Node.js runtime
  target: "node18", // Adjust based on your Node.js version
  external: ["express"], // Exclude dependencies that should be resolved at runtime
  loader: { ".ts": "ts" }, // Handle TypeScript files
}).catch(() => process.exit(1));
