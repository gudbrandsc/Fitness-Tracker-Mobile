import React, { Component } from "react";
import { ScrollView, AsyncStorage, Text, View, Dimensions } from "react-native";
import { Header } from "../components/common";
import AnalysisChart from "../components/Analysis/AnalysisChart";
import ExpensesPiChart from "../components/Analysis/ExpensesPiChart";
import DropdownMenu from "react-native-dropdown-menu";
import axios from "axios";

/**
 * A script that gets different data from the backend for a workout or exercise chosen by the user from the dropdown menu.
 * It applied some analysis to the retrieved data and shows the data in line charts and PI chart for the expenses.
 */
class AnalyticsPage extends Component {
  state = {
    allData: [],
    dropdownData: [["Workouts"], []],
    workoutDropDown: [],
    exercisesDropDown: [],
    userId: "",
    workoutID: 0,
    workoutName: "",
    exerciseId: 0,
    statisticsData: [],
    weightList: [],
    currentWeight: 0
  };

  componentDidMount() {
    this.retrieveDetails();
  }

  /**
   * A function that gets the user id from Async Storage and calls retrieveWeight function and also
   * gets workout categories by sending an API request to the backend.
   */
  retrieveDetails = async () => {
    try {
      const id = await AsyncStorage.getItem("login");
      this.setState({ userId: id });
      this.retrieveWeight(id, "");
      axios
        .get("http://localhost:8000/api/workoutcategories")
        .then(
          function(response) {
            const allData = response.data;
            const workout = [];
            for (var i = 0; i < allData.length; i++) {
              workout.push(allData[i].CategoryName);
            }
            workout.push("Expenses"); // add expenses to the workout list
            workout.push("Weight"); // add weight to the workout list
            this.setState({
              allData,
              workoutDropDown: workout,
              workoutID: 0,
              exerciseId: 0
            });
            this.updateExercisesDropDown(0);
          }.bind(this)
        )
        .catch(function(error) {
          alert("Couldn't get the data! Try Again.");
        });
    } catch (error) {
      alert("Check internet connectivity.");
    }
  };

  /**
   * A function that gets the user id and calls an API to retrieve a list of weights added by the user previously
   * then it saves the last weight value in the currentWeight variable.
   */
  retrieveWeight(userId, workoutName) {
    try {
      axios
        .get("http://localhost:8000/api/getweight/" + userId)
        .then(
          function(response) {
            const data = response.data;
            const weightList = [];
            for (var i = 0; i < data.length; i++) {
              weightList.push(data[i].Weight);
            }
            const currentWeight = weightList[weightList.length - 1];
            this.setState({ weightList, currentWeight, workoutName });
          }.bind(this)
        )
        .catch(function(error) {
          alert("Couldn't get the data! Try Again.");
        });
    } catch (error) {
      alert("Check internet connectivity.");
    }
  }

  /**
   * A function that calls an API to get the data (Sets, Reps, and weight) for a specific exercise by its ID
   * then calls fillStatistics function and pass to it the data received.
   */
  getExerciseStatistics(exercisesID) {
    try {
      const userId = this.state.userId;
      axios
        .get(
          "http://localhost:8000/api/exerciseanalysis/" +
            userId +
            "/" +
            exercisesID
        )
        .then(
          function(response) {
            this.fillStatistics(response.data);
          }.bind(this)
        )
        .catch(function(error) {
          alert("Couldn't get the data! Try Again.");
        });
    } catch (error) {
      alert("Check internet connectivity.");
    }
  }

  /**
   * A function that calls an API to get all the expenses added previously by the user.
   * Then calls fillStatistics function and pass to it the data received.
   */
  retrieveExpenses() {
    try {
      const userId = this.state.userId;
      axios
        .get("http://localhost:8000/api/getexpense/" + userId)
        .then(
          function(response) {
            this.fillStatistics(response.data.Expenses_Details);
          }.bind(this)
        )
        .catch(function(error) {
          alert("Couldn't get the data! Try Again.");
        });
    } catch (error) {
      alert("Check internet connectivity.");
    }
  }

