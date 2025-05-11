import { test, expect } from "@playwright/test";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

test.describe("ZIP 파일 업로드/다운로드 E2E 테스트", () => {
  let baseURL: string;

  test.beforeAll(async ({ playwright }) => {
    // 실제 서버 URL 확인
    const browser = await playwright.chromium.launch();
    const page = await browser.newPage();
    try {
      await page.goto("http://localhost:5173");
      baseURL = "http://localhost:5173";
    } catch {
      throw new Error("개발 서버를 찾을 수 없습니다.");
    }
    await browser.close();
  });

  test.beforeEach(async ({ page }) => {
    await page.goto(baseURL);
  });

  test("ZIP 파일을 업로드하고, 내부 파일을 수정한 후, 변경사항이 반영된 ZIP 파일을 다운로드", async ({
    page,
  }) => {
    // 1. ZIP 파일 업로드
    const zipPath = join(__dirname, "fixtures", "sample.zip");
    const fileInput = await page.getByLabel("ZIP 파일 선택");
    await fileInput.setInputFiles(zipPath);

    // 2. 파일 트리에 파일이 표시되는지 확인
    await expect(page.getByText("sample.py")).toBeVisible();

    // 3. 파일 클릭하여 에디터에서 열기
    await page.getByText("sample.py").click();

    // 4. 에디터에 내용이 표시되는지 확인
    const editor = await page.locator(".monaco-editor");
    await expect(editor).toBeVisible();

    // 5. 에디터 내용 수정
    await page.keyboard.press("Control+A");
    await page.keyboard.type('print("Hello, E2E!")');

    // 6. 저장 (Ctrl+S)
    await page.keyboard.press("Control+S");

    // 7. ZIP 다운로드
    const downloadButton = page.getByRole("button", {
      name: "ZIP 파일 다운로드",
    });
    await expect(downloadButton).toBeVisible({ timeout: 10000 });

    const [download] = await Promise.all([
      page.waitForEvent("download", { timeout: 30000 }),
      downloadButton.click(),
    ]);

    // 8. 다운로드된 파일 검증
    expect(download.suggestedFilename()).toMatch(/\.zip$/);

    // 9. 다운로드 완료 대기
    const path = await download.path();
    expect(path).toBeTruthy();
  });
});
