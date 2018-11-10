import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  Card,
  CardSection,
  Button,
  Input,
  Spinner,
  Header
} from "../components/common";
import NewsFeedRouter from "./NewsFeedRouter";

export default class Homepage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <React.Fragment>
        <Header headerText={""} />
        <View style={{ position: "absolute", width: "100%", height: "100%" }}>
          <NewsFeedRouter />
        </View>
      </React.Fragment>
    );
  }
}
