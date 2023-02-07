# Sanctions Screener

## **Data structure**

- `/admin`

  - contains admin user IDs. Based on these records the user can have admin privileges. If document with your UID exists in this collection then you have admin rights to configure indexes and lists.

- `/index`

  - contains indices (indexes) of all sanctions lists in the storage.
    As an example, `'/index/ec_europa_eu__sanctions_list|"Vostok Brigade"'` document holds an index record for sanction list with id `"ec_europa_eu__sanctions_list"` and search name "Vostok Brigade". Meaning, when you are searching for `"Vostok Brigade"` or `"Vastok Brigada"` both should return the document exists in `"list/ec_europa_eu__sanctions_list"` and is referenced by this index record (via ref field).

- `/list`

  - contains all sanction lists. Each document in this collection records the last updated and changed times of this list and general information about the list (like `source URL`, `etc`)

- `/list/{listId}/item/{itemId}`

  - contains individual sanction list records as they are present in the original sanction document.

- `/list/{listId}/indexConfig`

  - contains indices configuration that are used to build this list's indices. Each list can have multiple indices configured separately.

- `/user`

  - contains each user's private information that is not accessable by other users. It also contains user preferences.

- `/user/{uid}/search`

  - contains your search history

- `/user/{uid}/search/{searchId}/result`
  - contains an individual search results, i.e. items that were found when the search was executed.

## **API**

This is the `API` we expose to the clients (customers) that they can use via request `(HTTPS)` calls.

- **GetSanctionsLists**
  - returns the list of `JSON` objects containing meta info about all sanction lists available on the system.

```bash
curl -X POST -H "Content-Type:application/json" "https://us-central1-screener-9631e.cloudfunctions.net/GetSanctionsLists"
```

or in browser: https://us-central1-screener-9631e.cloudfunctions.net/GetSanctionsLists

- **GetSanctionsListEntities**

  - returns the list of items (in `JSON`) of the sanction list in alphabetical order by the name of the entity (different for each list, please refer to screener UI).

  - input: list: name of specific list

```bash
curl -X POST -H "Content-Type:application/json" "https://us-central1-screener-9631e.cloudfunctions.net/GetSanctionsListEntities?list=dfat.gov.au"
```

or in browser: https://us-central1-screener-9631e.cloudfunctions.net/GetSanctionsListEntities?list=dfat.gov.au

- **GetSanctionsListItemEntity**

  - returns all data of specific item (in `JSON`) of the specific sanction list

  - input: list: name of specific list , item: name of specific item in this list

```bash
curl -X POST -H "Content-Type:application/json" "https://us-central1-screener-9631e.cloudfunctions.net/GetSanctionsListItemEntities?list=dfat.gov.au&item=01ubEnwq38cuhIWvvd0E"
```

or in browser: https://us-central1-screener-9631e.cloudfunctions.net/GetSanctionsListItemEntities?list=dfat.gov.au&item=01ubEnwq38cuhIWvvd0E

- **ScreenName**

  - returns screening results based on the fuzzy search matching on the entire index (all sanctions lists) with the given precision. If precision is 1 it will return only exactly matching records.

  - input: name: string, precision (0.9-1)

```bash
curl -X POST -H "Content-Type:application/json" "https://us-central1-screener-9631e.cloudfunctions.net/ScreenName?name=AnyName"
```

or in browser: https://us-central1-screener-9631e.cloudfunctions.net/ScreenName?name=AnyName

- **FindName**
  - returns exact search matches across all lists for the name provided.
  - input: name: string

```bash
curl -X POST -H "Content-Type:application/json" "https://us-central1-screener-9631e.cloudfunctions.net/FindName?name=AnyName"
```

or in browser: https://us-central1-screener-9631e.cloudfunctions.net/FindName?name=AnyName

<!-- - **ScreenPerson (TBD)**
  - returns screening results based on the fuzzy search matching on the entire index (all sanctions lists) with the given precision. If precision is 1 it will return only exactly matching records.

  - input: search target string, precision (0.9-1)
  - optional: `DOB`, `nationality` -->

## **Deployment**

```bash
run firebase deploy --only functions
```

## **Test in the cloud:**

```bash
gcloud pubsub topics publish  --message 'MyMessage'
```

```bash
curl -X POST -H "Content-Type:application/json" -H "X-MyHeader: 123" "https://us-central1-screener-9631e.cloudfunctions.net/index_list2?list=ec_europa_eu__sanctions_list" -d '[{"field":"nameAlias", "type":"array","subField":"wholeName"}]'
```

```bash
curl -X POST -H "Content-Type:application/json" -H "X-MyHeader: 123" "https://us-central1-screener-9631e.cloudfunctions.net/screen?target=test"
```

```bash
curl -X POST -H "Content-Type:application/json" -H "X-MyHeader: 123" "https://us-central1-screener-9631e.cloudfunctions.net/test?test_parameter=hello" -d '{"test_json":"Hello World!"}'
```
