import puppeteer, { ElementHandle, Frame, HTTPResponse, Page } from "puppeteer";
import { z } from "zod";

/**Wait for an iframe to be detached. Triggered on navigations.
 * Required for DBS website.
 */
const waitForFrameLoad = async (page: Page, frameName: string) =>
  await new Promise<void>((resolve) => {
    const handler = (e: Frame) => {
      if (e.name() === frameName) {
        page.off("framedetached", handler);
        resolve();
      }
    };
    page.on("framedetached", handler);
  });

export type IgetDbsStatementSchema = z.infer<typeof getDbsStatementSchema>;

export const getDbsStatementSchema = z.object({
  username: z.string().nonempty(),
  password: z.string().nonempty(),
  accountNumberWithDashes: z.string().nonempty(),
});

/**
 * Fetch account statement from DBS iBanking (default last 30 days)
 *
 * `accountNumberWithDashes` must include dashes, e.g. 123-45678-9.
 * This must match exactly how it is displayed on the DBS website.
 *
 * @returns account statement in .csv as a string
 */
export const getDbsStatementAsCsv = async ({
  username,
  password,
  accountNumberWithDashes: accountNumber,
}: IgetDbsStatementSchema): Promise<string> => {
  const browser = await puppeteer.connect({
    browserWSEndpoint: "ws://browserless:3000",
  });
  const page = await browser.newPage();

  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto("https://internet-banking.dbs.com.sg/IB/Welcome");
  await page.locator("#UID").fill(username);
  await page.locator("#PIN").fill(password);

  // Click 'Login'
  const loginButton = (await page.waitForXPath(
    "//button[@title='Login']"
  )) as ElementHandle<Element>;
  await Promise.all([page.waitForNavigation(), loginButton?.click()]);
  console.log("Clicked Login");

  // Click 'Authenticate now'
  const loginFrame = await page.waitForFrame(
    async (f) => f.name() === "iframe1"
  );
  await loginFrame.locator("#AuthenticatBtnId").click();
  console.log("Clicked Authenticate Now");

  // Wait for login
  await loginFrame.waitForSelector("#parent_home_page", {
    timeout: 2 * 60 * 1000,
  });
  console.log("Login successful");

  const userFrame = await page.waitForFrame(
    async (f) => f.name() === "user_area"
  );

  // Click 'Banking'
  await userFrame.locator("li.banking > a").click();
  console.log("Clicked Banking");

  // Wait page load
  await waitForFrameLoad(page, "iframe1");

  // Click account number
  let iframe1 = await page.waitForFrame(async (f) => f.name() === "iframe1");
  await (
    await iframe1.waitForSelector(`xpath///span[text()='${accountNumber}']`)
  )?.click();

  // Click account number again, to get to transactions screen
  await iframe1.waitForNavigation();
  await (
    await iframe1.waitForSelector(`xpath///a[text()='${accountNumber}']`)
  )?.click();
  console.log("Clicked account number");

  // Click on 'Download', and start intercepting requests
  await iframe1.waitForNavigation();
  await (
    await iframe1.waitForSelector(`xpath///span[text()='Download']`)
  )?.click();
  console.log("Clicked Download");

  // Get the filename
  const downloadFilename = await new Promise<string>((resolve, reject) => {
    const handler = async (r: HTTPResponse) => {
      const req = r.request();
      const match = r
        .headers()
        ["content-disposition"]?.match(/filename="(.*)"/);
      if (req.url().includes("https://internet-banking.dbs.com.sg") && match) {
        const filename = match[1];
        if (!filename) {
          reject(
            Error(
              `Could not locate filename in content-disposition: ${
                r.headers()["content-disposition"]
              }`
            )
          );
          return;
        }
        page.off("response", handler);
        resolve(filename);
        return;
      }
    };
    page.on("response", handler);
  });

  console.log(`Downloaded to ${downloadFilename}`);

  // Retrieve from container
  const resp = await fetch(
    `http://browserless:3000/workspace/${downloadFilename}`
  );
  const data = await resp.blob();
  return data.text();
};
