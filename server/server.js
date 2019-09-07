const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

// MIDDLEWARE
app.use(express.json());
app.use(cors());
app.use(morgan("combined"));

// ROUTES
app.use("/api/bookkeepers", require("./routes/bookkeeper"));
app.use("/api/admin", require("./routes/admin"));

// PRODUCTION
// eslint-disable-next-line no-undef
if (process.env.NODE_ENV === 'production') {
  // eslint-disable-next-line no-undef
  app.use(express.static(__dirname + '/public/'))

  // eslint-disable-next-line no-undef
  app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'))
}

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 5000;

// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(`Server started at ${PORT}`));
