// const mongoose = require('mongoose');
// const initdata = require('./data');
// const Listing = require('../models/listing');

// const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

// main()
//   .then(() => {
//     console.log('Database connection established');
//     return initDB(); // 🔹 This is what was missing
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// async function main() {
//   await mongoose.connect(MONGO_URL);
// }

// const initDB = async () => {
//   await Listing.deleteMany({});
//   initData.data=initData.data.map({obj})=({...obj,owner:"68a80e90cedabcc8481465c4"});
//   await Listing.insertMany(initdata.data);
//   console.log("Database initialized with sample data");
// };

const mongoose = require('mongoose');
const initdata = require('./data');   // keep lowercase
const Listing = require('../models/listing');

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

main()
  .then(() => {
    console.log('Database connection established');
    return initDB();
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  
  // Fix: correct map syntax
  initdata.data = initdata.data.map((obj) => {
    return { ...obj, owner: "68a80e90cedabcc8481465c4" };
  });

  await Listing.insertMany(initdata.data);
  console.log("Database initialized with sample data");
};

