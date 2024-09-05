import { createRoot } from "react-dom/client";
import "@/assets/styles/tailwind.css";
import { useEffect, useState } from "react";
// import { Settings } from "lucide-react";
// import Setting from "./Settings";
import Wrongboard from "./Wrongboard";
import Dashboard from "./Dashboard";

export default function App() {
  const [isOnLoadboard, setIsOnLoadboard] = useState(false);
  // const [isSetting, setIsSetting] = useState(false);

  useEffect(() => {
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
  }, []);

  // const handleSetting = () => {
  //   setIsSetting(!isSetting);
  // };

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
        <Dashboard />
      ) : (
        <Wrongboard />
      )}
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);