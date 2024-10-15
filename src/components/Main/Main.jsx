import React, { useContext } from "react";
import "./Main.css";
import { assets } from "../../assets/assets";
import { Context } from "../../context/Context";

export const Main = () => {
  const {
    onSent,
    recentPrompt,
    setPrevPrompts,
    showResult,
    loading,
    resultData,
    setInput,
    input,
    getResponse,
    setRecentPrompt,
    isDarkMode,
    setIsDarkMode,
    newChat,
  } = useContext(Context);

  const loadPrompt = async (prompt) => {
    setPrevPrompts((prev) => [...prev, prompt]);
    setRecentPrompt(prompt);
    await getResponse(prompt);
  };

  return (
    <div className={`main ${isDarkMode ? "dark-mode" : ""}`}>
      <div className="nav">
        <p>Gemini</p>
        <div className="nav-options">
          {isDarkMode ? (
            <img
              onClick={() => setIsDarkMode((curr) => !curr)}
              className="light"
              src={assets.light_mode}
              alt=""
            />
          ) : (
            <img
              onClick={() => setIsDarkMode((curr) => !curr)}
              className="dark"
              src={assets.dark_mode}
              alt=""
            />
          )}
          <img src={assets.user_icon} alt="" />
        </div>
      </div>
      <div className="main-container">
        {!showResult ? (
          <>
            <div className="greet">
              <p>
                <span>Hello, there</span>
              </p>
              <p>How can I help you today?</p>
            </div>
            <div className="cards">
              <div
                onClick={() =>
                  loadPrompt(
                    "Suggest beautiful places to see on an upcoming road trip",
                  )
                }
                className="card"
              >
                <p>Suggest beautiful places to see on an upcoming road trip</p>
                <img src={assets.compass_icon} alt="" />
              </div>
              <div
                onClick={() =>
                  loadPrompt("Briefly summarize this concept: uraban planning")
                }
                className="card"
              >
                <p>Briefly summarize this concept: uraban planning</p>
                <img src={assets.bulb_icon} alt="" />
              </div>
              <div
                onClick={() =>
                  loadPrompt(
                    "Brainstorm team bonding activities for our work retreat",
                  )
                }
                className="card"
              >
                <p>Brainstorm team bonding activities for our work retreat</p>
                <img src={assets.message_icon} alt="" />
              </div>
              <div
                onClick={() =>
                  loadPrompt("Improve the readability of the following code")
                }
                className="card"
              >
                <p>Improve the readability of the following code</p>
                <img src={assets.code_icon} alt="" />
              </div>
            </div>
          </>
        ) : (
          <div className="result">
            <div className="result-title">
              <img src={assets.user_icon} className="user-icon" alt="" />
              <p>{recentPrompt}</p>
            </div>
            <div className="result-data">
              <img src={assets.gemini_icon} alt="" />
              {loading ? (
                <div className="loader">
                  <hr />
                  <hr className="second" />
                  <hr className="third" />
                </div>
              ) : (
                <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
              )}
            </div>
          </div>
        )}
        <div className="main-bottom">
          <div className="search-box">
            <input
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && input) {
                  onSent();
                }
              }}
              value={input}
              type="text"
              placeholder="Enter a prompt here"
            />
            <div>
              <img className="options" src={assets.gallery_icon} alt="" />
              <img className="options" src={assets.mic_icon} alt="" />
              <img
                className="new-tab"
                onClick={newChat}
                src={assets.plus_icon}
                alt=""
              />
              {input && loading == false ? (
                <img onClick={onSent} src={assets.send_icon} alt="" />
              ) : null}
            </div>
          </div>
          <p className="bottom-info">
            Gemini may display inaccurate info, including about people, so
            double-check its responses. Your privacy & Gemini Apps
          </p>
        </div>
      </div>
    </div>
  );
};
