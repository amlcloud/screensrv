import * as functions from "firebase-functions";
const sanctions = require("sanctions");
import { saveList } from "./common";
const listId = " https://www.interpol.int/";
const fieldId = "Interpol Red Notice";

export const fetchUSAlist = functions.pubsub.schedule("5 11 * * *").timeZone("Australia/Sydney").onRun(async () => {
  console.log("This will be run every day at 11:05 AM");
  await fetchIPList();
  return null;
});

export async function fetchIPList() {
  try {
    const list = await sanctions.fetchIP();
    await saveList(list, listId, fieldId);
  } catch (error) {
    console.log("error ", error);
  }
}
