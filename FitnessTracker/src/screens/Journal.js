import React, { Component } from "react";
import { View, TextInput, AsyncStorage } from "react-native";
import { Button, Spinner } from "../components/common";
import DropdownMenu from "react-native-dropdown-menu";
import AnimationErrorBox from "../components/common/AnimationErrorBox"; // this uses export default so can't be in {}
import { Avatar } from "react-native-elements";
import axios from "axios";
import ImagePicker from "react-native-image-picker";

const options = {
  title: "Add Journal Picture",
  takePhotoButtonTitle: "Take a photo",
  chooseFromLibraryButtonTitle: "Choose photo from library"
};

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
                const journalHeader =
                  journalsAllData[i].Journal.substring(0, 25) + "...";
                const journalDate = new Date(journalsAllData[i].createdAt);
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
            this.setState({
              avatarSource:
                "https://res.cloudinary.com/fitnesstracker/image/upload/v1541611311/blankImg.jpg"
            });
            this.onFailure("Couldn't upload the picture.");
          }.bind(this)
        );
    } else {
      if (mode === 0) this.addJournal();
      else if (mode === 1) this.updateJournal();
      else this.reAddJournal();
    }
  }

  deletePicture() {
    this.setState({
      avatarSource:
        "https://res.cloudinary.com/fitnesstracker/image/upload/v1541611311/blankImg.jpg",
      picName: ""
    });
  }

  onFailure(err) {
    this.setState({ error: err, loading: false, animationErrorHeight: "auto" });
  }

  onSuccess() {
    this.setState({ loading: false, error: "", animationErrorHeight: "0.5%" });
  }

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
      this.setState({
        journalPlaceholder: "",
        journalText: text,
        dropDownIndex: index,
        avatarSource: allJournals[index - 1].imageurl
      });
    }
  }

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
                  journalHeader + " " + journalDate.toDateString();
                const journalsAllData = this.state.journalsAllData;
                journalsAllData[index] = res.data.journalEntry;
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
                onPress={() => this.uploadImage(3)}
              >
                Re-Add
              </Button>
            </View>
          </View>
        );
      }
      return (
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignSelf: "center"
          }}
        >
          <View
            style={{
              height: 33,
              width: "30%",
              marginRight: 20
            }}
          >
            <Button
              size={"large"}
              type="success"
              onPress={() => this.uploadImage(2)}
            >
              Update
            </Button>
          </View>
          <View
            style={{
              height: 33,
              width: "30%"
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
      );
    }
  }

  /**
   * A function called when pressing the close button in the animation error box
   */
  onCloseAnimationBox() {
    this.setState({ error: "", animationErrorHeight: "0.5%" });
  }

  render() {
    const styles = {
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
        width: "100%",
        marginTop: 5,
        marginBottom: 20,
        marginLeft: "2%",
        marginRight: 6,
        flexDirection: "row"
      }
    };
    return (
      <View style={{ flex: 1, backgroundColor: '#f7f6ef' }}>
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
          <View style={styles.journalInputContainer}>
            <TextInput
              placeholder={this.state.journalPlaceholder}
              style={styles.inputStyle}
              editable={true}
              value={this.state.journalText}
              onChangeText={journalText => this.setState({ journalText })}
              multiline={true}
            />
          </View>
          <View style={styles.ImageContainer}>
            <View>
              <Avatar
                large
                source={{
                  uri: this.state.avatarSource
                }}
              />
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center"
              }}
            >
              <View
                style={{
                  width: 120,
                  height: 50,
                  marginRight: 10,
                  marginLeft: 15,
                  marginTop: "5%"
                }}
              >
                <Button
                  size={"large"}
                  type="success"
                  onPress={this.selectImage.bind(this)}
                >
                  Add Picture
                </Button>
              </View>
              <View style={{ width: 150, height: 50, marginTop: "5%" }}>
                <Button
                  size={"large"}
                  type="secondary"
                  onPress={this.deletePicture.bind(this)}
                >
                  Remove Picture
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
}

export default Journal;
