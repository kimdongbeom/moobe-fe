const puppeteer = require('puppeteer');
const express = require('express');
const cors = require('cors');

const port = 5000
// youtube title, date등을 크롤링 하는 puppeteer을 api로 제공
// 외부에서 접근가능한 로컬 포트로 포트를 변경한후 node puppetProxy.js로 수행
// moobe.co.kr/admin에 접근후 mixed content허용 설정함
// moobe.co.kr/admin 상단 PuppetServer에 현재 로컬 ip + port 주소 일벽(http포함해서 입력). (http://123.123.123.123:5000)
// 로컬에서 테스트 curl http://localhost:{port}/youtube?v=aRU-JIxxGag

const app = express();

app.use(cors())

app.get('/youtube', async (req, res) => {
    const browser = await puppeteer.launch()
    if (!req.query.v) {
        console.log("query 'v' not exist")
        res.end("query 'v' not exist")
        return
    }
    const url = `https://www.youtube.com/watch?v=${req.query.v}`
    console.log(url)
    const page = await browser.newPage();
    await page.setRequestInterception(true)

    page.on('request', (request) => {
        const headers = request.headers();
        headers['accept-language'] = 'ko,en-US;q=0.9,en;q=0.8';
        request.continue({
            headers
        });
    });

    await page.goto(url);
    const title = await getTextContent(page, "div#info-contents .title")
    if (!title) {
        console.log("get page error " , url)
        res.end("get page error " + url)
        return
    }
    const contents = await getTextContent(page, "div#meta #content")
    const dates = await getTextContent(page, "div#info-text #date :last-child")
    const tags = await getTextContent(page, "div#info-contents .super-title")

    await page.screenshot({path: `./puppet/${req.query.v}.png`});
    await browser.close();
    console.log("response ", {
        "title": title,
        "date": dates,
        "tag": tags,
        "content": contents,
    })

    res.json({
        "title": title,
        "date": dates,
        "tag": tags,
        "content": contents,
    })

})

async function getTextContent(page, selector) {
    const element = await page.waitForSelector(selector, {timeout: 6000}).catch(e => console.log("get data error ", selector, e))
    if (!element) {
        return
    }
    return trimContent(await (await element.getProperty('textContent')).jsonValue())
}
function trimContent(s) {
    return s.trim().replace(/^\s*[\r\n]/gm, "");
}

app.listen(port, '0.0.0.0', (e)=>{
    console.log(`express server is listening on ${port} port`);
});