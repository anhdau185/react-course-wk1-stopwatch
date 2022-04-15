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
  const now = useNow();
  const stopwatchState = useRef(STOPWATCH_STATES.INITIAL);
  const timestampOnStart = useRef(now);
  const lastElapsedMs = useRef(0);
  const laps = useRef([]);
  const elapsedMs = (now - timestampOnStart.current) + lastElapsedMs.current;

  return (
    <div className="stopwatch">
      {stopwatchState.current === STOPWATCH_STATES.INITIAL && (
        <>
          <div className="current-state">{stopwatchState.current}</div>
          <div className="time">{'00:00:00.000'}</div>
          <button
            onClick={() => {
              timestampOnStart.current = now;
              stopwatchState.current = STOPWATCH_STATES.RUNNING;
            }}
          >
            Start
          </button>
        </>
      )}
      {stopwatchState.current === STOPWATCH_STATES.RUNNING && (
        <>
          <div className="current-state">{stopwatchState.current}</div>
          <div className="time">{convertTimestampToString(elapsedMs)}</div>
          <button
            onClick={() => {
              lastElapsedMs.current = elapsedMs;
              stopwatchState.current = STOPWATCH_STATES.STOPPED;
            }}
          >
            Stop
          </button>
          <button
            onClick={() => {
              laps.current.push(convertTimestampToString(elapsedMs));
            }}
          >
            Lap
          </button>
        </>
      )}
      {stopwatchState.current === STOPWATCH_STATES.STOPPED && (
        <>
          <div className="current-state">{stopwatchState.current}</div>
          <div className="time">{convertTimestampToString(lastElapsedMs.current)}</div>
          <button
            onClick={() => {
              timestampOnStart.current = now;
              stopwatchState.current = STOPWATCH_STATES.RUNNING;
            }}
          >
            Resume
          </button>
          <button
            onClick={() => {
              laps.current = [];
              lastElapsedMs.current = 0;
              stopwatchState.current = STOPWATCH_STATES.INITIAL;
            }}
          >
            Reset
          </button>
        </>
      )}
      <div className="laps">
        <ul>
          {laps.current.map(
            timestamp => <li>{timestamp}</li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default App;
