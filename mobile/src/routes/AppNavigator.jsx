import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LeadsPage from "../pages/LeadPage";
import { ROUTE_NAMES} from "./routeNames";
const Stack = createNativeStackNavigator();
export default function AppNavigator() {
  return (
             <NavigationContainer>
                <Stack.Navigator
                 initialRouteName={ROUTE_NAMES.LEADS}
                    screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name={ROUTE_NAMES.LEADS} component={LeadsPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
