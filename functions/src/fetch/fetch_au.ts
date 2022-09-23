import * as functions from "firebase-functions";
const sanctions = require("sanctions");
import { saveList } from "../common";
const listId = "dfat.gov.au";
const fieldId = "Name of Individual or Entity";

export const fetchAU = functions.pubsub
  .schedule("5 11 * * *")
  .timeZone("Australia/Sydney")
  .onRun(async () => {
    try {
      let list = await sanctions.fetchAU();
      await saveList(list, listId, fieldId);
    } catch (error) {
      console.log("error ", error);
    }
  });

