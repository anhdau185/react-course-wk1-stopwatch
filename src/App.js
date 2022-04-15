import {useEffect, useRef, useState} from 'react';

import { STOPWATCH_STATES, MAX_RECENT_LAPS } from './constants';
import { convertTimestampToString } from './utils';
import './App.css';

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
          <div className="elapsed-time">{convertTimestampToString(0)}</div>
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
          <div className="elapsed-time">{convertTimestampToString(elapsedMs)}</div>
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
              if (laps.current.length >= MAX_RECENT_LAPS) {
                laps.current.pop();
                laps.current.unshift(convertTimestampToString(elapsedMs));
              } else {
                laps.current.unshift(convertTimestampToString(elapsedMs));
              }
            }}
          >
            Lap
          </button>
        </>
      )}
      {stopwatchState.current === STOPWATCH_STATES.STOPPED && (
        <>
          <div className="current-state">{stopwatchState.current}</div>
          <div className="elapsed-time">{convertTimestampToString(lastElapsedMs.current)}</div>
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
      <div className="lap-list">
        <h4>Laps</h4>
        <ul className="laps">
          {laps.current.map(lap => <li key={lap}>{lap}</li>)}
        </ul>
      </div>
    </div>
  );
}

export default App;
