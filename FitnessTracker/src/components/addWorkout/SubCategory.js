import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { NumericInput } from "./NumericInput";
import { Icon } from 'react-native-elements'

/**
 * Component that renders a spesific exercise type, and allows the user to enter their exercise result. 
 */
class SubCategory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.type.id,
            value1: '',
            value2: '',
            value3: '',
            valueLable1: '',
            valueLable2: '',
            valueLable3: '',
            placeholder1: '',
            placeholder2: '',
            placeholder3: '',
            missingField1: false,
            missingField2: false,
            missingField3: false,
            start: true,
            active: false
        };
    }
    // Method that is used if a user tries to submit a workout session where there 
    // is a missing field in one exercise. If the current excercise has a missing field 
    // then highlight it.
    componentWillReceiveProps(nextProps) {
        if(this.props.missingField !== nextProps.missingField){
            if((this.state.value1 === "") && (this.state.value2 !== "" || this.state.value3 !== "")){
                this.setState({missingField1: true})
            }

            if((this.state.value2 === "") && (this.state.value1 !== "" || this.state.value3 !== "")){
                this.setState({missingField2: true})
            }

            if((this.state.value3 === "") && (this.state.value2 !== "" || this.state.value1 !== "")){
                this.setState({missingField3: true})
            }
            this.forceUpdate();
        }
    } 
    
    // If a sub category is re-opened then it should have the value previusly added. 
    componentDidMount(){
        const id = this.state.id;
        var exist = this.props.inputValues.find(function(element) {
            return element.id === id ;
        });

        if(exist !== undefined && this.props.categoryId !== 8){
            this.setState({
                value1: exist.value1,
                value2: exist.value2,
                value3: exist.value3,
                start: false,      
                active: true         
            })
        }else if(exist !== undefined && this.props.categoryId === 8 && (exist.value1 !== "" || exist.value2 !== "")){
            this.setState({
                value1: exist.value1,
                value2: exist.value2,
                value3: exist.value3,
                start: false,      
                active: true         
            })
        } else {
            this.setState({
                start: false
            })
        }
        // Set placeholders and label for the exercise
        if(this.props.categoryId === 8 ){
            this.setState({
                valueLable1: 'Minutes',
                valueLable2: 'Total Miles',
                placeholder1: 'Enter Min...',
                placeholder2: 'Enter Miles...',

            })
        }else{
            this.setState({
                valueLable1: 'Num sets',
                valueLable2: 'Num reps',
                valueLable3: 'Weight',
                placeholder1: 'Enter sets...',
                placeholder2: 'Enter reps...',
                placeholder3: 'Enter Weight...'
            })
        }
    }
    
    // Method called to the categorylist when a user starts to add data about the spesific exercise
    componentDidUpdate(){
        if(this.state.start === false){
            if(this.props.categoryId === 8){
                if(this.state.value1 !== "" || this.state.value2 !== ""){
                    this.props.subUpdate(this.state.id, this.state.value1, this.state.value2, "0")
                }else {
                    this.props.subUpdate(this.state.id, this.state.value1, this.state.value2, "")
                }
            }else{
            this.props.subUpdate(this.state.id, this.state.value1, this.state.value2, this.state.value3)
            }
        }
    }

    //Verify that the value for the first inputfield entered is numeric 
    handleValue1Change = (text) => {
        if (/^\d+$/.test(text) || text === '') {
            this.setState({ 
                value1: text,
            })
        }else{
            alert("Please enter numbers only"); 
        }
    }

    //Verify that the value for the second inputfield entered is numeric 
    handleValue2Change = (text) => {
        if (/^\d+$/.test(text) || text === '') {
            this.setState({ 
                value2: text,
            })
        }else{
            alert("Please enter numbers only"); 
        }
    }

    //Verify that the value for the third inputfield entered is numeric 
    handleValue3Change = (text) => {
        if (/^\d+$/.test(text) || text === '') {
            this.setState({ 
                value3: text,
            })
        }else{
            alert("Please enter numbers only"); 
        }
    }
    
    // Render the first input field
    renderInput1(){
        if(this.state.active === true){
            return (
                <View>
                    <Text style={styles.labelStyle}>{this.state.valueLable1}</Text>
                    <View style={[styles.inputField, this.state.missingField1 ? styles.missingFieldColor :  styles.normalFieldColor]}>
                        <NumericInput  
                            value={this.state.value1} 
                            onChangeText={this.handleValue1Change} 
                            placeholder={this.state.placeholder1} 
                            maxLength={3} 
                        />
                    </View>
                </View>
            );
        }
    }

    // Render the second input field
    renderInput2(){
        if(this.state.active === true){
            return (
                <View>        
                    <Text style={styles.labelStyle}>{this.state.valueLable2}</Text>
                    <View style={[styles.inputField, this.state.missingField2 ? styles.missingFieldColor :  styles.normalFieldColor]}>
                        <NumericInput  
                            value={this.state.value2} 
                            onChangeText={this.handleValue2Change} 
                            placeholder={this.state.placeholder2} 
                            maxLength={3} 
                        />
                    </View>
                </View>
            );
        }
    }

    // Render the third input field
    // If the category type is of type cardio then don't render 
    renderInput3(){
        if(this.props.categoryId !== 8 ){
            if(this.state.active === true){
                return (
                    <View>        
                        <Text style={styles.labelStyle}>{this.state.valueLable3}</Text>
                        <View style={[styles.inputField, this.state.missingField3 ? styles.missingFieldColor :  styles.normalFieldColor]}>
                            <NumericInput  
                                value={this.state.value3} 
                                onChangeText={this.handleValue3Change} 
                                placeholder={this.state.placeholder3} 
                                maxLength={3} 
                            />
                        </View>
                    </View>
                );
            }
        }
    }

    // Show or hide icon.
    getIcon(){
        if(this.state.active === true){
            return 'remove-circle-outline';
        }
        return  'add-circle-outline' ;
    }

    render() {
        return (
            <View style={{paddingTop: 10, padding: 10}}>
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
                        {this.renderInput1()}
                        {this.renderInput2()}
                        {this.renderInput3()}
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
        alignItems: 'stretch',
        width: 90
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
