import { ghget, lister } from 'ghutils'

const defaultApiUrl = 'https://api.github.com'

export async function list (auth, org, options = {}) {
  const apiUrl = options._apiUrl || defaultApiUrl
  const url = `${apiUrl}/orgs/${org}/teams`
  return lister(auth, url, options)
}

async function teamIdByName (auth, org, name, options = {}) {
  const teams = await list(auth, org, options)
  const team = teams.find((t) => t.name === name)
  if (!team) {
    throw new Error(`No such team [${name}] for org [${org}]`)
  }
  return team.id
}

async function getById (auth, id, options = {}) {
  const apiUrl = options._apiUrl || defaultApiUrl
  const url = `${apiUrl}/teams/${id}`
  const { data } = await ghget(auth, url, options)
  return data
}

export async function get (auth, org, name, options = {}) {
  if (name === undefined) {
    return getById(auth, org, options)
  }
  const id = await teamIdByName(auth, org, name, options)
  return getById(auth, id, options)
}

async function membersById (auth, id, options = {}) {
  const apiUrl = options._apiUrl || defaultApiUrl
  const url = `${apiUrl}/teams/${id}/members`
  return lister(auth, url, options)
}

export async function members (auth, org, name, options = {}) {
  if (name === undefined) {
    return membersById(auth, org, options)
  }
  const id = await teamIdByName(auth, org, name, options)
  return membersById(auth, id, options)
}

export async function userTeams (auth, options = {}) {
  const apiUrl = options._apiUrl || defaultApiUrl
  const url = `${apiUrl}/user/teams`
  return lister(auth, url, options)
}
