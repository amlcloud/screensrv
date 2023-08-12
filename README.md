# Sanctions Screener

## **Data structure**

- `/admin` 
  - contains admin user IDs. Based on these records the user can have admin privileges. If document with your UID exists in this collection then you have admin rights to configure indexes and lists.

- `/index`
  - contains indices (indexes) of all sanctions lists in the storage.
  As an example, `'/index/ec_europa_eu__sanctions_list|"Vostok Brigade"'` document holds an index record for sanction list with id `"ec_europa_eu__sanctions_list"` and search name "Vostok Brigade". Meaning, when you are searching for `"Vostok Brigade"` or `"Vastok Brigada"` both should return the document exists in `"list/ec_europa_eu__sanctions_list"` and is referenced by this index record (via ref field).

- `/indexStatus`
  - contains status of list index
    If the list was never indexed there will be no document in the collection with the list ID.
    When indexing starts it will reset the count to 0:
      count: 0
      total: 1000
      listId: "government_nl__dnslt"

    If the indexing is in progress the 'count' will be different to 'total':
      count: 333
      total: 1000
      listId: "government_nl__dnslt"

    If the indexing is finished the count will equal total:
      count: 1000
      total: 1000
      listId: "government_nl__dnslt"

    Status field can have 3 different values:
      "Not indexed"  (set initially)
      "Indexing..."  (set by UI)
      "Indexed"  (set by function)
      "Indexing failed" (set by function)
    The moment user starts indexing the status will change to "Indexing..." (even before server function is called). 

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


- **ScreenNames**
  - returns screening results for multiple names based on the fuzzy search matching on the entire index (all sanctions lists) with the given precision. If precision is 1 it will return only exactly matching records for each name in the list.
  
  - input: name: string, precision (0.9-1)

```bash
curl -X POST -H "Content-Type:application/json" -d '{"names":["name1", "name2", "name3"], "precision":0.9}' "https://us-central1-screener-9631e.cloudfunctions.net/ScreenNames"
```

or in browser: https://us-central1-screener-9631e.cloudfunctions.net/ScreenNames

- **FindName**
  - returns exact search matches across all lists for the name provided.  
  - input:  name: string

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


## **Security Rules** ##
firebase deploy --only firestore:rules

## **Emulator Installation** ##

Prerequisites
-------------------------------------------------------------------------------------------------
Must have node.js installed (preferrably version 16 or higher)
   - ensure that PATH is enabled on the install configuration(to be able to run  on any cmd based terminal)
   - ensure NPM is working and installed correctly

Java JDK version 11 or higher.
use cmd terminal 
-------------------------------------------------------------------------------------------------
install guide
-------------------------------------------------------------------------------------------------
1.) Enter into terminal and copy paste command 
   - npm install -g firebase-tools
   - (this will install firebase tools to allow you to use firebase commands from anywhere)

2.) Set up the firebase emulator suite by using command 
   - firebase init emulators

   - This starts a configuration wizard allowing you to select required emulators
   - Make sure to select The functions emulators **only** for installation if not installed

3.) Start Emulator using 'firebase emulators:start --only functions' in project path
   - this will start the all emulators installed
   - while running, a table will appear in console which details the emulators that are running with their respective host:port and emulator ui view
       - find  the "http://127.0.0.1:4000/functions" url and ctrl+click  or copy-paste into browser (port will vary depending on machine)
       - you should be able to view the logs of function calls
       

4.) Test Firebase emulator
   - To test a firebase function format the function call as a URL
   - format it like this http://localhost:{function_port}/{project-id}/{region}/{Function (required search parameters)}
   - ensure to input the required ports , project id, region and desired function in the url
   - Once done, copy-paste the modified url into the browser and monitor its activity through the firebase emulator ui ( it should be logged in the terminal) 
   - if no data is received or displayed, enter int terminal ctrl-c to clear the emulator cache
   - restart emulator to try again  

	