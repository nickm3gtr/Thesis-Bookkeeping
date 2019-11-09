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
app.use("/api/charts", require("./routes/charts"));
app.use("/api/bookkeeping", require("./routes/bookkeeping"));
app.use("/api/accounts", require("./routes/accounts"));
app.use("/api/reports", require("./routes/reports"));
app.use("/api/books", require("./routes/books"));
app.use("/api/graphs", require("./routes/graphs"));
app.use("/api/dashboard", require("./routes/dashboard"));
app.use("/api/transactions", require("./routes/transactions"));
app.use("/api/bank", require("./routes/bank"));
app.use("/api/customer", require("./routes/customer"));
app.use("/api/vendor", require("./routes/vendor"));


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
