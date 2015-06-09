const jsonist = require('jsonist')
    , ghutils = require('ghutils')


function list (auth, org, options, callback) {
  if (typeof options == 'function') { // no options
    callback = options
    options  = {}
  }

  var urlbase = 'https://api.github.com/orgs/' + org + '/teams'

  ghutils.lister(auth, urlbase, options, callback)
}


function teamIdByName (auth, org, name, callback) {
  list(auth, org, function (err, teams) {
    if (err)
      return callback(err)

    var team = teams.filter(function (team) {
      return team.name == name
    })[0]

    if (!team)
      return callback(new Error('No such team [' + name + '] for org [' + org + ']'))

    callback(null, team.id)
  })
}


function getById (auth, id, options, callback) {
  if (typeof options == 'function') { // no options
    callback = options
    options  = {}
  }

  ghutils.ghget(auth, 'https://api.github.com/teams/' + id, options, callback)
}


function get (auth, org, name, callback) {
  if (typeof name == 'function')
    return getById(auth, org, name)

  teamIdByName(auth, org, name, function (err, id) {
    if (err)
      return callback(err)

    getById(auth, id, callback)
  })
}


function membersById (auth, id, options, callback) {
  if (typeof options == 'function') { // no options
    callback = options
    options  = {}
  }

  var urlbase = 'https://api.github.com/teams/' + id + '/members'

  ghutils.lister(auth, urlbase, options, callback)
}


function members (auth, org, name, callback) {
  if (typeof name == 'function')
    return membersById(auth, org, name)

  teamIdByName(auth, org, name, function (err, id) {
    if (err)
      return callback(err)

    membersById(auth, id, callback)
  })
}


function userTeams (auth, options, callback) {
  if (typeof options == 'function') { // no options
    callback = options
    options  = {}
  }

  var urlbase = 'https://api.github.com/user/teams'

  ghutils.lister(auth, urlbase, options, callback)
}


module.exports.list      = list
module.exports.get       = get
module.exports.members   = members
module.exports.userTeams = userTeams
