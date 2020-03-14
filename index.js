const puppeteer = require('puppeteer');

const siteList = [
    'aftenposten.no',
    ['aftenposten articles', 'aftenposten.no/i/xPvzml/'],
    'bt.no',
    'vg.no',
    'vgd.no',
    'vglive.no',
    'tek.no'
];

const arrayCheck = val => typeof val.sort === 'function';

async function main () {
    const browser = await puppeteer.launch();

    const resultsPromise = siteList.map(async site => {
        const [name, url] = arrayCheck(site) ? [site[0], site[1]] : [site, site];
        const page = await browser.newPage();
        await page.goto(`https://${url}`);

        return [name, await page.evaluate('apntag.getAstVersion()')];
    });
    
    const results = await Promise.all(resultsPromise);

    await browser.close();

    const sortedSites = results.sort((a, b) => a[1] >= b[1] ? 1 : -1);

    console.table(sortedSites);
}

try {
    main();
} catch (e) {
    console.error(e);
}
