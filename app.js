const express = require('express')
const app = express()
const PORT = process.env.PORT || 8080
const puppeteer = require('puppeteer')
const fs = require('fs')

void (async () => {
    try {
        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.goto('https://scrapethissite.com/pages/forms/');
        await page.screenshot({
            path: './screenshots/page2.png'
        });
        await page.pdf({
          path: './pdfs/page2.pdf'
        }) 
        
        const teams = await page.evaluate(() => {
          const grabFromRow = (row, classname) => row
            .querySelector(`td.${classname}`)
            .innerText
            .trim()

        const TEAM_ROW_SELECTOR = 'tr.team';
        const data = [];
        const teamRows = document.querySelectorAll(TEAM_ROW_SELECTOR)

        for (const tr of teamRows) {
          data.push({
            name: grabFromRow(tr, 'name'),
            year:grabFromRow(tr, 'year'),
            wins: grabFromRow(tr, 'wins'),
            losses: grabFromRow(tr, 'losses')
          })
        }

        return data
    })
        fs.writeFile(
          './json/teams.json',
          JSON.stringify(teams, null, 2),
          (err) => err ? console.error('Data not written!', err) : console.log('Data written!')
        )
        
        await browser.close()
    } catch (error) {
      console.log(error)
    }
})()

app.listen(PORT, () => {
  console.log('Listening on port ', PORT);
});

