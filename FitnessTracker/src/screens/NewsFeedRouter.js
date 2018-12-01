import React, { Component } from "react";
import { createMaterialTopTabNavigator } from "react-navigation";
import JournalNewsFeed from "../components/NewsFeed/JournalNewsFeed";
import WorkoutnewsFeed from "../components/NewsFeed/WorkoutNewsFeed";

/**
 * This script is a Material Top Tab navigation script that handles a Top tab style navigation to different pages.
 * It will initially show to "JournalNewsFeed" Page
 */
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
