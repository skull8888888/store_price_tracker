import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions
} from "react-native";
import { AsyncStorage, Alert } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Button } from "react-native-paper";
import firebase from "react-native-firebase";

const { width, height } = Dimensions.get("window");
const db = firebase.database();

const convertValToArray = (data) => {
  const arr = [];
  data.forEach(item => {
    arr.push(item.val())
  })

  return arr;
}

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: "Мои товары",
    headerStyle: {
      backgroundColor: "#f4511e"
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontWeight: "bold"
    }
  };

  state = {
    goods: [
      {
        url:
          "https://a.lmcdn.ru/pi/img236x341/R/A/RA084AMAISF6_6203977_1_v2.jpg",
        title: "Кроссовки Wicked One",
        cost: "14 500 тг",
        id: 4
      },
      {
        url:
          "https://a.lmcdn.ru/pi/img389x562/D/I/DI028AMPQX33_4487223_1_v2.jpg",
        title: "Кроссовки Wicked One",
        cost: "21 500 тг",
        id: 5
      },
      {
        url:
          "https://lanita.ru/images/offer/5820/2/su789emvcd22/su789emvcd22.jpg",
        title: "Мужская Одежда SuperDRY 2018",
        cost: "44 500 тг",
        id: 6
      },
      {
        url:
          "https://a.lmcdn.ru/pi/img236x341/J/H/JH001EMAYSW0_6987647_1_v1.jpg",
        title: "Футболкa s.Oliver",
        cost: "9 500 тг",
        id: 7
      },
      {
        url:
          "https://a.lmcdn.ru/pi/img236x341/S/O/SO917EMBWNW7_6951739_1_v1.jpg",
        title: "Футболкa s.Oliver",
        cost: "10 500 тг",
        id: 8
      },
      {
        url:
          "https://a.lmcdn.ru/pi/img236x341/W/I/WI015EMWOB33_5188808_1_v3.jpg",
        title: "Футболкa s.Oliver",
        cost: "24 100 тг",
        id: 9
      }
    ],

    isLoading: true, 
    trackers: [],
  };


  requestNotificationPermission = async () => {
    const enabled = await firebase.messaging().hasPermission();

    if (enabled) {
      const token = await firebase.messaging().getToken();

      if (!token) {
        const response = await fetch(
          "https://store-price-tracker.herokuapp.com/api/register",
          {
            method: "POST",
            body: {
              token: token
            }
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
        this.alertForNotification()
      }
    }
  };


  alertForNotification = () => {
    Alert.alert("", "Уведомления важны для работы приложения. Включить уведомления?", [
      { text: "Нет", onPress: () => console.log("отмена") },
      {
        text: "Да",
        onPress: () => {
          await firebase.messaging().requestPermission()
          console.log("successfull");
        }
      }
    ]);
  };

  deleteGood = id => {
    let newGoods = this.state.goods.filter(other => {
      return other.id != id;
    });
    console.log("deletedID:", id);
    console.log("newGoods", newGoods);
    this.setState({ goods: newGoods });
  };

  retrieveData = async () => {
    this.setState({ isLoading: true });
    try {
      const ID = await AsyncStorage.getItem("userID");

      if (ID === null) {
        this.requestNotificationPermission()
      }
      else{
        const trackersShapshot = await db.ref(`TRACKERS/${ID}`).once('value')
        // trackersShapshot.map(child => {
        //   const child = child.val();
        //   this.setState({...trackers, child})
        // });
        const trackers = convertValToArray(trackersShapshot);
        console.log('here', trackers);
        this.setState({ trackers })

      }

      this.setState({ isLoading: false });
    } catch (error) {
        console.log(error);
    }
  };

  alert = item => {
    Alert.alert("", "Удалить товар?", [
      { text: "Нет", onPress: () => console.log("отмена") },
      {
        text: "Да",
        onPress: () => {
          this.deleteGood(item.id) &&
            this.props.navigation.goBack() &&
            console.log("successfull");
        }
      }
    ]);
  };

  componentDidMount() {
   this.retrieveData();
  }

  render() {
    const { isLoading, goods } = this.state;

    if (!isLoading) {
      return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
      <View style={styles.container}>
        {this.state.goods.length == 0 ? (
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text>Добавьте товар в список</Text>
          </View>
        ) : (
          <View style={styles.container}>
            <FlatList
              contentContainerStyle={{ margin: 4 }}
              horizontal={false}
              numColumns={2}
              data={goods}
              horizontal={false}
              renderItem={({ item }) => {
                return (
                  <View style={styles.oddView}>
                    <Image
                      style={{ width: 150, height: 150, margin: 4 }}
                      source={{ uri: item.url }}
                    />
                    <Text>
                      Товар:<Text style={{ fontWeight: "bold" }}>
                        {item.title}
                      </Text>
                    </Text>
                    <Text style={{ paddingBottom: 50 }}>Цена: {item.cost}</Text>
                    <TouchableOpacity
                      style={styles.buttonDelete}
                      onPress={() => this.alert(item)}
                    >
                      <Text>Удалить</Text>
                    </TouchableOpacity>
                  </View>
                );
              }}
              keyExtractor={(item, index) => {
                item.id;
              }}
            />
            <View style={styles.container}>
              <Button
                primary
                raised
                compact
                style={styles.addBtn}
                onPress={() => this.props.navigation.navigate("Stores")}
              >
                <Icon name="plus" size={40} color="white" />
              </Button>
            </View>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  oddView: {
    backgroundColor: "pink",
    width: width / 2,
    borderColor: "green",
    borderBottomColor: "green",
    borderWidth: 2
  },

  addBtn: {
    backgroundColor: "red",
    position: "absolute",
    bottom: 16,
    right: 16,
    width: 60,
    height: 60,
    borderRadius: 60,
    justifyContent: "center",
    elevation: 8
  },
  buttonDelete: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    position: "absolute",
    bottom: 0,
    padding: 10,
    borderColor: "red"
  },
  actionButtonIcon: {
    position: "absolute",
    right: 10,
    bottom: 10,
    width: 50,
    height: 50,
    fontSize: 20,
    height: 22,
    color: "white"
  }
});
