
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppNavigator from "./src/routes/AppNavigator";
 
export default function App() {
  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
}
 