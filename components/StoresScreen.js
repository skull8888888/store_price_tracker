import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity
} from "react-native";

const stores = [
  {
    url:
      "https://i.pinimg.com/originals/4b/3e/cc/4b3ecc09e3b4fb647b0e8ff66b6312dd.jpg",
    id: 41
  },
  {
    url:
      "https://botw-pd.s3.amazonaws.com/styles/logo-thumbnail/s3/092016/untitled-1_17.jpg?itok=PMxwI3X0",
    id: 26
  },
  { url: "https://image.ibb.co/i4eHtH/ww.png", id: 1 },
  {
    url:
      "https://yt3.ggpht.com/a-/ACSszfFZuuqkGPSjOiHwDrLNvM53iJm5TK54CrA7gg=s900-mo-c-c0xffffffff-rj-k-no",
    id: 7
  },
  { url: "https://colibri.org.kz/storage/boutiques/tekhnodom/logo.png", id: 6 },
  {
    url:
      "https://image.isu.pub/150210012900-10151cf6131f67d8bf0c77df2803a909/jpg/page_1_thumb_large.jpg",
    id: 4
  }
];

export default class StoresScreen extends React.Component {
  static navigationOptions = {
    title: "Онлайн магазины",
    headerStyle: {
      backgroundColor: "#f4511e"
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontWeight: "bold"
    }
  };

  state = {
    // stores: []
  };

  // componentDidMount() {
  //   fetch(`https://store-price-tracker.herokuapp.com/api/db/stores`)
  //     .then(res => res.json())
  //     .then(json => this.setState({ stores: JSON.parse('[' + json  +']') }));
  // }

  render() {
    console.log("storesScreen", this.props);
    return (
      <FlatList
        contentContainerStyle={{ margin: 4 }}
        horizontal={false}
        numColumns={2}
        data={stores}
        horizontal={false}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate("AddNewOdd", {
                  info: item
                });
              }}
            >
              <Image
                style={{ width: 150, height: 100, margin: 4 }}
                source={{ uri: item.url }}
              />
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item, index) => {
          item.id;
        }}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
