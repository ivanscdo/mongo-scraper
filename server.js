var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = process.env.PORT || 3000;

var app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost/hw0609");

app.get("/scrape", function (req, res) {
    axios.get("https://www.wholefoodsmarket.com/sales-flyer/domain")
        .then(function (response) {
            var $ = cheerio.load(response.data);

            $("div.views-row.views-row-odd").each(function (i, element) {

                var result = {};

                if (!$(element).children(".views-field.views-field-field-flyer-product-name").children().text()) {
                    return;
                } else {
                    result.itemName = $(element).children(".views-field.views-field-field-flyer-product-name").children().text();
                }

                if ($(element).children(".views-field.views-field-nothing").children().children().children(".prices-text").children().children(".my_price").text()) {

                    result.salePrice = "Sale " + $(element).children(".views-field.views-field-nothing").children().children().children(".prices-text").children().children(".my_price").text();

                } else {

                    result.salePrice = "Sale " + $(element).children(".views-field.views-field-nothing").children().children().children(".prices-text").children(".sale_line").text();

                }

                result.regPrice = $(element).children(".views-field.views-field-nothing").children().children().children(".prices-text").children(".reg_line").text();

                let validDates = [];

                validDates.push("Valid");

                validDates.push(
                    $(element).find($(".views-field.views-field-field-flyer-end-date")).children().eq(1).text()
                );

                validDates.push("-");

                validDates.push(
                    $(element).find($(".views-field.views-field-field-flyer-end-date")).children().eq(2).text()
                );

                result.validDates = validDates.join(" ");

                db.SalesFlyer.create(result)
                    .then(function (dbSalesFlyer) {
                        console.log(dbSalesFlyer);
                    })
                    .catch(function (err) {
                        return res.json(err);
                    });

                // console.log(result);



            });

            res.send("Scrape Complete");
        });
});

app.get("/sales-flyer", function (req, res) {
    db.SalesFlyer.find({})
        .then(function (dbSalesFlyer) {
            res.json(dbSalesFlyer);
        })
        .catch(function (err) {
            res.json(err);
        });
});


app.get("/sales-flyer/:id", function (req, res) {

    db.SalesFlyer.findOne({
            _id: req.params.id
        })
        .populate("note")
        .then(function (dbSalesFlyer) {
            res.json(dbSalesFlyer);
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.post("/sales-flyer/:id", function (req, res) {
    db.Note.create(req.body)
        .then(function (dbNote) {
            return db.SalesFlyer.findOneAndUpdate({
                _id: req.params.id
            }, {
                note: dbNote._id
            }, {
                new: true
            });
        })
        .then(function (dbSalesFlyer) {
            res.json(dbSalesFlyer);
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.listen(PORT, function () {
    console.log("App running on port http://localhost:3000");
});