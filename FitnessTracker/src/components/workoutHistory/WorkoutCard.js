import React, { Component } from "react";
import { TouchableOpacity, StyleSheet, View, Text } from "react-native";
import { Icon, Avatar } from "react-native-elements";
import WorkoutCardSection from "./WorkoutCardSection";

class WorkoutCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: "",
      active: false
    };
  }

  renderSubText() {
    if (this.state.active === false) {
      if (this.props.session.jsonArray.length === 1) {
        return (
          <View>
            <Text style={styles.sessionSmallText}>
              {this.props.session.jsonArray[0].workoutname}
            </Text>
          </View>
        );
      } else if (this.props.session.jsonArray.length === 2) {
        return (
          <View>
            <Text style={styles.sessionSmallText}>
              {this.props.session.jsonArray[0].workoutname},{" "}
              {this.props.session.jsonArray[1].workoutname}{" "}
            </Text>
          </View>
        );
      } else {
        return (
          <View>
            <Text style={styles.sessionSmallText}>
              {this.props.session.jsonArray[0].workoutname},{" "}
              {this.props.session.jsonArray[1].workoutname},{" "}
              {this.props.session.jsonArray[2].workoutname}...{" "}
            </Text>
          </View>
        );
      }
    }
  }
  showEachSession() {
    if (this.state.active === true) {
      return this.props.session.jsonArray.map(exercise => (
        <WorkoutCardSection key={exercise.workoutid} exercise={exercise} />
      ));
    }
  }

  getIcon() {
    if (this.state.active === true) {
      return "remove-circle-outline";
    }
    return "add-circle-outline";
  }

    renderDateText(){
        const dateDiff = Math.abs(
            new Date() - new Date(this.props.session.createddate)
        );

        const seconds = dateDiff / 1000;
        console.log("Calculate seconds "  + seconds/ 86400)

        var date = "";
        if (Math.round(seconds / 86400) !== 0)
          date = Math.round(seconds / 86400) + "d ago";

        else if (Math.round(seconds / 3600) !== 0)
          date = Math.round(seconds / 3600) + "hr ago";

        else if (Math.round(seconds / 60) !== 0)
          date = Math.round(seconds / 60) + "min ago";

        else date = Math.round(seconds) + "sec ago";
        return <Text style={{ fontSize: 12, color: '#636463' }}>{date}</Text>
  }

  render() {
    return (
      <View style={{ paddingTop: 10, padding: 10 }}>
        <View style={styles.container}>
          <View style={styles.dateStyle}>{this.renderDateText()}</View>
          <View
            style={[
              styles.cardStyle,
              this.state.active
                ? styles.cardExpandStyle
                : styles.cardCollapseStyle
            ]}
          >
            <View style={styles.topCardWrapperStyle}>
              <View style={styles.avatarStyle}>
                <Avatar
                  small
                  rounded
                  source={{
                    uri:
                      "https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg"
                  }}
                  activeOpacity={0.7}
                />
              </View>
              <View style={styles.WorkoutNameStyle}>
                <Text style={styles.WorkoutNameTextStyle}>
                  {this.props.session.firstname} {this.props.session.lastname}
                </Text>
                <View>{this.renderSubText()}</View>
              </View>
              <View style={styles.plusSignStyle}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "column",
                    justifyContent: "space-around"
                  }}
                >
                  <TouchableOpacity
                    onPress={() =>
                      this.setState({ active: !this.state.active })
                    }
                  >
                    <Icon name={this.getIcon()} color="#00e7b1" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.inputFieldsWrapper}>
            {this.showEachSession()}
          </View>
        </View>
      </View>
    );
  }
}
export default WorkoutCard;

const styles = StyleSheet.create({
  container: {
    elevation: 1,
    marginLeft: 10,
    marginRight: 10,
    flexDirection: "column", // main axis
    justifyContent: "space-around", // main axis
    backgroundColor: "#fff",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 5,
    shadowOpacity: 0.3
  },
  cardStyle: {
    flexDirection: "column",
    justifyContent: "center",
    paddingTop: 10,
    paddingBottom: 10
  },
  topCardWrapperStyle: {
    flexDirection: "row",
    justifyContent: "center"
  },
  WorkoutNameStyle: {
    justifyContent: "flex-start",
    flex: 1,
    paddingLeft: 10
  },
  plusSignStyle: {
    justifyContent: "flex-end", // main axis
    paddingRight: 10
  },
  inputFieldsWrapper: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between"
  },
  cardExpandStyle: {
    borderBottomWidth: 2,
    borderColor: "#ddd"
  },
  cardCollapseStyle: {},
  inputField: {
    borderRadius: 4,
    borderWidth: 1,
    padding: 5,
    margin: 5,
    flex: 1,
    alignItems: "stretch",
    width: 90
  },
  missingFieldColor: {
    borderColor: "red"
  },
  normalFieldColor: {
    borderColor: "#d6d7da"
  },
  labelStyle: {
    textAlign: "center"
  },
  WorkoutNameTextStyle: {
    fontWeight: "200",
    fontSize: 16,
    fontFamily: "arial"
  },
  sessionSmallText: {
    fontSize: 12,
    color: "#636463"
  },
  avatarStyle: {
    marginLeft: 10
  },
  HeaderContainer: {
    height: "auto",
    width: "100%",
    justifyContent: "flex-end",
    flexDirection: "row",
    padding: 5
  },
  dateStyle: {
    justifyContent: "flex-end",
    flexDirection: "row",
    paddingTop: 5,
    paddingRight: 5
  }
});
