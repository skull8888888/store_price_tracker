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

// const MyScreen = () => (
//   <View>
//     <NavigationEvents
//       onDidFocus={payload => this.retrieveData}
//     />
//   </View>
// );

// const trackersRef;

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
    trackersRef: null,


  };


  alertForNotification = () => {
    Alert.alert("", "Уведомления важны для работы приложения. Включить уведомления?", [
      { text: "Нет", onPress: () => console.log("отмена") },
      {
        text: "Да",
        onPress: async () => {
          await firebase.messaging().requestPermission()
          console.log("successfull");
        }
      }
    ]);
  };

  deleteGood = async (id) => {
    const USERID = await AsyncStorage.getItem("userID");
    let newGoods = this.state.goods.filter(other => {
      return other.id != id;
    });
    console.log("deletedID:", id);
    console.log("newGoods", newGoods);

    db.ref(`TRACKERS/${USERID}/${id}`).set(null);

    this.setState({ goods: newGoods });


  };


  requestNotificationPermission = async () => {
    console.log('here');
    try {
      const enabled = await firebase.messaging().hasPermission();

      if (enabled) {
        const token = await firebase.messaging().getToken();
        ;
        if (token) {
          const res = await fetch("https://store-price-tracker.herokuapp.com/api/db/register")
          const result = await res.json();
          await AsyncStorage.setItem("userID", result);
          await AsyncStorage.setItem("userToken", token);
        }
      }
      else {
        // ask for permission again
        await firebase.messaging().requestPermission();
      }

      return Promise.resolve();

    } catch (e) {
      return Promise.reject();
    }
  };


  retrieveData = async () => {
    try {
      console.log('s')
      this.setState({ isLoading: true });

      const ID = await AsyncStorage.getItem("userID");
      console.log('ID', ID)
      if (!ID) {
        console.log('1')
        await this.requestNotificationPermission()
      }
      else {
        console.log("2")
        let trackers = [];
        let trackersRef = db.ref(`TRACKERS/${ID}`).on('value', snapshot => {
          snapshot.forEach(dataSnapshot => {
            trackers.push(dataSnapshot.val())
          })
          this.setState({ trackers, trackersRef }, () => console.log('here', trackers));

        })

      }
      this.setState({ isLoading: false });
    } catch (error) {
      console.log('error', error)
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

    if (isLoading) {
      return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
      <View style={styles.container}>
        {this.state.trackers.length == 0 ? (
          <View style={{ flex: 1 }}>
            <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
              <Text>Добавьте товар в список</Text>
            </View>
            <View style={{ flex: 1 }}>
              <TouchableOpacity style={{ flex: 1 }} onPress={() => this.props.navigation.navigate('Stores')}>
                <Image style={styles.myAddBtn} source={require('./img/myplus.png')} />
              </TouchableOpacity>
            </View>
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
              <TouchableOpacity onPress={() => this.props.navigation.navigate('Stores')}>
                <View style={{ flex: 1 }}>
                  <Image style={styles.myAddBtn} source={require('./img/myplus.png')} />
                </View>
              </TouchableOpacity>
            </View>
          )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  myAddBtn: {
    width: 70,
    height: 70,
    position: "absolute",
    bottom: 16,
    right: 16,
  },
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
