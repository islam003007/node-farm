const fs = require("fs");
const http = require("http");
const url = require("url");
const replaceHtml = require("./modules/replaceHtml")


const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, "utf-8")
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, "utf-8")
const tempproduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, "utf-8")
 
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataobj = JSON.parse(data);

const server = http.createServer((req, res) => {
    const {query, pathname} = url.parse(req.url, true)
    if (pathname === "/" || pathname === "/overview")
    {
        const cardsHtml = dataobj.map(el => replaceHtml(tempCard, el)).join("")
        const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
        res.writeHead(200, {"content-type": "text/html"});
        res.end(output);
    }
    else if (pathname === "/product")
    {
        const product = dataobj[query.id]
        const output = replaceHtml(tempproduct, product)
        res.writeHead(200, {"content-type": "text/html"});
        res.end(output);
    }
    else
    {
        res.writeHead(404, {"content-type": "text/html"});
        res.end("<h1>error not found </h1>")
    }
});

server.listen(9999, "127.0.0.1");
