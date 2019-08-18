import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";

function PomodoroApp() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [isBreakTime, setBreakTime] = useState(false);
  const [sessionState, setSessionState] = useState("Start");

  return (
    <div class="app">
      <h1>Pomodoro Clock</h1>
      <div class="app-configuration">
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
        sessionLength={sessionLength}
        sessionstate={sessionState}
        onStartStop={() => {
          setSessionState(sessionState === "Start" ? "Stop" : "Start");
        }}
        onReset={() => {
          setSessionLength(25);
          setBreakLength(5);
          setTimeFormat(formatTime(25 * 60 * 1000));
        }}
      />
    </div>
  );
}

function Length(props) {
  return (
    <div class="break-length">
      <h2 id={props.labelid}>{props.name}</h2>
      <div class="length-configuration">
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
  const [timeLeft, setTimeLeft] = useState(25 * 60 * 1000);
  const [timeFormat, setTimeFormat] = useState(formatTime(timeLeft));

  useInterval(() => {
    setTimeLeft(timeLeft - 1000);
    setTimeFormat(formatTime(timeLeft - 1000));
  }, 1000);

  return (
    <div class="timer">
      <h2 id="timer-label">Session</h2>
      <div id="time-left">{timeFormat}</div>
      <h3>
        <button id="start_stop" onClick={props.onStartStop}>
          {props.sessionstate}
        </button>
      </h3>
      <h4>
        <button id="reset" onClick={props.onReset}>
          Reset
        </button>
      </h4>
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
    (minutes === 0 ? "60" : minutes < 10 ? "0" + minutes : minutes) +
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
