const jsonist = require('jsonist')


function ghget (auth, url, callback) {
  var options = {
      headers : { 'User-Agent' : 'Magic Node.js application that does magic things' }
    , auth    : auth.user + ':' + auth.token
  }

  jsonist.get(url, options, function (err, data) {
    if (err)
      return callback(err)

    if (data.error || data.message)
      return callback(new Error('Error from GitHub: ' + (data.error || data.message)))

    callback(null, data)
  })
}


function list (auth, org, callback) {
  ghget(auth, 'https://api.github.com/orgs/' + org + '/teams', callback)
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


function getById (auth, id, callback) {
  ghget(auth, 'https://api.github.com/teams/' + id, callback)
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


function membersById (auth, id, callback) {
  ghget(auth, 'https://api.github.com/teams/' + id + '/members', callback)
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

module.exports.list    = list
module.exports.get     = get
module.exports.members = members