import * as functions from "firebase-functions";
const sanctions = require("sanctions");
import { saveList } from "./common";
const listId = "www.government.nl";
const fieldId = "Surname";

export const fetchNLlist = functions.pubsub.schedule("5 11 * * *").timeZone("Australia/Sydney").onRun(async () => {
  console.log("This will be run every day at 11:05 AM");
  await fetchNL();
  return null;
});

export async function fetchNL() {
  try {
    const list = await sanctions.fetchNL();
    await saveList(list, listId, fieldId);
  } catch (error) {
    console.log("error ", error);
  }
}
