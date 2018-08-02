import React from "react";
import { StyleSheet, Text, View } from "react-native";
// import { createStackNavigator } from "react-navigation";
// import { Toolbar, ToolbarContent } from "react-native-paper";
import firebase from "react-native-firebase";

//Expo.ScreenOrientation.allow(Expo.ScreenOrientation.Orientation.PORTRAIT);
// import HomeScreen from "./components/HomeScreen";
// import StoresScreen from "./components/StoresScreen";
// import AddNewOddScreen from "./components/AddNewOddScreen";


const db = firebase.database()


export default class App extends React.Component {

getText = async () => {
  const stores = await db.ref('STORES').once('value')

  stores.forEach(childSnapshot => {
    console.log(childSnapshot.val())
  })

  return "lego"
}

  componentDidMount(){
    this.getText()
  }

  render() {
    return (<View style={{ flex: 1, backgroundColor: 'red'}}></View>)
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
