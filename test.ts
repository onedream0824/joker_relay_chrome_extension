chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  let status;
  console.log(request.action);
  if (request.action === "Start") {
    status = true;
    if (request.tabId) {
      chrome.scripting
        .executeScript({
          target: { tabId: request.tabId },
          func: main, // Correctly reference the function to execute
          args: [
            request.refreshTime,
            request.payout,
            request.rate,
            request.stop,
            request.stem,
            status,
          ],
        })
        .then(() => sendResponse({ success: true }))
        .catch((err) => sendResponse({ success: false, error: err }));

      return true; // Keep the messaging channel open
    } else {
      sendResponse({ success: false, error: "No tab ID provided" });
      return true;
    }
  }
  if (request.action === "Stop") {
    status = false;
    if (request.tabId) {
      chrome.scripting
        .executeScript({
          target: { tabId: request.tabId },
          func: main, // Correctly reference the function to execute
          args: [
            request.refreshTime,
            request.payout,
            request.rate,
            request.stop,
            request.stem,
            status,
          ],
        })
        .then(() => sendResponse({ success: true }))
        .catch((err) => sendResponse({ success: false, error: err }));

      return true; // Keep the messaging channel open
    } else {
      sendResponse({ success: false, error: "No tab ID provided" });
      return true;
    }
  }
});

function main(
  refreshTime: string,
  payout: string,
  rate: string,
  stop: string,
  stem: string,
  status: boolean
) {
  console.log(payout);
  console.log(rate);
  console.log(stem);
  console.log(stop);
  console.log(status);

  const refreshTimeNum = Number(refreshTime);
  setInterval(() => {
    const button = document.querySelector(
      'button[mdn-popover-offset="-8"]'
    ) as HTMLButtonElement;

    if (button) {
      button.click();
    } else {
      console.error("Button not found!");
    }
  }, refreshTimeNum);
}
