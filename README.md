# Sanctions Screener

Sanctions Screening App

Purpose:
- Provide sanctions screening via UI: results ranked by match score (0.95-100%)

Intended features:
- Screen an entity (person/item or organisation) against all open sanctions lists.
- Look at up-to-date sanctions lists in one location.

This repo only defines server functions, which will serve as the back-end of the application.

## Data structure

* #### /admin 
  * This collection contains admin user IDs. Based on these records the user can have admin privileges. If document with your UID exists in this collection then you have admin rights to configure indexes and lists.

* #### /index
  * This collection contains indices (indexes) of all sanctions lists in the storage.
  * As an example, '/index/ec_europa_eu__sanctions_list|"Vostok Brigade"' document holds an index record for sanction list with id "ec_europa_eu__sanctions_list" and search name "Vostok Brigade". Meaning, when you are searching for "Vostok Brigade" or "Vastok Brigada" both should return the document exists in "list/ec_europa_eu__sanctions_list" and is referenced by this index record (via ref field).

* #### /list
  * This collection contains all sanction lists. Each document in this collection records the last updated and changed times of this list and general information about the list (like source URL, etc)

* #### /list/{listId}/item/{itemId}
  * This collection contains individual sanction list records as they are present in the original sanction document.

* #### /list/{listId}/indexConfig
  * This collection contains indices configuration that are used to build this list's indices. Each list can have multiple indices configured separately.

* #### /user
  * This collection contains each user's private information that is not accessable by other users. It also contains user preferences.

* #### /user/{uid}/search
  * This collection contains your search history

* #### /user/{uid}/search/{searchId}/result
  * This collection contains an individual search results, i.e. items that were found when the search was executed.

## API

This is the API we expose to the clients (customers) that they can use via request (HTTPS) calls.

* #### GetSanctionLists
  * This function returns the list of JSON objects containing meta info about all sanction lists available on the system.

* #### GetSanctionListEntities
  * This function returns the list of items (in JSON) of the sanction list.

* #### ScreenName
  * input: search target string, precision (0.9-1)
  * This function returns screening results based on the fuzzy search matching on the entire index (all sanctions lists) with the given precision. If precision is 1 it will return only exactly matching records.

* #### ScreenPerson (TBD)
  * input: search target string, precision (0.9-1), (optional: DOB, nationality)
  * This function returns screening results based on the fuzzy search matching on the entire index (all sanctions lists) with the given precision. If precision is 1 it will return only exactly matching records.

## Deployment
```
run firebase deploy --only functions
```

## Test in the cloud:
```
gcloud pubsub topics publish  --message 'MyMessage'
```

```
curl -X POST -H "Content-Type:application/json" -H "X-MyHeader: 123" "https://us-central1-screener-9631e.cloudfunctions.net/index_list2?list=ec_europa_eu__sanctions_list" -d '[{"field":"nameAlias", "type":"array","subField":"wholeName"}]'
```

```
curl -X POST -H "Content-Type:application/json" -H "X-MyHeader: 123" "https://us-central1-screener-9631e.cloudfunctions.net/screen?target=test"
```

```
curl -X POST -H "Content-Type:application/json" -H "X-MyHeader: 123" "https://us-central1-screener-9631e.cloudfunctions.net/test?test_parameter=hello" -d '{"test_json":"Hello World!"}'
```
