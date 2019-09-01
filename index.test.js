const supertest = require ('supertest');
const { app } 	= require ('./index');

//we are reuiring cookie session mock, not a real one
const cookieSession = require('cookie-session');

test('GET /home returns 200 status code', () => {
    return supertest(app).get('/petitions')
        .then( res => {
            expect(res.statusCode).toBe(200);
        });
});


test('GET /welcome causes redirect', () => {
    return supertest(app).get('/test')
        .then(res => {
            expect(res.statusCode).toBe(302);
            expect(res.headers.location).toBe('/testresult');
        });
});

test('GET /test when fakeCookieForDemo cookie is sent, receive p tag as response', () => {

    //so here we sent a cookie called 'fakeCookieForDemo' as part of teh request
    cookieSession.mockSessionOnce({
        fakeCookieForDemo: true
    });
    return supertest(app).get('/test')
        .then(res => {
            console.log('res: ', res);
            expect(res.statusCode).toBe(200);
            expect(res.text).toBe('<p> wow you have a cookie </p>');
        });

});

test('POST /test SETS "wentToWelcome" cookie', () => {
    //step 1 and step 2 in pictures;
    const cookie = {};
    cookieSession.mockSessionOnce(cookie);
    return supertest(app).post('/test').then( res => {
        console.log('res: ', res);
        console.log('cookie: ', cookie);
        expect(res.statusCode).toBe(302);
        expect(res.headers.location).toBe('/testresults');
        expect(cookie).toEqual({
            wentToWelcome: 'hell yea'
        });
    });

});
