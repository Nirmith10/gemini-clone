import { createContext, useState } from "react";
import run from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  const delayPara = (text, index = 0) => {
    if (index < text.length) {
      setTimeout(() => {
        setResultData((prev) => prev + text[index]);
        delayPara(text, index + 1); 
      }, 5);
    }
  };

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
  };

  function formatResponse(response) {
    let formattedResponse = response.replace(/^###?\s+(.*)$/gm, "<h2>$1</h2>");

    formattedResponse = formattedResponse.replace(
      /^\*\*(.*?):\*\*/gm,
      '<span style="font-weight: 600;">$1:</span>',
    );

    formattedResponse = formattedResponse.replace(
      /^\d+\.\s+(.*)$/gm,
      "<ol><li>$1</li></ol>",
    );

    formattedResponse = formattedResponse.replace(/<\/ol>\n<ol>/g, "");

    formattedResponse = formattedResponse.replace(
      /^\*\s+(.*)$/gm,
      "<ul><li>$1</li></ul>",
    );

    formattedResponse = formattedResponse.replace(/<\/ul>\n<ul>/g, "");

    formattedResponse = formattedResponse.replace(
      /\*\*(.*?)\*\*/g,
      '<span style="font-weight: 600;">$1</span>',
    );

    formattedResponse = formattedResponse.replace(/\*(.*?)\*/g, "<em>$1</em>");

    formattedResponse = formattedResponse.replace(/\n\n/g, "<br><br>");

    formattedResponse = formattedResponse.replace(
      /`([^`]+)`/g,
      "<code>$1</code>",
    );

    formattedResponse = formattedResponse.replace(
      /```\s*(.*?)\s*```/gs,
      "<pre><code>$1</code></pre>",
    );

    return formattedResponse;
  }

  const onSent = async () => {
    setResultData("");
    setLoading(true);
    setShowResult(true);

    setRecentPrompt(input);
    setPrevPrompts((prev) => [...prev, input]);

    try {
      const response = await run(input);
      const formattedResponse = formatResponse(response);
      delayPara(formattedResponse);
    } catch {
      const response =
        "**Request time out &#8987; Please try again &#128512;**";
      const formattedResponse = formatResponse(response);
      delayPara(formattedResponse);
    }

    setLoading(false);
    setInput("");
  };

  const getResponse = async (prompt) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);

    try {
      const response = await run(prompt);
      const formattedResponse = formatResponse(response);
      delayPara(formattedResponse);
    } catch {
      const response =
        "**Request time out &#8987; Please try again &#128512;**";
      const formattedResponse = formatResponse(response);
      delayPara(formattedResponse);
    }

    setLoading(false);
    setInput("");
  };

  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    getResponse,
    setInput,
    newChat,
    isDarkMode,
    setIsDarkMode,
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
