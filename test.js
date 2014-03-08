const http           = require('http')
    , test           = require('tape')
    , requireSubvert = require('require-subvert')(__dirname)
    , _hyperquest    = require('hyperquest')
    , xtend          = require('xtend')
    , EE             = require('events').EventEmitter

requireSubvert.subvert('hyperquest', hyperquest)

var ghteams    = require('./')
  , hyperget

function hyperquest () {
  return hyperget.apply(this, arguments)
}

function makeServer (data) {
  var ee     = new EE()
    , i      = 0
    , server = http.createServer(function (req, res) {
        ee.emit('request', req)

        var _data = Array.isArray(data) ? data[i++] : data
        res.end(JSON.stringify(_data))

        if (!Array.isArray(data) || i == data.length)
          server.close()
      })
      .listen(0, function (err) {
        if (err)
          return ee.emit('error', err)

        hyperget = function (url, opts) {
          ee.emit('get', url, opts)
          return _hyperquest('http://localhost:' + server.address().port, opts)
        }

        ee.emit('ready')
      })
      .on('close', ee.emit.bind(ee, 'close'))

  return ee
}


function toAuth (auth) {
  return 'Basic ' + (new Buffer(auth.user + ':' + auth.token).toString('base64'))
}


function verifyRequest (t, auth) {
  return function (req) {
    t.ok(true, 'got request')
    t.equal(req.headers['authorization'], toAuth(auth), 'got auth header')
  }
}


function verifyUrl (t, url) {
  return function (_url) {
    t.equal(_url, url, 'correct url')
  }
}


function verifyClose (t) {
  return function () {
    t.ok(true, 'got close')
  }
}


function verifyData (t, data) {
  return function (err, _data) {
    t.notOk(err, 'no error')
    t.ok(_data, 'got data')
    t.deepEqual(_data, data, 'got expected data')
  }
}


test('test list teams', function (t) {
  t.plan(7)

  var auth     = { user: 'authuser', token: 'authtoken' }
    , org      = 'testorg'
    , testData = { test: 'data' }

  makeServer(testData)
    .on('ready', function () {
      ghteams.list(xtend(auth), org, verifyData(t, testData))
    })
    .on('request', verifyRequest(t, auth))
    .on('get'    , verifyUrl(t, 'https://api.github.com/orgs/testorg/teams'))
    .on('close'  , verifyClose(t))
})


test('test get team by id', function (t) {
  t.plan(7)

  var auth     = { user: 'authuser2', token: 'authtoken2' }
    , teamId   = 101
    , testData = { test: 'team data' }

  makeServer(testData)
    .on('ready', function () {
      ghteams.get(xtend(auth), teamId, verifyData(t, testData))
    })
    .on('request', verifyRequest(t, auth))
    .on('get'    , verifyUrl(t, 'https://api.github.com/teams/' + teamId))
    .on('close'  , verifyClose(t))
})


test('test get members by id', function (t) {
  t.plan(7)

  var auth     = { user: 'authuser2', token: 'authtoken2' }
    , teamId   = 101
    , testData = { test: 'team data' }

  makeServer(testData)
    .on('ready', function () {
      ghteams.members(xtend(auth), teamId, verifyData(t, testData))
    })
    .on('request', verifyRequest(t, auth))
    .on('get'    , verifyUrl(t, 'https://api.github.com/teams/' + teamId + '/members'))
    .on('close'  , verifyClose(t))
})


test('test get team by org & name', function (t) {
  t.plan(10)

  var auth     = { user: 'authuser2', token: 'authtoken2' }
    , org      = 'myorg'
    , name     = 'myteamname'
    , teamId   = 202
    , testData = [
          [ { name: 'foo', id: 101 }, { name: name, id: teamId },  { name: 'bar', id: 303 } ]
        , { test: 'team data' }
      ]

  var server = makeServer(testData)
    .on('ready', function () {
      ghteams.get(xtend(auth), org, name, verifyData(t, testData[1]))
    })
    .on('request', verifyRequest(t, auth))
    .once('get'  , function (url) {
      verifyUrl(t, 'https://api.github.com/orgs/' + org + '/teams')(url)
      // second GET:
      server.on('get', verifyUrl(t, 'https://api.github.com/teams/' + teamId))
    })
    .on('close'  , verifyClose(t))
})


test('test get members by org & name', function (t) {
  t.plan(10)

  var auth     = { user: 'authuser3', token: 'authtoken3' }
    , org      = 'myorg2'
    , name     = 'myteamname2'
    , teamId   = 100001
    , testData = [
          [ { name: name, id: teamId } ]
        , { test: 'team data 3' }
      ]

  var server = makeServer(testData)
    .on('ready', function () {
      ghteams.members(xtend(auth), org, name, verifyData(t, testData[1]))
    })
    .on('request', verifyRequest(t, auth))
    .once('get'  , function (url) {
      verifyUrl(t, 'https://api.github.com/orgs/' + org + '/teams')(url)
      // second GET:
      server.on('get', verifyUrl(t, 'https://api.github.com/teams/' + teamId + '/members'))
    })
    .on('close'  , verifyClose(t))
})


test('test get teams for auth user', function (t) {
  t.plan(7)

  var auth     = { user: 'authuser2', token: 'authtoken2' }
    , teamId   = 101
    , testData = { test: 'team data' }

  makeServer(testData)
    .on('ready', function () {
      ghteams.userTeams(xtend(auth), verifyData(t, testData))
    })
    .on('request', verifyRequest(t, auth))
    .on('get'    , verifyUrl(t, 'https://api.github.com/user/teams'))
    .on('close'  , verifyClose(t))
})
