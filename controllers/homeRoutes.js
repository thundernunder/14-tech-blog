const router = require('express').Router();
const { User, Blog, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    const blogInfo = await Blog.findAll({
        include: [{
            model: User, 
            attributes: ['username'],
    },],
});

const allBlogs = blogInfo.map((blog) => blog.get({
    plain: true
}));

res.render('homepage', {
    allBlogs, 
    logged_in: req.session.logged_in
});
  } catch (err) {
    res.status(500).json(err);
  }
});


router.get('blog/:id', async (req, res) => {
    try {
        const blogInfo = await Blog.findByPk(req.params.id, {
            include: [
                {
                    model: User, 
                    attributes: ['username'], 
                }, 
                {
                    model: Comment, 
                    include: [
                        User
                    ]
                }
            ], 
        });

        const blog = blogInfo.get({
            plain: true,
        });

        res.render('blog', {
            ...blog, logged_in: req.session.logged_in
        });

    } catch (err) {
        res.status(500).json(err);
    }
})

 
router.get('/dashboard', withAuth, async (req, res) => {

    try { const userInfo = await User.findByPk(req.session.user_id, {
        attributes: {
            exclude: ['password']
        }, 
        include: [{
            model: Blog
        }], 
    });

    res.render('dashboard', {
        ...user, 
        logged_in: true
    });

} catch (err) {
    res.status(500).json(err);
}

});

router.get('/login', (req, res) => {
    if(req.session.logged_in) {
        res.redirect('/dashboard');
        return;
    }

    res.render('login');
});

router.get('/signup', (req, res) => {
    if(req.session.logged_in) {
        res.redirect('/dashboard');
        return;
    }

    res.render('signup');
});

module.exports = router;