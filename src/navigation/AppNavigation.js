import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../components/HomeScreen";
import ReceipeDetails from "../components/ReceipeDetails";
import ReceipeForm from "../components/ReceipeForm";

const Stack = createStackNavigator();

export default class AppNavigation extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="ReceipeDetails" component={ReceipeDetails} />
          <Stack.Screen name="ReceipeForm" component={ReceipeForm} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
