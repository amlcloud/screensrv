import * as sanctions from "sanctions";
import { updateList } from "./common";


// For testing the sanctions module
testFetch();

export async function testFetch() {
    try {
      console.log("fetch");
      // const list = await sanctions.dfat_gov_au__consolidated_list();
      const list = await sanctions.bis_doc_gov__denied_persons();
      console.log("fetch done, save...");
      // await saveList(list, "dfat_gov_au__consolidated_list", "fieldId");
      await updateList(list, "robert_test_list");
    } catch (error) {
      console.log("error ", error);
    }
  }
