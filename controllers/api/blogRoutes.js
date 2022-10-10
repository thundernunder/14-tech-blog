const router = require('express').Router();
const session = require('express-session');
const { Blog } = require('../../models');
const withAuth = require('../../utils/auth');

router.post('/', withAuth, async (req, res) => {

    try { const newBlog = await Blog.create({
        ...req.body, 
        user_id: session.user_id, 
    });

    res.status(200).json(newBlog);

} catch (err) {
    res.status(500).json(err);
}

});

router.delete('/:id', withAuth, async (req, res) => {
    
    try { const blogInfo = await Blog.destroy({
        where: {
            id: req.params.id,
            user_id: session.user_id,
        },
    }),

    if(!blogInfo) {
        res.status(404).json({
            message: 'Blog not found'});
            return;
    }

    res.status(200).json(blogInfo);

} catch(err) {
    res.status(500).json(err);
}
});