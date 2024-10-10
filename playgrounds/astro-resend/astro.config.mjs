// @ts-check
import { defineConfig } from 'astro/config';
import resend from '@hbertoson/astro-resend'

// https://astro.build/config
export default defineConfig({
    integrations: [
        resend({
            verbose: true,
        })
    ]
});
