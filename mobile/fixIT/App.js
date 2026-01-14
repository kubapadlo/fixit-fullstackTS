import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";

import LoginScreen from "./screens/LoginScreen";
import { FaultsScreen } from "./screens/FaultsScreen";
import ReportFaultScreen from "./screens/ReportFaultScreen";
import { useLoggedUserState } from "./store/userStore";

const queryClient = new QueryClient();
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const COLORS = {
  primary: "#6366f1",
  inactive: "#94a3b8",
  background: "#f8fafc",
  white: "#ffffff",
};

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const iconName =
            route.name === "Show"
              ? focused
                ? "list"
                : "list-outline"
              : focused
              ? "add-circle"
              : "add-circle-outline";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#6366f1",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { height: 60, paddingBottom: 8 },
        headerStyle: { backgroundColor: "#6366f1" },
        headerTintColor: "#fff",
      })}
    >
      <Tab.Screen
        name="Show"
        component={FaultsScreen}
        options={{ title: "Lista usterek" }}
      />
      <Tab.Screen
        name="Report"
        component={ReportFaultScreen}
        options={{ title: "Zgłoś usterkę" }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const isAuthenticated = useLoggedUserState((state) => state.isAuthenticated);

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShadowVisible: false,
          }}
        >
          {isAuthenticated === false ? (
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
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
