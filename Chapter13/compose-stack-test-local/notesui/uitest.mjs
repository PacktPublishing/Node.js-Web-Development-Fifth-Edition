
import util from 'util';
import Chai from 'chai';
const assert = Chai.assert;
import supertest from 'supertest';
const request = supertest(process.env.URL_USERS_TEST);
const authUser = 'them';
const authKey  = 'D4ED43C0-8BD6-4FE2-B358-7C0E230D11EF';
import { default as bcrypt } from 'bcrypt';
const saltRounds = 10;
import { v4 as uuidv4 } from 'uuid';
import puppeteer from 'puppeteer';

async function hashpass(password) {
    let salt = await bcrypt.genSalt(saltRounds);
    let hashed = await bcrypt.hash(password, salt);
    return hashed;
}

describe('Initialize test user', function() {
    it('should successfully add test user', async function() {
        await request
            .post('/create-user')
            .send({ 
                username: "testme", password: await hashpass("w0rd"),
                provider: "local",
                familyName: "Einarrsdottir", givenName: "Ashildr",
                middleName: "TEST",
                emails: [ "me@stolen.test.tardis" ], photos: []
            })
            .set('Content-Type', 'application/json')
            .set('Acccept', 'application/json')
            .auth(authUser, authKey);
    });
    it('should successfully verify test user exists', async function() {
        const res = await request
            .get('/find/testme')
            .set('Content-Type', 'application/json')
            .set('Acccept', 'application/json')
            .auth(authUser, authKey);
        
        assert.exists(res.body);
        assert.isObject(res.body);
        assert.deepEqual(res.body, { 
            username: "testme", id: "testme", provider: "local",
            familyName: "Einarrsdottir", givenName: "Ashildr", 
            middleName: "TEST",
            emails: [ "me@stolen.test.tardis" ], photos: []
        });
    });
});

describe('Notes', function() {
    this.timeout(100000);
    let browser;
    let page;

    async function doLogin() {
        await page.click('a.nav-item[href="/users/login"]');
        await page.waitForSelector('form[action="/users/login"]');
        await page.type('[name=username]', "testme", {delay: 150});
        await page.type('[name=password]', "w0rd",   {delay: 150});
        await page.keyboard.press('Enter');
        await page.waitForNavigation({
            'waitUntil': 'domcontentloaded'
        });
    }
    
    async function checkLogin() {
        const btnLogout = await page.$('a[href="/users/logout"]');
        assert.isNotNull(btnLogout);
    }
    
    before(async function() {
        browser = await puppeteer.launch({ 
            sloMo: 500,
            headless: false
        });
        page = await browser.newPage();
    });

    it('should visit home page', async function() {
        await page.goto(process.env.NOTES_HOME_URL);
        await page.waitForSelector('a.nav-item[href="/users/login"]');
    });

    describe('log in and log out correctly', function() {
        this.timeout(100000);
        
        it('should log in correctly', doLogin);

        it('should be logged in', checkLogin);

        it('should log out correctly', async function() {
            await page.click('a[href="/users/logout"]');
        });

        it('should be logged out', async function() {
            await page.waitForSelector('a.nav-item[href="/users/login"]');
        });
    });

    describe('allow creating notes', function() {
        this.timeout(100000);

        it('should log in correctly', doLogin);

        it('should be logged in', checkLogin);

        it('should go to Add Note form', async function() {
            await page.click('a[href="/notes/add"]');
            await page.waitForSelector('form[action="/notes/save"]');
            await page.type('[name=notekey]', "testkey", {delay: 200});
            await page.type('[name=title]', "Test Note Subject", {delay: 150});
            await page.type('[name=body]', 
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                { delay: 100 });
            await page.click('button[type="submit"]');
        });

        it('should view newly created Note', async function() {
            await page.waitForSelector('h3#notetitle');
            assert.include(
                await page.$eval('h3#notetitle', el => el.textContent),
                "Test Note Subject"
            );
            assert.include(
                await page.$eval('#notebody', el => el.textContent),
                "Lorem ipsum dolor"
            );
            assert.include(page.url(), '/notes/view');
        });

        it('should delete newly created Note', async function() {
            assert.isNotNull(await page.$('a#notedestroy'));
            await page.click('a#notedestroy');
            await page.waitForSelector('form[action="/notes/destroy/confirm"]');
            await page.click('button[type="submit"]');
            await page.waitForSelector('#notetitles');
            assert.isNotNull(await page.$('a[href="/users/logout"]'));
            assert.isNotNull(await page.$('a[href="/notes/add"]'));
        });

        it('should log out', async function() {
            await page.click('a[href="/users/logout"]');
            await page.waitForSelector('a[href="/users/login"]');
        });
    });
        
    describe('reject unknown user', function() {
        this.timeout(100000);

        it('should fail to log in unknown user correctly', async function() {
            assert.isNotNull(await page.$('a[href="/users/login"]'));
            await page.click('a.nav-item[href="/users/login"]');
            await page.waitForSelector('form[action="/users/login"]');
            await page.type('[name=username]', uuidv4(), {delay: 150});
            await page.type('[name=password]',
                                await hashpass(uuidv4()), {delay: 150});
            await page.keyboard.press('Enter');
            await page.waitForSelector('form[action="/users/login"]');
            assert.isNotNull(await page.$('a[href="/users/login"]'));
            assert.isNotNull(await page.$('form[action="/users/login"]'));
        });
    });

    describe('reject unknown URL', function() {
        this.timeout(100000);

        it('should fail on unknown URL correctly', async function() {
            let u = new URL(process.env.NOTES_HOME_URL);
            u.pathname = '/bad-unknown-url';
            let response = await page.goto(u.toString());
            await page.waitForSelector('header.page-header');
            assert.equal(response.status(), 404);
            assert.include(
                await page.$eval('h1', el => el.textContent),
                "Not Found"
            );
            assert.include(
                await page.$eval('h2', el => el.textContent),
                "404"
            );
        });
    });

    // Other test scenarios go here.

    after(async function() {
        await page.close();
        await browser.close();
    });
});


describe('Destroy test user', function() {
    it('should successfully destroy test user', async function() {
        await request
            .delete('/destroy/testme')
            .set('Content-Type', 'application/json')
            .set('Acccept', 'application/json')
            .auth(authUser, authKey);
    });
    it('should successfully verify test user gone', async function() {
        var res;
        try {
            res = await request
                .get('/find/testme')
                .set('Content-Type', 'application/json')
                .set('Acccept', 'application/json')
                .auth(authUser, authKey);
        } catch(e) {
            return;  // Test is okay in this case
        }
    });
});
