import React, { Component } from "react";
import { Text, View, Dimensions } from "react-native";
import { PieChart } from "react-native-chart-kit";

/**
 * A component called by Analytics Page. It uses a Pie Chart component from react-native-chart-kit library
 * to show the retrieved data in a Pie chart.
 */
class ExpensesPiChart extends Component {
  render() {
    styles = {
      container: {
        flex: 1,
        marginTop: 20,
        flexDirection: "column"
      },
      title: {
        textAlign: "center",
        fontSize: 24,
        fontWeight: "bold",
        color: "gray",
        marginBottom: 5
      },
      lineSeparator: {
        height: 1,
        width: Dimensions.get("screen").width,
        backgroundColor: "gray"
      }
    };
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Expenses</Text>
        <PieChart
          data={this.props.data}
          width={Dimensions.get("window").width + 20}
          height={Dimensions.get("window").width / 2}
          chartConfig={{
            backgroundColor: "white",
            backgroundGradientFrom: "#c1fff4",
            backgroundGradientTo: "#c1fff4", //c1ffce
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`
          }}
          backgroundColor="transparent"
          accessor="amount"
          style={{ padding: 0, marginLeft: -15 }}
        />
        <View style={styles.lineSeparator} />
      </View>
    );
  }
}
export default ExpensesPiChart;
