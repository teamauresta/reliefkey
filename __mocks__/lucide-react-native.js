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
  // Navigation
  Home: createIcon('Home'),
  MapPin: createIcon('MapPin'),
  TrendingUp: createIcon('TrendingUp'),
  Settings: createIcon('Settings'),

  // Technique icons
  Wind: createIcon('Wind'),
  Volume2: createIcon('Volume2'),
  BrainCircuit: createIcon('BrainCircuit'),
  PersonStanding: createIcon('PersonStanding'),
  Mountain: createIcon('Mountain'),

  // Restroom finder
  Accessibility: createIcon('Accessibility'),
  DoorOpen: createIcon('DoorOpen'),
  Crosshair: createIcon('Crosshair'),
  RefreshCw: createIcon('RefreshCw'),
  X: createIcon('X'),

  // Audio masking
  Radio: createIcon('Radio'),
  Waves: createIcon('Waves'),
  CloudLightning: createIcon('CloudLightning'),
  TreePine: createIcon('TreePine'),
  Bird: createIcon('Bird'),
  Moon: createIcon('Moon'),
  Bug: createIcon('Bug'),
  Leaf: createIcon('Leaf'),

  // Visualization scenes
  Sun: createIcon('Sun'),
  Star: createIcon('Star'),
  Clock: createIcon('Clock'),

  // UI elements
  ChevronDown: createIcon('ChevronDown'),
  ChevronRight: createIcon('ChevronRight'),
  Check: createIcon('Check'),
  VolumeX: createIcon('VolumeX'),
  BarChart3: createIcon('BarChart3'),
};
