type Props = {
  redirectToLanding: () => void;
};

export default function Pricing({ redirectToLanding }: Props) {
  return (
    <div className="bg-white p-8 space-y-6 rounded-lg shadow-lg transition-transform transform hover:scale-105">
      <h3 className="text-xl font-semibold text-gray-900 text-center">Unlock Joker Relay</h3>
      <p className="text-center text-2xl font-bold text-gray-800">
        $39.9<span className="text-gray-500 text-sm">/Month</span>
      </p>
      <div
        onClick={redirectToLanding}
        className=" cursor-pointer transition-transform duration-300 bg-[#e64a19] py-2 text-center text-lg text-white rounded-2xl hover:bg-[#ff7247] transform hover:scale-105 hover:shadow-lg hover:translate-y-1"
      >
        Purchase Now
      </div>
    </div >
  );
}
