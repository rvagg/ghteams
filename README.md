# ghteams

**A Node.js library to interact with the GitHub organisation teams API**

[![NPM](https://nodei.co/npm/ghteams.svg?style=flat&data=n,v&color=blue)](https://nodei.co/npm/ghteams/)

## Requirements

- Node.js >= 20

## Example usage

```js
import * as ghteams from 'ghteams'

const auth = { token: 'your-github-token' }
// note: the auth token needs the 'user' scope to deal with org teams

// list all teams in an organisation
const teams = await ghteams.list(auth, 'myorg')
console.log(teams)

// get team data by team name in an organisation
const team = await ghteams.get(auth, 'myorg', 'myteam')
console.log(team)

// get team data by team id (quicker)
const teamById = await ghteams.get(auth, 123456)
console.log(teamById)

// get team members by team name in an organisation
const members = await ghteams.members(auth, 'myorg', 'myteam')
console.log(members)

// get team members by team id (quicker)
const membersById = await ghteams.members(auth, 123456)
console.log(membersById)

// get teams the authenticated user belongs to
const myTeams = await ghteams.userTeams(auth)
console.log(myTeams)
```

The auth data is compatible with [ghauth](https://github.com/rvagg/ghauth) so you can connect them together:

```js
import ghauth from 'ghauth'
import * as ghteams from 'ghteams'

const auth = await ghauth({
  configName: 'team-lister',
  scopes: ['user']
})

const teams = await ghteams.list(auth, 'myorg')
console.log('Teams in "myorg":', teams.map((t) => t.name).join(', '))
```

## API

All methods return Promises.

### ghteams.list(auth, org, options)

List all teams in an organisation.

### ghteams.get(auth, org, name, options)

Get team data by team name in an organisation. If `name` is omitted and `org` is a numeric team ID, fetches the team directly by ID (quicker).

### ghteams.members(auth, org, name, options)

Get team members by team name in an organisation. If `name` is omitted and `org` is a numeric team ID, fetches members directly by ID (quicker).

### ghteams.userTeams(auth, options)

Get all teams the authenticated user belongs to.

## Authentication

See [ghauth](https://github.com/rvagg/ghauth) for an easy way to obtain and cache GitHub authentication tokens. The `auth` object returned by ghauth is directly compatible with all ghteams methods.

## See also

* [ghissues](https://github.com/rvagg/ghissues) - interact with the GitHub issues API
* [ghusers](https://github.com/rvagg/ghusers) - interact with the GitHub users API
* [ghpulls](https://github.com/rvagg/ghpulls) - interact with the GitHub pull requests API
* [ghrepos](https://github.com/rvagg/ghrepos) - interact with the GitHub repos API
* [ghauth](https://github.com/rvagg/ghauth) - GitHub authentication

## License

**ghteams** is Copyright (c) 2014-2025 Rod Vagg [@rvagg](https://github.com/rvagg) and licensed under the MIT licence. All rights not explicitly granted in the MIT license are reserved. See the included LICENSE file for more details.
