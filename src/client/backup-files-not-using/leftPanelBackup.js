import React from 'react';
import Legend from '../components/legend';
import Monitoring from '../components/monitoring';
import Directions from '../components/directions';

const LeftPanel = () => (
  <div className="leftPanel">
    <h3>Left Panel</h3>
    <Legend />
    <Monitoring />
    <Directions />
  </div>
);

export default LeftPanel;