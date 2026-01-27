import { test } from 'node:test'
import assert from 'node:assert'
import { createMockServer, createMockServerWithHandler } from 'ghutils/test-util'
import * as ghteams from './ghteams.js'

test('list teams', async () => {
  const auth = { token: 'test-token' }
  const testData = [{ id: 1, name: 'Team A' }, { id: 2, name: 'Team B' }]

  const server = await createMockServer({ response: testData })
  try {
    const results = await ghteams.list(auth, 'testorg', {
      _apiUrl: server.baseUrl
    })
    assert.deepStrictEqual(results, testData)
    assert.ok(server.requests[0].url.includes('/orgs/testorg/teams'))
  } finally {
    await server.close()
  }
})

test('get team by id', async () => {
  const auth = { token: 'test-token' }
  const testData = { id: 101, name: 'My Team' }

  const server = await createMockServer({ response: testData })
  try {
    const result = await ghteams.get(auth, 101, undefined, {
      _apiUrl: server.baseUrl
    })
    assert.deepStrictEqual(result, testData)
    assert.ok(server.requests[0].url.includes('/teams/101'))
  } finally {
    await server.close()
  }
})

test('get team by org and name', async () => {
  const auth = { token: 'test-token' }
  const teamList = [{ id: 101, name: 'foo' }, { id: 202, name: 'myteam' }, { id: 303, name: 'bar' }]
  const teamData = { id: 202, name: 'myteam', description: 'My Team' }

  let requestCount = 0
  const mock = await createMockServerWithHandler((req, res) => {
    requestCount++
    if (requestCount === 1) {
      res.end(JSON.stringify(teamList))
    } else {
      res.end(JSON.stringify(teamData))
    }
  })

  try {
    const result = await ghteams.get(auth, 'myorg', 'myteam', {
      _apiUrl: mock.baseUrl
    })
    assert.deepStrictEqual(result, teamData)
    assert.strictEqual(requestCount, 2)
  } finally {
    await mock.close()
  }
})

test('get team by name throws for unknown team', async () => {
  const auth = { token: 'test-token' }
  const teamList = [{ id: 101, name: 'foo' }]

  const server = await createMockServer({ response: teamList })
  try {
    await assert.rejects(
      ghteams.get(auth, 'myorg', 'nonexistent', { _apiUrl: server.baseUrl }),
      (err) => {
        assert.ok(err.message.includes('No such team'))
        assert.ok(err.message.includes('nonexistent'))
        return true
      }
    )
  } finally {
    await server.close()
  }
})

test('get members by id', async () => {
  const auth = { token: 'test-token' }
  const memberData = [{ id: 1, login: 'user1' }, { id: 2, login: 'user2' }]

  const server = await createMockServer({ response: memberData })
  try {
    const results = await ghteams.members(auth, 101, undefined, {
      _apiUrl: server.baseUrl
    })
    assert.deepStrictEqual(results, memberData)
    assert.ok(server.requests[0].url.includes('/teams/101/members'))
  } finally {
    await server.close()
  }
})

test('get members by org and name', async () => {
  const auth = { token: 'test-token' }
  const teamList = [{ id: 202, name: 'myteam' }]
  const memberData = [{ id: 1, login: 'user1' }]

  let requestCount = 0
  const mock = await createMockServerWithHandler((req, res) => {
    requestCount++
    if (requestCount === 1) {
      res.end(JSON.stringify(teamList))
    } else {
      res.end(JSON.stringify(memberData))
    }
  })

  try {
    const results = await ghteams.members(auth, 'myorg', 'myteam', {
      _apiUrl: mock.baseUrl
    })
    assert.deepStrictEqual(results, memberData)
    assert.strictEqual(requestCount, 2)
  } finally {
    await mock.close()
  }
})

test('user teams', async () => {
  const auth = { token: 'test-token' }
  const testData = [{ id: 1, name: 'Team A' }]

  const server = await createMockServer({ response: testData })
  try {
    const results = await ghteams.userTeams(auth, {
      _apiUrl: server.baseUrl
    })
    assert.deepStrictEqual(results, testData)
    assert.ok(server.requests[0].url.includes('/user/teams'))
  } finally {
    await server.close()
  }
})
