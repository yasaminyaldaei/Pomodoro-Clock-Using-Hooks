import React, { useState, useEffect, useRef, useContext } from "react";
import ReactDOM from "react-dom";

import "./styles.css";

const TimeFormatContext = React.createContext();

function PomodoroApp() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [sessionState, setSessionState] = useState("Start");
  const [isTimerRunning, setTimerRunning] = useState(false);
  const [isBreakTime, setBreakTime] = useState(false);
  const [timeLeft, setTimeLeft] = useState(sessionLength * 60 * 1000);
  const [timeFormat, setTimeFormat] = useState(formatTime(timeLeft));
  const [timerLabel, setTimerLabel] = useState("Session");

  useInterval(() => {
    if (sessionState === "Stop") {
      if (timeLeft > 0) {
        setTimeLeft(timeLeft - 1000);
        setTimeFormat(formatTime(timeLeft - 1000));
      } else {
        if (!isBreakTime) {
          setBreakTime(true);
          setTimerLabel("Break");
          setTimeLeft(breakLength * 60 * 1000 + 1000);
        } else {
          setBreakTime(false);
          setTimerLabel("Session");
          setTimeLeft(sessionLength * 60 * 1000 + 1000);
        }
      }
    }
  }, 1000);

  useEffect(() => {
    if (sessionState === "Start" && !isTimerRunning) {
      if (!isBreakTime) {
        setTimeLeft(sessionLength * 60 * 1000);
        setTimeFormat(formatTime(timeLeft));
      } else {
        setTimeLeft(breakLength * 60 * 1000);
        setTimeFormat(formatTime(timeLeft));
      }
    }
  }, [
    sessionLength,
    timeLeft,
    sessionState,
    isTimerRunning,
    isBreakTime,
    breakLength
  ]);

  useEffect(() => {
    if (timeFormat === "00:00") {
      document.getElementById("beep").play();
    }
  });

  return (
    <TimeFormatContext.Provider value={timeFormat}>
      <div className="app">
        <h1>Pomodoro Clock</h1>
        <div className="app-configuration">
          <Length
            name="Break Length"
            length={breakLength}
            labelid="break-label"
            decrementid="break-decrement"
            incrementid="break-increment"
            lengthid="break-length"
            onClickDecrease={() =>
              setBreakLength(breakLength > 1 ? breakLength - 1 : breakLength)
            }
            onClickIncrease={() =>
              setBreakLength(breakLength < 60 ? breakLength + 1 : breakLength)
            }
          />
          <Length
            name="Session Length"
            length={sessionLength}
            labelid="session-label"
            decrementid="session-decrement"
            incrementid="session-increment"
            lengthid="session-length"
            onClickDecrease={() =>
              setSessionLength(
                sessionLength > 1 ? sessionLength - 1 : sessionLength
              )
            }
            onClickIncrease={() =>
              setSessionLength(
                sessionLength < 60 ? sessionLength + 1 : sessionLength
              )
            }
          />
        </div>
        <Timer
          sessionstate={sessionState}
          timerLabel={timerLabel}
          onStartStop={() => {
            setSessionState(sessionState === "Start" ? "Stop" : "Start");
            setTimerRunning(true);
          }}
          onReset={() => {
            setSessionLength(25);
            setBreakLength(5);
            setSessionState("Start");
            setTimerRunning(false);
            setBreakTime(false);
            setTimeLeft(25 * 60 * 1000);
            setTimeFormat(formatTime(25 * 60 * 1000));
            setTimerLabel("Session");
            document.getElementById("beep").pause();
            document.getElementById("beep").currentTime = 0;
          }}
        />
        <audio src="https://goo.gl/65cBl1" id="beep" />
      </div>
    </TimeFormatContext.Provider>
  );
}

function Length(props) {
  return (
    <div className="break-length">
      <h2 id={props.labelid}>{props.name}</h2>
      <div className="length-configuration">
        <button id={props.decrementid} onClick={props.onClickDecrease}>
          &darr;
        </button>
        <p id={props.lengthid}>{props.length}</p>
        <button id={props.incrementid} onClick={props.onClickIncrease}>
          &uarr;
        </button>
      </div>
    </div>
  );
}

function Timer(props) {
  const timeFormat = useContext(TimeFormatContext);
  return (
    <div className="timer">
      <h2 id="timer-label">{props.timerLabel}</h2>
      <div id="time-left">{timeFormat}</div>
      <button id="start_stop" onClick={props.onStartStop}>
        {props.sessionstate}
      </button>

      <button id="reset" onClick={props.onReset}>
        Reset
      </button>
    </div>
  );
}

function formatTime(remainingInMilliseconds) {
  let baseDate = new Date();
  baseDate.setHours(0, 0, 0);

  let remainingDate = new Date(baseDate.getTime() + remainingInMilliseconds);
  let minutes = remainingDate.getMinutes();
  let seconds = remainingDate.getSeconds();

  return (
    (remainingInMilliseconds / (60 * 1000) === 60
      ? "60"
      : minutes < 10
      ? "0" + minutes
      : minutes) +
    ":" +
    (seconds < 10 ? "0" + seconds : seconds)
  );
}

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

const rootElement = document.getElementById("root");
ReactDOM.render(<PomodoroApp />, rootElement);
