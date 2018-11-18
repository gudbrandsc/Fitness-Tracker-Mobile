import React, { Component } from "react";
import { Text, View, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import LinearGradient from "react-native-linear-gradient";

class AnalysisChart extends Component {
  renderAvg() {
    if (this.props.avg !== null) {
      return (
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.statTitleText}>Avg:</Text>
          <Text style={{ fontSize: 18 }}>{this.props.avg}</Text>
        </View>
      );
    }
    return;
  }

  render() {
    styles = {
      container: {
        flex: 1,
        marginTop: 20,
        marginBottom: 10,
        height: "auto",
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
      },
      statsContainer: {
        flexDirection: "column",
        justifyContent: "space-between",
        height: "auto",
        width: Dimensions.get("screen").width,
        paddingTop: 5,
        paddingRight: 10,
        paddingLeft: 10,
        paddingBottom: 5
      },
      subStats: {
        flexDirection: "row",
        justifyContent: "space-between",
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
      }
    };
    return (
      /* labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
      ]*/
      <View style={styles.container}>
        <Text style={styles.title}>{this.props.title}</Text>
        <LineChart
          data={{
            labels: [""],
            datasets: [
              {
                data: this.props.stats
              }
            ]
          }}
          width={Dimensions.get("screen").width + 18}
          height={300}
          chartConfig={{
            backgroundColor: "white",
            backgroundGradientFrom: "white",
            backgroundGradientTo: "#ededed", //c1ffce
            decimalPlaces: 0, // number of digits after decimal point
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`
          }}
          bezier // make it curvy
          style={{
            marginVertical: 10,
            marginLeft: -20,
            marginBottom: 0
          }}
        />
        <View style={styles.lineSeparator} />
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={["white", "#ededed"]}
          style={styles.statsContainer}
        >
          <View style={styles.subStats}>
            {this.renderAvg()}
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.statTitleText}>Min:</Text>
              <Text style={{ fontSize: 18 }}>{this.props.min}</Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.statTitleText}>Max:</Text>
              <Text style={{ fontSize: 18 }}>{this.props.max}</Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  }
}
export default AnalysisChart;
