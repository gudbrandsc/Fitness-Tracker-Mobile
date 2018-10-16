import React, { Component } from "react";
import { AsyncStorage, View } from "react-native";
import { Button, Card, CardSection, Input, Spinner } from "../common";
import AnimationErrorBox from "../common/AnimationErrorBox"; // this uses export default so can't be in {}

class RegisterPage extends Component {
  static navigationOptions = {
    headerTitle: "Create Account"
  };
  state = {
    fname: "",
    lname: "",
    street: "",
    city: "",
    _state: "",
    zipcode: "",
    email: "",
    password: "",
    error: "",
    loading: false
  };

  /**
   * A function that validates all the inputs.
   */
  validateInput() {
    const regexName = /^(([A-Za-z]\s?-?){2,3})+$/;
    const regexStreet = /^(\w\s?,?\s?)+$/;
    const regexEmail = /^\w+[\w-\.]*@\w+((-\w+)|(\w*))(.[a-z]{2,})*$/;
    const regexPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const regexZipCode = /^\d+$/;
    var passwordMatch = regexPass.test(this.state.password);
    var emailMatch = regexEmail.test(this.state.email);
    var fnameMatch = regexName.test(this.state.fname);
    var lnameMatch = regexName.test(this.state.lname);
    var cityMatch = regexName.test(this.state.city);
    var stateMatch = regexName.test(this.state._state);
    var streetMatch = regexStreet.test(this.state.street);
    var zipCodeMatch = regexZipCode.test(this.state.zipcode);
    if (this.state.zipcode.length > 5) zipCodeMatch = false;

    console.log(passwordMatch);
    console.log(emailMatch);
    console.log(fnameMatch);
    console.log(lnameMatch);
    console.log(stateMatch);
    console.log(cityMatch);
    console.log(streetMatch);
    console.log(zipCodeMatch);
    if (!fnameMatch) {
      const error = "First name is invalid.";
      this.setState({ error });
    } else if (!lnameMatch) {
      const error = "Last name is invalid.";
      this.setState({ error });
    } else if (!emailMatch) {
      const error = "Wrong Email Format.";
      this.setState({ error });
    } else if (!passwordMatch) {
      const error =
        "Password should be minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character";
      this.setState({ error });
    } else if (!streetMatch) {
      const error = "Street Address Format is invalid";
      this.setState({ error });
    } else if (!cityMatch) {
      const error = "City Format is invalid";
      this.setState({ error });
    } else if (!stateMatch) {
      const error = "State Format is invalid";
      this.setState({ error });
    } else if (!zipCodeMatch) {
      const error = "Zipcode Format is invalid";
      this.setState({ error });
    } else this.handleRegister();
  }

  handleRegister() {
    this.onRegisterSuccess();
    this.setState({ error: "", loading: true });
    try {
      fetch("http://192.168.11.25:8885/signup", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fname: this.state.fname,
          lname: this.state.lname,
          username: this.state.email,
          password: this.state.password,
          street: this.state.street,
          city: this.state.city,
          state: this.state._state,
          zipcode: this.state.zipcode
        })
      })
        .then(response => response.json())
        .then(
          response => {
            console.log(response);
            if (response === "Account created") {
              console.log("Account creation Successful");
              const id = response.id;
              this.setState({ id });
              this.storeDataIsolatedStorage();
              this.onRegisterSuccess();
            } else {
              this.onRegisterFail("Registration failed.");
              console.log("Account creation Failed");
            }
          },
          error => {
            console.log(error);
            this.onRegisterFail(
              "Registration failed. Please check internet connectivity."
            );
          }
        );
    } catch (error) {
      this.onRegisterFail(
        "Registration failed. Please check internet connectivity."
      );
    }
  }

  /**
   * A function that stores login, password, and token to the isolated storage.
   */
  storeDataIsolatedStorage = async () => {
    try {
      const id = this.state.id;
      const pass = this.state.password;
      await AsyncStorage.setItem("login", id).then(() => {
        return AsyncStorage.setItem("Usertoken", "Token").then(() => {
          return AsyncStorage.setItem("pass", pass).then(() => {
            this.onRegisterSuccess();
          });
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  onRegisterFail(err) {
    this.setState({ error: err, loading: false });
  }

  onRegisterSuccess() {
    this.setState({
      fname: "",
      lname: "",
      email: "",
      password: "",
      street: "",
      city: "",
      _state: "",
      zipcode: "",
      loading: false,
      error: ""
    });
    this.props.navigation.navigate("Login");
  }

  renderButton() {
    if (this.state.loading) {
      return <Spinner size="small" />;
    }

    return (
      <Button onPress={this.validateInput.bind(this)}>Create Account</Button>
    );
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
              placeholder="First Name"
              label="Fname"
              value={this.state.fname}
              onChangeText={fname => this.setState({ fname })}
            />
          </CardSection>
          <CardSection>
            <Input
              placeholder="Last Name"
              label="Lname"
              value={this.state.lname}
              onChangeText={lname => this.setState({ lname })}
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
          <CardSection>
            <Input
              placeholder="Street Address"
              label="street"
              value={this.state.street}
              onChangeText={street => this.setState({ street })}
            />
          </CardSection>
          <CardSection>
            <Input
              placeholder="City"
              label="City"
              value={this.state.city}
              onChangeText={city => this.setState({ city })}
            />
          </CardSection>
          <CardSection>
            <Input
              placeholder="State"
              label="State"
              value={this.state._state}
              onChangeText={_state => this.setState({ _state })}
            />
          </CardSection>
          <CardSection>
            <Input
              placeholder="Zip Code"
              label="zipcode"
              value={this.state.zipcode}
              onChangeText={zipcode => this.setState({ zipcode })}
            />
          </CardSection>
          <CardSection>{this.renderButton()}</CardSection>
        </Card>
        <AnimationErrorBox
          errorMsg={this.state.error}
          onPress={this.onCloseAnimationBox.bind(this)}
        />
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
