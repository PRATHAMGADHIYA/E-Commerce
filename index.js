const express = require("express");
const dbConnect = require("./config/dbConnect");
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 4000;
const authrouter = require("./routes/authroute");
const bodyParser = require("body-parser");
const { errorHandler, notFound } = require("./middlewares/errorHandler");
const cookieparser = require("cookie-parser");
const productRouter = require("./routes/productroute")
const morgan = require("morgan");

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieparser());


app.use("/api/user", authrouter);
app.use("/api/product", productRouter);

app.use(notFound);
app.use(errorHandler)


app.listen(PORT, () => {
    console.log(`Server is Running at PORT ${PORT}`)
    dbConnect();
})