const puppeteer = require('puppeteer');

const siteList = [
    'aftenposten.no',
    'bt.no',
    'vg.no',
    'vgd.no',
    'vglive.no',
    'tek.no'
];

async function main () {
    const browser = await puppeteer.launch();

    const resultsPromise = siteList.map(async url => {
        const page = await browser.newPage();
        await page.goto(`https://${url}`);

        return [url, await page.evaluate('apntag.getAstVersion()')];
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
