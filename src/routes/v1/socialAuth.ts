import express from 'express';
import passport from 'passport';
import { socialAuthSuccess } from '#controllers/admin/auth/socialAuthController';

const router = express.Router();

// Google Auth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', 
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  socialAuthSuccess
);

// Facebook Auth
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback',
  passport.authenticate('facebook', { session: false, failureRedirect: '/login' }),
  socialAuthSuccess
);

// X (Twitter) Auth
router.get('/x', passport.authenticate('twitter'));
router.get('/x/callback',
  passport.authenticate('twitter', { session: false, failureRedirect: '/login' }),
  socialAuthSuccess
);

export default router;
