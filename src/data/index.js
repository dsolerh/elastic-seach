const elastic = require("../elastic");
const quotes = require(`./quotes.json`);

/**
 * @function pupulateDatabase
 * @returns {void}
 */
async function populateDatabase() {
  const operations = quotes.flatMap((doc) => [
    { index: { _index: elastic.index } },
    doc,
  ]);

  return elastic.esclient.bulk({ operations });
}

module.exports = {
  populateDatabase,
};
