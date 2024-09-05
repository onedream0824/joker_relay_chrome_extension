import { createRoot } from "react-dom/client";
import "@/assets/styles/tailwind.css";
import { useEffect, useState } from "react";
// import { Settings } from "lucide-react";
// import Setting from "./Settings";
import Wrongboard from "./Wrongboard";
import Dashboard from "./Dashboard";
import Pricing from "./Pricing";

const LANDING_PAGE_LINK = "https://ea12-191-96-208-68.ngrok-free.app";

export default function App() {
  const [isOnLoadboard, setIsOnLoadboard] = useState(false);
  const [email, setEmail] = useState("");
  const [validate, setValidate] = useState(false);

  useEffect(() => {
    chrome.storage.sync.get(['validate'], function (result) {
      setValidate(result?.validate)
    });

    const checkCurrentUrl = async () => {
      const tab = await getCurrentTab();
      if (tab.url === "https://relay.amazon.co.uk/loadboard/search") {
        setIsOnLoadboard(true);
      } else {
        setIsOnLoadboard(false);
      }
    };

    const getCurrentTab = async () => {
      const queryOptions = { active: true, currentWindow: true };
      const [tab] = await chrome.tabs.query(queryOptions);
      return tab;
    };

    checkCurrentUrl();

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        const activeTab = tabs[0];
        chrome.runtime.sendMessage(
          { action: "GET_EMAIL", tabId: activeTab.id },
          function (response) {
            setEmail(response.email);
          }
        );
      } else {
        console.error("No active tab found");
      }
    });
  }, []);

  useEffect(() => {
    if (email) {
      const fetchData = async () => {
        try {
          const response = await fetch(
            `${LANDING_PAGE_LINK}/api/auth/validate`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email }),
            }
          );

          const data = await response.json();

          setValidate(data);
          chrome.storage.sync.set({ validate: true })
        } catch (error) {
          console.error("Error:", error);
        }
      };
      fetchData();
    }
  }, [email]);

  const redirectToLanding = () => {
    window.open(`${LANDING_PAGE_LINK}`);
  };

  return (
    <div className="w-[400px] h-auto bg-gray-50 shadow-lg overflow-hidden">
      <div className="p-4 bg-[#ff5722] flex justify-between items-center relative">
        <img
          src="../../assets/icon.png"
          alt="Description"
          className="absolute w-12 h-12 left-4"
        />
        <div className="text-2xl flex-grow justify-center items-center w-full text-white text-center py-1 font-bold mx-auto">
          Joker Relay
        </div>
      </div>
      {isOnLoadboard ? (
        validate ?
          <Dashboard /> : <Pricing redirectToLanding={redirectToLanding} />
      ) : (
        <Wrongboard />
      )}
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
