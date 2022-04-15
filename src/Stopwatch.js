import React from 'react';

import { convertTimestampToString } from './utils';
import './Stopwatch.css';

const Stopwatch = ({ currentState, elapsedMs, actionButtons }) => (
  <div className="stopwatch">
    <div className="current-state">{currentState}</div>
    <code className="elapsed-time">{convertTimestampToString(elapsedMs)}</code>
    {actionButtons}
  </div>
);

export default Stopwatch;
