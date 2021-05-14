import React from "react";
import { FlatList, View, StyleSheet } from "react-native";
import get from "lodash/get";
import filter from "lodash/filter";
import ReceipeItem from "./ReceipeItem";
import { v4 as uuidv4 } from "uuid";
import "react-native-get-random-values";
import { openDatabase } from "../database/Database";
import ReceipeTypesDropdown from "./ReceipeTypesDropdown";
import { FAB, Icon } from "react-native-elements";

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      categoryFilter: "all",
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this._unsubscribe = navigation.addListener("focus", this.loadData);
    this.loadData();
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  loadData = async () => {
    var db = await openDatabase();
    db.transaction(
      (txn) => {
        txn.executeSql("SELECT * FROM food_receipe", [], (_, { rows: { _array } }) => {
          this.setState({ data: _array });
        });
      },
      (err) => console.log("Err @ SELECT * FROM food_receipe :: ", err)
    );
  };

  renderSeparator = () => {
    return <View style={{ height: 40 }}></View>;
  };

  renderItem = ({ item }) => {
    const { navigation } = this.props;
    const { photo, steps, ingredients, title, id, type } = item;
    return (
      <ReceipeItem
        imageUri={photo}
        title={title}
        type= {type}
        onPress={() =>
          navigation.navigate("ReceipeDetails", {
            id,
            title,
            photo,
            steps,
            type,
            ingredients,
          })
        }
      />
    );
  };

  getData = () => {
    const { categoryFilter, data } = this.state;
    return categoryFilter === "all" ? data : filter(data, (val) => get(val, "type", "") === categoryFilter);
  };

  render() {
    const { navigation } = this.props;
    return (
      <React.Fragment>
        <View style={styles.dropdown}>
          <ReceipeTypesDropdown onChange={(val) => this.setState({ categoryFilter: val })} showAllOptions={true} />
        </View>
        <FlatList
          vertical
          contentContainerStyle={{ flexGrow: 1, alignItems: "center", paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          data={this.getData()}
          renderItem={this.renderItem}
          keyExtractor={(item) => uuidv4()}
          ItemSeparatorComponent={this.renderSeparator}
        />
        <FAB icon={<Icon name="add" size={25} color="white" />} placement="right" onPress={() => navigation.navigate("ReceipeForm")} />
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  dropdown: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});
