import React, { Component } from "react";
import { Text, View, Image, Dimensions } from "react-native";
import { Avatar } from "react-native-elements";

export default class JournalItems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      follows: false,
      start: true
    };
  }
  renderImage() {
    if (this.props.imageurl !== null) {
      return (
        <View
          style={{
            width: Dimensions.get("window").width - 10,
            height: Dimensions.get("window").width,
            padding: 10
          }}
        >
          <Image
            style={{
              flex: 1,
              alignSelf: "stretch"
            }}
            source={{
              uri: this.props.imageurl
            }}
          />
        </View>
      );
    }
    return;
  }
  render() {
    styles = {
      MainContainer: {
        flex: 1,
        margin: 5,
        flexDirection: "column",
        justifyContent: "space-evenly",
        shadowColor: "blue",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 2
      },
      HeaderContainer: {
        height: "auto",
        width: "100%",
        justifyContent: "space-between",
        flexDirection: "row",
        padding: 5
      },
      detailsMain: {
        alignSelf: "flex-start",
        flexDirection: "row",
        justifyContent: "space-around",
        width: "60%"
      },
      userDetails: {
        flexDirection: "column",
        justifyContent: "space-evenly"
      },
      journalText: {
        height: "auto",
        width: "auto",
        margin: 10
      }
    };
    return (
      <View style={styles.MainContainer}>
        <View style={styles.HeaderContainer}>
          <View style={styles.detailsMain}>
            <Avatar
              medium
              rounded
              source={{
                uri: this.props.userImg
              }}
            />
            <View style={styles.userDetails}>
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                {this.props.fullName}
              </Text>
              <Text style={{ fontSize: 14 }}>{this.props.email}</Text>
            </View>
          </View>
          <Text style={{ fontSize: 14 }}>{this.props.time}</Text>
        </View>
        <View style={styles.journalText}>
          <Text style={{ margin: 5, fontSize: 16 }}>
            {this.props.journalText}
          </Text>
        </View>
        {this.renderImage()}
      </View>
    );
  }
}
