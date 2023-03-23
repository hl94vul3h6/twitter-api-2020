// const assert = require('assert')
const sequelize = require('sequelize')
const helpers = require('../_helpers')
const { User, Tweet, Reply, Like } = require('../models')
const { database } = require('faker/lib/locales/en')
const { assert } = require('chai')

const tweetServices = {
  getTweets: (req, cb) => {
    const userId = helpers.getUser(req).id
      return Tweet.findAll({
        attributes: [
        'id', 'description', 'createdAt', 'updatedAt',
        [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Tweet_id = Tweet.id)'), 'repliedCount'],
        [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Tweet_id = Tweet.id)'), 'likedCount'],
        [sequelize.literal(`EXISTS (SELECT id FROM Likes WHERE Tweet_id = Tweet.id AND User_id = ${userId})`), 'isLiked']
      ],
        include: [
          { model: User, attributes: ['id', 'name', 'account', 'avatar'] }
        ],
        order: [['updatedAt', 'DESC']],
        nest: true,
        raw: true
      })
      .then(tweetsData => {
        const tweets = tweetsData.map(t => ({
          ...t,
          isLiked: t.isLiked === 1
        }))
        cb(null, tweets )
      })
      .catch(err => cb(err))
  },
  getTweet: (req, cb) => {
    const userId = helpers.getUser(req).id
    const tweetId = req.params.tweetId
    return Tweet.findByPk(tweetId, {
      attributes: [
        'id', 'description', 'createdAt', 'updatedAt',
        [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Tweet_id = Tweet.id)'), 'repliedCount'],
        [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Tweet_id = Tweet.id)'), 'likedCount'],
        [sequelize.literal(`EXISTS (SELECT id FROM Likes WHERE Tweet_id = Tweet.id AND User_id = ${userId})`), 'isLiked']
      ],
      include: [
        { model: User, attributes: ['id', 'name', 'account', 'avatar'] }
      ]
    })
      .then(tweetData => {
        const { ...data } = {
          ...tweetData.toJSON(),
          isLiked: tweetData.isLiked === 1
        }
        return cb(null, data)
      })
        .catch(err => cb(err))
  },
  // postTweet: (req, cb) => {
  //   const { description } = req.body
  //   const userId = helpers.getUser(req).id
  //   return User.findByPk(userId)
  //     .then(user => {
  //       assert(user, '使用者不存在')
  //       return Tweet.create({
  //         UserId: userId,
  //         description
  //       })
  //     })
  //     .then(tweet => cb(null, tweet))
  //     .catch(err => cb(err))
  // }
  postTweet: (req, cb) => {
    const description = req.body.description
    const UserId = helpers.getUser(req).id
    return User.findByPk(UserId)
      .then(user => {
        if (!user) throw new Error('使用者不存在!')
        return Tweet.create({
          description,
          UserId
        })
      })
      .then(postedTweet => cb(null, postedTweet))
      .catch(err => cb(err))
  }
}

module.exports = tweetServices
