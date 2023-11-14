const request = require('supertest');
const express = require('express');
const itemsRouter = require('./items');

// Mocking fakeDb for testing
jest.mock('../fakeDb', () => []);

const app = express();
app.use(express.json());
app.use('/items', itemsRouter);

describe('Items API', () => {
  beforeEach(() => {
    // Clear fakeDb before each test
    jest.clearAllMocks();
  });

  it('GET /items should return the list of items', async () => {
    const response = await request(app).get('/items');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('POST /items should add a new item', async () => {
    const newItem = { name: 'TestItem', price: 9.99 };
    const response = await request(app).post('/items').send(newItem);
    expect(response.status).toBe(200);
    expect(response.body.added).toEqual(newItem);
  });

  it('GET /items/:name should return a specific item', async () => {
    const itemName = 'TestItem';
    const newItem = { name: itemName, price: 9.99 };
    await request(app).post('/items').send(newItem);

    const response = await request(app).get(`/items/${itemName}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(newItem);
  });

  it('GET /items/:name should return 404 if item not found', async () => {
    const response = await request(app).get('/items/NonexistentItem');
    expect(response.status).toBe(404);
  });

  it('PATCH /items/:name should update an existing item', async () => {
    const itemName = 'TestItem';
    const newItem = { name: itemName, price: 9.99 };
    await request(app).post('/items').send(newItem);

    const updatedItemData = { name: 'UpdatedItem', price: 14.99 };
    const response = await request(app).patch(`/items/${itemName}`).send(updatedItemData);

    expect(response.status).toBe(200);
    expect(response.body.updated).toEqual({ name: 'UpdatedItem', price: 14.99 });
  });

  it('PATCH /items/:name should return 404 if item not found', async () => {
    const response = await request(app).patch('/items/NonexistentItem').send({ name: 'UpdatedItem' });
    expect(response.status).toBe(404);
  });

  it('DELETE /items/:name should delete an existing item', async () => {
    const itemName = 'TestItem';
    const newItem = { name: itemName, price: 9.99 };
    await request(app).post('/items').send(newItem);

    const response = await request(app).delete(`/items/${itemName}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Deleted' });
  });

  it('DELETE /items/:name should return 404 if item not found', async () => {
    const response = await request(app).delete('/items/NonexistentItem');
    expect(response.status).toBe(404);
  });
});
