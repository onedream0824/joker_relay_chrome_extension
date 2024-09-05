type Props = {
  redirectToLanding: () => void;
};

export default function Pricing({ redirectToLanding }: Props) {
  return (
    <div className="bg-yellow-100 p-6 space-y-4 rounded-lg shadow-md">
      <h3 className="text-lg font-bold text-gray-800">Pricing</h3>
      {/* Add your settings components here */}
      <button
        onClick={redirectToLanding}
        className="bg-red-500 text-white rounded px-4 py-2"
      >
        Purchase
      </button>
    </div>
  );
}
