import React, { Component } from "react";
import { View, TextInput, AsyncStorage } from "react-native";
import { Card, CardSection, Button, Spinner } from "../components/common";
import DropdownMenu from "react-native-dropdown-menu";
import AnimationErrorBox from "../components/common/AnimationErrorBox"; // this uses export default so can't be in {}

class Journal extends Component {
  static navigationOptions = {
    headerTitle: "Journal"
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
    addingNewJournal: true,
    journalButtonType: "primary",
    journalButtonText: "Add",
    dropDownIndex: 0
  };

  componentDidMount() {
    this.retrieveDetails();
  }

  retrieveDetails = async () => {
    try {
      const id = await AsyncStorage.getItem("login");
      this.setState({ id });
      fetch("http://10.1.86.4:8000/api/getjournalentries/" + id, {
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

  onFailure(err) {
    this.setState({ error: err, loading: false, animationErrorHeight: "auto" });
  }

  onSuccess() {
    this.setState({ loading: false, error: "", animationErrorHeight: "0.5%" });
  }

  updateJournalElements(index) {
    if (index === 0) {
      this.setState({
        journalButtonText: "Add",
        journalButtonType: "primary",
        journalPlaceholder: "Write your journal",
        journalText: "",
        addingNewJournal: true,
        dropDownIndex: 0
      });
    } else {
      const allJournals = this.state.journalsAllData;
      const text = allJournals[index - 1].Journal;
      this.setState({
        journalButtonText: "Update",
        journalButtonType: "green",
        journalPlaceholder: "",
        journalText: text,
        addingNewJournal: false,
        dropDownIndex: index - 1
      });
    }
  }

  ButtonPressed() {
    if (this.state.journalText.trim()) {
      this.setState({ error: "", loading: true, animationErrorHeight: "0.5%" });
      if (this.state.addingNewJournal) this.addJournal();
      else this.updateJournal();
    }
  }

  addJournal() {
    try {
      const id = this.state.id;
      const journalText = this.state.journalText.trim();
      fetch("http://10.1.86.4:8000/api/appendjournal", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          Journal: journalText,
          UserId: id
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
              this.setState({ dropdownData, journalsAllData });
              this.setState({
                journalPlaceholder: "Write your journal",
                journalText: ""
              });
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

  updateJournal() {
    try {
      const index = this.state.dropDownIndex;
      const allJournals = this.state.journalsAllData;
      console.log(allJournals[index]);
      const journalId = allJournals[index].id;
      const journalText = this.state.journalText.trim();

      fetch("http://10.1.86.4:8000/api/updatejournal", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          journal: journalText,
          id: journalId + ""
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
              const index = this.state.dropDownIndex;
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
    } catch (error) {
      this.onFailure("Can't get Data. Please check internet connectivity.");
    }
  }

  renderButton() {
    if (this.state.loading) {
      return <Spinner size="small" />;
    }

    return (
      <Button
        size={"large"}
        type={this.state.journalButtonType}
        onPress={this.ButtonPressed.bind(this)}
      >
        {this.state.journalButtonText}
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
      }
    };
    return (
      <View style={{ flex: 1 }}>
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
          <View
            style={{
              marginTop: 15,
              marginBottom: 20,
              marginLeft: 6,
              marginRight: 6,
              height: "75%"
            }}
          >
            <TextInput
              placeholder={this.state.journalPlaceholder}
              style={styles.inputStyle}
              editable={true}
              value={this.state.journalText}
              onChangeText={journalText => this.setState({ journalText })}
              multiline={true}
            />
          </View>
          <View
            style={{
              height: "6%",
              width: "30%",
              alignSelf: "center"
            }}
          >
            {this.renderButton()}
          </View>
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
