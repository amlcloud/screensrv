import * as functions from "firebase-functions";
const sanctions = require("sanctions");
import { saveList } from "../common";
const listId = "webgate.ec.europa.eu";
const fieldId = "euReferenceNumber";

export const ukList = functions.pubsub
  .schedule("5 11 * * *")
  .timeZone("Australia/Sydney")
  .onRun(async () => {
    console.log("This will be run every day at 11:05 AM");
    await fetchUKList();
    return null;
  });

export async function fetchUKList() {
  try {
    const list = await sanctions.fetchUK();
    await saveList(list, listId, fieldId);
  } catch (error) {
    console.log("error ", error);
  }
}
