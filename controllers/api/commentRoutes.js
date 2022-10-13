const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', (req, res) => {
  Comment.findAll({})
    .then(commentInfo => {
        res.json(commentInfo)
        .catch(err => {
            res.status(404).json(err);
        });
      });
});

router.get('/id:', (req, res) => {

      Comment.findAll({
        where: {
          id: req.params.id
        }
      })
      .then(commentInfo => {
          res.json(commentInfo)
          .catch(err => {
              res.status(404).json(err);
          });
        });
  });
 
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

router.delete('/:id', async (req, res) => {
    
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

module.exports = router;