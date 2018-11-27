import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";
import { Button } from "../common";
import axios from "axios";

class ExpenseDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  onDelete = () => {
    const requestUrl =
    "http://localhost:8000/api/removeexpense/" + this.props.expense.id;
    console.log(requestUrl)
    axios.get(requestUrl).then(
      function(response) {
        if (response.status === 200) {
          this.props.deleteExpense(this.props.expense.id)
        } else {
          this.setState({
            loading: false,
            error: "Unable to unfollow.."
          });
        }
      }.bind(this)
    );
  };

 
  render() {
    var formatter = new Intl.NumberFormat("de-DE");
    var value = formatter.format(this.props.expense.AmountSpent);

    return (
      <View style={styles.topContainer}>
        <View style={styles.container}>
          <Text style={styles.expenseNameStyle}>{this.props.expense.ExpenseType} </Text>
          <Text style={styles.amountStyle}>${value} </Text>
        </View>

        <View style={styles.buttonViewContainer}>
          <Button
          size={"medium"}
          type={"danger"}
          onPress={this.onDelete}
          >
          Delete 
          </Button>   
        </View>   
      </View>
    );
  }
}            



const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 15   ,
      flexDirection: 'column',
      borderBottomWidth: 1,
      borderBottomColor: 'lightgray',
      backgroundColor: '#fff'
    },
    expenseNameStyle: {
        fontSize: 18,
        justifyContent: 'flex-start'
    },
    amountStyle: {
        fontSize: 13,
        fontWeight: '200',
        fontWeight: 'bold',
        color:'gray',
        marginTop:5,
        justifyContent: 'flex-end'
    },
    topContainer: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: '#fff'

    },
    buttonViewContainer: {
      flex: 0.5,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 25,
      borderBottomWidth: 1,
      borderBottomColor: 'lightgray',
      paddingRight: 10
    }

  });
  

export default ExpenseDetail;
