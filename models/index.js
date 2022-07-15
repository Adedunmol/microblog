const User = require('./User')
const Post = require('./Post')
const Comment = require('./Comment')
const Role = require('./Role')
const { ROLES } = require('../config/roles_list')

// one-to-many relationship between users and comments
User.hasMany(Comment)
Comment.belongsTo(User)

// one-to-many relationship between users and posts
User.hasMany(Post)
Post.belongsTo(User)


// one-to-many relationship between posts and comments
Post.hasMany(Comment)
Comment.belongsTo(Post)


// self-referencing many-to-many relationship between users for follows
User.belongsToMany(User, { as: 'User', through: 'Follow', foreignKey: 'UserId' })
User.belongsToMany(User, { as: 'Followed', through: 'Follow', foreignKey: 'FollowedId' })


// many-to-many relationship between users and posts for saved posts
User.belongsToMany(Post, { through: 'saves', as: 'Saved' })
Post.belongsToMany(User, { through: 'saves', as: 'Savers' })


// many-to-many relationship between users and posts for likes
User.belongsToMany(Post, { through: 'likes', as: 'Liked' })
Post.belongsToMany(User, { through: 'likes', as: 'Likers' })


// many-to-many relationship between users and roles
User.belongsToMany(Role, { through: 'user_roles' })
Role.belongsToMany(User, { through: 'user_roles' })


async function initialize_roles() {
    await Role.bulkCreate(ROLES)
}


module.exports = {
    User,
    Post,
    Comment,
    initialize_roles
}