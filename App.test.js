const request = require('supertest');
const app = require('./app1'); 

describe('Dog API tests', () => {

    jest.setTimeout(100000000);
    // Test retrieving all dog
    test('GET /dog should return all dogs', async () => {
        const response = await request(app).get('/dog');
        //console.log(response);
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });

    // Test adding a new dog
    test('POST /dog should add a new dog', async () => {
        const newDog = { 
            name: "Labus",
            Age: 7
        };
        const response = await request(app)
            .post('/dog')
            .send(newDog);
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toEqual("dog added succesfully");
    });

    // Test updating an existing fish
    test('PUT /dog/:dogName should update a dog', async () => {
        const updatedDogDetails = {
            Name: "Bruno",
            Age: "10"
        };
        const response = await request(app)
            .put('/dog/Bruno') 
            .send(updatedDogDetails);
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toEqual("Dog Bruno} updated");
    });

    // Test deleting an existing dog
    test('DELETE /dog/:dogName should delete a dog', async () => {
        const response = await request(app).delete('/dog/Bruno');
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toEqual("Deleted dog Bruno");
    });

    
});