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

/**
 * Script created only to give a gradient header for the page because gradient color is not yet available.
 * It loads the NewsFeedRouter
 */
export default class Homepage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Header headerText={""} />
        <View style={{ position: "absolute", width: "100%", height: "100%" }}>
          <NewsFeedRouter />
        </View>
      </View>
    );
  }
}
