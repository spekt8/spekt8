import React from 'react';
import Legend from './legend';
import Monitoring from './monitoring';
import Directions from './directions';

const LeftPanel = () => (
  <div className="leftPanel">
    <h3>Left Panel</h3>
    <Legend />
    <Monitoring />
    <Directions />
  </div>
);

export default LeftPanel;