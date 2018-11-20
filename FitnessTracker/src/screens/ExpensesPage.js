import React, { Component } from "react";
import { View, TextInput, AsyncStorage, Text, KeyboardAvoidingView, ScrollView } from "react-native";
import { Button, Spinner } from "../components/common";
import DropdownMenu from "react-native-dropdown-menu";


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
        expenseAllData: []
        
      };

      componentDidMount() {
        this.retrieveDetails();
      }

      retrieveDetails = async () => {
        try {
          const id = await AsyncStorage.getItem("login");
          this.setState({ id });
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
                console.log(res.status);
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
                console.log(error);
                this.onLoginFail(
                  "Can't get Data. Please check internet connectivity."
                );
              }
            );
        }
        catch(error)
        {
            console.log(error);
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

    addExpense()
    {
      if(!this.isInt(this.state.expenseAmount.trim()))
      {
        alert('Amount should be integer');
      }
      else
      {
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
              console.log(res.status);
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
                console.log('Could not get the result')
                this.onLoginFail("Could not complete the request");
              }
            },
            error => {
              console.log(error);
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
          

    render() {
        const styles = {
          inputStyle: {
            color: "#000",
            paddingRight: 5,
            paddingLeft: 5,
            fontSize: 18,
            borderColor: "gray",
            borderWidth: 0.5,
            height: "100%",
            textAlignVertical: "top",
            backgroundColor: "white"
          }
        };

        return (
           <View style={{ flex: 1 }}>
          <DropdownMenu
          style={{ flex: 1, height: "100%" }}
          bgColor={"white"}
          tintColor={"#666666"}
          activityTintColor={"#0071ec"}
          data={this.state.dropdownData}
        >
                <View
                  style={{
                    marginTop: 15,
                    marginBottom: 10,
                    marginLeft: 6,
                    marginRight: 6,
                    height: "25%"
                  }}
                >
                
                  <TextInput
                    placeholder={"What's it for?"}
                    style={styles.inputStyle}
                    editable={true}
                    value={this.state.expenseText}
                    onChangeText={expenseText => this.setState({ expenseText })}
                    multiline={true}
                  />

                </View>
                 

            <View
                  style={{
                    marginBottom: 10,
                    marginLeft: 6,
                    marginRight: 6,
                    height: "20%"
                  }}
                >
            <TextInput
              placeholder={"$0"}
              style={styles.inputStyle}
              editable={true}
              value={this.state.expenseAmount}
              onChangeText={expenseAmount => this.setState({ expenseAmount })}
            />
           </View>
           {this.renderButton()}  
           </DropdownMenu>
        </View>
          );
    }
}

export default ExpensesPage;