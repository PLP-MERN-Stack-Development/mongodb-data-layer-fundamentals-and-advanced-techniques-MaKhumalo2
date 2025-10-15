// indexing_queries.js
const { MongoClient } = require("mongodb");

//mongodb+srv://MERNSTACK:@Sihlewandile22@cluster0.yfuq9lg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
const uri = "mongodb://127.0.0.1:27017"; // for local MongoDB
// const uri = "mongodb+srv://MERNSTACK:@Sihlewandile22@cluster0.yfuq9lg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // for Atlas

const client = new MongoClient(uri);

async function runIndexingTasks() {
  try {
    await client.connect();
    const db = client.db("plp_books"); //
    const booksCollection = db.co

    // Create a single-field index on 'title'
    await booksCollection.createIndex({ title: 1 });
    console.log("Created index on 'title' field");

    //  Create a compound index on 'author' and 'year'
    await booksCollection.createIndex({ author: 1, year: 1 });
    console.log("Created compound index on 'author' and 'year'");

    // Use explain() to compare performance before and after indexing

    console.log("\n--- Query without using index ---");
    const noIndexExplain = await booksCollection.find({ title: "Harry Potter" })
      .explain("executionStats");
    console.log("Documents examined (without index):", noIndexExplain.executionStats.totalDocsExamined);

    console.log("\n--- Query using index ---");
    const indexExplain = await booksCollection.find({ title: "Harry Potter" })
      .hint({ title: 1 }) // force MongoDB to use the index
      .explain("executionStats");
    console.log("Documents examined (with index):", indexExplain.executionStats.totalDocsExamined);

    // Show all current indexes
    const indexes = await booksCollection.indexes();
    console.log("\nCurrent indexes on 'books' collection:");
    console.table(indexes.map(i => ({ name: i.name, key: i.key })));

  } catch (err) {
    console.error("Error running indexing tasks:", err);
  } finally {
    await client.close();
  }
}

runIndexingTasks();
// node indexing_queries.js