  /**
   * A function that checks the type of the workout selected and fills the statistic data list with specific data.
   * For expenses, only add the ExpenseType and Amount Spent
   * For Exercises, only add Sets, Reps, and Weight
   * For Cardio, only add Sets, Reps, and Calories burned (after calculating it using a specific formula)
   * For Weight, pass the weight list as it is to the Statistics list.
   */
  fillStatistics(data) {
    const workoutName = this.state.dropdownData[0][this.state.workoutID];
    if (workoutName === "Expenses") {
      const statisticsData = [];
      for (var i = 0; i < data.length; i++) {
        const expense = {
          type: data[i].ExpenseType,
          amount: data[i].AmountSpent
        };
        statisticsData.push(expense);
      }
      this.setState({ statisticsData, workoutName });
    } else if (workoutName === "Weight") {
      const statisticsData = this.state.weightList;
      this.setState({ statisticsData, workoutName });
    } else {
      const weightArray = [];
      const setArray = [];
      const repArray = [];
      if (data.length === 0) {
        weightArray.push(0);
        setArray.push(0);
        repArray.push(0);
      } else {
        for (var i = 0; i < data.length; i++) {
          if (workoutName === "Cardio") {
            // calculate the calories burned using the below formula
            const calorie = Math.round(
              0.0175 *
                10 *
                (this.state.currentWeight / 2.205) *
                data[i].NoOfSets
            );
            weightArray.push(calorie);
          } else weightArray.push(data[i].Weight);
          setArray.push(data[i].NoOfSets);
          repArray.push(data[i].NoOfReps);
        }
      }
      const statisticsData = [weightArray, setArray, repArray];
      this.setState({ statisticsData, workoutName });
    }
  }

  /**
   * A function called by the dropdown library whenever an item is selected from the menu.
   * It passes the selection (column index) and row (item's index)
   * If the selection equals to 0, it means that an item in the workouts menu is selected so call updateExercisesDropDown function and pass
   * the index of the item selected to it
   * If the selection equals to 1, it means an exercise is selected. so call getExerciseStatistics function
   */
  onDropDownSelectChange(selection, row) {
    if (selection === 1) {
      const workoutTable = this.state.allData[this.state.workoutID]
        .Workout_tables;
      row -= 1;
      // it means an item is selected, otherwise the exercises menu is empty
      if (workoutTable.length > 0 && row >= 0) {
        const exerciseId = workoutTable[row].id;
        this.getExerciseStatistics(exerciseId);
      }
    }
    if (selection === 0) {
      this.updateExercisesDropDown(row);
    }
  }

  /**
   * A function that gets the workout ID then gets the workout name from the dropdown list data and checks the workout name.
   * If the workout name is Expenses, then call retrieveExpenses function.
   * else If the workout name is Weight, then update the workout name in the state to refresh the render function
   * otherwise, it means a workout is chosen so get all the exercises for the selected workout and update the exercises' drop down menu
   */
  updateExercisesDropDown(workoutID) {
    const exercises = [];
    const workoutName = this.state.dropdownData[0][workoutID];
    var dropdownData = [this.state.workoutDropDown, exercises];
    this.setState({
      workoutID,
      dropdownData,
      exercisesDropDown: exercises
    });
    if (workoutName === "Expenses") {
      this.retrieveExpenses();
    } else if (workoutName === "Weight") {
      this.retrieveWeight(this.state.userId, "Weight");
    } else {
      exercises.push("Exercises");
      const workoutTable = this.state.allData[workoutID].Workout_tables;
      for (var j = 0; j < workoutTable.length; j++) {
        exercises.push(workoutTable[j].WorkoutName);
      }
      dropdownData = [this.state.workoutDropDown, exercises];
      this.setState({
        dropdownData,
        exercisesDropDown: exercises
      });
    }
  }

