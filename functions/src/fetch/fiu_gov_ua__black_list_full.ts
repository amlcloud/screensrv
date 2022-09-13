import * as functions from "firebase-functions";
const sanctions = require("sanctions");
import { saveList } from "./common";
const listId = "fiu.gov.ua";
const fieldId = "date-entry";

export const fetchUkraineList = functions.pubsub.schedule("5 11 * * *").timeZone("Australia/Sydney").onRun(async () => {
  console.log("This will be run every day at 11:05 AM");
  try {
    const list = await sanctions.fiu_gov_ua__black_list_full();
    await saveList(list, listId, fieldId);
  } catch (error) {
    console.log("error ", error);
  }
  return null;
});
