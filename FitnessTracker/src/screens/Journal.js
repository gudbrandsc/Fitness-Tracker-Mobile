import React, { Component } from "react";
import { View, TextInput, AsyncStorage } from "react-native";
import { Button, Spinner } from "../components/common";
import DropdownMenu from "react-native-dropdown-menu";
import AnimationErrorBox from "../components/common/AnimationErrorBox"; // this uses export default so can't be in {}
import { Avatar } from "react-native-elements";
import axios from "axios";
import ImagePicker from "react-native-image-picker";

/**
 * This is the alert box shown when the user wants to add a picture used by the react-native-image-picker library
 */
const options = {
  title: "Add Journal Picture",
  takePhotoButtonTitle: "Take a photo",
  chooseFromLibraryButtonTitle: "Choose photo from library"
};

/**
 * A script that allows the user to add a journal and to see all the journals added previously
 * with the ability to update or delete any journal selected. The user can upload a picture with the journal if s/he wants.
 */
class Journal extends Component {
  static navigationOptions = {
    headerTitle: "Journal",
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

  state = {
    id: "",
    error: "",
    loading: false,
    animationErrorHeight: "0.5%",
    dropdownText: "",
    dropdownData: [["New Journal"]],
    journalText: "",
    journalsAllData: [],
    journalPlaceholder: "Write your journal",
    dropDownIndex: 0,
    avatarSource:
      "https://res.cloudinary.com/fitnesstracker/image/upload/v1541611311/blankImg.jpg",
    picName: "",
    picData: null
  };

  componentDidMount() {
    this.retrieveDetails();
  }

  /**
   * A function that gets the user id from Async Storage and calls the API to get all the journals added
   * previously by the user. On success, it adds saves the list of journals and create another dropdown list
   * that contains part of the journal text with the date it was added.
   */
  retrieveDetails = async () => {
    try {
      const id = await AsyncStorage.getItem("login");
      this.setState({ id });
      fetch("http://localhost:8000/api/getjournalentries/" + id, {
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
            console.log(res.status);
            if (res.status === 200) {
              const journalsAllData = res.data.Journals;
              this.setState({ journalsAllData });
              var dropdownData = [["New Journal"]];
              for (var i = 0; i < journalsAllData.length; i++) {
                // get part of the journal text
                const journalHeader =
                  journalsAllData[i].Journal.substring(0, 25) + "...";
                const journalDate = new Date(journalsAllData[i].createdAt); // save the creation date of the journal
                dropdownData[0].push(
                  journalHeader + " " + journalDate.toDateString()
                );
              }
              this.setState({ dropdownData });
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
   * A function that accepts mode (Add, update, re-add) and first checks if the user typed anything and there is a text, then it
   * checks if the picName is not empty which means that the user uploaded a picture from the device. So it sends the picture in a Form format
   * to the backend to upload it then it calls the suitable function depending on the "mode" passed to it.
   */
  uploadImage(mode) {
    this.setState({
      error: "",
      loading: true,
      animationErrorHeight: "0.5%"
    });
    const journalText = this.state.journalText.trim();
    if (
      this.state.picName !== "" &&
      journalText &&
      journalText !== "[Deleted]"
    ) {
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
            this.setState({ avatarSource: response.data, picName: "" });
            if (mode === 0) this.addJournal();
            else if (mode === 1) this.updateJournal();
            else this.reAddJournal();
          }.bind(this)
        )
        .catch(
          function(error) {
            this.onFailure("Couldn't upload the picture.");
          }.bind(this)
        );
    } else {
      if (mode === 0) this.addJournal();
      else if (mode === 1) this.updateJournal();
      else this.reAddJournal();
    }
  }

  /**
   * A function that resets the source and picName to their default values
   */
  deletePicture() {
    this.setState({
      avatarSource:
        "https://res.cloudinary.com/fitnesstracker/image/upload/v1541611311/blankImg.jpg",
      picName: ""
    });
  }

  /**
   * A function that accepts an error string message and change the state to show the Error Animation Box Component.
   */
  onFailure(err) {
    this.setState({ error: err, loading: false, animationErrorHeight: "auto" });
  }

  /**
   * A function that resets the loading variable in the state and closes the Error Animation Box Component.
   */
  onSuccess() {
    this.setState({ loading: false, error: "", animationErrorHeight: "0.5%" });
  }

  /**
   * A function called when an option in the drop down menu is selected. If the index is 0, it means the selected option
   * is "Add Journal" so the components and variables will be reset and updated.
   * Otherwise, the option is a previously added journal. So the function gets the text and the image of the joutnal from allJournals list
   * and updates the variables to render it.
   */
  updateJournalElements(index) {
    if (index === 0) {
      this.setState({
        journalPlaceholder: "Write your journal",
        journalText: "",
        dropDownIndex: 0,
        avatarSource:
          "https://res.cloudinary.com/fitnesstracker/image/upload/v1541611311/blankImg.jpg"
      });
    } else {
      const allJournals = this.state.journalsAllData;
      const text = allJournals[index - 1].Journal;
      var avatarSource = allJournals[index - 1].imageurl;
      if (avatarSource === null) {
        this.deletePicture();
        this.setState({
          journalPlaceholder: "",
          journalText: text,
          dropDownIndex: index
        });
      } else {
        this.setState({
          journalPlaceholder: "",
          journalText: text,
          dropDownIndex: index,
          avatarSource
        });
      }
    }
  }

  /**
   * A function that checks if the journal text is not empty and not "[Deleted]" because this keyword is only reserved for deleted
   * journals that can be re-added again. Then it calls the api and pass all the required data to add the journal. On success,
   * the journal is added to the dropdown data and to the journal list and updateJournalElements function is called in addition to OnSuccess
   * function.
   */
  addJournal() {
    try {
      const journalText = this.state.journalText.trim();
      if (journalText && journalText !== "[Deleted]") {
        const id = this.state.id;
        const journalText = this.state.journalText.trim();
        var avatarSource = this.state.avatarSource;
        if (
          avatarSource ===
          "https://res.cloudinary.com/fitnesstracker/image/upload/v1541611311/blankImg.jpg"
        )
          avatarSource = null;
        fetch("http://localhost:8000/api/appendjournal", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            Journal: journalText,
            UserId: id,
            ImageUrl: avatarSource
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
              console.log(res.status);
              if (res.status === 200) {
                console.log(res.data.journalEntry);
                const journalHeader =
                  res.data.journalEntry.Journal.substring(0, 25) + "...";
                const journalDate = new Date(res.data.journalEntry.createdAt);
                const dropdownData = [...this.state.dropdownData];
                dropdownData[0].push(
                  journalHeader + " " + journalDate.toDateString()
                );
                const journalsAllData = [...this.state.journalsAllData];
                journalsAllData.push(res.data.journalEntry);
                this.setState({
                  dropdownData,
                  journalsAllData,
                  avatarSource:
                    "https://res.cloudinary.com/fitnesstracker/image/upload/v1541611311/blankImg.jpg"
                });
                this.updateJournalElements(0);
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
      } else {
        this.onFailure("Invalid journal text");
      }
    } catch (error) {
      this.onFailure("Can't get Data. Please check internet connectivity.");
    }
  }

  /**
   * A function that checks if the journal text is not empty and not "[Deleted]" because this keyword is only reserved for deleted
   * journals that can be re-added again. Then it calls the api and pass all the required data to "re-add" the journal after deleting it.
   * On success, the journal is updated in the dropdown data and in the journal list again
   */
  reAddJournal() {
    try {
      const journalText = this.state.journalText.trim();
      if (journalText && journalText !== "[Deleted]") {
        const id = this.state.id;
        const journalText = this.state.journalText.trim();
        var avatarSource = this.state.avatarSource;
        if (
          avatarSource ===
          "https://res.cloudinary.com/fitnesstracker/image/upload/v1541611311/blankImg.jpg"
        )
          avatarSource = null;
        fetch("http://localhost:8000/api/appendjournal", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            Journal: journalText,
            UserId: id,
            ImageUrl: avatarSource
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
              console.log(res.status);
              if (res.status === 200) {
                const index = this.state.dropDownIndex - 1;
                const journalHeader =
                  res.data.journalEntry.Journal.substring(0, 25) + "...";
                const journalDate = new Date(res.data.journalEntry.createdAt);
                const dropdownData = [...this.state.dropdownData];
                dropdownData[0][index + 1] =
                  journalHeader + " " + journalDate.toDateString(); // update the re-added journal in the dropdown
                const journalsAllData = this.state.journalsAllData;
                journalsAllData[index] = res.data.journalEntry; // update the re-added journal in the Journals List
                this.setState({ dropdownData, journalsAllData });
                console.log(journalsAllData);
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
      } else {
        this.onFailure("Invalid journal text");
      }
    } catch (error) {
      this.onFailure("Can't get Data. Please check internet connectivity.");
    }
  }

  /**
   * A function that checks if the journal text is not empty and not "[Deleted]" because this keyword is only reserved for deleted
   * journals that can be re-added again.
   * Then it calls the api and pass all the required data to update a selected journal.
   * On success, the journal is updated in the dropdown data and in the journal list.
   */
  updateJournal() {
    try {
      const journalText = this.state.journalText.trim();
      if (journalText && journalText !== "[Deleted]") {
        const index = this.state.dropDownIndex - 1;
        const allJournals = this.state.journalsAllData;
        var avatarSource = this.state.avatarSource;
        if (
          avatarSource ===
          "https://res.cloudinary.com/fitnesstracker/image/upload/v1541611311/blankImg.jpg"
        )
          avatarSource = null;
        console.log(allJournals[index]);
        const journalId = allJournals[index].id;
        const journalText = this.state.journalText.trim();

        fetch("http://localhost:8000/api/updatejournal", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            journal: journalText,
            id: journalId + "",
            ImageUrl: avatarSource
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
                const index = this.state.dropDownIndex - 1;
                const journalHeader = res.data.Journal.substring(0, 25) + "...";
                const journalDate = new Date(res.data.createdAt);
                const dropdownData = [...this.state.dropdownData];
                dropdownData[0][index + 1] =
                  journalHeader + " " + journalDate.toDateString();
                const journalsAllData = this.state.journalsAllData;
                journalsAllData[index] = res.data;
                this.setState({ dropdownData, journalsAllData });
                console.log(journalsAllData);
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
      } else {
        this.onFailure("Invalid journal text");
      }
    } catch (error) {
      this.onFailure("Can't get Data. Please check internet connectivity.");
    }
  }

  /**
   * A function that deletes a selected journal. On success it doesn't remove it from the Journals List just to give the user
   * a second chance to add it again. But it updates its title in the dropdown to "[Deleted]" as an indicator that this journal is
   * deleted.
   */
  deleteJournal() {
    try {
      this.setState({
        error: "",
        loading: true,
        animationErrorHeight: "0.5%"
      });
      const index = this.state.dropDownIndex - 1;
      const allJournals = this.state.journalsAllData;
      const journalId = allJournals[index].id;
      console.log(allJournals[index] + " \nand the id is " + journalId);

      fetch("http://localhost:8000/api/removejournal/" + journalId, {
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
              console.log("The id is " + journalId);
              const index = this.state.dropDownIndex - 1;
              const dropdownData = [...this.state.dropdownData];
              dropdownData[0][index + 1] = "[Deleted]";
              this.setState({
                dropdownData,
                dropdownText: "[Deleted]"
              });
              this.updateJournalElements(index + 1);
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
  }

  /**
   * A function that renders the buttons for the Journals depending on the index selected from the drop down menu.
   * If the index = 0, it means that "Add Journal" so show the "Add" Button.
   * If the index is not 0 but the title of the selected journal is "[Deleted]" then show "Re-Add" button
   * because the journal is deleted.
   * Otherwise, show the "Delete" and "Update" buttons.
   * All the buttons call uploadImage and pass the mode to it. To handle the case of a picture was selected with the journal.
   */
  renderButton() {
    if (this.state.loading) {
      return <Spinner size="small" />;
    }
    if (this.state.dropDownIndex === 0) {
      return (
        <View
          style={{
            flex: 1
          }}
        >
          <View
            style={{
              height: 33,
              width: "30%",
              alignSelf: "center"
            }}
          >
            <Button
              size={"large"}
              type="primary"
              onPress={() => this.uploadImage(0)}
            >
              Add
            </Button>
          </View>
        </View>
      );
    } else {
      if (
        this.state.dropdownData[0][this.state.dropDownIndex] === "[Deleted]"
      ) {
        return (
          <View
            style={{
              flex: 1
            }}
          >
            <View
              style={{
                height: 33,
                width: "30%",
                alignSelf: "center"
              }}
            >
              <Button
                size={"large"}
                type="secondary"
                onPress={() => this.uploadImage(2)}
              >
                Re-Add
              </Button>
            </View>
          </View>
        );
      }
      return (
        <View style={this.styles.JournalButtonsContainer}>
          <View
            style={{
              justifyContent: "center",
              height: 75,
              width: 75
            }}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start"
            }}
          >
            <View
              style={{
                height: 33,
                width: 110
              }}
            >
              <Button
                size={"large"}
                type="success"
                onPress={() => this.uploadImage(1)}
              >
                Update
              </Button>
            </View>
            <View
              style={{
                height: 33,
                width: 140
              }}
            >
              <Button
                size={"large"}
                type="danger"
                onPress={this.deleteJournal.bind(this)}
              >
                Delete
              </Button>
            </View>
          </View>
        </View>
      );
    }
  }

  /**
   * A function called when pressing the close button in the animation error box
   */
  onCloseAnimationBox() {
    this.setState({ error: "", animationErrorHeight: "0.5%" });
  }

  /**
   * Main built in render function that loads the whole page
   */
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#f4f4f4" }}>
        <DropdownMenu
          style={{ flex: 1, height: "100%" }}
          bgColor={"white"}
          tintColor={"#666666"}
          activityTintColor={"#0071ec"}
          handler={(selection, row) => {
            const data = this.state.dropdownData;
            this.setState({ dropdownText: data[selection][row] });
            this.updateJournalElements(row);
          }}
          data={this.state.dropdownData}
        >
          <View style={this.styles.journalInputContainer}>
            <TextInput
              placeholder={this.state.journalPlaceholder}
              style={this.styles.inputStyle}
              editable={true}
              value={this.state.journalText}
              onChangeText={journalText => this.setState({ journalText })}
              multiline={true}
            />
          </View>
          <View style={this.styles.ImageContainer}>
            <View style={{ justifyContent: "center" }}>
              <Avatar
                large
                source={{
                  uri: this.state.avatarSource
                }}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <View
                style={{
                  width: 110,
                  height: 50,
                  marginTop: "5%"
                }}
              >
                <Button
                  size={"large"}
                  type="success"
                  onPress={this.selectImage.bind(this)}
                >
                  Add image
                </Button>
              </View>
              <View style={{ width: 140, height: 50, marginTop: "5%" }}>
                <Button
                  size={"large"}
                  type="secondary"
                  onPress={this.deletePicture.bind(this)}
                >
                  Remove image
                </Button>
              </View>
            </View>
          </View>
          {this.renderButton()}
          <AnimationErrorBox
            errorMsg={this.state.error}
            viewHeight={this.state.animationErrorHeight}
            onPress={this.onCloseAnimationBox.bind(this)}
          />
        </DropdownMenu>
      </View>
    );
  }

  styles = {
    inputStyle: {
      color: "#000",
      paddingRight: 5,
      paddingLeft: 5,
      fontSize: 18,
      borderColor: "gray",
      borderWidth: 0.5,
      height: "100%",
      textAlignVertical: "top",
      backgroundColor: "white"
    },
    journalInputContainer: {
      marginTop: 15,
      marginBottom: 5,
      marginLeft: 6,
      marginRight: 6,
      height: "60%"
    },
    ImageContainer: {
      height: "15%",
      width: "95%",
      marginTop: 5,
      marginBottom: 10,
      marginLeft: 6,
      marginRight: 6,
      flexDirection: "row",
      justifyContent: "space-between"
    },
    JournalButtonsContainer: {
      height: "auto",
      width: "95%",
      marginLeft: 6,
      marginRight: 6,
      flexDirection: "row",
      justifyContent: "space-between"
    }
  };
}

export default Journal;
