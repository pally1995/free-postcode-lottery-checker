
const puppeteer = require("puppeteer");

async function FPL_LogIn() {
  //Set up puppeteer

  const browser = await puppeteer.launch({
    headless: false,
    args: ["--disable-features=site-per-process"],
  });
  const page = await browser.newPage();
  page.setViewport({ width: 1366, height: 794 });
  await page.goto("https://pickmypostcode.com/#", {
    waitUntil: "networkidle0",
  });

  //Log into FPL

  await page.click(
    "#v-rebrand > div.wrapper.top > div.wrapper--content.wrapper--content__relative > nav > ul > li.nav--buttons.nav--item > button.btn.btn-secondary.btn-cancel"
  );
  await page.type("#confirm-ticket", "ng5 7at");
  await page.type("#confirm-email", "alexward95@hotmail.com");
  await page.click(
    "#v-rebrand > div.wrapper.top > div.wrapper--content > main > div.overlay.overlay__open > section > div > div > div > form > button"
  );

  //Accept advertising settings within iFrame

  await page.waitForNavigation({ waitUntil: "networkidle2" });
  const frameHandle = await await page.$(".faktor-iframe-wrapper");
  const frame = await frameHandle.contentFrame();
  await frame.click("#save");

  //Wait for Main result selector to load and retrieve result

  await page.waitForSelector(
    "#result > div > div.result--header > p.result--postcode"
  );
  const mainResult = await page.$eval(
    "#result > div > div.result--header > p.result--postcode",
    (el) => el.textContent
  );
  console.log(mainResult);

  //Wait for video result to load and retrieve result

  await page.click("#v-main-header > div > div > ul > li:nth-child(2) > a");
  await page.waitForSelector("#bridVideoPlayer > div > div.brid-overlay-play-button.brid-button > span > svg > path:nth-child(2)")
  await page.click("#bridVideoPlayer > div > div.brid-overlay-play-button.brid-button > span > svg > path:nth-child(2)")
  await page.waitForSelector(
    "#result-header > div > p.result--postcode", {timeout: 40000}
  );
  const videoResult = await page.$eval(
    "#result-header > div > p.result--postcode",
    (el) => el.textContent
  );
  console.log(videoResult);
  
  // Get survey draw

  await page.click("#v-main-header > div > div > ul > li.active.visited > a")
  await page.waitForSelector("#result-survey > div:nth-child(1) > div > div.questions > div.survey-buttons > button.btn.btn-secondary");
  await page.click("#result-survey > div:nth-child(1) > div > div.questions > div.survey-buttons > button.btn.btn-secondary");
  await page.waitForSelector(
    "#result-header > div > p.result--postcode", {timeout: 40000}
  );
  const surveyResult = await page.$eval(
    "#result-header > div > p.result--postcode",
    (el) => el.textContent
  );
  console.log(surveyResult);

    //Check stackpot Draw

    await page.waitForNavigation();
    const stackpot = document.querySelectorAll(".result--postcode");
    const getStackpot = await page.$eval(
      stackpot,
      (el) => el.textContent
    );
    console.log(getStackpot)

  await browser.close();
}

FPL_LogIn();
