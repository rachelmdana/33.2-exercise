const express = require('express');
const ExpressError = require('./expressError');
const app = express();
const itemsRouter = require('./routes/items');
const fakeDb = require('./fakeDb');

app.use(express.json());
app.use('/items', itemsRouter);


app.use(function(req, res, nxt) {
  return new ExpressError('Not Found', 404);
});

app.use((err, req, res, nxt) => {
    res.status(err.status || 500);

    return res.json({
        error: err.message,
    });
});

module.exports = app