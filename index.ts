// [Purpose] Root entry: tell Expo to launch the real app component from ./src/App.
// This replaces the default behavior that expected a root-level App.tsx.
import { registerRootComponent } from 'expo';
import App from './src/App';
registerRootComponent(App);
