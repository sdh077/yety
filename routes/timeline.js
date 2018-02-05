let express = require('express');
let router = express.Router();
let mysql = require('promise-mysql');
let dbconfig   = require('./config/db.js');
let pool = mysql.createPool(dbconfig);

router.get('/', function(req, res, next) {
    let limit = req.query.limit;
    let offset = req.query.offset;
    let promiseArr=[];
    let returnDate = {
        timeline:null
    }
    let sql = `
            select timeline_no,content , DATE_FORMAT(dttm, "%Y.%m.%d") "dttm" from timeline 
            order by timeline_no desc
            limit ${limit} offset ${offset}
        `;
    let sql2 = `
            select * from img where timeline_no=? 
        `;
    pool.query(sql,[limit,offset])
        .then(function(row) {
            returnDate.timeline = row;
            for(i=0;i<row.length;i++){
                promiseArr.push(pool.query(sql2,[row[i].timeline_no]))
                if(i>=row.length-1) {
                    return Promise.all(promiseArr);
                }
            }

        })
        .then(function(row) {
            for(i=0;i<returnDate.timeline.length;i++){
                returnDate.timeline[i].img = row[i];
            }
            res.send(returnDate.timeline);
        })
        .catch(function (err) {
            console.log(err)
            res.status(404).send(err);
        })
});

module.exports = router;
