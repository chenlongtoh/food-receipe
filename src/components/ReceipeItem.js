import React from "react";
import { View, Image, TouchableOpacity, Text, StyleSheet, Dimensions } from "react-native";
import { RECEIPT_TYPES } from "./constant";
import get from "lodash/get";

export default class ReceipeItem extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { imageUri, title, type, onPress } = this.props;
    return (
      <TouchableOpacity onPress={onPress}>
        <View style={styles.container}>
          <Image style={styles.photo} source={{ uri: imageUri }} />
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{`Category: ${get(RECEIPT_TYPES, type, "N/A")}`}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

// screen sizing
const { width, height } = Dimensions.get("window");
// orientation must fixed
const SCREEN_WIDTH = width < height ? width : height;
const RECIPE_ITEM_HEIGHT = 150;

const styles = StyleSheet.create({
  container: {
    textAlign: "center",
    width: SCREEN_WIDTH * 0.8,
    height: RECIPE_ITEM_HEIGHT + 65,
    borderColor: "#cccccc",
    borderWidth: 0.5,
    borderRadius: 15,
  },
  photo: {
    width: SCREEN_WIDTH * 0.8,
    height: RECIPE_ITEM_HEIGHT,
    borderRadius: 15,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "center",
    color: "#444444",
    marginTop: 10,
    marginRight: 5,
    marginLeft: 5,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#444444",
    marginBottom: 10,
  },
});
