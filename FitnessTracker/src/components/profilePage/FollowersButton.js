import React, { Component } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { Spinner } from "../common";
import axios from "axios";


class FollowingButton extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: []
    };
  }

  componentDidMount() {
    axios
      .get(
        "http://localhost:8000/api/listfollower/" + this.props.userId
      )
      .then(response => this.setState({ users: response.data }))
    this.setState({loading: false});
  }

  renderCount(){
    if(this.state.loading === false){
      return(
        <View>
      <Text style={{ fontSize: 15, fontWeight: "bold", textAlign: 'center' }}>{this.state.data.length}</Text>
      <Text style={{ fontSize: 15, textAlign: 'center', color: '#a0a0a0' }}>Followers</Text>
      </View>
      );
    }else {
      return <Text>Rendering</Text>;
    }
  }

  render() {
    return (
      
      <View style={{ flexDirection: "column"}} >
        {this.renderCount()}
      </View>

    );
  }
}

export default FollowingButton;
