import React, {Component} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import ExpenseDetail from './ExpenseDetail'
import { Button } from 'react-native-elements';


class ExpensesList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: '',
    }
  }

  renderExpenses () {
    return this.props.expenses.map(expense =>
      <ExpenseDetail  key={expense.id} expense={expense} />
    );
  }

  render(){
    return (
      <View style={styles.v_container}>
      <ScrollView style={styles.container}>
        { this.renderExpenses() }
      </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  v_container: {
    flex: 1,
    flexDirection: 'column', // main axis
    justifyContent: 'center', // main axis
    alignItems: 'center', // cross axis
  },
  container: {
    alignSelf: "stretch",
  }
});


export default ExpensesList;
