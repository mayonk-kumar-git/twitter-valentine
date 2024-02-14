import React, { useState } from "react";
import { findValentine } from "./twitterApiClient";

const defaultUserAvatar =
  "https://cdn-icons-png.flaticon.com/512/124/124021.png";
const defaultValentineAvatar =
  "https://i.pinimg.com/736x/21/10/24/211024e6dcded50ccf0f2d2131dde1de.jpg";
function App() {
  const [username, setUsername] = useState("");
  const [valentineUsername, setValentineUsername] = useState("sue");
  const [userAvatar, setUserAvatar] = useState(defaultUserAvatar);
  const [valentineAvatar, setValentineAvatar] = useState(
    defaultValentineAvatar
  );
  const [loading, setLoading] = useState(100);

  const handleFindValentine = () => {
    // findValentine(
    //   username,
    //   setValentineUsername,
    //   setUserAvatar,
    //   setValentineAvatar,
    //   setLoading
    // );
  };

  const handleFindValentinesValentine = () => {
    setValentineAvatar(defaultValentineAvatar);
    setUsername(valentineUsername);
    // findValentine(
    //   valentineUsername,
    //   setValentineUsername,
    //   setUserAvatar,
    //   setValentineAvatar,
    //   setLoading
    // );
  };

  return (
    // <div className="h-screen text-center p-10 bg-gradient-to-b from-gray-500 to-gray-400 cursor-default">
    <div className="h-screen text-center p-10 bg-gradient-to-b from-pink-500 to-pink-400 cursor-default flex flex-col justify-center align-middle">
      <p className="text-2xl font-bold leading-7 sm:truncate sm:text-3xl sm:tracking-tight">
        Twitter Valentine
        {/* Twitter Valentine */}
      </p>
      <p className="text-sm">Get your twitter valentine</p>
      <input
        type="text"
        className="block mx-auto mt-10 mb-5 px-4 py-2 rounded-md bg-pink-400 text-white focus:outline-none placeholder:text-white"
        placeholder="@username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button
        // className="inline-flex px-5 py-2 bg-gray-600 rounded-md my-5 cursor-pointer"
        className="inline-flex px-5 py-2 bg-pink-600 rounded-md cursor-pointer max-w-52 justify-center align-middle mx-auto"
        // onClick={handleFindValentine}
      >
        <p>Find my valentine</p>
      </button>

      <div className="flex flex-row-reverse justify-center my-10">
        <img
          src={valentineAvatar}
          alt="valentine avatar"
          width={200}
          height={200}
          className="rounded-full max-w-[50vw] max-h-[50vw] border-white border-4 -translate-x-4"
        />
        <img
          src={userAvatar}
          alt="user avatar"
          width={200}
          height={200}
          className="rounded-full max-w-[50vw] max-h-[50vw] border-white border-4 translate-x-4"
        />
      </div>

      <div>
        {loading >= 100 ? (
          <>
            {valentineUsername && (
              <div className="flex flex-col">
                <a
                  href={`https://twitter.com/${valentineUsername}`}
                  target="_blank"
                  className="hover:text-pink-200"
                >
                  <p>{`🔗 @${valentineUsername}`}</p>
                </a>
                <button
                  // className="inline-flex px-5 py-2 bg-gray-600 rounded-md my-5 cursor-pointer"
                  className="inline-flex px-5 py-2 my-2 bg-pink-600 rounded-md cursor-pointer max-w-52 justify-center align-middle mx-auto"
                  // onClick={handleFindValentinesValentine}
                >
                  <p>{`Find @${valentineUsername} valentine`}</p>
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="inline-flex px-14 py-2 bg-pink-500 rounded-md cursor-pointer justify-center align-middle mx-auto">
              <svg
                className="animate-spin h-5 w-5 mr-3 border-t-2 border-r-2 rounded-full "
                viewBox="0 0 24 24"
              ></svg>
              {`${loading} %`}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
