import * as SQLite from "expo-sqlite";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";

async function openDatabase() {
  if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + "SQLite/foodReceipe.db")).exists) {
    if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + "SQLite")).exists) {
      await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + "SQLite");
    }
    await FileSystem.downloadAsync(Asset.fromModule(require("../../assets/sqlite.db")).uri, FileSystem.documentDirectory + "SQLite/foodReceipe.db");
  }
  return SQLite.openDatabase("//foodReceipe.db");
}
export { openDatabase };
