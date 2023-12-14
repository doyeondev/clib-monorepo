const siteUrl = 'https://www.typelegal.io'

module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  exclude: ['/server-sitemap.xml'], // <= exclude here
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', disallow: '/sidepanel' },
      { userAgent: '*', allow: '/' },
    ],
    additionalSitemaps: [`${siteUrl}/sitemap.xml`, `${siteUrl}/server-sitemap.xml`],
  },
  exclude: ['/sidepanel'],
}
