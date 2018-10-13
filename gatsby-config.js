require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});

const { RichText } = require('prismic-reactjs');
const Prism = require('prismjs');
require('prismjs/components/prism-javascript');
require('prismjs/components/prism-css');
require('prismjs/components/prism-scss');
require('prismjs/components/prism-jsx');
require('prismjs/components/prism-bash');
require('prismjs/components/prism-json');
require('prismjs/components/prism-diff');
require('prismjs/components/prism-markdown');
require('prismjs/components/prism-graphql');

const { Elements } = RichText;

const codeInline = ['text'];
const codeBlock = ['javascript', 'css', 'scss', 'jsx', 'bash', 'json', 'diff', 'markdown', 'graphql'];

const {
  _pathPrefix,
  shortName,
  description,
  themeColor,
  backgroundColor,
  _title,
  _titleAlt,
  _url,
  author,
  logo,
  favicon,
  siteLanguage,
  twitter,
} = require('./config/website');

module.exports = {
  /* General Information */
  pathPrefix: _pathPrefix,
  siteMetadata: {
    title: _title,
    titleAlt: _titleAlt,
    shortName,
    author,
    siteLanguage,
    logo, // Logo for JSONLD
    url: _url,
    siteUrl: _url + _pathPrefix, // For gatsby-plugin-sitemap
    pathPrefix: _pathPrefix,
    description,
    banner: logo,
    twitter,
  },
  /* Plugins */
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-emotion',
    {
      resolve: 'gatsby-source-prismic',
      options: {
        repositoryName: 'gatsby-starter-prismic',
        accessToken: `${process.env.API_KEY}`,
        linkResolver: () => post => `/${post.uid}`,
        htmlSerializer: () => (type, element, content) => {
          switch (type) {
            case Elements.label: {
              if (codeInline.includes(element.data.label)) {
                return `<code class="language-${element.data.label}">${content}</code>`;
              }
              if (element.data.label === 'quote') {
                return `<blockquote><p>${content}</p></blockquote>`;
              }
              if (codeBlock.includes(element.data.label)) {
                return `<pre class="language-${element.data.label}"><code class="language-${
                  element.data.label
                }">${Prism.highlight(content, Prism.languages[element.label])}</code></pre>`;
              }
              return null;
            }
            case Elements.preformatted: {
              if (codeBlock.includes(element.label)) {
                return `<pre class="language-${element.label}"><code class="language-${
                  element.label
                }">${Prism.highlight(element.text, Prism.languages[element.label])}</code></pre>`;
              }
              return null;
            }
            default: {
              return null;
            }
          }
        },
      },
    },
    'gatsby-plugin-lodash',
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: 'src',
        path: `${__dirname}/src/`,
      },
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    {
      resolve: 'gatsby-plugin-typography',
      options: {
        pathToConfigModule: 'config/typography.js',
      },
    },
    'gatsby-plugin-sitemap',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: _title,
        short_name: _titleAlt,
        description,
        start_url: _pathPrefix,
        background_color: backgroundColor,
        theme_color: themeColor,
        display: 'standalone',
        icon: favicon,
      },
    },
    /* Must be placed at the end */
    'gatsby-plugin-offline',
    'gatsby-plugin-netlify',
  ],
};