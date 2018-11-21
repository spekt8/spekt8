import svgmdcrop2 from '../images/_ionicons_svg_md-crop2.svg';
import svglogocodepen2 from '../images/_ionicons_svg_logo-codepen2.svg';
import svgmdwifi2 from '../images/_ionicons_svg_md-wifi2.svg';
import svgmdaperture2 from '../images/_ionicons_svg_md-aperture2.svg';

const options = {
  autoResize: true,
  layout: {
    hierarchical: {
      enabled: true,
      levelSeparation: 100,
      nodeSpacing: 150,
      treeSpacing: 60,
      blockShifting: true,
      edgeMinimization: true,
      parentCentralization: true,
      direction: 'UD',        // UD, DU, LR, RL
      sortMethod: 'directed'   // hubsize, directed
    }
  },
  interaction: {
    hover: true,
    navigationButtons: true,
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
    hierarchicalRepulsion: {
      centralGravity: 0.0,
      springLength: 100,
      springConstant: 0.01,
      nodeDistance: 80,
      damping: 0.09
    },
  },
  edges: {
    color: "#000000",
    smooth: {
      enabled: true,
      type: "dynamic",
      roundness: 0.8
    },
  },
  width: '100%',
  height: '100%',
  nodes: {
    font: {
      face: 'Roboto',
    },
    chosen: true,
    borderWidth: 0,
    color: {
      border: 'black',
      background: '#97C2FC',
      highlight: {
        border: '#2B7CE9',
        background: '#D2E5FF'
      },
      hover: {
        border: '#2B7CE9',
        background: '#D2E5FF'
      },
    },
  },
  groups: {
    master: {
      shape: 'circularImage',
      image: {
        selected: svgmdcrop2,
        unselected: svgmdcrop2,
      }
    },
    pods: {
      shape: 'circularImage',
      image: {
        selected: svglogocodepen2,
        unselected: svglogocodepen2,
      }
    },
    services: {
      shape: 'circularImage',
      image: {
        selected: svgmdwifi2,
        unselected: svgmdwifi2
      }
    },
    ingress: {
      shape: 'circularImage',
      image: {
        selected: svgmdaperture2,
        unselected: svgmdaperture2,
      }
    },
  },
  
};

export default options;
