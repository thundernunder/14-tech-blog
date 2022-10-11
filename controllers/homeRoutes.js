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

 
router.post('/', async (req, res) => {

    try { const newComment = await Comment.create({
        ...req.body, 
        user_id: req.session.user_id, 
    });

    res.json(newComment);

} catch (err) {
    res.status(500).json(err);
}

});

router.delete('/:id', withAuth, async (req, res) => {
    
    try { const commentInfo = await Comment.destroy({
        where: {
            id: req.params.id,
            user_id: req.session.user_id,
        },
    })

    if(!commentInfo) {
        res.status(404).json({
            message: 'Blog not found'});
            return;
    }

    res.status(200).json(commentInfo);

} catch(err) {
    res.status(500).json(err);
}
});