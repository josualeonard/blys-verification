const supertest = require('supertest');
const app = require('../server');
const request = supertest(app);


describe("Testing the verification API", () => {
    it("tests verification code less than 6 digits", async (done) => {
        const response = await request.post('/api/v1.0/verify').send({
            code: '12345'
        });

        const res = response.body.body;
        expect(response.status).toBe(200);
        expect(res.status).toBe('failed');
        expect(res.message).toBe('Verification error');

        done();
    });

    it("tests verification code 6 digits ending with 7", async (done) => {
        const response = await request.post('/api/v1.0/verify').send({
            code: '666667'
        });

        const res = response.body.body;
        expect(response.status).toBe(200);
        expect(res.status).toBe('failed');
        expect(res.message).toBe('Verification error');

        done();
    });

    it("tests verification code 6 digits ending with 0", async (done) => {
        const response = await request.post('/api/v1.0/verify').send({
            code: '777770'
        });

        const res = response.body.body;
        expect(response.status).toBe(200);
        expect(res.status).toBe('success');
        expect(res.message).toBe('Verification success');

        done();
    });
});

afterAll(function(done) {
    done();
});