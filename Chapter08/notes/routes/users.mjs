import path from 'path';
import util from 'util';
import { default as express } from 'express';
import { default as passport } from 'passport'; 
import { default as passportLocal } from 'passport-local';
const LocalStrategy = passportLocal.Strategy; 
import * as usersModel from '../models/users-superagent.mjs';
import { sessionCookieName } from '../app.mjs';

export const router = express.Router();

import DBG from 'debug';
const debug = DBG('notes:router-users'); 
const error = DBG('notes:error-users'); 

export function initPassport(app) { 
    app.use(passport.initialize()); 
    app.use(passport.session()); 
}
   
export function ensureAuthenticated(req, res, next) { 
    try {
      // req.user is set by Passport in the deserialize function 
      if (req.user) next(); 
      else res.redirect('/users/login'); 
    } catch (e) { next(e); }
}

router.get('/login', function(req, res, next) { 
    try {
      res.render('login', { title: "Login to Notes", user: req.user, }); 
    } catch (e) { next(e); }
}); 
   
router.post('/login', 
    passport.authenticate('local', { 
      successRedirect: '/', // SUCCESS: Go to home page 
      failureRedirect: 'login', // FAIL: Go to /user/login 
    }) 
);

router.get('/logout', function(req, res, next) { 
    try {
      req.session.destroy();
      req.logout(); 
      res.clearCookie(sessionCookieName);
      res.redirect('/'); 
    } catch (e) { next(e); }
});

passport.use(new LocalStrategy( 
    async (username, password, done) => { 
      try {
        var check = await usersModel.userPasswordCheck(username, 
        password);
        if (check.check) { 
          done(null, { id: check.username, username: check.username }); 
        } else { 
          done(null, false, check.message); 
        } 
      } catch (e) { done(e); }
    } 
)); 

passport.serializeUser(function(user, done) { 
    try {
      done(null, user.username); 
    } catch (e) { done(e); }
}); 
   
passport.deserializeUser(async (username, done) => { 
    try {
      let user = await usersModel.find(username);
      done(null, user);
    } catch(e) { done(e); }
}); 

