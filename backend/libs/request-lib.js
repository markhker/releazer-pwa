import fetch from 'node-fetch'
import * as semver from 'semver'

const { GITHUB_API_URL, GITHUB_TOKEN } = process.env

export async function request (url) {
  try {
    const res = await fetch(`${GITHUB_API_URL}${url}`, {
      headers: { Authorization: `token ${GITHUB_TOKEN}` }
    })
    const data = await res.json()
    return data
  } catch (err) {
    return Promise.reject(err)
  }
}

export const getRepoTags = async repo => {
  try {
    const tags = await request(`/repos/${repo}/tags?per_page=30`)
    if (!tags.length) return []
    return tags
  } catch (err) {
    return []
  }
}

export const getRepoVersions = async repo =>
  (await getRepoTags(repo))
    .filter(tag => /^(v[0-9]|[0-9])/.test(tag.name))
    .map(tag => tag.name)
    .sort((t1, t2) => {
      try {
        return semver.rcompare(t1, t2)
      } catch (e) {
        return semver.rcompare(semver.coerce(t1), semver.coerce(t2))
      }
    })
    .map(tag => {
      return tag
    })
