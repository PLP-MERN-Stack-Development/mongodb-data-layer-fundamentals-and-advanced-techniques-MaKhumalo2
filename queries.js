// advanced_queries.js
const { MongoClient } = require("mongodb");

// mongodb+srv://MERNSTACK:<db_@Sihlewandile22>@cluster0.yfuq9lg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
const uri = "mongodb+srv://MERNSTACK:<db_@Sihlewandile22>@cluster0.yfuq9lg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

async function runAdvancedQueries() {
  try {
    await client.connect();
    const db = client.db("plp_books");
    const booksCollection = db.collection("books");

    // 1. Find books that are in stock and published after 2010
    const inStockRecentBooks = await booksCollection.find({
      inStock: true,
      year: { $gt: 2010 }  
    }).toArray();
    console.log("Books in stock and published after 2010:", inStockRecentBooks);

    // 2. Projection: title, author, and price fields only
    const projectedBooks = await booksCollection.find(
      { inStock: true }, // example filter
      { projection: { title: 1, author: 1, price: 1, _id: 0 } }
    ).toArray();
    console.log("Books with projection:", projectedBooks);

    // 3. Sorting by price
    const sortedAsc = await booksCollection.find()
      .sort({ price: 1 })
      .toArray();
    console.log("Books sorted by price ascending:", sortedAsc);

    const sortedDesc = await booksCollection.find()
      .sort({ price: -1 })
      .toArray();
    console.log("Books sorted by price descending:", sortedDesc);

    // 4. Pagination: 5 books per page
    const page = 1; // change page number as needed
    const pageSize = 5;

    const paginatedBooks = await booksCollection.find()
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray();
    console.log(`Books on page ${page}:`, paginatedBooks);

    // Optional: Combine filter, projection, sort, and pagination
    const combinedQuery = await booksCollection.find({
      inStock: true,
      year: { $gt: 2010 }
    })
      .project({ title: 1, author: "Harper and Brothers", price: 1, _id: 0 })
      .sort({ price: 1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray();
    console.log(`Combined query results (page ${page}):`, combinedQuery);

  } catch (err) {
    console.error("Error running advanced queries:", err);
  } finally {
    await client.close();
  }
}

runAdvancedQueries(); 
