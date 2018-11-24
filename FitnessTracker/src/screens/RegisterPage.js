import React, { Component } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import ImagePicker from "react-native-image-picker";
import {
  Card,
  CardSection,
  Button,
  Input,
  Spinner
} from "../components/common";
import AnimationErrorBox from "../components/common/AnimationErrorBox"; // this uses export default so can't be in {}
import { Avatar } from "react-native-elements";
import axios from "axios";

const options = {
  title: "Profile Picture",
  takePhotoButtonTitle: "Take a photo",
  chooseFromLibraryButtonTitle: "Choose photo from library"
};

class RegisterPage extends Component {
  static navigationOptions = {
    headerTitle: "Create Account"
  };

  state = {
    id: "",
    fname: "",
    lname: "",
    weight: "",
    street: "",
    city: "",
    _state: "",
    zipcode: "",
    email: "",
    password: "",
    error: "",
    loading: false,
    avatarSource:
      "https://res.cloudinary.com/fitnesstracker/image/upload/v1540766575/blank-profile-picture.png",
    picName: "",
    picData: null,
    animationErrorHeight: "0.5%"
  };

  selectImage = () => {
    ImagePicker.showImagePicker(options, response => {

      if (response.didCancel) {
        //TODO fix this 
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("Image Picker Error: ", response.error);
      } else {
        this.setState({
          avatarSource: response.uri,
          picData: response.data,
          picName: response.fileName
        });
      }
    });
  };

  uploadImage() {
    var bodyFormData = new FormData();
    bodyFormData.append("data", this.state.picData);
    bodyFormData.append("filename", this.state.picName);
    bodyFormData.append("name", "image");

    axios({
      method: "post",
      url: "http://localhost:8000/api/uploadfile",
      data: bodyFormData,
      config: { headers: { enctype: "multipart/form-data" } }
    })
      .then(
        function(response) {
          this.setState({ avatarSource: response.data });
          this.handleRegister();
        }.bind(this)
      )
      .catch(function(response) {
        this.handleRegister();
      });
  }

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
    var weightMatch = regexZipCode.test(this.state.weight);
    if (this.state.zipcode.length > 5) zipCodeMatch = false;

    if (!fnameMatch) {
      const error = "First name is invalid.";
      this.setState({ error });
      this.setState({ animationErrorHeight: "auto" });
    } else if (!lnameMatch) {
      const error = "Last name is invalid.";
      this.setState({ error });
      this.setState({ animationErrorHeight: "auto" });
    } else if (!emailMatch) {
      const error = "Wrong Email Format.";
      this.setState({ error });
      this.setState({ animationErrorHeight: "auto" });
    } else if (!weightMatch) {
      const error = "Wrong Weight Format (only numbers).";
      this.setState({ error });
      this.setState({ animationErrorHeight: "auto" });
    } else if (!passwordMatch) {
      const error =
        "Password should be minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character";
      this.setState({ error });
      this.setState({ animationErrorHeight: "auto" });
    } else if (!streetMatch) {
      const error = "Street Address Format is invalid";
      this.setState({ error });
      this.setState({ animationErrorHeight: "auto" });
    } else if (!cityMatch) {
      const error = "City Format is invalid";
      this.setState({ error });
      this.setState({ animationErrorHeight: "auto" });
    } else if (!stateMatch) {
      const error = "State Format is invalid";
      this.setState({ error });
      this.setState({ animationErrorHeight: "auto" });
    } else if (!zipCodeMatch) {
      const error = "Zipcode Format is invalid";
      this.setState({ error });
      this.setState({ animationErrorHeight: "auto" });
    } else {
      this.setState({ error: "", loading: true, animationErrorHeight: "0.5%" });
      if (this.state.picData !== null) this.uploadImage();
      else this.handleRegister();
    }
  }

  /**
   * A function that sends a register request to the backend to store the data
   */
  handleRegister() {
    try {
      fetch("http://localhost:8000/api/userregistration", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ImageUrl: this.state.avatarSource,
          FirstName: this.state.fname,
          LastName: this.state.lname,
          UserName: this.state.email,
          Password: this.state.password,
          StreetAddress: this.state.street,
          City: this.state.city,
          State: this.state._state,
          Zipcode: this.state.zipcode,
          Weight: parseInt(this.state.weight, 10)
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
            if (res.status === 201) {
              const id = res.data.id;
              this.setState({ id });
              this.onRegisterSuccess();
            } else {
              this.onRegisterFail("Registration failed.");
            }
          },
          error => {
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

  onRegisterFail(err) {
    this.setState({ error: err, loading: false, animationErrorHeight: "auto" });
  }

  onRegisterSuccess() {
    this.setState({
      fname: "",
      lname: "",
      email: "",
      password: "",
      street: "",
      weight: "",
      city: "",
      _state: "",
      zipcode: "",
      loading: false,
      error: "",
      animationErrorHeight: "0.5%"
    });
    this.props.navigation.navigate("Login");
  }

  /**
   * A function called when pressing the Register button
   */
  renderButton() {
    if (this.state.loading) {
      return <Spinner size="small" />;
    }

    return (
      <Button onPress={this.validateInput.bind(this)}>Create Account</Button>
    );
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
            <View style={styles.profileImgContainer}>
              <Avatar
                large
                rounded
                source={{
                  uri: this.state.avatarSource
                }}
              />
            </View>
            <View
              style={{ justifyContent: "center", flex: 1, marginLeft: "10%" }}
            >
              <TouchableOpacity onPress={this.selectImage}>
                <Text style={{ color: "#00aad5", fontSize: 18 }}>
                  Select Profile Picture
                </Text>
              </TouchableOpacity>
            </View>
          </CardSection>
          <CardSection>
            <Input
              placeholder="First Name"
              label="First Name"
              value={this.state.fname}
              onChangeText={fname => this.setState({ fname })}
            />
          </CardSection>
          <CardSection>
            <Input
              placeholder="Last Name"
              label="Last Name"
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
              placeholder="Weight in lbs"
              label="Weight"
              value={this.state.weight}
              onChangeText={weight => this.setState({ weight })}
            />
          </CardSection>
          <CardSection>
            <Input
              placeholder="Street Address"
              label="Street"
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
              label="Zipcode"
              value={this.state.zipcode}
              onChangeText={zipcode => this.setState({ zipcode })}
            />
          </CardSection>
          <CardSection>{this.renderButton()}</CardSection>
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
    marginLeft: 8
  },
  errorTextStyle: {
    fontSize: 20,
    alignSelf: "center",
    color: "red"
  }
};

export default RegisterPage;
