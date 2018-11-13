import React, {Component} from 'react';
import {TouchableOpacity, StyleSheet,  Text, View} from 'react-native';
import { Icon } from 'react-native-elements'


class WorkoutCardSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
    }
  }

  getIcon(){
    if(this.state.active === true){
        return 'remove-circle-outline';
    }
    return  'add-circle-outline' ;
  }

  renderWorkoutDetails(){
    if(this.props.exercise.cardio === "true"){
      return( 
        <View style={styles.container}>
          <Text>{this.props.exercise.workoutname}</Text>
          <Text>Time: {this.props.exercise.noofsets} Distance: {this.props.exercise.noofreps} </Text>
        </View>
     );
    } else{
      return( 
        <View style={styles.container}>
          <Text>{this.props.exercise.workoutname}</Text>
          <Text>{this.props.exercise.noofsets}. {this.props.exercise.noofreps} x {this.props.exercise.weight} lbs</Text>
        </View>
      );
    }
  }


  render() {
    return (
      <View style={{paddingTop: 10, padding: 10}}>
        {this.renderWorkoutDetails()}
      </View>
  );
  }
}
export default WorkoutCardSection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
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


