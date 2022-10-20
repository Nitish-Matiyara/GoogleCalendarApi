const express = require("express");
const bodyParser = require("body-parser")
const eventsApiRoute = require("./routes/eventsApiRoute");
const port = 3003 || process.env.PORT
const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use("/event", eventsApiRoute);

app.listen(port, () => console.log(`App listening on port ${port}`));
