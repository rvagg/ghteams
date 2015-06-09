const ghutils = require('ghutils/test')
    , ghteams = require('./')
    , test    = require('tape')
    , xtend   = require('xtend')


test('test list teams', function (t) {
  t.plan(10)

  var auth     = { user: 'authuser', token: 'authtoken' }
    , org      = 'testorg'
    , testData = [ [ { test: 'data' } ], [] ]

  ghutils.makeServer(testData)
    .on('ready', function () {
      ghteams.list(xtend(auth), org, ghutils.verifyData(t, testData[0]))
    })
    .on('request', ghutils.verifyRequest(t, auth))
    .on('get'    , ghutils.verifyUrl(t, [
        'https://api.github.com/orgs/testorg/teams?page=1'
      , 'https://api.github.com/orgs/testorg/teams?page=2'
    ]))
    .on('close'  , ghutils.verifyClose(t))
})


test('test get team by id', function (t) {
  t.plan(7)

  var auth     = { user: 'authuser2', token: 'authtoken2' }
    , teamId   = 101
    , testData = [ { test: 'team data' } ]

  ghutils.makeServer(testData)
    .on('ready', function () {
      ghteams.get(xtend(auth), teamId, ghutils.verifyData(t, testData[0]))
    })
    .on('request', ghutils.verifyRequest(t, auth))
    .on('get'    , ghutils.verifyUrl(t, [ 'https://api.github.com/teams/' + teamId ]))
    .on('close'  , ghutils.verifyClose(t))
})


test('test get members by id', function (t) {
  t.plan(10)

  var auth     = { user: 'authuser2', token: 'authtoken2' }
    , teamId   = 101
    , testData = [ [ { test: 'team data' } ], [] ]

  ghutils.makeServer(testData)
    .on('ready', function () {
      ghteams.members(xtend(auth), teamId, ghutils.verifyData(t, testData[0]))
    })
    .on('request', ghutils.verifyRequest(t, auth))
    .on('get'    , ghutils.verifyUrl(t, [
        'https://api.github.com/teams/' + teamId + '/members?page=1'
      , 'https://api.github.com/teams/' + teamId + '/members?page=2'
    ]))
    .on('close'  , ghutils.verifyClose(t))
})


test('test get team by org & name', function (t) {
  t.plan(13)

  var auth     = { user: 'authuser2', token: 'authtoken2' }
    , org      = 'myorg'
    , name     = 'myteamname'
    , teamId   = 202
    , testData = [
          [ { name: 'foo', id: 101 }, { name: name, id: teamId },  { name: 'bar', id: 303 } ]
	, []
        , { test: 'team data' }
      ]

  var server = ghutils.makeServer(testData)
    .on('ready', function () {
      ghteams.get(xtend(auth), org, name, ghutils.verifyData(t, testData[2]))
    })
    .on('request', ghutils.verifyRequest(t, auth))
    .once('get'  , function (url) {
      ghutils.verifyUrl(t, [ 'https://api.github.com/orgs/' + org + '/teams?page=1' ])(url)
      server.once('get'  , function (url) {
        ghutils.verifyUrl(t, [ 'https://api.github.com/orgs/' + org + '/teams?page=2' ])(url)
        server.once('get', ghutils.verifyUrl(t, [ 'https://api.github.com/teams/' + teamId ]))
      })
    })
    .on('close'  , ghutils.verifyClose(t))
})


test('test get members by org & name', function (t) {
  t.plan(15)

  var auth     = { user: 'authuser3', token: 'authtoken3' }
    , org      = 'myorg2'
    , name     = 'myteamname2'
    , teamId   = 100001
    , testData = [
          [ { name: name, id: teamId } ]
        , []
        , [ { test: 'team data 3' } ]
        , []
      ]

  var server = ghutils.makeServer(testData)
    .on('ready', function () {
      ghteams.members(xtend(auth), org, name, ghutils.verifyData(t, testData[2]))
    })
    .on('request', ghutils.verifyRequest(t, auth))
    .once('get'  , function (url) {
      ghutils.verifyUrl(t, [ 'https://api.github.com/orgs/' + org + '/teams?page=1' ])(url)
      server.once('get'  , function (url) {
        ghutils.verifyUrl(t, [ 'https://api.github.com/orgs/' + org + '/teams?page=2' ])(url)
        server.once('get', ghutils.verifyUrl(t, [
            'https://api.github.com/teams/' + teamId + '/members?page=1'
          , 'https://api.github.com/teams/' + teamId + '/members?page=2'
        ]))
      })
    })
    .on('close'  , ghutils.verifyClose(t))
})


test('test get teams for auth user', function (t) {
  t.plan(10)

  var auth     = { user: 'authuser2', token: 'authtoken2' }
    , teamId   = 101
    , testData = [ [ { test: 'team data' } ], [] ]

  ghutils.makeServer(testData)
    .on('ready', function () {
      ghteams.userTeams(xtend(auth), ghutils.verifyData(t, testData[0]))
    })
    .on('request', ghutils.verifyRequest(t, auth))
    .on('get'    , ghutils.verifyUrl(t, [
        'https://api.github.com/user/teams?page=1'
      , 'https://api.github.com/user/teams?page=2'
    ]))
    .on('close'  , ghutils.verifyClose(t))
})
