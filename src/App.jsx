import React from "react";
import { findValentine } from "./twitterApiClient";

function App() {
  return (
    // <div className="h-screen text-center p-10 bg-gradient-to-b from-pink-500 to-pink-400 cursor-default">
    <div className="h-screen text-center p-10 bg-gradient-to-b from-gray-500 to-gray-400 cursor-default">
      <p className="text-2xl font-bold leading-7 sm:truncate sm:text-3xl sm:tracking-tight">
        Twitter
        {/* Twitter Valentine */}
      </p>
      {/* <p className="text-sm">Get your twitter valentine</p> */}
      <p className="text-sm">Get your twitter asdternkr</p>
      <button
        className="inline-flex px-5 py-2 bg-gray-600 rounded-md my-5 cursor-pointer"
        // className="inline-flex px-5 py-2 bg-pink-600 rounded-md my-5 cursor-pointer"
        onClick={findValentine}
      >
        <p>Find my valentine</p>
      </button>
    </div>
  );
}

export default App;
