import "@/assets/styles/tailwind.css";
import React, { useEffect, useState } from "react";

export default function Dashboard() {
  const [buttonTxt, setButtonTxt] = useState("Start");
  const [isOn, setIsOn] = useState(false); // Randomize
  const [isOn1, setIsOn1] = useState(false); // Auto Book

  const [data, setData] = useState({
    refreshTime: 1000,
    payout: 0,
    rate: 0,
    stop: 0,
    stem: 0,
  });

  useEffect(() => {
    chrome.storage.sync.get(['refreshTime', 'payout', 'rate', 'stop', 'stem', 'autoBook', 'action'], function (result) {
      setData({ refreshTime: result?.refreshTime || 1000, payout: result?.payout || 0, rate: result?.rate || 0, stop: result?.stop || 0, stem: result?.stem || 0 })
      setIsOn1(result?.autoBook || false);
      setButtonTxt(result.action === "Start" ? "Stop" : "Start");
    });

    const listener = (request: { action: string }) => {
      if (request.action === "RefreshStopped") {
        chrome.storage.sync.set({
          action: "Stop",
        })
        setButtonTxt("Start");
      }
    };

    chrome.runtime.onMessage.addListener(listener);

    return () => {
      chrome.runtime.onMessage.removeListener(listener);
    };
  }, [])

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const toggleSwitch1 = () => {
    setIsOn(!isOn);
  };
  const toggleSwitch2 = () => {
    setIsOn1(!isOn1);
  };

  const handleStart = () => {
    if (buttonTxt === "Start") {
      setButtonTxt("Stop");
    } else {
      setButtonTxt("Start");
    }

    const autoBook = isOn1;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        const activeTab = tabs[0];
        chrome.runtime.sendMessage({
          action: `${buttonTxt}`,
          tabId: activeTab.id,
          refreshTime: data.refreshTime,
          payout: data.payout,
          rate: data.rate,
          stop: data.stop,
          stem: data.stem,
          autoBook,
        });

        chrome.storage.sync.set({
          ...data,
          autoBook: autoBook,
          action: `${buttonTxt}`,
        })
      } else {
        console.error("No active tab found");
      }
    });
  };

  return (
    <div className="bg-[#f3f1ef] p-6 space-y-4 rounded-lg shadow-lg">
      <div className="space-y-4">
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="text-gray-700 text-sm">Refresher (ms)</label>
            <input
              id="refresh_time"
              type="number"
              name="refreshTime"
              required={true}
              className="w-full rounded-lg px-4 py-2 text-sm text-gray-800 border border-[#ffccbc] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#bf360c]"
              placeholder="5000"
              value={data.refreshTime}
              onChange={onChange}
            />
          </div>
          <div className="flex-1">
            <label className="text-gray-700 text-sm">Stop</label>
            <input
              id="stop"
              type="number"
              name="stop"
              required={true}
              className="w-full rounded-lg px-4 py-2 text-sm text-gray-800 border border-[#ffccbc] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#bf360c]"
              placeholder="2"
              value={data.stop}
              onChange={onChange}
            />
          </div>
        </div>
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="text-gray-700 text-sm">Payout</label>
            <input
              id="payout"
              type="number"
              name="payout"
              required={true}
              className="w-full rounded-lg px-4 py-2 text-sm text-gray-800 border border-[#ffccbc] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#bf360c]"
              placeholder="1000"
              value={data.payout}
              onChange={onChange}
            />
          </div>
          <div className="flex-1">
            <label className="text-gray-700 text-sm">Rate</label>
            <input
              id="rate"
              type="number"
              name="rate"
              required={true}
              className="w-full rounded-lg px-4 py-2 text-sm text-gray-800 border border-[#ffccbc] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#bf360c]"
              placeholder="2.2"
              value={data.rate}
              onChange={onChange}
            />
          </div>
        </div>

        <div className="w-1/2">
          <label className="text-gray-700 text-sm">First Pickup in (min)</label>
          <input
            id="stem"
            type="number"
            name="stem"
            required={true}
            className="w-full rounded-lg px-4 py-2 text-sm text-gray-800 border border-[#ffccbc] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#bf360c]"
            placeholder="10"
            value={data.stem}
            onChange={onChange}
          />
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center">
          <div className="text-sm font-medium text-gray-800">Randomize</div>
          <div
            onClick={toggleSwitch1}
            className={`ml-auto cursor-pointer w-16 h-8 flex items-center rounded-full p-1 transition-all duration-300 ease-in-out ${isOn ? "bg-[#73bfb8]" : "bg-[#f25c54]"
              }`}
          >
            <span
              className={`text-white text-sm font-semibold ml-2 transition-opacity duration-300 ${isOn ? "opacity-100" : "opacity-0"
                }`}
            >
              ON
            </span>
            <div
              className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${isOn ? "translate-x-8" : "translate-x-0"
                }`}
            />
            <span
              className={`text-white text-sm font-semibold mr-2 transition-opacity duration-300 ${isOn ? "opacity-0" : "opacity-100"
                }`}
            >
              OFF
            </span>
          </div>
        </div>
        <div className="flex items-center">
          <div className="text-sm font-medium text-gray-800">Auto Book</div>
          <div
            onClick={toggleSwitch2}
            className={`ml-auto cursor-pointer w-16 h-8 flex items-center rounded-full p-1 transition-all duration-300 ease-in-out ${isOn1 ? "bg-[#73bfb8]" : "bg-[#f25c54]"
              }`}
          >
            <span
              className={`text-white text-sm font-semibold ml-2 transition-opacity duration-300 ${isOn1 ? "opacity-100" : "opacity-0"
                }`}
            >
              ON
            </span>
            <div
              className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${isOn1 ? "translate-x-8" : "translate-x-0"
                }`}
            />
            <span
              className={`text-white text-sm font-semibold mr-2 transition-opacity duration-300 ${isOn1 ? "opacity-0" : "opacity-100"
                }`}
            >
              OFF
            </span>
          </div>
        </div>
      </div>
      <div
        className="cursor-pointer transition-transform duration-300 bg-[#e64a19] py-2 text-center text-lg text-white rounded-2xl hover:bg-[#ff7247] transform hover:scale-105 hover:shadow-lg hover:translate-y-1"
        onClick={() => {
          handleStart();
        }}
      >
        {buttonTxt}
      </div>

    </div>
  );
}
