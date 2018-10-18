import React, { Component } from "react";
import AnimationErrorBox from "../components/common/AnimationErrorBox"; // this uses export default so can't be in {}
import {
  AsyncStorage,
  View,
  Text,
  TouchableOpacity,
  Image
} from "react-native";
import ImagePicker from "react-native-image-picker";
import {
  Card,
  CardSection,
  Button,
  Input,
  Spinner
} from "../components/common";

const options = {
  title: "Profile Picture",
  takePhotoButtonTitle: "Take a photo",
  chooseFromLibraryButtonTitle: "Choose photo from library"
};

class ProfileDetails extends Component {
  state = {
    id: "",
    fname: "",
    lname: "",
    street: "",
    city: "",
    _state: "",
    zipcode: "",
    email: "",
    password: "",
    error: "",
    loading: false,
    avatarSource: require("../components/UIdesign/blank-profile-picture.png"),
    pic: null,
    animationErrorHeight: "0.5%"
  };

  static navigationOptions = {
    headerTitle: "Details"
  };

  componentDidMount() {
    this.retrieveDetails();
  }

  retrieveDetails = async () => {
    try {
      const id = await AsyncStorage.getItem("login");
      const pw = await AsyncStorage.getItem("pass");
      this.setState({ id: id, password: pw });
      fetch("http://10.1.86.4:8000/api/user_details/" + id, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
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
              console.log("Details retrieved");
              this.setState({
                email: res.data.UserName,
                fname: res.data.FirstName,
                lname: res.data.LastName,
                street: res.data.StreetAddress,
                city: res.data.City,
                zipcode: res.data.Zipcode,
                _state: res.data.State
              });
              this.storeDataIsolatedStorage();
              this.onSuccess();
            } else {
              this.onFailure(
                "Can't get Data. Please check internet connectivity."
              );
            }
          },
          error => {
            console.log(error);
            this.onFailure(
              "Can't get Data. Please check internet connectivity."
            );
          }
        );
    } catch (error) {
      this.onFailure("Can't get Data. Please check internet connectivity.");
    }
  };

  /**
   * A function to select an image from device
   */
  selectImage = () => {
    ImagePicker.showImagePicker(options, response => {
      console.log("Response = ", response);

      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("Image Picker Error: ", response.error);
      } else {
        let source = { uri: response.uri };
        console.log("source", source);
        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          avatarSource: source,
          pic: response.data
        });
      }
    });
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
    } else this.handleUpdate();
  }

  /**
   * A function that sends a Update request to the backend to store the data
   */
  handleUpdate() {
    this.setState({ error: "", loading: true, animationErrorHeight: "0.5%" });
    try {
      const id = this.state.id;
      fetch("http://10.1.86.4:8000/api/userregistration/" + id + "/update", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          FirstName: this.state.fname,
          LastName: this.state.lname,
          UserName: this.state.email,
          Password: this.state.password,
          StreetAddress: this.state.street,
          City: this.state.city,
          State: this.state._state,
          Zipcode: this.state.zipcode
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
              console.log("Details updated");
              const id = res.data.id;
              this.setState({ id });
              this.storeDataIsolatedStorage();
              this.onSuccess();
            } else {
              this.onFailure("Update failed.");
              console.log("Account update Failed");
            }
          },
          error => {
            console.log(error);
            this.onFailure(
              "Update failed. Please check internet connectivity."
            );
          }
        );
    } catch (error) {
      this.onFailure("Update failed. Please check internet connectivity.");
    }
  }

  /**
   * A function that stores login, password, and token to the isolated storage.
   */
  storeDataIsolatedStorage = async () => {
    try {
      const id = this.state.id;
      const pass = this.state.password;
      await AsyncStorage.setItem("login", id.toString()).then(() => {
        return AsyncStorage.setItem("pass", pass.toString()).then(() => {
          this.onSuccess();
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  onFailure(err) {
    this.setState({ error: err, loading: false, animationErrorHeight: "auto" });
  }

  onSuccess() {
    this.setState({ loading: false, error: "", animationErrorHeight: "0.5%" });
  }

  /**
   * A function called when pressing the Update button
   */
  renderButton() {
    if (this.state.loading) {
      return <Spinner size="small" />;
    }

    return (
      <Button
        size={"large"}
        type={"update"}
        onPress={this.validateInput.bind(this)}
      >
        Update
      </Button>
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
              <Image
                source={this.state.avatarSource}
                style={{
                  height: 80,
                  width: 80,
                  borderRadius: 40
                }}
              />
            </View>
            <View
              style={{ justifyContent: "center", flex: 1, marginLeft: "10%" }}
            >
              <TouchableOpacity onPress={this.selectImage}>
                <Text style={{ color: "#007aff", fontSize: 18 }}>
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
              editable={false}
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
/*
<TouchableOpacity onPress={this.uploadPic}>
              <Text>Upload</Text>
            </TouchableOpacity>
            */

export default ProfileDetails;
