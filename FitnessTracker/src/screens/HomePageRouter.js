import React, { Component } from "react";
import {
  createBottomTabNavigator,
  createStackNavigator
} from "react-navigation";
import Icon from "react-native-vector-icons/Ionicons";
import Homepage from "./Homepage";
import AnalyticsPage from "./AnalyticsPage";
import AddWorkoutPage from "./AddWorkoutPage";
import SearchUserPage from "./SearchUserRouter";
import ProfilePage from "./ProfilePage";
import ProfileDetails from "./ProfileDetails";
import FollowingPage from "./FollowingPage";
import FollowersPage from "./FollowersPage";
import TopAuthPageRouter from "./TopAuthPageRouter";
import Journal from "./Journal";

const ProfilePageStack = createStackNavigator(
  {
    mainProfile: { screen: ProfilePage },
    details: { screen: ProfileDetails },
    following: { screen: FollowingPage },
    followers: { screen: FollowersPage },

    topAuthPage: {
      screen: TopAuthPageRouter
    },
    search: { screen: SearchUserPage },
    journal: { screen: Journal }
  },
  {
    initialRouteName: "mainProfile",

    navigationOptions: {
      headerTitleStyle: {
        flex: 1,
        fontSize: 22,
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        color: "#646464",
        fontFamily: "HelveticaNeue"
      }
    }
  }
);

ProfilePageStack.navigationOptions = ({ navigation }) => {
  let { routeName } = navigation.state.routes[navigation.state.index];
  let navigationOptions = {};

  if (routeName === "details" || routeName === "topAuthPage") {
    navigationOptions.tabBarVisible = false;
  }

  return navigationOptions;
};

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
      screen: ProfilePageStack
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
        } else if (routeName === "WorkoutHistory") {
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
      activeTintColor: "#00e6d3",
      inactiveTintColor: "gray",
      showLabel: false //Remove text under icons
    }
  }
);

export default class HomePageRouter extends Component {
  static navigationOptions = {
    header: null
  };

  render() {
    return <RootStack />;
  }
}
