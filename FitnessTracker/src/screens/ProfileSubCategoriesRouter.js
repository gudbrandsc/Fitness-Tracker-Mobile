import React, { Component } from "react";
import { createMaterialTopTabNavigator } from "react-navigation";

import WorkoutHistory from "./Homepage";
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
    "Calculate Expenses": {
      screen: SearchUserPage
    }
  },
  {
    tabBarOptions: {
      labelStyle: {
        fontSize: 13,
        fontWeight: "bold",
        color: "#007aff"
      },
      tabStyle: {
        width: 138,
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
