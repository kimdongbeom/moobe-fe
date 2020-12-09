const es2015 = require('babel-preset-es2015');
const presetReact = require('babel-preset-react');
require("babel-register")({
    presets: [es2015, presetReact]
});

const SiteMapRouter = require("./src/SiteMapRouter").default;
const Sitemap = require("react-router-sitemap").default;

function generateSitemap() {
    return (
        new Sitemap(SiteMapRouter)
            .applyParams({
                "/channels/:channelId": [{"channelId": "*"}],
                "/contents/:contentId": [{"contentId": "*"}],
                "/channels/:channelId/contents/:contentId": [{"channelId": "*", "contentId": "*"}],
            })
            .build('https://moobe.co.kr')
            .save('./public/sitemap.xml')
    );
}

generateSitemap();