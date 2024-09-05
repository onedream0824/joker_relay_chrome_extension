let refreshPage: number | null; // Declare a variable to hold the interval ID

chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  if (request.action === "Start") {
    if (request.tabId) {
      let autoBook = false;
      if (request.autoBook == undefined) autoBook = false;
      else autoBook = request.autoBook;
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
            autoBook,
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
  if (request.action === "GET_EMAIL") {
    if (request.tabId) {
      chrome.scripting
        .executeScript({
          target: { tabId: request.tabId },
          func: getEmail,
        })
        .then((results) => sendResponse({ email: results[0].result }))
        .catch((err) => sendResponse({ success: false, error: err }));

      return true;
    } else {
      sendResponse({ success: false, error: "No tab ID provided" });
      return true;
    }
  }
});

function getEmail() {
  const email = (document.getElementById("case-user-email") as HTMLInputElement)
    .value;
  return email;
}

function start(
  refreshTime: string,
  payout: string,
  rate: string,
  stop: string,
  stem: string,
  autoBook: boolean
) {
  const refreshTimeNum = Number(refreshTime);

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const playBellSound = () => {
    const audio = new Audio(chrome.runtime.getURL("src/assets/bell.wav"));
    audio.play().catch((error) => {
      console.error("Error playing sound:", error);
    });
  };

  const button = document.querySelector(
    'button[mdn-popover-offset="-8"]'
  ) as HTMLButtonElement;

  if (button) {
    button.click();
  } else {
    console.error("Button not found!");
  }

  refreshPage = window.setInterval(async () => {
    const count = document
      .querySelector(".search-results-summary__result-summary--show p")
      ?.textContent?.split(" ")[3] as string;

    const resultSummaryPanel = document
      .querySelector(".css-ftr0v1")
      ?.querySelectorAll(".css-1ehu6yl")[1] as HTMLElement;

    const loadCards = resultSummaryPanel.querySelectorAll(".load-card");
    const highlightCards = resultSummaryPanel.querySelectorAll(
      ".wo-card-header--highlighted"
    );

    const matched_loads = [...loadCards, ...highlightCards];

    console.log(loadCards.length, highlightCards.length, matched_loads.length);

    if (autoBook) {
      for (let index = 0; index < Number(count); index++) {
        if (Number(count) <= index) return;

        const page_start_time =
          matched_loads[index].getElementsByClassName(
            "wo-card-header__components"
          )[1]?.textContent || "";

        const page_stop: string | null =
          matched_loads[index].getElementsByClassName("css-kabd3k")[1]
            .textContent;

        const page_payout: string | undefined = (
          matched_loads[index].getElementsByClassName("wo-total_payout")[0] ||
          matched_loads[index].getElementsByClassName(
            "wo-total_payout__modified-load-increase-attr"
          )[0]
        )?.textContent?.substr(1);

        const page_rate: string | undefined = matched_loads[index]
          .getElementsByClassName("wo-card-header__components")[6]
          ?.textContent?.split("/")[0]
          .substr(1);

        console.log("Refresh: ", refreshTime, refreshTimeNum);
        console.log(
          "Stop: ",
          stop,
          page_stop,
          Number.parseFloat(stop) <= Number.parseFloat(page_stop || "0")
        );
        console.log(
          "Payout: ",
          payout,
          page_payout,
          Number.parseFloat(payout) <= Number.parseFloat(page_payout || "0")
        );
        console.log(
          "Rate: ",
          rate,
          page_rate,
          Number.parseFloat(rate) <= Number.parseFloat(page_rate || "0")
        );

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

          console.log("Left mins: ", leftMinutes, stem);

          if (leftMinutes < Number(stem)) {
            const open_button = matched_loads[index].getElementsByClassName(
              "css-e9glob"
            )[0] as HTMLElement;

            open_button.click();

            await sleep(500);

            const selectedWorkSheet = document.getElementById(
              "selected-work-sheet"
            ) as HTMLElement;

            console.log("Select: ", selectedWorkSheet);

            if (selectedWorkSheet) {
              const bookBtn = selectedWorkSheet.querySelector(
                "button.wo-book-button.css-1lpvuz4"
              ) as HTMLButtonElement;

              console.log("Book btn: ", bookBtn);

              bookBtn.click();

              // const confirmNoBtn = selectedWorkSheet.querySelector(
              //   "button.css-1r6inv4"
              // ) as HTMLButtonElement;
              // confirmNoBtn.click();

              // Click confirm btn
              // const confirmBtn = selectedWorkSheet.querySelector('button.css-n0loux') as HTMLButtonElement;
              // confirmBtn.click();

              if (refreshPage !== null) {
                clearInterval(refreshPage);
                refreshPage = null;
                chrome.runtime.sendMessage({ action: "RefreshStopped" });
              }

              playBellSound();
              break;
            }
          }
        }
      }
    } else {
      const button = document.querySelector(
        'button[mdn-popover-offset="-8"]'
      ) as HTMLButtonElement;

      if (button) {
        button.click();
      } else {
        console.error("Button not found!");
      }
    }
  }, refreshTimeNum);
}

function stop() {
  console.log("stop clicked");

  if (refreshPage) {
    clearInterval(refreshPage);
    refreshPage = null;
  }
}
