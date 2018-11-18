import React, { Component } from "react";
import { createMaterialTopTabNavigator } from "react-navigation";
import { Dimensions } from "react-native";

import WorkoutHistory from "./WorkoutHistory";
import MapSearchPage from "./MapSearchPage";
import SearchUserPage from "./SearchUserPage";

export default createMaterialTopTabNavigator(
  {
    "Workout History": {
      screen: WorkoutHistory
    },
    "GYM Search": {
      screen: MapSearchPage
    },
    Expenses: {
      screen: SearchUserPage
    }
  },
  {
    tabBarOptions: {
      labelStyle: {
        fontSize: 0.03 * Dimensions.get("window").width,
        fontWeight: "bold",
        color: "#007aff"
      },
      tabStyle: {
        height: 50,
        width: Dimensions.get("window").width / 3
      },
      indicatorStyle: {
        backgroundColor: "#007aff"
      },
      style: {
        borderWidth: 0.5,
        borderColor: "#747474",
        backgroundColor: "#e1e1e1"
      }
    }
  }
);
