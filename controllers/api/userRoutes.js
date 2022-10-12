const router = require('express').Router();
const { User } = require('../../models');

router.post('/', async (req, res) => {
    try {
        const userData = await User.create(req.body);

        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;

            res.status(200).json(userData);
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post('/login', async (req, res) => {
    try {
        const userData = await User.findOne({
            where: { username: req.body.username}
        });

        if (!userData) {
            res.status(400).json({message: 'Username or password is incorrect'});
            return;
        }

        const correctPassword = await userData.checkPassword(req.body.password);

        if(!correctPassword) {
            res.status(400).json({message: 'Username or password is incorrect'});
        }

        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;
            
            res.json({ user: userData, message: 'Login Successful!' });
          });

        } catch (err) {
            res.status(500).json(err);
        }
            
});

router.post('/logout', async (req, res) => {
    if(req.session.logged_in) {
        req.session.destroy(() => {
            res.status(200).json({message: 'Logged out'});
        });
} else{
    res.status(404).end();
}
});