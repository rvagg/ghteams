# ghteams

**A node library to interact with the GitHub organisation teams API**

[![NPM](https://nodei.co/npm/ghteams.png?mini=true)](https://nodei.co/npm/ghteams/)

## Example usage

```js
const ghteams     = require('ghteams')
    , authOptions = { user: 'rvagg', token: '24d5dee258c64aef38a66c0c5eca459c379901c2' }
    // note the auth token needs the 'user' scope to deal with org teams


// list all teams in an organisation

ghteams.list(authOptions, 'myorg', function (err, teamlist) {
  // Array of team data for 'myorg'
  console.log(teamlist)
})


// get team data by team name in an organisation

ghteams.get(authOptions, 'myorg', 'myteam', function (err, team) {
  // object containing full team data for myorg/myteam
  console.log(team)
})


// get team data by team id (quicker)
ghteams.get(authOptions, 123456, function (err, team) {
  // object containing full team data team #123456
  console.log(team)
})


// get team members by team name in an organisation

ghteams.members(authOptions, 'myorg', 'myteam', function (err, members) {
  // Array containing full list of team members for myorg/myteam
  console.log(members)
})


// get team members by team id (quicker)
ghteams.members(authOptions, 123456, function (err, members) {
  // Array containing full list of team members team #123456
  console.log(members)
})
```


The auth data is compatible with [ghauth](https://github.com/rvagg/ghauth) so you can just connect them together to make a simple command-line application:

```js
const ghauth      = require('ghauth')
    , ghteams     = require('ghteams')
    , authOptions = {
          configName : 'team-lister'
        , scopes     : [ 'user' ]
      }

ghauth(authOptions, function (err, authData) {
  ghteams.list(authData, 'myorg', function (err, list) {
    console.log('Teams in "myorg": ', list.map(function (t) {
      return t.name
    }).join(', '))
  })
})
```


## License

**ghteams** is Copyright (c) 2014 Rod Vagg [@rvagg](https://github.com/rvagg) and licensed under the MIT licence. All rights not explicitly granted in the MIT license are reserved. See the included LICENSE file for more details.
