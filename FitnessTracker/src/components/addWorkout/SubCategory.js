import React, { Component } from "react";
import {  StyleSheet, TextInput, View, Text } from "react-native";


class SubCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
        id: this.props.type.id,
        value1: '',
        value2: '',
        missingField1: false,
        missingField2: false,

    };
  }

  checkMissingInputState(){
    if(this.state.value2 === '' && this.state.value1 !== ''){
        this.setState({missingField2: true})
    }else if(this.state.value1 === '' && this.state.value2 !== ''){
        this.setState({missingField1: true})
    }else{
        this.setState({missingField1: false, missingField2: false })
    }
  }
  updateParentWithData(){
    if(this.state.missingField1 === false && this.state.missingField2 === false){
        this.props.subUpdate(this.state.id, this.state.value1, this.state.value2)
    }
  }


  handleValue1Change = (text) => {
    this.setState({ value1: text })
    this.checkMissingInputState();
    this.updateParentWithData();

 }

 handleValue2Change = (text) => {
    this.setState({ value2: text })
    this.checkMissingInputState();
    this.updateParentWithData();
 }

 renderInput1(){
     return (
        <View style={[styles.inputField, this.state.missingField1 ? styles.missingFieldColor :  styles.normalFieldColor]}>
        <TextInput 
            placeholder = "Enter Value"
            placeholderTextColor = "#9a73ef"
            autoCapitalize = "none"
            value={this.state.value1}
            onChangeText = {this.handleValue1Change}
            style={{flex: 2}}
        />
        </View>
     );
 }
  renderInput2(){
     return (
        <View style={[styles.inputField, this.state.missingField2 ? styles.missingFieldColor :  styles.normalFieldColor]}>
        <TextInput 
            placeholder = "Enter Value"
            placeholderTextColor = "#9a73ef"
            autoCapitalize = "none"
            value={this.state.value2}
            onChangeText = {this.handleValue2Change}
            style={{flex: 2}}
        />
        </View>
     );
 }

  render() {
    return (
        <View style={styles.container}>
            <View style={styles.workoutNameStyle}>
                <Text>{this.props.type.WorkoutName}</Text>
            </View>
            <View style={styles.inputFieldsWrapper}>
               {this.renderInput1()}
               {this.renderInput2()}

               
             </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        elevation: 1,
        borderRadius: 2,
        borderBottomWidth: 1,
        borderColor: "#ddd",
        flex: 1,
        flexDirection: "row", // main axis
        justifyContent: "flex-start", // main axis
        alignItems: "center", // cross axis
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 16,
        marginTop: 0,
        backgroundColor: "#fff"
    },
    workoutNameStyle: {
        flex: 1,
        flexDirection: "column"
      },
      inputFieldsWrapper: {
        paddingLeft: 16,
        flex: 2,
        margin: 10,
        flexDirection: "row", // main axis


      },
    inputField: {
        borderRadius: 4,
        borderWidth: 1,
        padding: 5,
        margin: 5,
        flex: 1,

    },
    missingFieldColor: {
        borderColor: 'red',
    },
    normalFieldColor: {
        borderColor: '#d6d7da',

    }
});




export default SubCategory;
