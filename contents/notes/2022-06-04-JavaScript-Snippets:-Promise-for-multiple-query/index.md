---
slug: '/notes/JavaScript-Snippets:-Promise-for-multiple-query'
date: '2022-06-04'
title: 'JavaScript Snippets: Promise for multiple query'
tags: ['JavaScript', "Backend", "MongoDB"]
abstract: 'In my one of the backend project, I need to query multiple tables and gather the result after all the searchs are done. Thus, normal promise will not work.'
---

In my GCGR project, in the backend I need to do string match for user input. For example when user type `L12`, I need to search cell line table to find all cell lines (which there are 4 tables) for cell line names. And also, I need to search expression and CNA tables for gene name. In this case, I have 6 searchs. I need to find a way to write promise when all of them done.

## 1. Create multiple query

In below code, I showed two ways to create query list. One if from `map`:
```javascript
    var celllineTableNames = [
      "primary_gsc_line",
      "primary_gsc_line_engineered",
      "ns_cell_lines_unmodified",
      "ns_cell_lines_derivatives",
    ];
    var celllineSearch = celllineTableNames.map((clt) => {
      let tmpTable = mongoose.models[clt] || mongoose.model(clt, tableSchema);
      return tmpTable.find(
        { ID: { $regex: searchContent, $options: "i" } },
        { _id: 0 }
      );
    });
```
In above code, I know the 4 table's name in MongoDB. In the map action, it will automatically create model for each table, then create a promise with `.find()` function. After above code, a "query list" with 4 promise can be created.

## 2. Append multiple query

After above code, I still have tow more queries to add. However, these two table have different structure as previous ones. Thus, I have to add them into previous query list. Like below, just `.push()` function works.

```javascript
    var valueTableNames = ["tpm", "cna"];
    valueTableNames.forEach((vt) => {
      let tmpTable = mongoose.models[vt] || mongoose.model(vt, tableSchema);
      celllineSearch.push(
        tmpTable.find(
          { GeneSymbol: { $regex: searchContent, $options: "i" } },
          { _id: 0, GeneSymbol: 1 }
        )
      );
    });
```

## 3. Collect all queries

After sending queries and created query list. `Promise.all(celllineSearch)` is key step to collect them all back **after they are all done**. After that, `.then` and `.catch` can be used as their usual ways.

```javascript
    Promise.all(celllineSearch)
      .then((results) => {
          ...
```


## 4. Other (regex)

Another feature in below code is string match, which looks like below. It should be very commonly used function for searching in web development.

```javascript
tmpTable.find(
        { ID: { $regex: searchContent, $options: "i" } },
        { _id: 0 }
      );
```

## 5. Full Snippets

Below is the full code for this get request.

```javascript
router.get(
  "/fetchSearchOptions/:searchContent",
  // requireAuth.requirePriorAuth,

  (req, res) => {
    var searchContent = req.params.searchContent;

    var tableSchema = new mongoose.Schema({}, { strict: false });

    var celllineTableNames = [
      "primary_gsc_line",
      "primary_gsc_line_engineered",
      "ns_cell_lines_unmodified",
      "ns_cell_lines_derivatives",
    ];
    var celllineSearch = celllineTableNames.map((clt) => {
      let tmpTable = mongoose.models[clt] || mongoose.model(clt, tableSchema);
      return tmpTable.find(
        { ID: { $regex: searchContent, $options: "i" } },
        { _id: 0 }
      );
    });

    var valueTableNames = ["tpm", "cna"];
    valueTableNames.forEach((vt) => {
      let tmpTable = mongoose.models[vt] || mongoose.model(vt, tableSchema);
      celllineSearch.push(
        tmpTable.find(
          { GeneSymbol: { $regex: searchContent, $options: "i" } },
          { _id: 0, GeneSymbol: 1 }
        )
      );
    });

    Promise.all(celllineSearch)
      .then((results) => {
        let celllineResult = celllineTableNames.map((ctn, index) => {
          return {
            searchType: "cell line",
            type: ctn,
            options: results[index],
          };
        });

        let geneResult = ["Expression", "Copy Number Aberation"].map(
          (vtn, index) => {
            return {
              searchType: "value",
              type: vtn,
              options: results[index + 4],
            };
          }
        );

        var output = {
          result: "success",
          message: "Global search on " + searchContent + " success.",
          globalSearch: {
            celllineResult: celllineResult,
            geneResult: geneResult,
          },
        };
        res.status(200).send(output);
      })
      .catch((err) => {
        var output = {
          result: "error",
          message: "Global search on " + searchContent + " failed.",
          clinfo: null,
        };
        res.status(400).send(output);
      });
  }
);
```