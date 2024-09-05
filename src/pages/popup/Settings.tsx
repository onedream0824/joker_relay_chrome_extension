type Props = {
  handleSetting: () => void;
};

export default function Settings({ handleSetting }: Props) {
  return (
    <div className="bg-yellow-100 p-6 space-y-4 rounded-lg shadow-md">
      <h3 className="text-lg font-bold text-gray-800">Settings</h3>
      <p className="text-gray-700">Here you can adjust your settings.</p>
      {/* Add your settings components here */}
      <button
        onClick={handleSetting}
        className="bg-[#FFCCBC] text-white rounded px-4 py-2"
      >
        Close Settings
      </button>
    </div>
  );
}
