import React, { Component } from "react";
import { createBottomTabNavigator } from "react-navigation";
import Icon from "react-native-vector-icons/Ionicons";

import Homepage from "./Homepage";
import ProfilePage from "./ProfilePageRouter";
import AnalyticsPage from "./AnalyticsPage";
import AddWorkoutPage from "./AddWorkoutPage";
import SearchUserPage from "./SearchUserPage";

const RootStack = createBottomTabNavigator(
  {
    Home: {
      screen: Homepage
    },
    SearchUser: {
      screen: SearchUserPage
    },
    AddWorkout: {
      screen: AddWorkoutPage
    },
    Analytics: {
      screen: AnalyticsPage
    },
    Profile: {
      screen: ProfilePage
    }
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === "Home") {
          iconName = `md-home`;
        } else if (routeName === "Analytics") {
          iconName = `md-analytics`;
        } else if (routeName === "AddWorkout") {
          iconName = `md-add-circle-outline`;
        } else if (routeName === "Profile") {
          iconName = `md-contact`;
        } else if (routeName === "SearchUser") {
          iconName = `md-search`;
        }

        // You can return any component that you like here! We usually use an
        // icon component from react-native-vector-icons
        return (
          <Icon name={iconName} size={horizontal ? 20 : 25} color={tintColor} />
        );
      }
    }),
    tabBarOptions: {
      activeTintColor: "#007aff",
      inactiveTintColor: "gray",
      showLabel: false //Remove text under icons
    }
  }
);

export default class HomePageRouter extends Component {
 

  render() {
    return <RootStack />;
  }
}
