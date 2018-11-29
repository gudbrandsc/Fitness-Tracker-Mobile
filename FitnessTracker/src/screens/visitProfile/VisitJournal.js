import React, { Component } from "react";
import { ScrollView, View, Text, Dimensions, Image } from "react-native";
import DropdownMenu from "react-native-dropdown-menu";
import AnimationErrorBox from "../../components/common/AnimationErrorBox"; // this uses export default so can't be in {}

class VisitJournal extends Component {
  static navigationOptions = {
    headerTitle: "Journal"
  };

  state = {
    visitedUserId: "",
    error: "",
    loading: false,
    animationErrorHeight: "0.5%",
    journalText: "",
    dropdownText: "",
    dropdownData: [[]],
    journalsAllData: [],
    dropDownIndex: 0,
    journalImgSource: null
  };

  componentDidMount() {
    if (this.props.screenProps.visitedUserId !== undefined){
      try {
        const visitedUserId = this.props.screenProps.visitedUserId;
        this.setState({ visitedUserId });
        fetch("http://localhost:8000/api/getjournalentries/" + visitedUserId, {
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
                const journalsAllData = res.data.Journals;
                var dropdownData = [[]];
                for (var i = 0; i < journalsAllData.length; i++) {
                  const journalHeader =
                    journalsAllData[i].Journal.substring(0, 25) + "...";
                  const journalDate = new Date(journalsAllData[i].createdAt);
                  dropdownData[0].push(
                    journalHeader + " " + journalDate.toDateString()
                  );
                }

                if (journalsAllData.length > 0) {
                  this.setState({
                    journalsAllData,
                    dropdownData,
                    journalText: journalsAllData[0].Journal,
                    journalImgSource: journalsAllData[0].imageurl
                  });
                } else {
                  this.setState({
                    journalsAllData,
                    dropdownData,
                    journalText: "No Journals to show"
                  });
                }
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
  }

  onFailure(err) {
    this.setState({ error: err, loading: false, animationErrorHeight: "auto" });
  }

  onSuccess() {
    this.setState({ loading: false, error: "", animationErrorHeight: "0.5%" });
  }

  /**
   * A function called when pressing the close button in the animation error box
   */
  onCloseAnimationBox() {
    this.setState({ error: "", animationErrorHeight: "0.5%" });
  }

  updateJournalElements(index) {
    const allJournals = this.state.journalsAllData;
    const text = allJournals[index].Journal;
    this.setState({
      journalText: text,
      dropDownIndex: index,
      journalImgSource: allJournals[index].imageurl
    });
  }

  renderJournalImg() {
    if (this.state.journalImgSource !== null) {
      return (
        <View style={this.styles.ImageContainer}>
          <Image
            style={{
              flex: 1,
              alignSelf: "stretch"
            }}
            source={{
              uri: this.state.journalImgSource
            }}
          />
        </View>
      );
    }
    return;
  }

  renderWholePage() {
    if (this.state.journalsAllData.length > 0) {
      return (
        <DropdownMenu
          style={{ flex: 1 }}
          bgColor={"white"}
          tintColor={"#666666"}
          activityTintColor={"#0071ec"}
          maxHeight={Dimensions.get("window").width / 2}
          handler={(selection, row) => {
            const data = this.state.dropdownData;
            this.setState({ dropdownText: data[selection][row] });
            this.updateJournalElements(row);
          }}
          data={this.state.dropdownData}
        >
          <ScrollView>
            <View style={this.styles.journalTextContainer}>
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                {this.state.journalText}
              </Text>
            </View>
            {this.renderJournalImg()}
          </ScrollView>
          <AnimationErrorBox
            errorMsg={this.state.error}
            viewHeight={this.state.animationErrorHeight}
            onPress={this.onCloseAnimationBox.bind(this)}
          />
        </DropdownMenu>
      );
    } else {
      return (
        <View style={this.styles.journalTextContainer}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            {this.state.journalText}
          </Text>
        </View>
      );
    }
  }

  render() {
    return <View style={{ flex: 1, backgroundColor: '#f7f6ef' }}>{this.renderWholePage()}</View>;
  }
  styles = {
    journalTextContainer: {
      marginTop: 25,
      marginBottom: 15,
      marginLeft: 10,
      marginRight: 10,
      height: "auto"
    },
    ImageContainer: {
      width: Dimensions.get("window").width - 10,
      height: Dimensions.get("window").width,
      padding: 10
    }
  };
}

export default VisitJournal;
