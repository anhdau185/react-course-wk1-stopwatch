import {useEffect, useRef, useState} from 'react';

import './App.css';

const STOPWATCH_STATES = {
  INITIAL: 'initial',
  RUNNING: 'running...',
  STOPPED: 'stopped'
};

const convertTimestampToString = timestamp => {
  // TODO convert this
  return timestamp;
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
  const timeSinceOnClick = convertTimestampToString(now - onStartTimestamp.current);

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
          <div className="time">{timeSinceOnClick}</div>
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
          <div className="time">{onStopTimestamp.current}</div>
          <button
            onClick={() => {
              lapTimestamp.current = [];
              onStopTimestamp.current = 0;
              setCurrentState(STOPWATCH_STATES.INITIAL);
            }}
          >
            Reset
          </button>
          <button
            onClick={() => {
              onStartTimestamp.current = now;
              setCurrentState(STOPWATCH_STATES.RUNNING);
            }}
          >
            Resume
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
