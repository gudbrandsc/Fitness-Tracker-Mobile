import React, { Component } from "react";
import { AsyncStorage, View } from "react-native";
import { Button, Card, CardSection, Input, Spinner } from "./common";
import AnimationErrorBox from "./common/AnimationErrorBox"; // this uses export default so can't be in {}

/**
 * A class that handles Login functionality
 * @author Hassan Ch
 */
class LoginPage extends Component {
  static navigationOptions = {
    headerTitle: "Login to your account"
  };

  state = {
    email: "",
    password: "",
    userToken: "",
    error: "",
    loading: false
  };

  componentWillMount() {
    console.log("Inside log page");
  }

  /**
   * A function that validates the email and password then calls handleLogin function.
   */
  validateInput() {
    const regexEmail = /^\w+[\w-\.]*@\w+((-\w+)|(\w*))(.[a-z]{2,})*$/;
    const regexPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    var passwordMatch = regexPass.test(this.state.password);
    var emailMatch = regexEmail.test(this.state.email);
    console.log(passwordMatch);
    console.log(emailMatch);
    if (!passwordMatch) {
      const error =
        "Password should be minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character";
      this.setState({ error });
    }
    if (!emailMatch) {
      const error = "Wrong Email Format.";
      this.setState({ error });
    }
    if (emailMatch && passwordMatch) this.handleLogin();
  }

  /**
   * A function that calls the Login API to login the user. If login is successful, save values to Isolated storage.
   * Otherwise, show error message.
   */
  handleLogin() {
    console.log("handle login");
    const { email, password } = this.state;

    this.setState({ error: "", loading: true });

    try {
      fetch("http://192.168.11.25:8885/login", {
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
        .then(response => response.text())
        .then(
          response => {
            if (response === "Login Successful") {
              this.onLoginSuccess();
              console.log("Login Successful");
              this.storeLoginData();
            } else {
              this.onLoginFail();
              console.log("Login Failed");
            }
          },
          error => {
            console.log(error);
            this.onLoginFail();
          }
        );
    } catch (error) {
      console.log(error);
      this.onLoginFail();
    }
  }

  /**
   * A function that stores login, password, and token to the isolated storage.
   */
  storeLoginData = async () => {
    try {
      await AsyncStorage.setItem("login", "yes");
    } catch (error) {
      console.log(error);
    }
  };

  onLoginFail() {
    this.setState({ error: "Authentication Failed", loading: false });
  }

  onLoginSuccess() {
    this.setState({
      email: "",
      password: "",
      loading: false,
      error: ""
    });
  }

  renderButton() {
    if (this.state.loading) {
      return <Spinner size="small" />;
    }

    return <Button onPress={this.validateInput.bind(this)}>Log in</Button>;
  }

  onRegisterButtonPress() {
    this.props.navigation.navigate("Register");
  }

  onCloseAnimationBox() {
    this.setState({ error: "" });
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
            <Button onPress={this.onRegisterButtonPress.bind(this)}>
              Create account
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
