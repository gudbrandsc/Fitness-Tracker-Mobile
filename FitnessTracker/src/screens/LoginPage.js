import React, { Component } from "react";
import { AsyncStorage, View } from "react-native";
import {
  Card,
  CardSection,
  Button,
  Input,
  Spinner
} from "../components/common";
import AnimationErrorBox from "../components/common/AnimationErrorBox"; // this uses export default so can't be in {}

/**
 * A class that handles Login functionality
 * @author Hassan Ch
 */
class LoginPage extends Component {
  static navigationOptions = {
    headerTitle: "Login to your account",
    headerLeft: null
  };

  state = {
    id: "",
    email: "",
    password: "",
    userToken: "",
    error: "",
    loading: false,
    animationErrorHeight: "0.5%"
  };

  /**
   * A function that validates the email and password then calls handleLogin function.
   */
  validateInput() {
    const regexEmail = /^\w+[\w-\.]*@\w+((-\w+)|(\w*))(.[a-z]{2,})*$/;
    var emailMatch = regexEmail.test(this.state.email);
    if (!emailMatch) {
      const error = "Wrong Email Format.";
      this.setState({ error });
    }
    if (emailMatch) this.handleLogin();
  }

  /**
   * A function that calls the Login API to login the user. If login is successful, save values to Isolated storage.
   * Otherwise, show error message.
   */
  handleLogin() {
    const { email, password } = this.state;

    this.setState({ error: "", loading: true, animationErrorHeight: "0.5%" });

    try {
      fetch("http://localhost:8000/api/userlogin", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: this.state.email,
          password: this.state.password
        })
      })
        .then(response =>
          response.json().then(data => ({
            data: data,
            status: response.status
          }))
        )
        .then(
          res => {
            if (res.status === 200) {
              const userToken = res.data.token;
              const id = res.data.userId;
              this.setState({ userToken, id });
              this.storeDataIsolatedStorage();
            } else {
              this.onLoginFail("Password or username doesn't match.");
            }
          },
          error => {
            this.onLoginFail(
              "Login failed. Please check internet connectivity."
            );
          }
        );
    } catch (error) {
      this.onLoginFail("Login failed. Please check internet connectivity.");
    }
  }

  /**
   * A function that stores login, password, and token to the isolated storage.
   */
  storeDataIsolatedStorage = async () => {
    try {
      const userToken = this.state.userToken;
      const pass = this.state.password;
      const id = this.state.id;
      await AsyncStorage.setItem("Usertoken", userToken.toString()).then(() => {
        return AsyncStorage.setItem("pass", pass.toString()).then(() => {
          return AsyncStorage.setItem("login", id.toString()).then(() => {
            this.onLoginSuccess();
          });
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  onLoginFail(err) {
    this.setState({
      error: err,
      loading: false,
      animationErrorHeight: "auto"
    });
  }

  onLoginSuccess() {
    this.setState({
      email: "",
      password: "",
      loading: false,
      error: "",
      animationErrorHeight: "0.5%"
    });
    this.props.navigation.navigate("Home");
  }

  renderButton() {
    if (this.state.loading) {
      return <Spinner size="small" />;
    }

    return (
      <Button
        size={"large"}
        type={"primary"}
        onPress={this.validateInput.bind(this)}
      >
        Log in
      </Button>
    );
  }

  onRegisterButtonPress() {
    this.props.navigation.navigate("Register");
  }

  onForgetPassButtonPress() {
    this.props.navigation.navigate("ForgetPass");
  }

  onCloseAnimationBox() {
    this.setState({
      error: "",
      animationErrorHeight: "0.5%"
    });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Card>
          <CardSection>
            <Input
              placeholder="user@gmail.com"
              label="Email"
              value={this.state.email}
              onChangeText={email => this.setState({ email })}
            />
          </CardSection>

          <CardSection>
            <Input
              secureTextEntry
              placeholder="password"
              label="Password"
              value={this.state.password}
              onChangeText={password => this.setState({ password })}
            />
          </CardSection>
          <CardSection>{this.renderButton()}</CardSection>
          <CardSection>
            <Button
              size={"large"}
              type={"secondary"}
              onPress={this.onRegisterButtonPress.bind(this)}
            >
              Create account
            </Button>
          </CardSection>
          <CardSection>
            <Button
              size={"large"}
              type={"secondary"}
              onPress={this.onForgetPassButtonPress.bind(this)}
            >
              Forget Password
            </Button>
          </CardSection>
        </Card>
        <AnimationErrorBox
          errorMsg={this.state.error}
          onPress={this.onCloseAnimationBox.bind(this)}
        />
      </View>
    );
  }
}

export default LoginPage;
