const express = require('express');
const fakeDb = require('../fakeDb');

const itemsRouter = express.Router();

// GET /items
itemsRouter.get('/', (req, res) => {
  res.json(fakeDb);
});

// POST /items
itemsRouter.post('/', (req, res) => {
  const newItem = req.body;
  fakeDb.push(newItem);
  res.json({ added: newItem });
});

// GET /items/:name
itemsRouter.get('/:name', (req, res) => {
  const itemName = req.params.name;
  const foundItem = fakeDb.find(item => item.name === itemName);

  if (foundItem) {
    res.json(foundItem);
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
});

// PATCH /items/:name
itemsRouter.patch('/:name', (req, res) => {
  const itemName = req.params.name;
  const updatedItemData = req.body;

  fakeDb.forEach(item => {
    if (item.name === itemName) {
      Object.assign(item, updatedItemData);
      res.json({ updated: item });
    }
  });

  res.status(404).json({ message: 'Item not found' });
});

// DELETE /items/:name
itemsRouter.delete('/:name', (req, res) => {
  const itemName = req.params.name;

  const index = fakeDb.findIndex(item => item.name === itemName);

  if (index !== -1) {
    fakeDb.splice(index, 1);
    res.json({ message: 'Deleted' });
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
});

module.exports = itemsRouter;
