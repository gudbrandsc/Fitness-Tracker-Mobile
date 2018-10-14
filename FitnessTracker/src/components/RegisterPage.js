import React, { Component } from "react";
import { View, Text, AsyncStorage } from "react-native";
import { Button, Card, CardSection, Input, Spinner, Header } from "./common";

class RegisterPage extends Component {
  state = { name: "", email: "", password: "", error: "", loading: false };

  onButtonPress() {
    const { email, password, name } = this.state;

    this.setState({ error: "", loading: true });

    fetch("http://192.168.11.25:8885/signup", {
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
          console.log(response);
          if (response === "Account created") {
            //this.onLoginSuccess();
            console.log("Login Successful");
            //this.storeLoginData();
          } else {
            //this.onLoginFail();
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

    return (
      <Button onPress={this.onButtonPress.bind(this)}>Create Account</Button>
    );
  }

  render() {
    return (
      <View>
        <Header headerText="Create Account" />
        <Card>
          <CardSection>
            <Input
              placeholder="Full Name"
              label="Name"
              value={this.state.name}
              onChangeText={name => this.setState({ name })}
            />
          </CardSection>

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
        </Card>
      </View>
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

export default RegisterPage;
