type Props = {
  handleSetting: () => void;
  redirectToLanding: () => void;
};

export default function Settings({ handleSetting, redirectToLanding }: Props) {
  return (
    <div className="bg-yellow-100 p-6 space-y-4 rounded-lg shadow-lg transition-transform transform hover:scale-105">
      <h3 className="text-xl text-center font-semibold text-gray-900 mb-22">Settings</h3>
      <div className="flex w-full ">
        <button
          className="bg-[#e64a19] mx-auto text-white rounded-lg px-6 py-3 transition-colors hover:bg-[#d45a1f] focus:outline-none focus:ring-2 focus:ring-[#e64a19] focus:ring-opacity-50"
          onClick={redirectToLanding}
        >
          Refund
        </button>
        <button
          onClick={handleSetting}
          className="bg-gradient-to-r from-[#73bfb8] to-[#4a9d9e] mx-auto text-white rounded-lg px-6 py-3 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#73bfb8] focus:ring-opacity-50"
        >
          Return
        </button>
      </div>
    </div>
  );
}
