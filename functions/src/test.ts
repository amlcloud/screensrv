import * as sanctions from "sanctions";
import { saveList } from "./common";


// For testing the sanctions module
test_fetch();

export async function test_fetch() {
    try {
      console.log("fetch");
      const list = await sanctions.dfat_gov_au__consolidated_list();
      console.log("fetch done, save...");
      await saveList(list, "dfat_gov_au__consolidated_list", "fieldId");
    } catch (error) {
      console.log("error ", error);
    }
  }
