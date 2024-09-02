import { createRoot } from 'react-dom/client';
import "@/assets/styles/tailwind.css";
import { useEffect, useState } from 'react';
import { Settings } from 'lucide-react';

export default function App() {
  const [isOnLoadboard, setIsOnLoadboard] = useState(false);
  const [isSetting, setIsSetting] = useState(false);
  const [buttonTxt, setButtonTxt] = useState("Start");

  async function getCurrentTab() {
    const queryOptions = { active: true, currentWindow: true };
    const [tab] = await chrome.tabs.query(queryOptions);
    return tab;
  }

  const checkCurrentUrl = async () => {
    const tab = await getCurrentTab();
    if (tab.url === 'https://relay.amazon.co.uk/loadboard/search') {
      setIsOnLoadboard(true);
    }
  };

  useEffect(() => {
    checkCurrentUrl();
  }, []);

  const [isOn, setIsOn] = useState(false);
  const [isOn1, setIsOn1] = useState(false);

  const toggleSwitch1 = () => {
    setIsOn(!isOn);
  };
  const toggleSwitch2 = () => {
    setIsOn1(!isOn1);
  };
  const handleSetting = () => {
    setIsSetting(!isSetting);
  }
  const handleStart = () => {
    if (buttonTxt === "Start") {
      setButtonTxt("Stop");
    } else {
      setButtonTxt("Start");
    }
    const refreshInput = document.getElementById('refresh_time') as HTMLInputElement;
    const payoutInput = document.getElementById('payout') as HTMLInputElement;
    const rateInput = document.getElementById('rate') as HTMLInputElement;
    const stopInput = document.getElementById('stop') as HTMLInputElement;
    const stemInput = document.getElementById('stem') as HTMLInputElement;
    const refreshTime = refreshInput ? refreshInput.value : undefined;
    const payout = payoutInput ? payoutInput.value : undefined;
    const rate = rateInput ? rateInput.value : undefined;
    const stop = stopInput ? stopInput.value : undefined;
    const stem = stemInput ? stemInput.value : undefined;
    const autoBook = isOn1;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        const activeTab = tabs[0];
        chrome.runtime.sendMessage({ action: `${buttonTxt}`, tabId: activeTab.id, refreshTime: refreshTime, payout: payout, rate: rate, stop: stop, stem: stem, autoBook });
      } else {
        console.error("No active tab found");
      }
    });
  };


  return (
    <div className="w-[400px] h-auto bg-gray-50 shadow-lg overflow-hidden">

      <div className="p-4 bg-yellow-500 flex justify-between items-center relative">
        <img src="../../assets/icon.png" alt="Description" className="absolute w-12 h-12 left-4" />
        {isSetting ? (
          <div className="text-2xl flex-grow justify-center items-center w-full text-white text-center py-1 font-bold mx-auto">
            Setting
          </div>
        ) : (
          <div className="text-2xl flex-grow justify-center items-center w-full text-white text-center py-1 font-bold mx-auto">
            Joker Relay
          </div>
        )}
        {isOnLoadboard ? (
          <Settings onClick={handleSetting} width={18} color='white' className='absolutew-auto mt-2 right-4' />
        ) : null}
      </div>

      {
        isOnLoadboard ? (
          isSetting ? (
            <div className='bg-yellow-100 p-6 space-y-4 rounded-lg shadow-md'>
              <h3 className="text-lg font-bold text-gray-800">Settings</h3>
              <p className="text-gray-700">Here you can adjust your settings.</p>
              {/* Add your settings components here */}
              <button onClick={handleSetting} className="bg-red-500 text-white rounded px-4 py-2">Close Settings</button>
            </div>
          ) : (
            <div className='bg-yellow-100 p-6 space-y-4 rounded-lg shadow-md'>
              <div className='space-y-4'>
                <div className='flex space-x-4'>
                  <div className='flex-1'>
                    <label className='text-gray-800 text-sm'>Refresher(ms)</label>
                    <input id='refresh_time' className='w-full rounded-lg px-4 py-2 text-sm text-gray-800 border border-yellow-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500' placeholder='5000' />
                  </div>
                  <div className='flex-1'>
                    <label className='text-gray-800 text-sm'>Stop</label>
                    <input id="stop" className='w-full rounded-lg px-4 py-2 text-sm text-gray-800 border border-yellow-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500' placeholder='2' />
                  </div>
                </div>
                <div className='flex space-x-4'>
                  <div className='flex-1'>
                    <label className='text-gray-800 text-sm'>Payout</label>
                    <input id="payout" className='w-full rounded-lg px-4 py-2 text-sm text-gray-800 border border-yellow-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500' placeholder='1000' />
                  </div>
                  <div className='flex-1'>
                    <label className='text-gray-800 text-sm'>Rate</label>
                    <input id="rate" className='w-full rounded-lg px-4 py-2 text-sm text-gray-800 border border-yellow-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500' placeholder='2.2' />
                  </div>
                </div>

                <div className='w-1/2'>
                  <label className='text-gray-800 text-sm'>First Pickup in (min)</label>
                  <input id="stem" className='w-full rounded-lg px-4 py-2 text-sm text-gray-800 border border-yellow-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500' placeholder='10' />
                </div>
              </div>
              <div className='space-y-4'>
                <div className='flex items-center'>
                  <div className='text-sm font-medium text-gray-800'>Randomize</div>
                  <div
                    onClick={toggleSwitch1}
                    className={`ml-auto cursor-pointer w-16 h-8 flex items-center rounded-full p-1 transition-all duration-300 ease-in-out ${isOn ? 'bg-green-500' : 'bg-red-500'}`}
                  >
                    <span className={`text-white text-sm font-semibold ml-2 transition-opacity duration-300 ${isOn ? 'opacity-100' : 'opacity-0'}`}>ON</span>
                    <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${isOn ? 'translate-x-8' : 'translate-x-0'}`} />
                    <span className={`text-white text-sm font-semibold mr-2 transition-opacity duration-300 ${isOn ? 'opacity-0' : 'opacity-100'}`}>OFF</span>
                  </div>
                </div>
                <div className='flex items-center'>
                  <div className='text-sm font-medium text-gray-800'>Auto Book</div>
                  <div
                    onClick={toggleSwitch2}
                    className={`ml-auto cursor-pointer w-16 h-8 flex items-center rounded-full p-1 transition-all duration-300 ease-in-out ${isOn1 ? 'bg-green-500' : 'bg-red-500'}`}
                  >
                    <span className={`text-white text-sm font-semibold ml-2 transition-opacity duration-300 ${isOn1 ? 'opacity-100' : 'opacity-0'}`}>ON</span>
                    <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${isOn1 ? 'translate-x-8' : 'translate-x-0'}`} />
                    <span className={`text-white text-sm font-semibold mr-2 transition-opacity duration-300 ${isOn1 ? 'opacity-0' : 'opacity-100'}`}>OFF</span>
                  </div>
                </div>
              </div>
              <div className='cursor-pointer transition-all duration-300 bg-yellow-500 py-2 text-center text-lg text-white rounded-2xl hover:bg-yellow-400 transform hover:scale-105 hover:shadow-lg hover:rotate-1' onClick={() => { handleStart(); }} >{buttonTxt}</div>
            </div>
          )
        ) : (
          <div className='p-4'>
            <p className="text-sm text-gray-700 leading-relaxed text-center font-medium my-2">
              To start using Joker Relay, please make sure you have logged in to your Amazon load board, and/or refresh the page.
            </p>
          </div>
        )
      }
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <App />
);
