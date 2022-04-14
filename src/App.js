import {useEffect, useRef, useState} from 'react';

import './App.css';

const STOPWATCH_STATES = {
  INITIAL: 'initial',
  RUNNING: 'running...',
  STOPPED: 'stopped'
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
  const onClickTimestamp = useRef(now);
  const timeSinceOnClick = now - onClickTimestamp.current;

  if (currentState === STOPWATCH_STATES.RUNNING) {
    return (
      <div className="stopwatch">
        <div>{timeSinceOnClick}</div>
      </div>
    );
  }

  if (currentState === STOPWATCH_STATES.STOPPED) {
    return (
      <div className="stopwatch">
      </div>
    );
  }

  return (
    <div className="stopwatch">
      <div className="current-state">{currentState}</div>
      <div className="time">{'00:00:00.000'}</div>
      <button
        onClick={() => {
          onClickTimestamp.current = now;
          setCurrentState(STOPWATCH_STATES.RUNNING);
        }}
      >
        Start
      </button>
    </div>
  );
}

export default App;
