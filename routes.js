const { Router, json, urlencoded } = require("express");
const router = Router();
const { Client, HttpConnection } = require("@elastic/elasticsearch");

const client = new Client({
  node: "https://localhost:9200",
  // headers: {
  //   "Content-Type": "application/json",
  // },
  // Connection: HttpConnection,
});

router.use(async (req, res, next) => {
  client
    .index({
      index: "logs",
      body: {
        url: req.url,
        method: req.method,
      },
    })
    .then(() => {
      console.log("Logs added");
    })
    .catch(console.log);

  next();
});
router.use(json());
router.use(urlencoded({ extended: false }));

router.post("/products", async (req, res) => {
  try {
    const resp = await client.index({
      index: "products",
      body: req.body,
    });
    return res.status(200).json({
      msg: "product indexed",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Error",
      error,
    });
  }
});

router.get("/products/:id", async (req, res) => {
  const query = {
    index: "products",
    id: req.params.id,
  };
  try {
    const resp = await client.get(query);
    if (!resp) {
      return res.status(404).json({
        product: resp,
      });
    }
    return res.status(200).json({
      product: resp,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Error",
      error,
    });
  }
});

router.put("/products/:id", async (req, res) => {
  try {
    await client.update({
      index: "products",
      id: req.params.id,
      body: {
        doc: req.body,
      },
    });
    return res.status(200).json({
      msg: "product updated",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Error",
      error,
    });
  }
});

router.delete("/products/:id", async (req, res) => {
  try {
    await client.delete({
      index: "products",
      id: req.params.id,
    });
    return res.status(200).json({
      msg: "product deleted",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Error",
      error,
    });
  }
});

router.get("/products", async (req, res) => {
  const query = {
    index: "products",
  };
  if (req.query.product) {
    query.q = `*${req.query.product}*`;
  }
  try {
    const resp = await client.search(query);
    return res.status(200).json({
      products: resp.hits.hits,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error",
      error,
    });
  }
});

const products = require("./products");
async function run() {
  try {
    for (const product of products) {
      await client.index({
        index: "products",
        body: product,
      });
    }
    console.log("Done");
  } catch (error) {
    console.log(error);
  }
}
run();

module.exports = router;
