// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { LAB_SITE, SITE_URL } from './src/config/site.mjs';

const labPreviewImage = new URL(LAB_SITE.iconPath, SITE_URL).href;

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  output: 'static',
  redirects: {
    '/lab/writeups/towel-on-the-sunbed':
      '/lab/writeups/tryhackme/towel-on-the-sunbed',
    '/lab/writeups/tryhackme': '/lab/writeups',
  },
  integrations: [
    starlight({
      title: LAB_SITE.title,
      description: LAB_SITE.description,
      disable404Route: true,
      favicon: LAB_SITE.iconPath,
      head: [
        {
          tag: 'meta',
          attrs: { property: 'og:image', content: labPreviewImage },
        },
        {
          tag: 'meta',
          attrs: { property: 'og:image:type', content: 'image/png' },
        },
        {
          tag: 'meta',
          attrs: { property: 'og:image:width', content: String(LAB_SITE.iconWidth) },
        },
        {
          tag: 'meta',
          attrs: { property: 'og:image:height', content: String(LAB_SITE.iconHeight) },
        },
        {
          tag: 'meta',
          attrs: { property: 'og:image:alt', content: LAB_SITE.iconAlt },
        },
        {
          tag: 'meta',
          attrs: { name: 'twitter:card', content: 'summary' },
        },
        {
          tag: 'meta',
          attrs: { name: 'twitter:image', content: labPreviewImage },
        },
        {
          tag: 'meta',
          attrs: { name: 'twitter:image:alt', content: LAB_SITE.iconAlt },
        },
      ],
      expressiveCode: {
        // Keep every code sample visually consistent as the lab grows.
        defaultProps: { frame: 'terminal' },
      },
      customCss: [
        '@fontsource-variable/rubik',
        './src/styles/lab.css',
      ],
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/sprackles',
        },
      ],
      sidebar: [
        {
          label: 'My Lab',
          items: [
            {
              slug: 'lab',
              label: 'My Lab',
              attrs: { 'data-group-index': 'true' },
            },
            { slug: 'lab/about' },
          ],
        },
        {
          label: 'Writeups',
          items: [
            {
              slug: 'lab/writeups',
              label: 'Writeups',
              attrs: { 'data-group-index': 'true' },
            },
            {
              label: 'TryHackMe',
              items: [
                {
                  autogenerate: {
                    directory: 'lab/writeups/tryhackme',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Exploratory',
          items: [
            {
              link: '/lab/exploratory/',
              label: 'Exploratory',
              attrs: { 'data-group-index': 'true' },
            },
            {
              autogenerate: {
                directory: 'lab/exploratory',
              },
            },
          ],
        },
      ],
      components: {
        SiteTitle: './src/components/lab/SiteTitle.astro',
        SocialIcons: './src/components/lab/GitHubIdentity.astro',
        ThemeProvider: './src/components/lab/DarkThemeProvider.astro',
        ThemeSelect: './src/components/lab/Empty.astro',
        PageTitle: './src/components/lab/PageTitle.astro',
        Footer: './src/components/lab/Footer.astro',
        // Keeps section indexes clickable without duplicating them as child rows.
        Sidebar: './src/components/lab/Sidebar.astro',
      },
      lastUpdated: false,
      pagination: true,
      prerender: true,
    }),
  ],
});
