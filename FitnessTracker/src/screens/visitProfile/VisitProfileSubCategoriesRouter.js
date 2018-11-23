import React, { Component } from "react";
import { createMaterialTopTabNavigator } from "react-navigation";
import { Dimensions } from "react-native";
import WorkoutHistoryPage from "./VisitWorkoutHistory";
import JournalPage from "./VisitJournal";

const RootStack = createMaterialTopTabNavigator(
  {
    "Workout History": {
      screen: WorkoutHistoryPage
    },
    Journal: {
      screen: JournalPage
    }
  },
  {
    tabBarOptions: {
      labelStyle: {
        // Change this to fit the IOS
        fontSize: 0.03 * Dimensions.get("window").width,
        fontWeight: "bold",
        color: "#00aeff"
      },
      tabStyle: {
        height: 50,
        width: Dimensions.get("window").width / 2
      },
      indicatorStyle: {
        backgroundColor: "#00aeff"
      },
      style: {
        borderWidth: 0.5,
        borderColor: "#747474",
        backgroundColor: "white"
      }
    }
  }
);
class VisitProfileSubCategoriesRouter extends Component {
  constructor(props) {
    super(props);
    console.log("Inside visit top tab router " + this.props.profileID);
  }

  render() {
    return <RootStack screenProps={{ profileID: this.props.profileID }} />;
  }
}

export default VisitProfileSubCategoriesRouter;
