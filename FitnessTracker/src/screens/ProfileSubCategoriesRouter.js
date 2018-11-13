import React, { Component } from "react";
import { createMaterialTopTabNavigator } from "react-navigation";

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
    "Expenses": {
      screen: SearchUserPage
    }
  },
  {
    tabBarOptions: {
      labelStyle: {
        fontSize: 9,
        fontWeight: "bold",
        color: "#007aff"
      },
      tabStyle: {
        height: 50
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
