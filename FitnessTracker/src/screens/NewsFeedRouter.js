import React, { Component } from "react";
import { createMaterialTopTabNavigator } from "react-navigation";
import { Header } from "../components/common";

import JournalNewsFeed from "../components/NewsFeed/JournalNewsFeed";
import WorkoutnewsFeed from "../components/NewsFeed/WorkoutNewsFeed";

export default createMaterialTopTabNavigator(
  {
    Journals: {
      screen: JournalNewsFeed
    },
    Workouts: {
      screen: WorkoutnewsFeed
    }
  },
  {
    tabBarOptions: {
      labelStyle: {
        paddingTop: 20,
        fontWeight: "600",
        color: "#fff",
        fontSize: 22,
        fontFamily: "arial"
      },
      tabStyle: {
        height: 80
      },
      indicatorStyle: {
        backgroundColor: "white"
      },
      style: {
        backgroundColor: "transparent"
      }
    }
  }
);
