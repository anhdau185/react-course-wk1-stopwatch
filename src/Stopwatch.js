import React from 'react';

import { STOPWATCH_STATES } from './constants';
import { convertTimestampToString } from './utils';
import './Stopwatch.css';

const Stopwatch = ({ currentState, elapsedMs, actionButtons }) => (
  <div className="stopwatch">
    <div className={`current-state ${currentState}`}>
      {currentState}{currentState === STOPWATCH_STATES.RUNNING && '...'}
    </div>
    <code className="elapsed-time">{convertTimestampToString(elapsedMs)}</code>
    {actionButtons}
  </div>
);

export default Stopwatch;
