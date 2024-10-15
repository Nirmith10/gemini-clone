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
        delayPara(text, index + 1); // Recursive call for the next character
      }, 5); // Adjust the delay time (in milliseconds) as needed
    }
  };

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
  };

  function formatResponse(response) {
    // Format headers (e.g., ## React Hook Forms becomes <h2>React Hook Forms</h2>)
    let formattedResponse = response.replace(/^###?\s+(.*)$/gm, "<h2>$1</h2>");

    // Format sub-headers (e.g., **Key Features:** becomes <span style="font-weight: 600;">Key Features:</span>)
    formattedResponse = formattedResponse.replace(
      /^\*\*(.*?):\*\*/gm,
      '<span style="font-weight: 600;">$1:</span>',
    );

    // Format numbered lists (e.g., 1. Intuitive API becomes <ol><li>Intuitive API</li></ol>)
    formattedResponse = formattedResponse.replace(
      /^\d+\.\s+(.*)$/gm,
      "<ol><li>$1</li></ol>",
    );

    // Combine list items into single list
    formattedResponse = formattedResponse.replace(/<\/ol>\n<ol>/g, "");

    // Format bullet points (e.g., * Works seamlessly with React's functional components becomes <ul><li>Works seamlessly with React's functional components</li></ul>)
    formattedResponse = formattedResponse.replace(
      /^\*\s+(.*)$/gm,
      "<ul><li>$1</li></ul>",
    );

    // Combine bullet points into a single list
    formattedResponse = formattedResponse.replace(/<\/ul>\n<ul>/g, "");

    // Format text semibold (e.g., **text** becomes <span style="font-weight: 600;">text</span>)
    formattedResponse = formattedResponse.replace(
      /\*\*(.*?)\*\*/g,
      '<span style="font-weight: 600;">$1</span>',
    );

    // Format text italic (e.g., *text* becomes <em>text</em>)
    formattedResponse = formattedResponse.replace(/\*(.*?)\*/g, "<em>$1</em>");

    // Add paragraph breaks for better readability
    formattedResponse = formattedResponse.replace(/\n\n/g, "<br><br>");

    // Fix inline code blocks with backticks (e.g., `code` becomes <code>code</code>)
    formattedResponse = formattedResponse.replace(
      /`([^`]+)`/g,
      "<code>$1</code>",
    );

    // Format code blocks (e.g., ```javascript ... ``` becomes <pre><code>...</code></pre>)
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
