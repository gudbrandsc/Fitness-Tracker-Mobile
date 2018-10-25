import React, { Component } from "react";
import { Text, View, TouchableOpacity } from "react-native";


class FollowingButton extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      followingCount: ''
    }
  }

  componentDidMount() {
    fetch("http://localhost:8000/api/getnooffollowers/43", {
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
            console.log('hello')
            const count = res.data.count;
            this.setState({followingCount: count})
          } else {
            this.setState({followingCount: 'null'})
          }
        });  
  }


  render() {
    return (
      
      <View style={{ flexDirection: "column"}} >
        <Text style={{ fontSize: 15, fontWeight: "bold", textAlign: 'center' }}>{this.state.followingCount}</Text>
       <Text style={{ fontSize: 15, textAlign: 'center', color: '#a0a0a0' }}>Following</Text> 
      </View>

    );
  }
}

export default FollowingButton;
