import React from "react";
import { getUser } from "./twitterApiClient";

function App() {
  return (
    <div className="h-screen text-center p-10 bg-gradient-to-b from-pink-500 to-pink-400 cursor-default">
      <p className="text-2xl font-bold leading-7 sm:truncate sm:text-3xl sm:tracking-tight">
        Twitter Valentine
      </p>
      <p className="text-sm">Get your twitter valentine</p>
      <button
        className="inline-flex px-5 py-2 bg-pink-600 rounded-md my-5 cursor-pointer"
        onClick={getUser}
      >
        <p>Find my valentine</p>
      </button>
    </div>
  );
}

export default App;
