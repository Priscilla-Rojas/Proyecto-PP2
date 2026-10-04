import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: '/Proyecto-PP2/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        contacto: resolve(__dirname, 'src/pages/contacto.html'),
        pedidos: resolve(__dirname, 'src/pages/pedidos.html'),
        recetas: resolve(__dirname, 'src/pages/recetas.html'),
      }
    }
  }
})
