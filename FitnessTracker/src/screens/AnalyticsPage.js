import React, { Component } from "react";
import { ScrollView, AsyncStorage, Text, View, Dimensions } from "react-native";
import { Header } from "../components/common";
import AnalysisChart from "../components/Analysis/AnalysisChart";
import ExpensesPiChart from "../components/Analysis/ExpensesPiChart";
import DropdownMenu from "react-native-dropdown-menu";
import axios from "axios";

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

  retrieveDetails = async () => {
    try {
      const id = await AsyncStorage.getItem("login");
      this.setState({ userId: id });
      this.retrieveWeight(id);
      axios.get("http://localhost:8000/api/workoutcategories").then(
        function(response) {
          const allData = response.data;
          console.log(allData);
          const workout = [];
          for (var i = 0; i < allData.length; i++) {
            workout.push(allData[i].CategoryName);
          }
          workout.push("Expenses");
          workout.push("Weight");
          this.setState({
            allData,
            workoutDropDown: workout,
            workoutID: 0,
            exerciseId: 0
          });
          this.updateExercisesDropDown(0);
        }.bind(this)
      );
    } catch (error) {
      alert(error);
      // this.setState({
      //   error: "Can't get Data. Please check internet connectivity."
      // });
    }
  };

  retrieveWeight(userId) {
    try {
      axios.get("http://localhost:8000/api/getweight/" + userId).then(
        function(response) {
          const data = response.data;
          const weightList = [];
          for (var i = 0; i < data.length; i++) {
            weightList.push(data[i].Weight);
          }
          const currentWeight = weightList[weightList.length - 1];
          this.setState({ weightList, currentWeight });
        }.bind(this)
      );
    } catch (error) {
      alert(error);
      // this.setState({
      //   error: "Can't get Data. Please check internet connectivity."
      // });
    }
  }

  getExerciseStatistics(exercisesID) {
    try {
      console.log("Inside exercises stats" + exercisesID);
      const userId = this.state.userId;
      //axios.get(" http://localhost:8000/api/exerciseanalysis/36/" + exercisesID)
      //axios.get("http://localhost:8000/api/exerciseanalysis/12/" + exercisesID)
      axios
        .get(
          " http://localhost:8000/api/exerciseanalysis/" +
            userId +
            "/" +
            exercisesID
        )

        .then(
          function(response) {
            console.log("Getting exericeses" + response.data);
            this.fillStatistics(response.data);
          }.bind(this)
        );
    } catch (error) {
      alert(error);
      // this.setState({
      //   error: "Can't get Data. Please check internet connectivity."
      // });
    }
  }

  retrieveExpenses() {
    try {
      const userId = this.state.userId;
      axios.get(" http://localhost:8000/api/getexpense/" + userId).then(
        function(response) {
          this.fillStatistics(response.data.Expenses_Details);
        }.bind(this)
      );
    } catch (error) {
      alert(error);
      // this.setState({
      //   error: "Can't get Data. Please check internet connectivity."
      // });
    }
  }

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
      console.log(data);
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

  onDropDownSelectChange(selection, row) {
    if (selection === 1) {
      const workoutTable = this.state.allData[this.state.workoutID]
        .Workout_tables;
      row -= 1;
      if (workoutTable.length > 0 && row >= 0) {
        const exerciseId = workoutTable[row].id;
        this.getExerciseStatistics(exerciseId);
      }
    }
    if (selection === 0) {
      this.updateExercisesDropDown(row);
    }
  }

  updateExercisesDropDown(workoutID) {
    const exercises = [];
    const workoutName = this.state.dropdownData[0][workoutID];
    var dropdownData = [this.state.workoutDropDown, exercises];
    this.setState({
      workoutID,
      dropdownData,
      exercisesDropDown: exercises
    });
    console.log(workoutName);
    if (workoutName === "Expenses") {
      this.retrieveExpenses();
    } else if (workoutName === "Weight") {
      this.setState({ workoutName });
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

  renderCharts() {
    const workoutName = this.state.workoutName;
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
        for (var j = 0; j < data[i].length; j++) {
          if (maxVal < data[i][j]) maxVal = data[i][j];
          if (minVal > data[i][j]) minVal = data[i][j];
          avgCount += data[i][j];
        }
        avgVal = Math.round(avgCount / data[i].length);
        var title = "";
        if (i === 0) {
          // Progress analysis
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
              min: minVal + "m",
              max: maxVal + "m",
              avg: avgVal + "m",
              stats: data[i]
            };
            jsxList.push(jsx);
          }
        }
      }
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
      const data = this.state.statisticsData;
      const PiData = [];
      for (var i = 0; i < data.length; i++) {
        var red = 0;
        while (red === 0) red = Math.floor(Math.random() * 255);
        var green = 0;
        while (green === 0) green = Math.floor(Math.random() * 255);
        var blue = 0;
        while (blue === 0) blue = Math.floor(Math.random() * 255);
        const colorCustom = "rgba(" + red + ", " + green + "," + blue + ",1)"; // generate random colors
        const subPi = {
          name: data[i].type,
          amount: data[i].amount,
          color: colorCustom,
          legendFontColor: "#7F7F7F",
          legendFontSize: 15
        };
        PiData.push(subPi);
      }
      if (PiData.length > 0) {
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
      const weightDiff = this.state.currentWeight - originalWeight;
      if (weightDiff < 0) progress = "You lost " + Math.abs(weightDiff) + "lbs";
      else if (weightDiff > 0) progress = "You gained " + weightDiff + "lbs";
      else progress = "Your weight is stable";
      for (var i = 0; i < data.length; i++) {
        if (minVal > data[i]) minVal = data[i];
        if (maxVal < data[i]) maxVal = data[i];
      }
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
          // Progress analysis
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
            // Progress analysis
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
