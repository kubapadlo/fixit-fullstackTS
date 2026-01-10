import { StyleSheet, Text, View } from "react-native";
import LoginScreen from "./screens/LoginScreen";
import { FaultsScreen } from "./screens/FaultsScreen";
import ReportFaultScreen from "./screens/ReportFaultScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, useLocale } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useLoggedUserState } from "./store/userStore";
const queryClient = new QueryClient();

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Show" component={FaultsScreen} />
      <Tab.Screen name="Report" component={ReportFaultScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const isAuthenticated = useLoggedUserState((state) => state.isAuthenticated);

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Stack.Navigator>
          {isAuthenticated == false ? (
            <Stack.Screen name="Login" component={LoginScreen} />
          ) : (
            <Stack.Screen
              name="Home"
              component={MyTabs}
              options={{ headerShown: false }}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
