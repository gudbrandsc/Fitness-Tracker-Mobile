import React, { Component } from "react";
import { View, Text, AsyncStorage } from "react-native";
import { Button, Card, CardSection, Input, Spinner, Header } from "./common";

class LoginPage extends Component {
  state = { email: "", password: "", error: "", loading: false };

  componentWillMount() {
    console.log("Inside log page");
  }

  onButtonPress() {
    const { email, password } = this.state;

    this.setState({ error: "", loading: true });

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
        }
      );
  }

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

    return <Button onPress={this.onButtonPress.bind(this)}>Log in</Button>;
  }

  onRegButtonPress() {
    this.props.navigation.navigate("Register");
  }

  render() {
    return (
      <React.Fragment>
        <Header headerText="Log in to your Account" />
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

          <Text style={styles.errorTextStyle}>{this.state.error}</Text>

          <CardSection>{this.renderButton()}</CardSection>
          <CardSection>
            <Button onPress={this.onRegButtonPress.bind(this)}>
              Create account
            </Button>
          </CardSection>
        </Card>
      </React.Fragment>
    );
  }
}

const styles = {
  errorTextStyle: {
    fontSize: 20,
    alignSelf: "center",
    color: "red"
  }
};

export default LoginPage;
