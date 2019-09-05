const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

// MIDDLEWARE
app.use(express.json());
app.use(cors());
app.use(morgan("combined"));

// ROUTES
app.get("/", (req, res) => res.send("Hello"));
app.use("/bookkeepers", require("./routes/bookkeeper"));

const PORT = 5000;

// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(`Server started at ${PORT}`));