  /**
   * A function that renders the data into Line chart (PI chart for expenses)
   * and analyzes it depending on the chosen workout and exercise.
   */
  renderCharts() {
    const workoutName = this.state.workoutName;
    // no workout selected
    if (workoutName === "")
      return (
        <View
          style={{
            flex: 1,
            height: 500,
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Text>Choose exercise to see the analysis</Text>
        </View>
      );
    else if (workoutName === "Cardio") {
      const data = this.state.statisticsData;
      var minVal = 0;
      var maxVal = 0;
      var avgVal = 0;
      var avgCount = 0;
      var progress = "";
      const jsxList = [];
      for (var i = 0; i < data.length; i++) {
        minVal = data[i][0];
        maxVal = data[i][0];
        avgCount = 0;
        avgVal = 0;
        // get min max and avg
        for (var j = 0; j < data[i].length; j++) {
          if (maxVal < data[i][j]) maxVal = data[i][j];
          if (minVal > data[i][j]) minVal = data[i][j];
          avgCount += data[i][j];
        }
        avgVal = Math.round(avgCount / data[i].length);
        var title = "";
        if (i === 0) {
          // Analyse the the calories data
          var length = data[i].length;
          if (length >= 2) {
            if (data[i][length - 1] > data[i][length - 2]) {
              progress = "Burning good calories";
            }
            if (data[i][length - 1] < data[i][length - 2]) {
              progress = "Not burning calories as before";
            } else progress = "Need to burn more calories.";
          } else {
            progress = "Progress analysis requires more than one workout";
          }
          title = "Calories Burned Chart";
          const jsx = {
            id: i,
            title,
            min: minVal + " cal",
            max: maxVal + " cal",
            avg: avgVal + " cal",
            stats: data[i]
          };
          jsxList.push(jsx);
        } else {
          if (i === 1) {
            title = "Time Chart";
            const jsx = {
              id: i,
              title,
              min: minVal + " min",
              max: maxVal + " min",
              avg: avgVal + " min",
              stats: data[i]
            };
            jsxList.push(jsx);
          } else {
            title = "Distance  Chart";
            const jsx = {
              id: i,
              title,
              min: minVal + " miles",
              max: maxVal + " miles",
              avg: avgVal + " miles",
              stats: data[i]
            };
            jsxList.push(jsx);
          }
        }
      }
      // Render the data in Analysis Component (Line Chart)
      return (
        <React.Fragment>
          <View style={styles.progressContainer}>
            <Text style={styles.statTitleText}>Progress Analysis:</Text>
            <Text style={{ fontSize: 18 }}>{progress}</Text>
          </View>
          <View style={styles.lineSeparator} />
          {jsxList.map(jsx => (
            <AnalysisChart
              key={jsx.id}
              title={jsx.title}
              min={jsx.min}
              max={jsx.max}
              avg={jsx.avg}
              stats={jsx.stats}
            />
          ))}
        </React.Fragment>
      );
    } else if (workoutName === "Expenses") {
      // Expenses are loaded into a PI chart
      const data = this.state.statisticsData;
      const PiData = [];
      const colors = [
        "rgba(100,50,170,1)",
        "rgba(70,230,150,1)",
        "rgba(40,90,190,1)",
        "rgba(190,40,160,1)",
        "rgba(210,210,0,1)",
        "rgba(255,160,0,1)",
        "rgba(255,0,0,1)",
        "rgba(0,180,0,1)",
        "rgba(255,130,220,1)",
        "rgba(110,110,110,1)"
      ];
      // iterate through the expenses list and generate a random color for each expense and push it to the PI Data list
      for (var i = 0; i < data.length; i++) {
        var color = "";
        var repeat = true;
        // this loop is to make sure that the colors are not repeated
        while (repeat) {
          color = colors[Math.floor(Math.random() * 9)];
          repeat = false;
          if (PiData.length === 0) break;
          else {
            for (var j = 0; j < PiData.length; j++) {
              if (color === PiData[j].color) {
                repeat = true;
                break;
              }
            }
          }
        }
        const subPi = {
          name: data[i].type,
          amount: data[i].amount,
          color: color,
          legendFontColor: "#7F7F7F",
          legendFontSize: 15
        };
        PiData.push(subPi);
      }
      if (PiData.length > 0) {
        // Render the data in Expenses PIChart Component
        return (
          <View
            style={{
              flex: 1,
              height: 500,
              alignItems: "center"
            }}
          >
            <ExpensesPiChart data={PiData} />
          </View>
        );
      } else {
        return (
          <View
            style={{
              flex: 1,
              height: 500,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Text>No Expenses to analyze</Text>
          </View>
        );
      }
    } else if (workoutName === "Weight") {
      const data = this.state.weightList;
      const originalWeight = data[0];
      var minVal = data[0];
      var maxVal = data[0];
      var avgVal = null;
      var progress = "";
      // Get the weight difference to show progress between the first weight and the current weight
      const weightDiff = this.state.currentWeight - originalWeight;
      if (weightDiff < 0) progress = "You lost " + Math.abs(weightDiff) + "lbs";
      else if (weightDiff > 0) progress = "You gained " + weightDiff + "lbs";
      else progress = "Your weight is stable";
      for (var i = 0; i < data.length; i++) {
        if (minVal > data[i]) minVal = data[i];
        if (maxVal < data[i]) maxVal = data[i];
      }
      // Render the data in Analysis Component (Line Chart)
      return (
        <React.Fragment>
          <View style={styles.weightprogressContainer}>
            <Text style={styles.statTitleText}>Progress Analysis:</Text>
            <Text style={{ fontSize: 18, marginLeft: 5 }}>{progress}</Text>
          </View>
          <View style={styles.lineSeparator} />
          <AnalysisChart
            title={"Weight Chart"}
            min={minVal + " lbs"}
            max={maxVal + " lbs"}
            avg={avgVal}
            stats={data}
          />
        </React.Fragment>
      );
    } else {
      const data = this.state.statisticsData;
      var minVal = 0;
      var maxVal = 0;
      var avgVal = 0;
      var avgCount = 0;
      var weightProgress = "";
      var progress = "";
      const jsxList = [];
      for (var i = 0; i < data.length; i++) {
        minVal = data[i][0];
        maxVal = data[i][0];
        avgCount = 0;
        avgVal = 0;
        for (var j = 0; j < data[i].length; j++) {
          if (maxVal < data[i][j]) maxVal = data[i][j];
          if (minVal > data[i][j]) minVal = data[i][j];
          avgCount += data[i][j];
        }
        avgVal = Math.round(avgCount / data[i].length);
        var title = "";
        if (i === 0) {
          // Analyze the weight lifted to know if the muscle building or toning
          var length = data[i].length;
          if (length >= 2) {
            if (data[i][length - 1] > data[i][length - 2]) {
              weightProgress = "Muscle building";
            } else weightProgress = "Muscle toning";
          } else {
            progress = "Progress analysis requires more than one workout";
          }
          title = "Weight Chart";
          const min = minVal + "lbs";
          const max = maxVal + "lbs";
          const avg = avgVal + "lbs";
          const jsx = {
            id: i,
            title,
            min,
            max,
            avg,
            stats: data[i]
          };
          jsxList.push(jsx);
        } else {
          if (i === 1) title = "Sets Chart";
          else {
            title = "Reps Chart";
            var length = data[i].length;
            // Analyze Reps to see if the muscle building or toning is going into the right way or it is done wrong
            if (length >= 2) {
              if (data[i][length - 1] > data[i][length - 2]) {
                if (weightProgress === "Muscle building")
                  progress =
                    "You are building your muscles but you should keep the number of reps stable.";
                else progress = "You are toning your muscles in the right way.";
              } else if (data[i][length - 1] < data[i][length - 2]) {
                if (weightProgress === "Muscle building")
                  progress = "You are building your muscles in the right way.";
                else
                  progress =
                    "Toning your muscles and decreasing the reps is not right.";
              } else {
                if (weightProgress === "Muscle building")
                  progress = "You are building your muscles in the right way.";
                else
                  progress =
                    "Toning your muscles in a good way, but don't keep the reps stable.";
              }
            } else {
              progress = "Progress analysis requires more than one workout";
            }
          }
          const jsx = {
            id: i,
            title,
            min: minVal,
            max: maxVal,
            avg: avgVal,
            stats: data[i]
          };
          jsxList.push(jsx);
        }
      }
      // Render the data in Analysis Component (Line Chart)
      return (
        <React.Fragment>
          <View style={styles.progressContainer}>
            <Text style={styles.statTitleText}>Progress Analysis:</Text>
            <Text style={{ fontSize: 18 }}>{progress}</Text>
          </View>
          <View style={styles.lineSeparator} />
          {jsxList.map(jsx => (
            <AnalysisChart
              key={jsx.id}
              title={jsx.title}
              min={jsx.min}
              max={jsx.max}
              avg={jsx.avg}
              stats={jsx.stats}
            />
          ))}
        </React.Fragment>
      );
    }
    return;
  }

  /**
   * Main built in render function that loads the whole page
   */
  render() {
    styles = {
      progressContainer: {
        flexDirection: "column",
        justifyContent: "flex-start",
        marginTop: 10,
        marginBottom: 5,
        paddingTop: 5,
        paddingRight: 10,
        paddingLeft: 10,
        paddingBottom: 5
      },
      weightprogressContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        marginTop: 10,
        marginBottom: 5,
        paddingTop: 5,
        paddingRight: 10,
        paddingLeft: 10,
        paddingBottom: 5
      },
      statTitleText: {
        fontSize: 18,
        fontWeight: "bold",
        marginRight: 10
      },
      lineSeparator: {
        height: 1,
        width: Dimensions.get("screen").width,
        backgroundColor: "gray",
        marginBottom: 10
      }
    };
    return (
      <React.Fragment>
        <Header headerText={"Analysis"} />
        <ScrollView style={{ flex: 1, flexDirection: "column" }}>
          <DropdownMenu
            style={{ flex: 1 }}
            bgColor={"white"}
            tintColor={"#666666"}
            activityTintColor={"#0071ec"}
            handler={(selection, row) => {
              this.onDropDownSelectChange(selection, row);
            }}
            data={this.state.dropdownData}
          >
            {this.renderCharts()}
          </DropdownMenu>
        </ScrollView>
      </React.Fragment>
    );
  }
}
export default AnalyticsPage;
