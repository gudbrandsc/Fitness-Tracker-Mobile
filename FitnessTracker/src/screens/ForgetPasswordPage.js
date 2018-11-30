import React, { Component } from "react";
import { View, Text } from "react-native";
import {
  Card,
  CardSection,
  Button,
  Input,
  Spinner
} from "../components/common";
import AnimationErrorBox from "../components/common/AnimationErrorBox"; // this uses export default so can't be in {}

/**
 * Script that allows the user to reset his password in case s/he forgot it.
 */

class ForgetPassword extends Component {
  static navigationOptions = {
    headerTitle: "Forget Password"
  };

  state = {
    email: "",
    error: "",
    loading: false,
    animationErrorHeight: "0.5%",
    successMsg: "" // shows the success message in the Text component when the password is reset
  };

  /**
   * A function that validates all the inputs. If all inputs are valid, call sendEmail function
   */
  validateInput() {
    this.setState({ successMsg: "" });
    const regexEmail = /^\w+[\w-\.]*@\w+((-\w+)|(\w*))(.[a-z]{2,})*$/;
    if (!regexEmail.test(this.state.email)) {
      const error = "Wrong Email Format.";
      this.setState({ error });
      this.setState({ animationErrorHeight: "auto" });
    } else this.sendEmail();
  }

  /**
   * A function that sends an API request to the backend to reset the password.
   * On success, onSendingSuccess function is called and a success message will appear saying that Password was successfully reset...etc
   * On failure, onSendingFailed function is called
   */
  sendEmail() {
    try {
      this.setState({
        loading: true,
        error: "",
        animationErrorHeight: "0.5%"
      });
      fetch("http://localhost:8000/api/getnewpassword", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: this.state.email
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
              this.setState({
                successMsg: "Password was successfully reset. Check your email."
              });
              this.onSendingSuccess();
            } else {
              this.onSendingFailed("Resetting password failed.");
            }
          },
          error => {
            console.log(error);
            this.onSendingFailed(
              "Resetting password failed. Please check internet connectivity."
            );
          }
        );
    } catch (error) {
      this.onSendingFailed(
        "Resetting password failed. Please check internet connectivity."
      );
    }
  }

  /**
   * A function that accepts an error string message and change the state to show the Error Animation Box Component
   * and reset the email and successMsg.
   */
  onSendingFailed(err) {
    this.setState({
      email: "",
      error: err,
      loading: false,
      animationErrorHeight: "auto",
      successMsg: "" // reset
    });
  }

  /**
   * A function that resets the email and hides the AnimationErrorBox.
   */
  onSendingSuccess() {
    this.setState({
      email: "",
      loading: false,
      error: "",
      animationErrorHeight: "0.5%"
    });
  }

  /**
   * A function that renders the Send button, if loading is true then show a spinner. Otherwise, show the button
   */
  renderButton() {
    if (this.state.loading) {
      return <Spinner size="small" />;
    }

    return <Button onPress={this.validateInput.bind(this)}>Send</Button>;
  }

  /**
   * A function called from the ErrorBoxAnimation Component to close the Error Animation
   */
  onCloseAnimationBox() {
    this.setState({ error: "", animationErrorHeight: "0.5%" });
  }

  /**
   * Main built in render function that loads the whole page
   */
  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Card>
          <CardSection>
            <Text style={{ textAlign: "center", fontSize: 18 }}>
              Your password will be sent to the email entered below
            </Text>
          </CardSection>
          <CardSection>
            <Input
              placeholder="user@gmail.com"
              label="Email"
              value={this.state.email}
              onChangeText={email => this.setState({ email })}
            />
          </CardSection>
          <CardSection>{this.renderButton()}</CardSection>
          <Text
            style={{
              textAlign: "center",
              fontSize: 18,
              color: "green",
              margin: 10
            }}
          >
            {this.state.successMsg}
          </Text>
        </Card>
        <AnimationErrorBox
          errorMsg={this.state.error}
          viewHeight={this.state.animationErrorHeight}
          onPress={this.onCloseAnimationBox.bind(this)}
        />
      </View>
    );
  }
}

const styles = {
  profileImgContainer: {
    marginLeft: 8,
    height: 80,
    width: 80,
    borderRadius: 40,
    overflow: "hidden",
    borderColor: "#007aff",
    borderWidth: 1
  },
  errorTextStyle: {
    fontSize: 20,
    alignSelf: "center",
    color: "red"
  }
};

export default ForgetPassword;
