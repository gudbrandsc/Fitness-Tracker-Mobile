import React, { Component } from "react";
import { View, TextInput, AsyncStorage, Text, TouchableOpacity, ScrollView,StyleSheet } from "react-native";
import { Button, Spinner } from "../components/common";
import DropdownMenu from "react-native-dropdown-menu";
import ExpensesList from "../components/expenses/ExpensesList";
import { Icon } from 'react-native-elements'


class ExpensesPage extends Component {
    state = {
        id: "",
        expensePlaceholder: "What's it for",
        amountPlaceholder: "$0",
        expenseText: "",
        expenseAmount: "",
        loading: false,
        animationErrorHeight: "0.5%",
        error: "",
        dropdownData: [["Expense entries"]],
        expenseAllData: [],
        activeExpenseList: false,
        resetState: false
      };

      componentDidMount() {
        this.retrieveDetails();
      }

      retrieveDetails = async () => {
        try {
          const id = await AsyncStorage.getItem("login");
          this.setState({ id });
          console.log("http://localhost:8000/api/getexpense/" + id)
          fetch("http://localhost:8000/api/getexpense/" + id, {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json"
            }
          })
            .then(response =>
              response.json().then(data => ({
                data: data,
                status: response.status
              }))
            )
            .then(
              res => {
                if (res.status === 200) {
                  const expenseAllData = res.data.Expenses_Details;
                  this.setState({ expenseAllData });
                  var dropdownData = [["Expense List"]];
                  for (var i = 0; i < expenseAllData.length; i++) {
                    const expenseHeader = expenseAllData[i].ExpenseType;
                    const expenseCost = expenseAllData[i].AmountSpent;
                    dropdownData[0].push(
                      expenseHeader + "              " + expenseCost + "$"
                    );
                  }
                  this.setState({ dropdownData });
                  this.setState({loading: false});
                } else {
                  this.onLoginFail(
                    "Can't get Data. Please check internet connectivity."
                  );
                }
              },
              error => {
                this.onLoginFail(
                  "Can't get Data. Please check internet connectivity."
                );
              }
            );
        }
        catch(error)
        {
            this.onLoginFail(
              "Can't get Data. Please check internet connectivity."
            );
        }
    }

    renderButton() {
        if (this.state.loading) {
          return <Spinner size="small" />;
        }
          return (
            <View
              style={{
                flex: 1
              }}
            >
              <View
                style={{
                  height: 33,
                  width: "32%",
                  alignSelf: "center"
                }}
              >
                <Button
                  size={"large"}
                  type={"primary"}
                  onPress={this.addExpense.bind(this)}
                >
                  Add Expense
                </Button>
              </View>
            </View>
          );
    }

 
   isInt(value) {
      var x;
      if (isNaN(value)) {
        return false;
      }
      return true;
    }

    addExpense() {

      if(this.state.expenseAmount !== "" && this.state.expenseText !== ""){
        try{
            const id = this.state.id;
            this.setState({ error: "", loading: true, animationErrorHeight: "0.5%" });
            const expenseText = this.state.expenseText.trim();
            const expenseAmount = this.state.expenseAmount.trim();
            fetch("http://localhost:8000/api/createexpense", {
            method: "POST",
            headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
            },
            body: JSON.stringify({
            ExpenseType: expenseText,
            AmountSpent: expenseAmount,
            UserId: id
            })
          })
          .then(response =>
            response.json().then(data => ({
              data: data,
              status: response.status
            }))
          ).then(
            res => {
              if (res.status === 200) {
                const expenseAllData = res.data.Expenses_Details;
                this.setState({ expenseAllData });
                  var dropdownData = [["Expense List"]];
                  for (var i = 0; i < expenseAllData.length; i++) {
                    const expenseHeader = expenseAllData[i].ExpenseType;
                    const expenseCost = expenseAllData[i].AmountSpent;
                    dropdownData[0].push(
                      expenseHeader + "              " + expenseCost + "$"
                    );
                  }
                  this.setState({ dropdownData });
                this.setState({loading: false, expenseText: "", expenseAmount: "" });
              }
               else 
              {
                this.onLoginFail("Could not complete the request");
              }
            },
            error => {
              this.onLoginFail(
                "Request failed. Please check internet connectivity."
              );
            }
          );
        }
        catch(error)
        {
            console.log(error);
            this.onLoginFail(
              "Request failed. Please check internet connectivity."
            );
        }
      }else{
        alert("Please enter both amount and description")
      }
    }

    onLoginFail(err) {
      this.setState({
        error: err,
        loading: false,
        animationErrorHeight: "auto"
      });
      alert(err);
    }

    onCloseAnimationBox() {
      this.setState({
        error: "",
        animationErrorHeight: "0.5%"
      });
    }

    deleteExpense(id){
      console.log(this.state.expenseAllData)
      var objIndex = this.state.expenseAllData.findIndex(obj => obj.id == id);
      this.state.expenseAllData.splice(objIndex, 1);
      this.setState({ resetState: !this.state.resetState });

    }

    componentWillReceiveProps(nextProps) {
      console.log(this.props.expenseAllData)
      console.log(nextProps.expenseAllData)
      if(this.props.expenseAllData !== nextProps.expenseAllData){
        this.forceUpdate();
      }
  } 


  handleAmountInput = (text) => {
    if (/^\d+$/.test(text) || text === '') {
      this.setState({expenseAmount: text })
    }else{
        alert("Please enter numbers only"); 
    }
}



    getListOfExpenses(){
      if(this.state.activeExpenseList === true){
        return (
          <ScrollView style={styles.scrollViewStyle}>
          <ExpensesList expenses={this.state.expenseAllData} deleteExpense={this.deleteExpense.bind(this)} reset={this.state.resetState} />
          </ScrollView>
        );
      }else{
        return(
          <View>
            <View style={{ marginTop: 15, marginBottom: 10, marginLeft: 6, marginRight: 6, height: "40%" }} >
              <TextInput
                placeholder={"What's it for?"}
                style={styles.inputStyle}
                editable={true}
                value={this.state.expenseText}
                onChangeText={expenseText => this.setState({ expenseText })}
                multiline={true}
              />
            </View>
            <View style={{ marginBottom: 10, marginLeft: 6, marginRight: 6, height: "20%" }} >
              <TextInput
                placeholder={"$0"}
                style={styles.inputStyle}
                editable={true}
                value={this.state.expenseAmount}
                onChangeText={this.handleAmountInput}
              />
            </View>
            {this.renderButton()}
          </View>
         );
      }
    }
     getTouchtext(){
      if(this.state.activeExpenseList === true){
        return<Text style={styles.activeTextStyle}>Add expense</Text>
      }else{
        return <Text style={styles.activeTextStyle}>View all expenses</Text>

      }
     }     

    render() {

        return (
           <View style={styles.containerStyle}>
            <TouchableOpacity style={styles.touchViewContainer} onPress={() => this.setState({activeExpenseList: !this.state.activeExpenseList})}>
              <View style={[styles.touchViewStyle, this.state.activeExpenseList ? styles.showExpenseList : styles.showAddExpenseView ]}>
              {this.getTouchtext()} 
              <Icon size={20} name='add' color='gray' />
              </View>
            </TouchableOpacity>
            
          {this.getListOfExpenses()}

        </View>
        );
    }
}
const styles = StyleSheet.create({
  inputStyle: {
    color: "#000",
    paddingRight: 5,
    paddingLeft: 5,
    fontSize: 18,
    borderColor: "gray",
    borderWidth: 0.5,
    height: "100%",
    textAlignVertical: "top",
    backgroundColor: "white",
    borderRadius: 5

  },
  activeTextStyle: {
    fontSize: 14,
    color:'gray'
  },
  containerStyle: {
    backgroundColor: '#f7f6ef',
    flex:1
  },
  touchViewStyle:{
    flex: 1, 
    flexDirection: "row", 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  touchViewContainer: {
    flexDirection: "row", 
    justifyContent: "center",
    paddingTop:"5%"
  },
  showExpenseList:{
    borderBottomColor: 'lightgray',
  
    borderBottomWidth:1,
    marginBottom: 5,
    shadowColor: 'gray',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 5,
    shadowOpacity: 0.3,
  },
  showAddExpenseView: {

  },
  scrollViewStyle: {
    paddingTop: 0
  }
});

export default ExpensesPage;