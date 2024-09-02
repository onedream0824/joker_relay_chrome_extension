import { createRoot } from "react-dom/client";
import "@/assets/styles/tailwind.css";

export default function App() {
  return (
    <div className='container p-4'>
      <h2 className='text-2xl text-[#3c3c3c]'>This is Options Page.</h2>
      <p>Hello, Chrome Extension!</p>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <App />
);