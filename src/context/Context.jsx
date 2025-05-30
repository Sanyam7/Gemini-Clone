import { createContext, useState, useEffect } from "react";
import runChat from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {

    const [prevPrompts, setPrevPrompts] = useState([]);
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [showResult, setShowResult] = useState(false)
    const [loading, setLoading] = useState(false)
    const [resultData, setResultData] = useState("")


  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(`${theme}-theme`);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

    function delayPara(index, nextWord) {
        setTimeout(function () {
            setResultData(prev => prev + nextWord)
        }, 75 * index);
    }

    const onEnter = async (prompt, event) => {
        if (event.key === 'Enter'){
            setResultData("")
        setLoading(true)
        setShowResult(true)
        let response;
        if (prompt !== undefined) {
            response = await runChat(prompt);
            setRecentPrompt(prompt)
        }
        else {
            setPrevPrompts(prev => [...prev, input]);
            setRecentPrompt(input)
            response = await runChat(input);
        }
        let responseArray = response.split('**');
        let newArray = "";
        for (let i = 0; i < responseArray.length; i++) {
            if (i === 0 || i % 2 !== 1) {
                newArray += responseArray[i]
            }
            else {
                newArray += "<b>" + responseArray[i] + "</b>"
            }
        }
        console.log(newArray);
        responseArray = newArray.split('*').join("</br>").split(" ");
        for (let i = 0; i < responseArray.length; i++) {
            const nextWord = responseArray[i];
            delayPara(i, nextWord + " ")
        }
        setLoading(false);
        setInput("")
        }
    }

    const onSent = async (prompt) => {

        setResultData("")
        setLoading(true)
        setShowResult(true)
        let response;
        if (prompt !== undefined) {
            response = await runChat(prompt);
            setRecentPrompt(prompt)
        }
        else {
            setPrevPrompts(prev => [...prev, input]);
            setRecentPrompt(input)
            response = await runChat(input);
        }
        let responseArray = response.split('**');
        let newArray = "";
        for (let i = 0; i < responseArray.length; i++) {
            if (i === 0 || i % 2 !== 1) {
                newArray += responseArray[i]
            }
            else {
                newArray += "<b>" + responseArray[i] + "</b>"
            }
        }
        console.log(newArray);
        responseArray = newArray.split('*').join("</br>").split(" ");
        for (let i = 0; i < responseArray.length; i++) {
            const nextWord = responseArray[i];
            delayPara(i, nextWord + " ")
        }
        setLoading(false);
        setInput("")
    }

    const newChat = async () => {
        setLoading(false);
        setShowResult(false);
    }

    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        onEnter,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat,
        toggleTheme,
        theme
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider