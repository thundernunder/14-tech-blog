const sequelize = require('../config/connection');
const { User, Blog, Comment } = require('../models');

const blogData = require('./blog.json');
const commentData = require('./comment.json');
const userData = require('./user.json');

const seedBlogDatabase = async () => {
  await sequelize.sync({ force: true });

  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  for (const blog of blogData) {
    await Blog.create({
      ...blog,
      user_id: users[Math.floor(Math.random() * users.length)].id,
    });
  }

  const comments = await Comment.bulkCreate(commentData, {
    returning: true,
  });

  process.exit(0);
};

seedBlogDatabase();