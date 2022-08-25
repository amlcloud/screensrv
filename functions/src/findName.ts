import * as functions from "firebase-functions";
import { search } from "./fuzzy_search";

export const findName = functions.https.onRequest(async (request, response) => {
  const resultsCount = await search(request.body.name, 2, 0.95);
  response.send(`screening results count: ${resultsCount.toString()}!`);

});

