import React, { Component } from "react";
import {
  AsyncStorage,
  View,
  ActivityIndicator,
  ImageBackground
} from "react-native";
import AuthPageRouter from "./screens/AuthPageRouter";
import HomePageRouter from "./screens/HomePageRouter";

class App extends Component {
  state = { loggedIn: -1, startApp: 0 };

  componentDidMount() {
    console.disableYellowBox = true;
    setTimeout(() => {
      this.startApplication();
    }, 2000);
    this.retrieveData();
  }

  /**
   * A function that updates startApp variable
   */
  startApplication() {
    const startApp = 1;
    this.setState({ startApp });
  }

  /**
   * A function that gets all 3 variables stored in the isolated storage. If all of them exist, then
   * it changes the loggedIn variable to true otherwise to false.
   */
  retrieveData = async () => {
    try {
      const userToken = await AsyncStorage.getItem("Usertoken");
      const pw = await AsyncStorage.getItem("pass");
      var loggedIn = 0;
      if (userToken !== null && pw !== null) loggedIn = 1;
      this.setState({ loggedIn });
    } catch (error) {
      const loggedIn = 0;
      this.setState({ loggedIn });
    }
  };

  renderLogoPage() {
    const styles = {
      spinnerStyle: {
        flex: 1,
        alignItems: "center",
        marginTop: "110%"
      }
    };
    return (
      <ImageBackground
        style={{ flex: 1 }}
        source={require("./components/UIdesign/logoPage.jpg")}
      >
        <View style={styles.spinnerStyle}>
          <ActivityIndicator color="#3695d0" size="large" />
        </View>
      </ImageBackground>
    );
  }

  /**
   * A function that renders the page depending on the loggedIn value
   */
  checkLoginState() {
    if (this.state.loggedIn === 1) return <HomePageRouter />;
    else return <AuthPageRouter />;
  }

  renderContent() {
    if (this.state.startApp === 1 && this.state.loggedIn > -1)
      return this.checkLoginState();
    else return this.renderLogoPage(); // I will keep showing the startup image until I change the startApp value
  }

  render() {
    return this.renderContent();
  }
}

export default App;
