import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Modal,
  TouchableHighlight,
  Dimensions,
  AsyncStorage,
} from "react-native";
import { TextInput } from "react-native-paper";
//import { green100 } from "react-native-paper/src/styles/colors";
import firebase from "react-native-firebase";
const { width, height } = Dimensions.get("window");
const db = firebase.database();



export default class AddNewOddScreen extends React.Component {

  static navigationOptions = {
    title: "Добавление товара",
    headerStyle: {
      backgroundColor: "#f4511e"
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontWeight: "bold"
    }
  };

  state = {
    link: "",
    color: "gray",
    borderBottomColor: "gray",
    modalVisible: false,
    text: "Введите ссылку на товар",
    good: {
      curPrice: 0,
      imgURL: '',
      goodTitle: '',
    },
    INFO: this.props.navigation.state.params.info,
  };

  checkGood = async () => {
    console.log('touched');
    const ID = await AsyncStorage.getItem("userID")
    console.log('myid', ID)
    console.log('link', this.state.link)
    console.log('storeID', this.state.INFO.id)

    let details = {
      link: this.state.link,
      storeId: this.state.INFO.id,
    }

    let formBody = [];
    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    fetch('https://store-price-tracker.herokuapp.com/api/parser', {

      method: "POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: formBody
    }
    ).then((response) => response.json())

      .then((resJson) => {
        console.log("resJson", resJson)
        //console.log(resJson.data.currentPrice, resJson.data.imageURL, resJson.data.title)


        let newGood = {
          curPrice: resJson.data.currentPrice,
          imgURL: resJson.data.imageURL,
          goodTitle: resJson.data.title,
        }
        this.setState(prevState => ({
          good: newGood,
        }))




      }).catch(error => console.log('error while sending good to server'))
    this.setModalVisible(true);
  }



  setModalVisible = visible => {
    this.setState({ modalVisible: visible });
  };

  handleTrue = async () => {
    const ID = await AsyncStorage.getItem("userID")
    fetch('https://store-price-tracker.herokuapp.com/api/tracker', {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        good: {
          userID: ID,
          link: this.state.link,
          storeID: this.state.INFO.id,
          currentPrice: this.state.currentPrice,
          imageURL: this.state.imgURL,
          title: this.state.goodTitle,
        }
      })
    });
    this.props.navigation.navigate("Home");
    this.setModalVisible(!this.state.modalVisible);
  };

  handleFalse = () => {
    this.setState({ text: "Проверьте правильность введенной ссылки" });
    this.setModalVisible(!this.state.modalVisible);
  };

  render() {
    console.log('hereIAM:', this.props.navigation.state.params.info)
    return (
      <ScrollView style={styles.container}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            alert("Modal has been closed.");
          }}
        >
          <View style={styles.modal}>
            <View style={styles.modalInner}>
              {console.log("our link:", this.state.link)}

              <View style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                  {console.log('myURLLINk', this.state.good.imgURL)}
                  <Image
                    source={{ uri: this.state.good.imgURL }}
                    style={{ flex: 1 }}
                    resizeMode="cover"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ textAlign: "center", marginTop: 10 }}>
                    Это ваш товар ?
                  </Text>
                  <TouchableHighlight
                    style={styles.modalButton}
                    onPress={() => {
                      this.handleTrue();
                    }}
                  >
                    <Text>Да</Text>
                  </TouchableHighlight>

                  <TouchableHighlight
                    style={styles.modalButton}
                    onPress={() => {
                      this.handleFalse();
                    }}
                  >
                    <Text>Нет</Text>
                  </TouchableHighlight>
                </View>
              </View>
            </View>
          </View>
        </Modal>

        <View style={styles.logoIn}>
          <Image
            style={styles.image}
            source={{ uri: this.props.navigation.state.params.info.logoURL }}
          />
        </View>
        <View style={styles.container2}>
          <View style={styles.textInputIn}>
            <Text style={styles.textStyle}>{this.state.text}</Text>
          </View>
          <TextInput
            label="https://"
            style={styles.textInput}
            value={this.state.link}
            multiline={true}
            onChangeText={link => this.setState({ link })}
          />
        </View>
        <View style={styles.buttonIn}>
          <TouchableOpacity
            onPress={this.checkGood}
            style={styles.button}
          >
            <Text>Добавить</Text>
          </TouchableOpacity>
        </View>


      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  container2: {
    flex: 2
  },

  logoIn: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center"
  },

  textInputIn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },

  buttonIn: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20
  },

  textInput: {
    marginRight: 20,
    marginLeft: 20
  },

  image: {
    width: 200,
    height: 100
  },

  inputContainerStyle: {
    marginLeft: 8,
    marginRight: 8,
    width: 200
  },

  textStyle: {
    fontSize: 20,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center"
  },

  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10
  },
  modalButton: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
    marginTop: 10
  },
  modal: {
    marginTop: 22,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width: width,
    height: height,
    justifyContent: "center",
    alignItems: "center"
  },
  modalInner: {
    padding: 20,
    backgroundColor: "#fff",
    width: width * 0.8,
    height: height * 0.8
  }
});
