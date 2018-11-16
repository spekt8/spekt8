const options = {
  autoResize: true,
  layout: {
    hierarchical: {
      enabled: true,
      levelSeparation: 100,
      nodeSpacing: 200,
      treeSpacing: 100,
      blockShifting: true,
      edgeMinimization: true,
      parentCentralization: true,
      direction: 'UD',        // UD, DU, LR, RL
      sortMethod: 'directed'   // hubsize, directed
    }
  },
  interaction: {
    keyboard: {
      enabled: true,
      speed: {
        x:10,
        y:10,
        zoom:0.01,
      },
      bindToWindow: true,
    },
  },
  physics: {
    enabled: true,
    repulsion: {
      nodeDistance: 200,
    },
  },
  edges: {
    color: "#000000",
  },
  width: '100%',
  height: '100%',
  nodes: {
    shape: 'image',
    // icon: {
    // 	face: '"Font Awesome 5 Free"',
    // 	code: '\uf466',
    // 	size: 30,
    // 	color: 'black'
    // },
    image: {
      selected: 'https://camo.githubusercontent.com/f8ea5eab7494f955e90f60abc1d13f2ce2c2e540/68747470733a2f2f662e636c6f75642e6769746875622e636f6d2f6173736574732f323037383234352f3235393331332f35653833313336322d386362612d313165322d383435332d6536626439353663383961342e706e67',
      unselected: 'https://camo.githubusercontent.com/f8ea5eab7494f955e90f60abc1d13f2ce2c2e540/68747470733a2f2f662e636c6f75642e6769746875622e636f6d2f6173736574732f323037383234352f3235393331332f35653833313336322d386362612d313165322d383435332d6536626439353663383961342e706e67'
    }
  },
  
};

export default options;
