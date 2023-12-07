import { AppRegistry } from 'react-native';
import App from './App'; // Assuming your main app component is in App.js or App.tsx
import { name as appName } from './app.json';

// Register the main component of your app
AppRegistry.registerComponent(appName, () => App);

// Run the app
AppRegistry.runApplication(appName, {
  rootTag: document.getElementById('root'), // Replace with your root view ID
});
