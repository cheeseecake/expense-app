import puppeteer from "puppeteer";

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--window-size=1920,1080"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto("https://internet-banking.dbs.com.sg/IB/Welcome");
  await page.locator("#UID").fill("LOGIN");
  await page.locator("#PIN").fill("PASSWORD");

  // Click 'Login'
  await Promise.all([
    page.waitForNavigation(),
    (await page.waitForXPath("//button[@title='Login']")).click(),
  ]);

  // Click 'Authenticate now'
  const loginFrame = await page.waitForFrame(
    async (f) => f.name() === "iframe1"
  );
  await loginFrame.locator("#AuthenticatBtnId").click();

  await loginFrame.waitForSelector("#parent_home_page");
  console.log("login successful");
  const userFrame = await page.waitForFrame(
    async (f) => f.name() === "user_area"
  );
  await page.sl
  await userFrame.locator("li.banking > a").click();
  console.log('clicked')

  // await browser.close();
})();
