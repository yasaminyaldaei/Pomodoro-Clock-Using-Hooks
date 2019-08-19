import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";

import "./styles.css";

function PomodoroApp() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [sessionState, setSessionState] = useState("Start");
  const [timeLeft, setTimeLeft] = useState(sessionLength * 60 * 1000);
  const [timeFormat, setTimeFormat] = useState(formatTime(timeLeft));

  useInterval(() => {
    if (sessionState === "Stop") {
      setTimeLeft(timeLeft - 1000);
      setTimeFormat(formatTime(timeLeft - 1000));
    }
  }, 1000);

  useEffect(() => {
    if (sessionState === "Start") {
      setTimeLeft(sessionLength * 60 * 1000);
      setTimeFormat(formatTime(timeLeft));
    }
  }, [sessionLength, timeLeft, sessionState]);

  return (
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
        timeFormat={timeFormat}
        sessionstate={sessionState}
        onStartStop={() => {
          setSessionState(sessionState === "Start" ? "Stop" : "Start");
        }}
        onReset={() => {
          setSessionLength(25);
          setBreakLength(5);
          setSessionState("Start");
          setTimeFormat(formatTime(25 * 60 * 1000));
        }}
      />
    </div>
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
  return (
    <div className="timer">
      <h2 id="timer-label">Session</h2>
      <div id="time-left">{props.timeFormat}</div>
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
