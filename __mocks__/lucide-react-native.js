const React = require('react');
const { View } = require('react-native');

function createIcon(name) {
  return function Icon(props) {
    return React.createElement(View, {
      testID: `icon-${name}`,
      style: { width: props.size || 24, height: props.size || 24 }
    });
  };
}

module.exports = {
  ChevronDown: createIcon('ChevronDown'),
  ChevronRight: createIcon('ChevronRight'),
  X: createIcon('X'),
  Check: createIcon('Check'),
  Volume2: createIcon('Volume2'),
  VolumeX: createIcon('VolumeX'),
  Home: createIcon('Home'),
  Settings: createIcon('Settings'),
  BarChart3: createIcon('BarChart3'),
};
