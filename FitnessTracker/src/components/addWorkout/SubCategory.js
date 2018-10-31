import React, { Component } from "react";
import {  StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { NumericInput } from "./NumericInput";
import { Icon } from 'react-native-elements'


class SubCategory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.type.id,
            value1: '',
            value2: '',
            value3: '',
            missingField1: false,
            missingField2: false,
            missingField3: false,
            start: true,
            active: false
        };
    }
    componentDidMount(){
        const id = this.state.id;
        var exist = this.props.inputValues.find(function(element) {
            return element.id === id ;
        });
        if(exist !== undefined){
            if(exist.value1 === '' && exist.value2 !== ''){
                this.setState({
                    value1: exist.value1,
                    value2: exist.value2,
                    missingField1: true,
                    missingField2: false,
                    start: false,                })
            }else if(exist.value2 === '' && exist.value1 !== ''){
                this.setState({
                    value1: exist.value1,
                    value2: exist.value2,
                    missingField1: false,
                    missingField2: true,
                    start: false,
                })
            }else{
                this.setState({
                    value1: exist.value1,
                    value2: exist.value2,
                    missingField1: false,
                    missingField2: false,
                    start: false,
                })
            }
        }
    }
    
    componentDidUpdate(){
        this.props.subUpdate(this.state.id, this.state.value1, this.state.value2)
    }


    handleValue1Change = (text) => {
        if (/^\d+$/.test(text) || text === '') {
            if(text === '' && this.state.value2 !== ''){
                this.setState({ 
                    value1: text,
                    missingField1: true})
            }else if(text === '' && this.state.value2 === ''){
                this.setState({ 
                    value1: text,
                    missingField1: false,
                    missingField2: false
                })
            }else {
                if(this.state.start === true){
                    this.setState({
                        value1: text,
                        missingField1: false,
                        missingField2: true,
                        start: false

                    })
                }else {
                    this.setState({
                    value1: text,
                    missingField1: false
                    })
                }
            }
        }else{
            alert("Please enter numbers only"); 
        }
    }

    handleValue2Change = (text) => {
        if (/^\d+$/.test(text) || text === '') {
            if(text === '' && this.state.value1 !== ''){
                this.setState({ 
                    value2: text,
                    missingField2: true
                })
            }else if(text === '' && this.state.value1 === ''){
                console.log('Missing both fields')
                this.setState({ 
                    value2: text,
                    missingField1: false,
                    missingField2: false
                })
            }else {
                if(this.state.start === true){
                    this.setState({
                        value1: text,
                        missingField1: true,
                        missingField2: false,
                        start: false

                    })
                }else {
                this.setState({
                    value2: text,
                    missingField2: false
                    })
                }
            }
        }else{
            alert("Please enter numbers only"); 
        }
    }

    handleValue3Change = (text) => {
        if (/^\d+$/.test(text) || text === '') {
            this.setState({ 
                value2: text,
                missingField2: true
            })
        }else{
            alert("Please enter numbers only"); 
        }
    }
    
    
    renderInput1(){
        if(this.state.active === true){

            return (
                <View>
                    <Text style={styles.labelStyle}>Reps</Text>
                    <View style={[styles.inputField, this.state.missingField1 ? styles.missingFieldColor :  styles.normalFieldColor]}>
                        <NumericInput  
                            value={this.state.value1} 
                            onChangeText={this.handleValue1Change} 
                            placeholder={'Enter reps...'} 
                            missingField={this.state.missingField2} 
                            maxLength={3} 
                        />
                    </View>
                </View>
            );
        }
    }

    renderInput2(){
        if(this.state.active === true){
            return (
                <View>        
                    <Text style={styles.labelStyle}>Weight</Text>
                    <View style={[styles.inputField, this.state.missingField2 ? styles.missingFieldColor :  styles.normalFieldColor]}>
                        <NumericInput  
                            value={this.state.value2} 
                            onChangeText={this.handleValue2Change} 
                            placeholder={'Enter weight...'} 
                            missingField={this.state.missingField1} 
                            maxLength={3} 
                        />
                    </View>
                </View>
            );
        }
    }

    renderInput3(){
        if(this.state.active === true){
            return (
                <View>        
                    <Text style={styles.labelStyle}>Sets</Text>
                    <View style={[styles.inputField, this.state.missingField2 ? styles.missingFieldColor :  styles.normalFieldColor]}>
                        <NumericInput  
                            value={this.state.value3} 
                            onChangeText={this.handleValue3Change} 
                            placeholder={'Enter sets...'} 
                            missingField={this.state.missingField3} 
                            maxLength={3} 
                        />
                    </View>
                </View>
            );
        }
    }
    getIcon(){
        if(this.state.active === true){
            return 'remove-circle-outline';
        }
        return  'add-circle-outline' ;
    }

    render() {
            return (
                <View style={{paddingTop: 10}}>
                    <View style={styles.container}>                        
                        <View style={styles.cardStyle}>
                            <View style={styles.topCardWrapperStyle}>
                                <View style={styles.WorkoutNameStyle}>
                                    <Text style={styles.WorkoutNameTextStyle}>{this.props.type.WorkoutName}</Text>
                                </View>

                                <View style={styles.plusSignStyle}>
                                    <TouchableOpacity onPress={() => this.setState({ active: !this.state.active })}>
                                        <Icon name={this.getIcon()} color='#00e7b1'/>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        <View style={[styles.inputFieldsWrapper, this.state.active ? styles.cardExpandStyle : styles.cardCollapseStyle]}>
                            {this.renderInput3()}
                            {this.renderInput1()}
                            {this.renderInput2()}
                        </View>
                    </View>
                </View>
            );
        }
    
}

const styles = StyleSheet.create({
    container: {
        elevation: 1,
        marginLeft: 10,
        marginRight: 10,
        flexDirection: "column", // main axis
        justifyContent: "space-around", // main axis
        backgroundColor: "#fff",
        shadowColor: '#000000',
        shadowOffset: {
          width: 0,
          height: 3
        },
        shadowRadius: 5,
        shadowOpacity: 0.3,
    },
    cardStyle: {
        flexDirection: 'column',
        justifyContent:'center',
        paddingTop: 20
    },
    topCardWrapperStyle: {
        flexDirection:'row',
        justifyContent:'center'
      },
      WorkoutNameStyle: {
        justifyContent: 'flex-start',
        flex:1,
        paddingLeft: 10
      },
      plusSignStyle: {
        justifyContent: "flex-end", // main axis
        paddingRight: 10,
        flex: 0

      },
      inputFieldsWrapper: {
        margin: 10,
        flex:1,
        flexDirection: "row",
        justifyContent: 'space-between',
    
      },
      cardExpandStyle: {
        paddingTop: 20,
        borderTopWidth: 1,
        borderColor: '#ddd',
      },
      cardCollapseStyle: {
        paddingTop: 0,
        borderTopWidth: 0,
      },
    inputField: {
        borderRadius: 4,
        borderWidth: 1,
        padding: 5,
        margin: 5,
        flex: 1,
        alignItems: 'stretch'

    },
    missingFieldColor: {
        borderColor: 'red',
    },
    normalFieldColor: {
        borderColor: '#d6d7da',
    },
    labelStyle: {
        textAlign: 'center'
    },    
    WorkoutNameTextStyle: {
        fontWeight: '200',
        color: '#636463',
        fontSize: 16,
        fontFamily:'arial', 
    },
});




export default SubCategory;
