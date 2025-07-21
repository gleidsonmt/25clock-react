import { useEffect, useState } from "react";
import dayjs from "dayjs";
import "./App.css";

var runWach;
let minutos = 59;
let pausa = 5;

let test = true;

function App() {
  const format = (str) => {
    return str.padStart(2, "0");
  };

  const [sectionLength, setSectionLength] = useState(minutos);
  const [breakLength, setBreakLength] = useState(pausa);

  const [minutes, setMinutes] = useState(format(String(sectionLength)));
  const [seconds, setSeconds] = useState(format(String(0)));
  const [running, setRunning] = useState(false);

  const [sessionBreak, setSessionBreak] = useState(false);

  let days = dayjs().minute(minutes).second(seconds);

  const handleClick = () => {
    setRunning(!running);
    console.log(running);
    if (running) {
      clearInterval(runWach);
    } else {
      runWach = setInterval(beginCountdown, 100);
    }
  };

  const beginCountdown = () => {
    days = days.subtract(1, "second");

    if (days.second() == "59") {
      setMinutes(format(String(days.minute())));
    }
    setSeconds(String(days.second()).padStart(2, "0"));

    if (days.minute() == "00" && days.second() == "00") {
      // handleStop();
      // if (sessionBreak) {
      //   days = days.minute(minutes);
      // } else {
      test = !test;
      setSessionBreak(test);
      console.log(test);
      days = days.minute(breakLength);

      // }
      // setMinutes(format(String(days.minute())));
      // clearInterval(runWach);
    }
  };

  const handleStop = () => {
    clearInterval(runWach);
    setRunning(false);
  };

  function handleReset() {
    clearInterval(runWach);
    setRunning(false);
    setMinutes(String(minutos).padStart(2, "0"));
    setSeconds(String(pausa).padStart(2, "0"));
    setSectionLength(minutos);
    setBreakLength(pausa);
    days = dayjs().minute(minutes).second(seconds);
  }

  function decreaseOrIncreaseSession(inc) {
    if (inc) {
      if (sectionLength <= 60) {
        setSectionLength(sectionLength + 1);
        setMinutes(sectionLength + 1);
      }
      console.log(sectionLength + 1);
      if (sectionLength + 1 == 60) {
        console.log("60x");
        days = days.hour(1);
      } else {
        days = days.minute(sectionLength + 1).second(0);
      }
    } else {
      if (sectionLength > 1) {
        days = days.minute(sectionLength - 1).second(0);
        setSectionLength(sectionLength - 1);
      }
    }
    setMinutes(String(days.minute()).padStart(2, "0"));
    setSeconds(String(days.second()).padStart(2, "0"));
  }

  function incrementOrDecrementBreak(inc) {
    if (inc) {
      if (breakLength < 60) {
        setBreakLength(breakLength + 1);
      }
    } else {
      if (breakLength > 1) {
        setBreakLength(breakLength - 1);
      }
    }
  }

  return (
    <div id="wrapper">
      <h1 id="title">25 + 5 Clock</h1>
      <div className="controls">
        <div className="length-control">
          <h2 id="break-label">Break Length</h2>
          <div className="length-session">
            <button
              className="material-symbols-outlined arrow"
              id="break-decrement"
              disabled={running}
              onClick={() => incrementOrDecrementBreak(false)}
            >
              arrow_downward_alt
            </button>
            <div id="break-length">{breakLength}</div>
            <button
              id="break-increment"
              className="material-symbols-outlined arrow"
              disabled={running}
              onClick={() => incrementOrDecrementBreak(true)}
            >
              arrow_upward_alt
            </button>
          </div>
        </div>

        <div className="length-control">
          <h2 id="session-label">Session Length</h2>
          <div className="length-session">
            <button
              id="session-decrement"
              className="material-symbols-outlined arrow"
              onClick={() => decreaseOrIncreaseSession(false)}
              disabled={running}
            >
              arrow_downward_alt
            </button>
            <div id="session-length">{sectionLength}</div>
            <button
              id="session-increment"
              className="material-symbols-outlined arrow"
              onClick={() => decreaseOrIncreaseSession(true)}
              disabled={running}
            >
              arrow_upward_alt
            </button>
          </div>
        </div>
      </div>
      <div className="timer">
        <h2 id="timer-label">{!sessionBreak ? "Session" : "Break"}</h2>
        <div id="time-left">
          {minutes}:{seconds}
        </div>
      </div>
      <div id="start_stop" className="timer-control">
        <span
          // id="start_stop"
          className="material-symbols-outlined arrow control"
          onClick={handleClick}
        >
          play_arrow
        </span>
        <span
          onClick={handleStop}
          className="material-symbols-outlined arrow control"
        >
          pause
        </span>
        <span
          id="reset"
          onClick={handleReset}
          className="material-symbols-outlined arrow control"
        >
          autorenew
        </span>
      </div>
    </div>
  );
}

export default App;
