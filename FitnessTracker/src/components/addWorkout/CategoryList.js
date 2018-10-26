import React, {Component} from 'react';
import { StyleSheet, Text, View, ScrollView } from "react-native";
import CategoryDetail from './CategoryDetail'



class CategoryList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: '',
    }
  }



  renderUser () {
   return this.props.workouts.map(workout =>
    <CategoryDetail key={workout.id} workout={workout} />
   );
  }

  render(){
    console.log('Inside CategoryList')
    return (
      <ScrollView style={styles.container}>
        { this.renderUser() }
      </ScrollView>
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


export default CategoryList;
