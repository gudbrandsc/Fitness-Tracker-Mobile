import React, { Component } from "react";
import AnimationErrorBox from "../components/common/AnimationErrorBox"; // this uses export default so can't be in {}
import {
  AsyncStorage,
  View,
  ScrollView,
  Text,
  TouchableOpacity
} from "react-native";
import ImagePicker from "react-native-image-picker";
import {
  Card,
  CardSection,
  Button,
  Input,
  Spinner
} from "../components/common";
import { Avatar } from "react-native-elements";
import axios from "axios";

/**
 * This is the alert box shown when the user wants to add a picture used by the react-native-image-picker library
 */
const options = {
  title: "Profile Picture",
  takePhotoButtonTitle: "Take a photo",
  chooseFromLibraryButtonTitle: "Choose photo from library"
};

/**
 * Script that allows the user all his details like First name, Last name, Email, Passoword, Picture, Weight, and Address.
 * Also the user can update his details and Logout.
 */
class ProfileDetails extends Component {
  state = {
    fullName: "",
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

  static navigationOptions = {
    headerTitle: "Details",
    headerStyle: {
      backgroundColor: "#00e6d3",
      height: 60
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontWeight: "600",
      color: "#fff",
      fontSize: 22,
      fontFamily: "arial"
    }
  };

  componentDidMount() {
    this.retrieveWeight();
  }

  /**
   * A function that gets the ID and password from the Async Storage and calls an API to get a list of weights of the user
   * and get the current weight (last element in the weight list), then calls retrieveDetails and pass the current weight to it.
   */
  retrieveWeight = async () => {
    try {
      const id = await AsyncStorage.getItem("login");
      const pw = await AsyncStorage.getItem("pass");
      this.setState({ id, password: pw });
      axios.get("http://localhost:8000/api/getweight/" + id).then(
        function(response) {
          const data = response.data;
          const weightList = [];
          for (var i = 0; i < data.length; i++) {
            weightList.push(data[i].Weight);
          }
          var currentWeight = "0";
          if (weightList.length > 0)
            currentWeight = weightList[weightList.length - 1] + "";
          this.retrieveDetails(currentWeight);
        }.bind(this)
      );
    } catch (error) {
      this.onFailure("Can't get Data. Please check internet connectivity.");
    }
  };

  /**
   * A function that calls an API to get all the user's details. On success, it updates the variables in the state including the
   * weight variable passed to it too.
   */
  retrieveDetails(weight) {
    const id = this.state.id;
    fetch("http://localhost:8000/api/user_details/" + id, {
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
              _state: res.data.State,
              fullName: res.data.FirstName + " " + res.data.LastName,
              avatarSource: res.data.ImageUrl,
              weight
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
          this.onFailure("Can't get Data. Please check internet connectivity.");
        }
      );
  }

  /**
   * A built in function for react-native-image-picker library that handles loading the picture from the mobile.
   * If the picture was successfully loaded from the device, save the picture's url, data, and name to the state.
   */
  selectImage = () => {
    ImagePicker.showImagePicker(options, response => {
      console.log("Response = ", response);

      if (response.didCancel) {
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

  /**
   * A function that sends the picture loaded from the device to backend in a FormData format.
   * On successful or failure, the function will call handleUpdate function to update the user's details.
   */
  uploadImage() {
    var bodyFormData = new FormData();
    bodyFormData.append("data", this.state.picData);
    bodyFormData.append("filename", this.state.picName);
    bodyFormData.append("name", "image");

    console.log("Uploading.. \n" + bodyFormData);
    axios({
      method: "post",
      url: "http://localhost:8000/api/uploadfile",
      data: bodyFormData,
      config: { headers: { enctype: "multipart/form-data" } }
    })
      .then(
        function(response) {
          this.setState({ avatarSource: response.data });
          console.log(response);
          this.handleUpdate();
        }.bind(this)
      )
      .catch(function(response) {
        console.log(response);
        this.handleUpdate();
      });
  }

  /**
   * A function that validates all the inputs. If all input are valid then check if the picData variable.
   * If it is null, it means the user didn't load a new picture, so call handleUpdate function. Otherwise
   * call uploadImage to upload the image then update user's details.
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
      else this.handleUpdate();
    }
  }

  /**
   * A function that calls an API and pass to it all required data to update user's details. On success, it updates the variables
   * in the state, then calls storeDataIsolatedStorage and updateWeight functions.
   */
  handleUpdate() {
    try {
      const id = this.state.id;
      fetch("http://localhost:8000/api/userregistration/" + id + "/update", {
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
              const fullName = this.state.fname + " " + this.state.lname;
              this.setState({ id, fullName });
              this.storeDataIsolatedStorage();
              this.updateWeight(id);
              // this will update the name and picture by calling the updateInfo function in the ProfilePage script
              const { params } = this.props.navigation.state;
              params.updateInfo(fullName, this.state.avatarSource);
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
   * A function that calls an API to append the weight of the user to his/her weight table.
   */
  updateWeight(id) {
    try {
      fetch("http://localhost:8000/api/updateweight", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          UserId: id,
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
            if (res.status === 200) {
              console.log("Weight updated");
              this.onSuccess();
            } else {
              this.onFailure("Update failed. Try again.");
              console.log("Weight update Failed");
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
   * Then it calls the onLoginSuccess function.
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

  /**
   * A function that accepts an error string message and change the state to show the Error Animation Box Component.
   */
  onFailure(err) {
    this.setState({ error: err, loading: false, animationErrorHeight: "auto" });
  }

  /**
   * A function that resets the loading variable and hides the Error Animation Box Component.
   */
  onSuccess() {
    this.setState({ loading: false, error: "", animationErrorHeight: "0.5%" });
  }

  /**
   * A function called by the "Logout" button. It deletes all the data stored in the Async Storage,
   * then navigates to the "TopAuthPageRouter"
   */
  logout = async () => {
    try {
      await AsyncStorage.removeItem("Usertoken").then(() => {
        return AsyncStorage.removeItem("pass").then(() => {
          return AsyncStorage.removeItem("login").then(() => {
            this.props.navigation.navigate("topAuthPage");
          });
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * A function that renders the Update button, if loading is true then show a spinner. Otherwise, show the button
   */
  renderButton() {
    if (this.state.loading) {
      return <Spinner size="small" />;
    }

    return (
      <Button
        size={"large"}
        type={"success"}
        onPress={this.validateInput.bind(this)}
      >
        Update
      </Button>
    );
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
      <ScrollView>
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
          <CardSection>
            <Button
              size={"large"}
              type={"danger"}
              onPress={this.logout.bind(this)}
            >
              Logout
            </Button>
          </CardSection>
        </Card>
        <AnimationErrorBox
          errorMsg={this.state.error}
          viewHeight={this.state.animationErrorHeight}
          onPress={this.onCloseAnimationBox.bind(this)}
        />
      </ScrollView>
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

export default ProfileDetails;
