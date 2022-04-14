import {useEffect, useRef, useState} from 'react';

import './App.css';

const STOPWATCH_STATES = {
  INITIAL: 'initial',
  RUNNING: 'running...',
  STOPPED: 'stopped'
};

const padStartNumber = (number, digits = 2) => number.toString().padStart(digits, '0');

const convertTimestampToString = milliseconds => {
  let seconds = ~~(milliseconds / 1000);
  const rMilliseconds = milliseconds % 1000;

  const hh = ~~(seconds / 3600);
  seconds -= hh;
  const mm = ~~(seconds / 60);
  seconds -= mm;
  return `${[hh, mm, seconds]
    .map(number => padStartNumber(number))
    .join(':')}:${padStartNumber(rMilliseconds, 3)}`; // only milliseconds require 3 digits, so here we are...
};

const useNow = () => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    let id;
    const repaint = () => {
      setNow(Date.now());
      id = requestAnimationFrame(repaint);
    };

    repaint();

    return () => {
      cancelAnimationFrame(id);
    };
  }, []);

  return now;
};

const App = () => {
  const [currentState, setCurrentState] = useState(STOPWATCH_STATES.INITIAL);
  const now = useNow();
  const onStartTimestamp = useRef(now);
  const lapTimestamp = useRef([]);
  const onStopTimestamp = useRef(0);
  const timeSinceOnClick = now - onStartTimestamp.current + onStopTimestamp.current;

  return (
    <div className="stopwatch">
      {currentState === STOPWATCH_STATES.INITIAL && (
        <>
          <div className="current-state">{currentState}</div>
          <div className="time">{'00:00:00.000'}</div>
          <button
            onClick={() => {
              onStartTimestamp.current = now;
              setCurrentState(STOPWATCH_STATES.RUNNING);
            }}
          >
            Start
          </button>
        </>
      )}
      {currentState === STOPWATCH_STATES.RUNNING && (
        <>
          <div className="current-state">{currentState}</div>
          <div className="time">{convertTimestampToString(timeSinceOnClick)}</div>
          <button
            onClick={() => {
              onStopTimestamp.current = timeSinceOnClick;
              setCurrentState(STOPWATCH_STATES.STOPPED);
            }}
          >
            Stop
          </button>
          <button
            onClick={() => {
              lapTimestamp.current.push(convertTimestampToString(timeSinceOnClick));
            }}
          >
            Lap
          </button>
        </>
      )}
      {currentState === STOPWATCH_STATES.STOPPED && (
        <>
          <div className="current-state">{currentState}</div>
          <div className="time">{convertTimestampToString(onStopTimestamp.current)}</div>
          <button
            onClick={() => {
              onStartTimestamp.current = now;
              setCurrentState(STOPWATCH_STATES.RUNNING);
            }}
          >
            Resume
          </button>
          <button
            onClick={() => {
              lapTimestamp.current = [];
              onStopTimestamp.current = 0;
              setCurrentState(STOPWATCH_STATES.INITIAL);
            }}
          >
            Reset
          </button>
        </>
      )}
      <div className="laps">
        <ul>
          {lapTimestamp.current.map(
            timestamp => <li>{timestamp}</li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default App;
