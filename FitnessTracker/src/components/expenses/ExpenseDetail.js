import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";


class ExpenseDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }


  render() {

    return (
      <View style={styles.container}>
        <Text style={styles.expenseNameStyle}>{this.props.expense.ExpenseType} </Text>
        <Text style={styles.amountStyle}>${this.props.expense.AmountSpent} </Text>

      </View>
    );
  }
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 15   ,
      margin:10, 
      flexDirection: 'row',
      shadowColor: '#000000',
      shadowOffset: {
        width: 0,
        height: 3
      },
      shadowRadius: 5,
      shadowOpacity: 0.3,
      backgroundColor: '#fff'
    },
    expenseNameStyle: {
        fontSize: 22,
        color:'gray',
        justifyContent: 'flex-start'
    },
    amountStyle: {
        color:'gray',
        justifyContent: 'flex-end'
    },

  });
  

export default ExpenseDetail;
