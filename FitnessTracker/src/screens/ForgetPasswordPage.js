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

class ForgetPassword extends Component {
  static navigationOptions = {
    headerTitle: "Forget Password"
  };

  state = {
    email: "",
    error: "",
    loading: false,
    animationErrorHeight: "0.5%",
    successMsg: ""
  };

  /**
   * A function that validates all the inputs.
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

  sendEmail() {
    try {
      this.setState({
        loading: true,
        error: "",
        animationErrorHeight: "0.5%"
      });
      fetch("http://10.1.86.4:8000/api/getnewpassword", {
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
            console.log(res);
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

  onSendingFailed(err) {
    this.setState({
      email: "",
      error: err,
      loading: false,
      animationErrorHeight: "auto",
      successMsg: ""
    });
  }

  onSendingSuccess() {
    this.setState({
      email: "",
      loading: false,
      error: "",
      animationErrorHeight: "0.5%"
    });
  }

  /**
   * A function called when pressing the Register button
   */
  renderButton() {
    if (this.state.loading) {
      return <Spinner size="small" />;
    }

    return <Button onPress={this.validateInput.bind(this)}>Send</Button>;
  }

  /**
   * A function called when pressing the close button in the animation error box
   */
  onCloseAnimationBox() {
    this.setState({ error: "", animationErrorHeight: "0.5%" });
  }

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
