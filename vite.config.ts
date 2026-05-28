// vite.config.ts
import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import react from '@vitejs/plugin-react'

// 빌드 시 자동으로 배포 시간 업데이트
const injectBuildDate = (): Plugin => ({
  name: 'inject-build-date',
  transformIndexHtml(html) {
    const now = new Date()
    const buildDate = now.toLocaleString('sv-SE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).replace(',', '')

    return html.replace(
      /<meta name="build-date" content="[^"]*" \/>/,
      `<meta name="build-date" content="${buildDate}" />`
    )
  },
})

export default defineConfig({
  plugins: [react(), injectBuildDate()],
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/shared/components',
    },
  },
})
