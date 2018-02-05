let express = require('express');
let router = express.Router();
let mysql = require('promise-mysql');
let dbconfig   = require('./config/db.js');
let pool = mysql.createPool(dbconfig);

router.get('/', function(req, res, next) {
    let limit = req.query.limit;
    let offset = req.query.offset;
    let sql = `
            select notice_no, title,content , DATE_FORMAT(dttm, "%Y-%m-%d") "dttm" from notice 
            order by notice_no desc
            limit ${limit} offset ${offset}
        `
    pool.query(sql,[limit,offset])
        .then(function(row) {
            res.send(row);
        })
        .catch(function (err) {
            console.log(err)
            res.status(404).send(err);
        })
});
router.post('/', function(req, res, next) {
    let content = req.body.content;
    let title = req.body.title;
    let sql = `
            insert into notice 
            (title, content) 
            values (?,?)
        `
    pool.query(sql,[title,content])
        .then(function(row) {
            res.send(row);
        })
        .catch(function (err) {
            console.log(err)
            res.status(404).send(err);
        })
});
router.put('/', function(req, res, next) {
    let notice_no = req.body.notice_no;
    let content = req.body.content;
    let title = req.body.title;
    let sql = `
            update notice set
            title=?, content=?
            where notice_no=?
        `
    pool.query(sql,[title,content,notice_no])
        .then(function(row) {
            res.send(row);
        })
        .catch(function (err) {
            console.log(err)
            res.status(404).send(err);
        })
});
router.delete('/', function(req, res, next) {
    let notice_no = req.query.notice_no;
    let sql = `
            delete from notice where notice_no = ?
        `
    pool.query(sql,[notice_no])
        .then(function(row) {
            res.send(row);
        })
        .catch(function (err) {
            console.log(err)
            res.status(404).send(err);
        })
});

module.exports = router;
