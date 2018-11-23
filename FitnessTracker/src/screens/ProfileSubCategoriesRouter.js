import React, { Component } from "react";
import { createMaterialTopTabNavigator } from "react-navigation";
import { Dimensions } from "react-native";
import WorkoutHistory from "./WorkoutHistory";
import MapSearchPage from "./MapSearchPage";
import ExpensesPage from "./ExpensesPage";

export default createMaterialTopTabNavigator(
  {
    "Workout History": {
      screen: WorkoutHistory
    },
    "GYM Search": {
      screen: MapSearchPage
    },
    Expenses: {
      screen: ExpensesPage
    }
  },
  {
    tabBarOptions: {
      labelStyle: {
        //fontSize needs to be excactly like this to fit on IOS
        fontSize: 0.024 * Dimensions.get("window").width,
        fontWeight: "bold",
        color: "#00aeff"
      },
      tabStyle: {
        height: 50,
        width: Dimensions.get("window").width / 3
      },
      indicatorStyle: {
        backgroundColor: "#00aeff" // 00b4ff
      },
      style: {
        borderWidth: 0.5,
        borderColor: "#747474",
        backgroundColor: "white"
      }
    }
  }
);
