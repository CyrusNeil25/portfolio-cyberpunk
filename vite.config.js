import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/portfolio-cyberpunk/',

  plugins: [react(), tailwindcss()],
  // react-spline can pull in a second React instance during dep pre-bundling,
  // which triggers "Invalid hook call". Force a single React copy.
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@splinetool/react-spline', '@splinetool/runtime'],
  },
  server: {
    port: parseInt(process.env.PORT) || 2512,
    strictPort: true,
  },
})
