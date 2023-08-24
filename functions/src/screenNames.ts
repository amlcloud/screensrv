import * as functions from "firebase-functions";
import { getScreenResults } from "./screenName";

const MIN_LENGHT = 7;

export const ScreenNames = functions.https.onRequest(async (req, res) => {
  let names: string[];
  let precision: number;

  if (req.method == "GET") {
    names = req.query.names as string[];
    precision = parseFloat(req.query.precision as string);
  } else if (req.method == "POST") {
    names = req.body.names as string[];
    precision = parseFloat(req.body.precision as string);
  } else {
    res.status(405).send("Method not allowed");
    return;
  }

  if (!names || names.some((name) => name.length < MIN_LENGHT)) {
    res.status(400).send("All names should have a minimum of 7 characters");
    return;
  } else if (!precision) {
    res.status(400).send("Parameter precision was not provided");
    return;
  }

  try {
    const results = await Promise.all(
      names.map((name) => getScreenResults(name, precision))
    );
    res.status(200).send(results);
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).send(err.message);
    } else {
      res.status(400).send("An error occurred");
    }
  }
});
