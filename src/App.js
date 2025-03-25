import React, { useState, useEffect, useCallback } from "react";
import "./App.css";

const sampleText = `The quick brown fox jumps over the lazy dog. This is a test to measure how fast you can type within 30 seconds. Typing speed is measured in words per minute (WPM).To improve your speed, practice typing regularly. 
Accuracy is just as important as speed, so focus on both.`;

const TypingSpeedTest = () => {
  const [inputText, setInputText] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTyping, setIsTyping] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [highlightedText, setHighlightedText] = useState([]);

  const calculateWPM = useCallback(() => {
    const wordsTyped = inputText.trim().split(/\s+/).length;
    setWpm(Math.round((wordsTyped * 60) / 30));
  }, [inputText]);

  useEffect(() => {
    let timer;
    if (isTyping && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(timer);
      calculateWPM();
    }
    return () => clearInterval(timer);
  }, [isTyping, timeLeft, calculateWPM]);

  const handleInputChange = (e) => {
    if (!isTyping) setIsTyping(true);
    const userInput = e.target.value;

    // ✅ Ensure text updates properly
    setInputText(userInput);
    setHighlightedText(validateText(userInput));
  };

  const validateText = (input) => {
    return input.split("").map((char, index) => ({
      char,
      correct: sampleText[index] === char,
    }));
  };

  const resetTest = () => {
    setInputText("");
    setTimeLeft(30);
    setIsTyping(false);
    setWpm(0);
    setHighlightedText([]);
  };

  return (
    <div className="typing-test-container">
      <h2 className="typing-test-heading">Typing Speed Test</h2>
      <p className="typing-test-text">{sampleText}</p>

      <div className="typing-text-display">
        {highlightedText.map((charObj, index) => (
          <span
            key={index}
            className={
              charObj.correct ? "typing-text-correct" : "typing-text-wrong"
            }
          >
            {charObj.char}
          </span>
        ))}
      </div>

      <textarea
        className="typing-textarea"
        value={inputText}
        onChange={handleInputChange}
        disabled={timeLeft === 0}
        placeholder="Start typing here..."
      />

      <h3 className="typing-timer">Time Left: {timeLeft} sec</h3>
      {timeLeft === 0 ? (
        <h3 className="typing-speed">Your Typing Speed: {wpm} WPM</h3>
      ) : null}

      <button className="typing-restart-button" onClick={resetTest}>
        Restart
      </button>
    </div>
  );
};

export default TypingSpeedTest;
