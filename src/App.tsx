import DataView from "./features/DataView";

function App() {
  return (
    <div className="flex flex-col justify-between m-auto p-8 md:p-12 w-full h-screen overflow-y-auto bg-zinc-900">
      <DataView />
      <footer className="mt-8 text-center text-zinc-500 cursor-pointer">
        <p className="text-sm hover:text-blue-400 transition-colors duration-200">
          Made by{" "}
          <a
            href="https://danellewessels.com"
            className="font-semibold"
            target="_blank"
          >
            Dan 🐾
          </a>
          {/* <span className="text-zinc-400 "> &copy; 2025</span> */}
        </p>
      </footer>
    </div>
  );
}

export default App;
