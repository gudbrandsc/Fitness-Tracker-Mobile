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
    headerTitle: "Login to your account"
  };

  state = {
    email: "",
    password: "",
    userToken: "",
    error: "",
    loading: false
  };

  /**
   * A function that validates the email and password then calls handleLogin function.
   */
  validateInput() {
    const regexEmail = /^\w+[\w-\.]*@\w+((-\w+)|(\w*))(.[a-z]{2,})*$/;
    const regexPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    var passwordMatch = regexPass.test(this.state.password);
    var emailMatch = regexEmail.test(this.state.email);

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
      fetch("http://10.1.86.4:8000/api/userlogin", {
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
            console.log("json", res.data);
            if (res.status === 200) {
              console.log("Login Successful");
              const userToken = res.data.token;
              this.setState({ userToken });
              this.storeDataIsolatedStorage();
              this.onLoginSuccess();
            } else {
              this.onLoginFail("Password or username doesn't match.");
              console.log("Login Failed");
            }
          },
          error => {
            console.log(error);
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
      await AsyncStorage.setItem("Usertoken", userToken).then(() => {
        return AsyncStorage.setItem("pass", pass).then(() => {
          this.onLoginSuccess();
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  onLoginFail(err) {
    this.setState({ error: err, loading: false });
  }

  onLoginSuccess() {
    this.setState({
      email: "",
      password: "",
      loading: false,
      error: ""
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
            <Button
              size={"large"}
              type={"secondary"}
              onPress={this.onRegisterButtonPress.bind(this)}
            >
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
