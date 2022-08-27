import * as functions from "firebase-functions";
import { _screen } from "./screen";
import { search } from "./fuzzy_search";

/**
 * Returns with object containg screening results of all entrys with name 'name'
 * @param {string} name
 * @param {number} gramSize
 * @param {number} pres
 * @return {}
 * {
 *    resultsCount: Num. of results returned,
 *    screenData: Array of objects containing screen data for all results,
 * }
 * As Array of Jsons
 */
export const findName = functions.https.onRequest(async (req: any, res: any) => {
  const { name, gramSize, pres} = req.query
  const data = await search(name as string, gramSize as number, pres as number);
  res.send(JSON.stringify(data));
});

/**
 * Saves searches and populates documents with data
 * @param {string} name
 * @param {number} gramSize
 * @param {number} pres
 * @return String: `screening results count: ${resultsCount.toString()} from query ${name}!`
 */
export const screen = functions.https.onRequest(async (req: any, res: any) => {
  const { name, gramSize, pres} = req.query
  const resultsCount = await _screen(name as string, gramSize as number, pres as number);
  res.send(`screening results count: ${resultsCount.toString()} from query ${name}!`);
});