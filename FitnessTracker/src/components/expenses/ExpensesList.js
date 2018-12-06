import React, {Component} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import ExpenseDetail from './ExpenseDetail'

/**
 * Component that displays a list of expenses. 
 */
class ExpensesList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: '',
      rerender: true,

    }
  }

  // If a expense is deleted then rerender the entier list. 
  componentWillReceiveProps(nextProps) {
    if (this.props.reset !== nextProps.reset) {
      this.forceUpdate();
    }
  }

  //Render a list of all expenses. 
  renderExpenses () {
    return this.props.expenses.map(expense =>
      <ExpenseDetail  key={expense.id} expense={expense} deleteExpense={this.props.deleteExpense}/>
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
