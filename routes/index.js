let express = require('express');
let router = express.Router();
let mysql = require('promise-mysql');
let dbconfig   = require('./config/db.js');
let pool = mysql.createPool(dbconfig);

router.get('/introduce', function(req, res, next) {
    let sql = `
            SELECT document from document where document_no=1
        `
    pool.query(sql,[])
        .then(function(row) {
            res.send(row[0]);
        })
        .catch(function (err) {
            console.log(err)
            res.status(404).send(err);
        })
});

module.exports = router;
