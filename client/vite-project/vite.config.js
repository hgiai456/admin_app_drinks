import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'), //Trỏ thẳng tới thư mục góc Pro_Drinks
            '@components': path.resolve(__dirname, 'src/components'),
            '@models': path.resolve(__dirname, 'src/models'),
            '@api': path.resolve(__dirname, 'src/api'),
            '@styles': path.resolve(__dirname, 'src/styles')
        }
    }
});
