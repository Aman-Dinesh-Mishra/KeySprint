import React, { useState, useEffect, useCallback, useMemo } from "react";
import "./App.css";

const sampleText = `The quick brown fox jumps over the lazy dog. This is a test to measure how fast you can type within 30 seconds. Typing speed is measured in words per minute (WPM). To improve your speed, practice typing regularly. Accuracy is just as important as speed, so focus on both.`;

const TypingSpeedTest = () => {
  const [inputText, setInputText] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTyping, setIsTyping] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [startTime, setStartTime] = useState(null);

  
  const highlightedText = useMemo(() => {
    return inputText.split("").map((char, index) => ({
      char,
      correct: sampleText[index] === char,
    }));
  }, [inputText]);

  const calculateWPM = useCallback(() => {
    const wordsTyped = inputText.trim().split(/\s+/).length;
    setWpm(wordsTyped * 2); 
  }, [inputText]);

  useEffect(() => {
    let timerInterval;
    if (isTyping) {
      if (!startTime) setStartTime(Date.now());

      timerInterval = setInterval(() => {
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        const remainingTime = 30 - elapsedTime;
        if (remainingTime >= 0) {
          setTimeLeft(remainingTime);
        } else {
          clearInterval(timerInterval);
          setTimeLeft(0);
          calculateWPM();
          setIsTyping(false);
        }
      }, 100); 
    }

    return () => clearInterval(timerInterval); 
  }, [isTyping, startTime, calculateWPM]);

  const handleInputChange = (e) => {
    if (!isTyping) setIsTyping(true);
    setInputText(e.target.value);
  };

  const resetTest = () => {
    setInputText("");
    setTimeLeft(30);
    setIsTyping(false);
    setWpm(0);
    setStartTime(null);
  };

  return (
    <div className="typing-test-container">
      <h2 className="typing-test-heading">Typing Speed Test</h2>
      <p className="typing-test-text">{sampleText}</p>

      <div className="typing-text-display">
        {highlightedText.map((charObj, index) => (
          <span
            key={index}
            className={charObj.correct ? "typing-text-correct" : "typing-text-wrong"}
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