import React from "react";
import { StyleSheet, Text, View, AsyncStorage } from "react-native";
// import { createStackNavigator } from "react-navigation";
// import { Toolbar, ToolbarContent } from "react-native-paper";
import firebase from "react-native-firebase";

//Expo.ScreenOrientation.allow(Expo.ScreenOrientation.Orientation.PORTRAIT);
// import HomeScreen from "./components/HomeScreen";
// import StoresScreen from "./components/StoresScreen";
// import AddNewOddScreen from "./components/AddNewOddScreen";

export default class App extends React.Component {
  requestNotificationPermission = async () => {
    const enabled = await firebase.messaging().hasPermission();

    if (enabled) {
      const token = await firebase.messaging().getToken();

      if (!token) {
        const response = await fetch(
          "https://store-price-tracker.herokuapp.com/api/register",
          {
            method: "POST",

            body: JSON.stringify({
              token: token
            })
          }
        );
        const json = await response.json();

        await AsyncStorage.setItem("userId", json.userId);
      }
    } else {
      // ask for permission again
      try {
        await firebase.messaging().requestPermission();
      } catch (error) {
        //handle alert('its important')
      }
    }
  };

  componentDidMount() {
    this.requestNotificationPermission();
  }

  render() {
    return <View style={{ flex: 1, backgroundColor: "green" }} />;
  }
}

// var config = {
//   apiKey: "AIzaSyAioEwYxDyPpfqgOyqZdWF3_l8X0Lps6UQ",
//   authDomain: "store-price-tracker.firebaseapp.com",
//   databaseURL: "https://store-price-tracker.firebaseio.com",
//   projectId: "store-price-tracker",
//   storageBucket: "store-price-tracker.appspot.com",
//   messagingSenderId: "658824869797"
// };

// firebase.initializeApp(config);

// const RootStack = createStackNavigator(
//   {
//     Home: HomeScreen,
//     Stores: StoresScreen,
//     AddNewOdd: AddNewOddScreen
//   },
//   {
//     initialRouteName: "Home"
//   }
// );
