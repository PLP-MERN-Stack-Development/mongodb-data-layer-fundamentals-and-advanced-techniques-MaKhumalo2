// aggregation_queries.js
const { MongoClient } = require("mongodb");

// mongodb+srv://MERNSTACK:<db_@Sihlewandile22>@cluster0.yfuq9lg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
const uri = "mongodb://127.0.0.1:27017"; // local MongoDB
// const uri = "mongodb+srv://MERNSTACK:<db_@Sihlewandile22>@cluster0.yfuq9lg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // for Atlas

const client = new MongoClient(uri);

async function runAggregationPipelines() {
  try {
    await client.connect();
    const db = client.db("myDatabase"); // replace with your DB name
    const booksCollection = db.collection("books");

    // 1. Average price of books by genre
    const avgPriceByGenre = await booksCollection.aggregate([
      {
        $group: {
          _id: "$genre",
          averagePrice: { $avg: "$price" }
        }
      },
      { $sort: { averagePrice: -1 } } // optional: sort by price descending
    ]).toArray();
    console.log("Average price by genre:", avgPriceByGenre);

    // 2. Author with the most books
    const authorWithMostBooks = await booksCollection.aggregate([
      {
        $group: {
          _id: "$author",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 1 } // top author
    ]).toArray();
    console.log("Author with the most books:", authorWithMostBooks);

    // 3. Group books by publication decade and count them
    const booksByDecade = await booksCollection.aggregate([
      {
        $project: {
          title: 1,
          decade: { $multiply: [ { $floor: { $divide: ["$year", 10] } }, 10 ] }
        }
      },
      {
        $group: {
          _id: "$decade",
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } } // sort by decade
    ]).toArray();
    console.log("Books grouped by decade:", booksByDecade);

  } catch (err) {
    console.error("Error running aggregation pipelines:", err);
  } finally {
    await client.close();
  }
}

runAggregationPipelines();
