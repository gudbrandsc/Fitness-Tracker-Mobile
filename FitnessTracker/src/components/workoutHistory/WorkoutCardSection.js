import React, {Component} from 'react';
import {TouchableOpacity, StyleSheet,  Text, View, FlatList} from 'react-native';
import { Icon } from 'react-native-elements'
import ExerciseItem from './ExerciseItem'

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

  

  render() {
    return (
      <View style={{flex: 1}}>
       <ExerciseItem
            imageurl={"https://res.cloudinary.com/fitnesstracker/image/upload/v1541742154/chest.gif"}
            workoutName={"Dumbell Press"}
            category={"Chest"}
            sets={"1"}
            reps={"2"}
            weight={"3"}
          /> 
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


