const request = require('supertest');
const app = require('../../app');
const { mongoConnect,
        mongoDisconnect, } = require('../../services/mongo');

describe('Launches API', () => {

    beforeAll(async () => {
        await mongoConnect();
    });

    afterAll(async() => {
        await mongoDisconnect();
    })

    describe('Test GET /launches', () => {
        test('Should respond with 200 success', async () => {
            const response = await request(app)
                .get('/v1/launches')
                .expect('Content-Type', /json/)
                .expect(200);
        });
    });
    
    describe('Test POST /launches', () => {
        const completeLaunchData = {
            mission: 'Falcon',
            rocket: 'NCC 1701-D',
            target: 'Kepler-62 f',
            launchDate: 'January 4, 2028',
        };
    
        const launchDataWithoutDate = {
            mission: 'Falcon',
            rocket: 'NCC 1701-D',
            target: 'Kepler-62 f',
        };
    
        const launchDataInvalidDate = {
            mission: 'Falcon',
            rocket: 'NCC 1701-D',
            target: 'Kepler-62 f',
            launchDate: 'zoot',
        }
    
        test('Should respond with 201 created', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(completeLaunchData)
                .expect('Content-Type', /json/)
                .expect(201);
    
            const requestDate = new Date(completeLaunchData.launchDate).valueOf()
            const responseDate = new Date(response.body.launchDate).valueOf()
            expect(responseDate === requestDate);
        });
    
    
        test('Should catch missing required properties', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(launchDataWithoutDate)
                .expect('Content-Type', /json/)
                .expect(400);
    
            expect(response.body).toStrictEqual({
                error: "Missing required launch property"
            })
        });
    
        test('Should catch invalid dates', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(launchDataInvalidDate)
                .expect('Content-Type', /json/)
                .expect(400);
    
            expect(response.body).toStrictEqual({
                error: "Invalid launch date"
            })
        });
        
    })
})

