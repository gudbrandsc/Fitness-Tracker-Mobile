import React, { Component } from "react";
import { StyleSheet, TextInput, Text, View, Image } from "react-native";
import { Button, Spinner } from "../components/common";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import axios from "axios";

/**
 * A script that allows the user to search for gyms on the map based on specific preferences and to see details about the gyms.
 */
class MapSearchPage extends Component {
  state = {
    region: {
      latitude: 37.7655,
      longitude: -122.4444,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1
    },
    latitude: 37.7655,
    longitude: -122.4444,
    error: null,
    searchValue: "",
    markers: [],
    refresh: 0,
    markerDetailsViewOpacity: 0,
    markerDetailsViewPress: "none",
    markerDetailsImage:
      "https://res.cloudinary.com/fitnesstracker/image/upload/v1541611311/blankImg.jpg",
    loadingMarkerDetails: null,
    markerSelectedId: 0
  };

  /**
   * A Built in function that gets the current geolocation of the device and updates the variables in the state
   */
  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      position => {
        const region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1
        };
        this.setState({
          region,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null
        });
      },
      error => {
        this.setState({ error: error.message });
        console.log(error);
      },
      { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 }
    );
  }

  /**
   * A function that is called when the user presses "Enter on keyboard". It checks if the search text is not empty
   * then calls an API to googlemaps to get all the places near by 8000 meters to the device's current location.
   * Then it parses the response to extract the data needed and adds them to marker's list.
   */
  startSearch() {
    console.log("Start searching");
    try {
      const searchValue = this.state.searchValue.trim();
      if (searchValue.length > 0) {
        fetch(
          "https://maps.googleapis.com/maps/api/place/textsearch/json?query=" +
            searchValue +
            "&location=" +
            this.state.latitude +
            "," +
            this.state.longitude +
            "&radius=8000&key=AIzaSyA92o1PC2GUo5f-_--4yhIaQjjo8XhnnU4",
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json"
            }
          }
        )
          .then(response =>
            response.json().then(data => ({
              data: data,
              status: response.status
            }))
          )
          .then(
            res => {
              console.log(res.data);
              const markers = [];
              for (var i = 0; i < res.data.results.length; i++) {
                const id = i + 1;
                const latitude = res.data.results[i].geometry.location.lat;
                const longitude = res.data.results[i].geometry.location.lng;
                const title = res.data.results[i].name;
                const openingHours = res.data.results[i].opening_hours;
                const opened = false;
                if (openingHours)
                  opened = res.data.results[i].opening_hours.open_now;
                let openedNow = "Opened";
                if (!opened) openedNow = "Closed";
                const rating = res.data.results[i].rating;
                const description =
                  "Rating: " + rating + " / 5 - " + openedNow + " now.";
                const address = res.data.results[i].formatted_address;
                const photos = res.data.results[i].photos;
                var photoReference = "";
                if (photos)
                  photoReference =
                    res.data.results[i].photos[0].photo_reference;
                const types = res.data.results[i].types;
                var typesString = "";
                for (var j = 0; j < types.length; j++) {
                  typesString += types[j];
                  if (j < types.length - 1) typesString += ", ";
                }
                typesString = typesString.replace(new RegExp("_", "g"), " ");
                const marker = {
                  id: id,
                  latitude: latitude,
                  longitude: longitude,
                  title: title,
                  description: description,
                  icon: require("../components/UIdesign/gymMarker1.png"),
                  address: address,
                  photoReference: photoReference,
                  openedNow: openedNow,
                  rating: rating + " / 5",
                  typesString: typesString
                };
                markers.push(marker);
              }
              const refresh = this.state.refresh + 1;
              this.setState({ markers, refresh });
              //console.log(markers);
            },
            error => {
              console.log(error);
              alert("Couldn't load data on the map.");
            }
          );
      }
    } catch (error) {
      console.log(error);
      alert("Check Internet Connectivity");
    }
  }

  /**
   * A function that accepts the photo refernce and calls a google api to get the actual picture from that reference.
   * Then saves it in markerDetailsImage on success.
   */
  getMarkerPicture(photo_reference) {
    try {
      axios
        .get(
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&maxheight=400&photoreference=" +
            photo_reference +
            "&key=AIzaSyA92o1PC2GUo5f-_--4yhIaQjjo8XhnnU4"
        )
        .then(
          function(response) {
            console.log(response);
            var img =
              "https://res.cloudinary.com/fitnesstracker/image/upload/v1541359522/noimg.jpg";
            if (response.status == 200) {
              img = response.request.responseURL;
            }
            this.setState({
              loadingMarkerDetails: false,
              markerDetailsImage: img
            });
          }.bind(this)
        )
        .catch(
          function(error) {
            this.onFailure("Can't load the image.");
          }.bind(this)
        );
    } catch (error) {
      this.onFailure("Can't load the image.");
    }
  }

  /**
   * A function that accepts an error message and alerts it to the user then resets the loadingMarkerDetails and
   * markerDetailsImage.
   */
  onFailure(err) {
    alert(err);
    this.setState({
      loadingMarkerDetails: false,
      markerDetailsImage:
        "https://res.cloudinary.com/fitnesstracker/image/upload/v1541359522/noimg.jpg"
    });
  }

  /**
   * A function called when pressing on a marker, it gets the details of the selected marker by its ID from the markers list
   * and set them then getMarkerPicture function is called.
   * Then it shows the Marker View box by setting the opacity to 1 and View Press to auto which enables triggering the press on the view
   * of the marker details box.
   */
  openDetailsView(id) {
    const photo_reference = this.state.markers[id - 1].photoReference;
    this.setState({
      markerDetailsViewOpacity: 1,
      markerDetailsViewPress: "auto",
      loadingMarkerDetails: true,
      markerSelectedId: id - 1
    });
    this.getMarkerPicture(photo_reference);
  }

  /**
   * A function called when the close button is pressed in the marker view box. It resets the marker's details
   * and close the view by setting the opacity to 0 and ViewPress to none which disable triggering the press on the view of the marker
   * details box.
   */
  closeMarkerDetails() {
    this.setState({
      markerDetailsViewOpacity: 0,
      markerDetailsViewPress: "none",
      markerDetailsImage:
        "https://res.cloudinary.com/fitnesstracker/image/upload/v1541359522/noimg.jpg",
      loadingMarkerDetails: null,
      markerSelectedId: 0
    });
  }

  /**
   * A function that iterates through the marker's list and renders the details to the Marker built in component for react-native-map.
   */
  renderMarkers() {
    if (this.state.refresh > 0) {
      return (
        <React.Fragment>
          {this.state.markers.map(marker => (
            <Marker
              key={marker.id}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude
              }}
              title={marker.title}
              description={marker.description}
              image={marker.icon}
              onPress={() => this.openDetailsView(marker.id)}
            />
          ))}
        </React.Fragment>
      );
    }
  }

  /**
   * A function that renders the Marker Details View Box, it is always rendered but when the user presses on a marker its opacity
   * changes to 1 to appear and the ViewPress gets enabled. When the user presses the close button, this component gets hidden again
   */
  renderMarkerDetails() {
    if (this.state.loadingMarkerDetails == false) {
      return (
        <React.Fragment>
          <View
            style={{
              width: "100%",
              height: "40%"
            }}
          >
            <Image
              style={{
                resizeMode: "stretch",
                flex: 1
              }}
              source={{ uri: this.state.markerDetailsImage }}
            />
          </View>
          <View
            style={{
              width: "100%",
              height: "55%",
              flexDirection: "column",
              paddingLeft: 10,
              paddingBottom: 2
            }}
          >
            <Text
              style={{
                fontSize: 17,
                marginBottom: 2,
                marginTop: 5,
                fontWeight: "bold"
              }}
            >
              {this.state.markers[this.state.markerSelectedId].title}
            </Text>
            <Text style={{ fontSize: 15, marginBottom: 2 }}>
              {this.state.markers[this.state.markerSelectedId].address}
            </Text>
            <Text style={{ fontSize: 15, marginBottom: 2 }}>
              {this.state.markers[this.state.markerSelectedId].typesString}
            </Text>
            <Text style={{ fontSize: 15, marginBottom: 2 }}>
              {this.state.markers[this.state.markerSelectedId].rating}
            </Text>
            <Text style={{ fontSize: 15 }}>
              {this.state.markers[this.state.markerSelectedId].openedNow}
            </Text>
            <View
              style={{
                width: 90,
                height: 30,
                marginLeft: "70%"
              }}
            >
              <Button
                size={"medium"}
                type={"danger"}
                onPress={this.closeMarkerDetails.bind(this)}
              >
                Close
              </Button>
            </View>
          </View>
        </React.Fragment>
      );
    }
    if (this.state.loadingMarkerDetails == true)
      return <Spinner size="large" />;
    return;
  }

  /**
   * Main Built in render function that renders the whole Page.
   */
  render() {
    const styles = StyleSheet.create({
      container: { ...StyleSheet.absoluteFillObject },
      map: { ...StyleSheet.absoluteFillObject },
      searchContainer: {
        alignItems: "center",
        height: 55,
        width: "100%",
        paddingRight: 10,
        paddingLeft: 10,
        paddingTop: 6,
        backgroundColor: "rgba(255,255,255,0.7)"
      },
      searchBorder: {
        borderWidth: 2,
        borderColor: "#cbcbcb",
        borderRadius: 18,
        height: "88%",
        width: "100%",
        flexDirection: "row",
        justifyContent: "center"
      },
      searchBar: {
        height: "100%",
        width: "90%",
        fontSize: 15,
        margin: 2
      },
      markerDetailsContainer: {
        flex: 1,
        flexDirection: "column",
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 15,
        height: "auto",
        backgroundColor: "white",
        position: "absolute",
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        borderWidth: 1,
        borderColor: "#2fd5ff",
        opacity: this.state.markerDetailsViewOpacity
      }
    });

    return (
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          <MapView style={styles.map} region={this.state.region}>
            <Marker
              key={0}
              coordinate={{
                latitude: this.state.latitude,
                longitude: this.state.longitude
              }}
              title={"My Location"}
              description={"You're here"}
            />
            {this.renderMarkers()}
          </MapView>
        </View>
        <View style={styles.searchContainer}>
          <View style={styles.searchBorder}>
            <Image
              style={{ width: 28, height: 28, alignSelf: "center" }}
              source={require("../components/UIdesign/searchImg.png")}
            />
            <TextInput
              secureTextEntry={false}
              placeholder={"Search for gyms"}
              autoCorrect={false}
              editable={true}
              multiline={false}
              style={styles.searchBar}
              value={this.state.searchValue}
              onChangeText={searchValue => this.setState({ searchValue })}
              onSubmitEditing={this.startSearch.bind(this)}
            />
          </View>
        </View>
        <View
          style={styles.markerDetailsContainer}
          pointerEvents={this.state.markerDetailsViewPress}
        >
          {this.renderMarkerDetails()}
        </View>
      </View>
    );
  }
}

export default MapSearchPage;
