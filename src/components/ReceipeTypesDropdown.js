import React from "react";
import DropDownPicker from "react-native-dropdown-picker";
import { parse } from "fast-xml-parser";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";
import get from "lodash/get";
import forEach from "lodash/forEach";
import isFunction from "lodash/isFunction";
import { RECEIPT_TYPES } from "./constant";

export default class ReceipeTypesDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      items: [],
    };
  }
  componentDidMount = async () => {
    const { showAllOptions, initialValue } = this.props;
    const receipeTypesAsset = await Asset.loadAsync(require("../../assets/receipetypes.xml"));
    const assetLocalUri = get(receipeTypesAsset, "0.localUri", "");
    const dirInfo = await FileSystem.getInfoAsync(assetLocalUri).catch((err) => console.log("Exists @ ", err));
    let file = {};
    if (dirInfo?.exists ?? false) {
      file = await FileSystem.readAsStringAsync(assetLocalUri).catch((err) => console.log("Err @ ", err));
    } else {
      console.log("Dir doesn't exists");
    }
    const xmlData = get(parse(file), "receipetypes", []);
    const types = Object.keys(xmlData);
    let items = [];
    forEach(types, (type) => {
      if (get(RECEIPT_TYPES, type))
        items.push({
          label: get(RECEIPT_TYPES, type),
          value: type,
        });
    });
    if (showAllOptions) {
      items = [{ label: "All", value: "all" }, ...items];
    }
    let state = { items };
    if (initialValue) {
      state.categoryFilter = initialValue;
    }
    this.setState({ ...state });
  };

  setOpen = (open) => {
    this.setState({ open });
  };

  setCategoryFilter = (callback) => {
    const { onChange } = this.props;
    const { categoryFilter } = this.state;
    this.setState({ categoryFilter: callback(categoryFilter) }, () => (isFunction(onChange) ? onChange(callback(categoryFilter)) : null));
  };

  setItems = (callback) => {
    this.setState((state) => ({
      items: callback(state.items),
    }));
  };
  render() {
    const { open, categoryFilter, items } = this.state;
    return (
      <DropDownPicker
        dropDownDirection={"BOTTOM"}
        searchable={false}
        open={open}
        value={categoryFilter}
        items={items}
        setOpen={this.setOpen}
        setValue={this.setCategoryFilter}
        setItems={this.setItems}
      />
    );
  }
}
