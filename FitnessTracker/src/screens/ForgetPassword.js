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
    const regexEmail = /^\w+[\w-\.]*@\w+((-\w+)|(\w*))(.[a-z]{2,})*$/;
    if (!regexEmail.test(this.state.email)) {
      const error = "Wrong Email Format.";
      this.setState({ error });
      this.setState({ animationErrorHeight: "auto" });
    }
  }

  sendEmail() {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    nodemailer.createTestAccount((err, account) => {
      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: "fitness.tracker.ft", // generated ethereal user
          pass: "Usf2018++" // generated ethereal password
        }
      });

      // setup email data with unicode symbols
      let mailOptions = {
        from:
          '"Fitness Tracker Development Department" <fitness.tracker.ft@gmail.com>', // sender address
        to: this.state.email, // list of receivers
        subject: "Password Retrieval", // Subject line
        text: "Please Check the password Hasan123456@", // plain text body
        html: "<b>Please Check the password Hasan123456@</b>" // html body
      };

      // send mail with defined transport object
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log("Message sent: %s", info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      });
    });
  }

  onRegisterFail(err) {
    this.setState({ error: err, loading: false, animationErrorHeight: "auto" });
  }

  onRegisterSuccess() {
    this.setState({
      email: "",
      loading: false,
      error: "",
      animationErrorHeight: "0.5%",
      successMsg: ""
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
          <CardSection>
            <Text style={{ textAlign: "center", fontSize: 18, color: "green" }}>
              {this.state.successMsg}
            </Text>
          </CardSection>
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
