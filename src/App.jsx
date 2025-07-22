import { useEffect, useState } from "react";
import dayjs from "dayjs";
import "./App.css";

var runWach;

let defaultMinutes = 25;
let defaultBreak = 5;
let interval = 10;

function App() {
  const format = (str) => {
    return str.padStart(2, "0");
  };

  const convert = (num) => {
    let minutes = Math.floor(num / 60);
    let seconds = num % 60;
    return {
      minutes: format(String(minutes)),
      seconds: format(String(seconds)),
    };
  };

  const Timer = {
    value: defaultMinutes * 60,
    session: false,
    time: convert(defaultMinutes * 60),
  };

  const [timer, setTimer] = useState(Timer);
  const [sessionLength, setSessionLength] = useState(defaultMinutes);
  const [breakLength, setBreakLength] = useState(defaultBreak);
  const [running, setRunning] = useState(false);

  const handleClick = () => {
    setRunning(!running);
    if (!running) {
      runWach = setInterval(beginCountdown, interval);
    } else {
      clearInterval(runWach);
    }
  };

  const beginCountdown = () => {
    setTimer((prev) => {
      console.log(prev.value);
      if (prev.value == 0) {
        clearInterval(runWach);
        runWach = setInterval(beginCountdown, interval);

        document.getElementById("beep").play();
        return {
          session: !prev.session,
          value: (prev.session ? sessionLength : breakLength) * 60,
          time: convert((prev.session ? sessionLength : breakLength) * 60),
        };
      }
      return {
        ...prev,
        value: prev.value - 1,
        time: convert(prev.value - 1),
      };
    });
    console.log(`Timer: ${dayjs().format("HH:mm:ss")}, Value: ${timer.value}`);
  };

  const handleStop = () => {
    clearInterval(runWach);
    setRunning(false);
  };

  function handleReset() {
    clearInterval(runWach);
    setRunning(false);

    setSessionLength(25);
    setBreakLength(5);

    setTimer({
      value: defaultMinutes * 60,
      time: convert(25 * 60),
      session: false,
    });

    const audio = document.getElementById("beep");
    audio.pause();
    audio.currentTime = 0;
  }

  function decreaseOrIncreaseSession(inc) {
    // if (sessionLength >= 60) return;
    // if (sessionLength <= 0) return;

    setSessionLength((prev) => {
      return adjust(1, 60, prev, inc);
    });

    setTimer((prev) => {
      // let conv = convert(adjust(60, 60 * 60, prev.value, inc, 60));
      let conv = convert((sessionLength + (inc ? 1 : -1)) * 60);
      conv.seconds = 0;
      return {
        ...prev,
        // value: adjust(60, 60 * 60, prev.value, inc, 60),
        time: {
          minutes: conv.minutes,
          seconds: format(String(conv.seconds)),
        },
      };
    });
  }

  const adjust = (min, max, num, inc, processor = 1) => {
    if (num >= max && inc) return num;
    if (num <= min && !inc) return num;
    return num + (inc ? processor : -processor);
  };

  function incrementOrDecrementBreak(inc) {
    setBreakLength((prev) => {
      return adjust(1, 60, prev, inc);
    });
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
            <div id="session-length">{sessionLength} </div>
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
        <h2 id="timer-label">{!timer.session ? "Session" : "Break"}</h2>
        <div id="time-left">
          {timer.time.minutes}:{timer.time.seconds}
        </div>
        <div>{timer.value}</div>
      </div>
      <div id="start_stop" className="timer-control">
        <span
          id="start_stop"
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
        <audio
          id="beep"
          preload="auto"
          src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
        />
      </div>
    </div>
  );
}

export default App;
