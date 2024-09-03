let refreshPage: number | undefined; // Declare a variable to hold the interval ID

chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  console.log(request.action);
  if (request.action === "Start") {
    if (request.tabId) {
      chrome.scripting
        .executeScript({
          target: { tabId: request.tabId },
          func: start,
          args: [
            request.refreshTime,
            request.payout,
            request.rate,
            request.stop,
            request.stem,
            request.autoBook,
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
    if (request.tabId) {
      chrome.scripting
        .executeScript({
          target: { tabId: request.tabId },
          func: stop,
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

function start(
  refreshTime: string,
  payout: string,
  rate: string,
  stop: string,
  stem: string,
  autoBook: boolean
) {
  const refreshTimeNum = Number(refreshTime);
  refreshPage = window.setInterval(async () => {
    const count = (await document
      .querySelector(".search-results-summary__result-summary--show p")
      ?.textContent?.split(" ")[3]) as string;
    const matched_loads = await document.querySelectorAll(".load-card");
    for (let index = 0; index < Number(count); index++) {
      if (Number(count) <= index) return;
      const page_start_time =
        (await matched_loads[index].getElementsByClassName(
          "wo-card-header__components"
        )[1]?.textContent) || "";

      const page_stop: string | null = await matched_loads[
        index
      ].getElementsByClassName("css-kabd3k")[1].textContent;

      const page_payout: string | undefined = await matched_loads[index]
        .getElementsByClassName("wo-total_payout")[0]
        ?.textContent?.substr(1);

      const page_rate: string | undefined = await matched_loads[index]
        .getElementsByClassName("wo-card-header__components")[6]
        ?.textContent?.split("/")[0]
        .substr(1);

      console.log("Refresh: ", refreshTime);
      console.log("Stop: ", stop);
      console.log("Payout: ", payout);
      console.log("Rate: ", rate);
      console.log("Auto: ", autoBook);

      if (
        autoBook &&
        Number.parseFloat(payout) <= Number.parseFloat(page_payout || "0") &&
        Number.parseFloat(rate) <= Number.parseFloat(page_rate || "0") &&
        Number.parseFloat(stop) <= Number.parseFloat(page_stop || "0")
      ) {
        const currentYear = new Date().getFullYear();
        const startDate = new Date(
          `${page_start_time.replace("BST", "+0100")} ${currentYear}`
        );
        const currentDate = new Date();
        const leftMinutes =
          (startDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60);

        console.log("Left mins: ", leftMinutes);

        if (leftMinutes > Number(stem)) {
          const open_button = matched_loads[index].getElementsByClassName(
            "css-e9glob"
          )[0] as HTMLElement;
          open_button.click();

          const selectedWorkSheet = await document.getElementById(
            "selected-work-sheet"
          );
          if (selectedWorkSheet) {
            const bookBtn = selectedWorkSheet.querySelector(
              "button.css-1lpvuz4"
            ) as HTMLButtonElement;
            bookBtn.click();

            const confirmNoBtn = selectedWorkSheet.querySelector(
              "button.css-1r6inv4"
            ) as HTMLButtonElement;
            confirmNoBtn.click();

            // Click confirm btn
            // const confirmBtn = selectedWorkSheet.querySelector('button.css-n0loux') as HTMLButtonElement;
            // confirmBtn.click();
          }
        }
      }
    }

    // const button = document.querySelector(
    //   'button[mdn-popover-offset="-8"]'
    // ) as HTMLButtonElement;

    // if (button) {
    //   button.click();
    // } else {
    //   console.error("Button not found!");
    // }
  }, refreshTimeNum);
}

function stop() {
  console.log("stop clicked");

  if (refreshPage) {
    clearInterval(refreshPage);
    refreshPage = undefined;
  }
}
