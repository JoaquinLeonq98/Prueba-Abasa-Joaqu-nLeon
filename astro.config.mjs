// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import vercel from '@astrojs/vercel/serverless';
import tailwindcss from '@tailwindcss/vite';


export default defineConfig({
    integrations: [
        react(), 
    ],
    
	vite: {    plugins: [tailwindcss()],  },
    output: 'server', 
    adapter: vercel({}), 
    

});