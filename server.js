'use strict'
const koa = require('koa')
const koaBody = require('koa-better-body')
const Firenext = require('Firenext')
const FirebaseTokenGenerator = require("firebase-token-generator")
const router = require('koa-router')()
const serve = require('koa-static')
const thunkify = require('thunkify-wrap')
const app = koa()
const port =  process.env.PORT || 5000
const server = require('http').createServer(app.callback()).listen(port)
const dotenv = require('dotenv')


const userData = new Firenext('https://grumble.firebaseio.com/users/')

dotenv.load()


const tokenGenerator = new FirebaseTokenGenerator(process.env.FIREBASE_SECRET)

app.use(koaBody({
  extendTypes: {
    // will parse application/x-javascript type body as a JSON string
    json: ['application/x-javascript'],
    multipart: ['multipart/mixed']
  }
}))

app.use(serve(__dirname + '/client'))

router.get('/users/:id', function *(next) {
  let response
  let user
  const token = tokenGenerator.createToken({uid: this.params.id, provider: 'github'})
  userData.authWithCustomToken(token)


  this.status = 200
  this.body = yield getUser(this.params.id)
})

function getUser(username) {
  return userData.child(username).exec().then(function(snapshot){
    return snapshot.val()
  })
}

router.post('', function *(next) {

})
router.patch('', function *(next) {

})
router.delete('', function *(next) {

})

app.use(router.routes())
console.log('Listening on ' + port)
