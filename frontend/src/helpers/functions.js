import * as semver from 'semver'

export const sortVersions = versions =>
  versions
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

export const getLinkHeaders = header => {
  if (!header) throw new Error('Please provide a header')

  const parts = header.split(',')
  let links = {}
  for (let i = 0; i < parts.length; i++) {
    let section = parts[i].split(';')
    if (section.length !== 2) {
      throw new Error('Section could not be splitted')
    }
    let url = section[0].replace(/<(.*)>/, '$1').trim()
    url = url.replace(process.env.GITHUB_API_URL, '')
    let name = section[1].replace(/rel="(.*)"/, '$1').trim()
    links[name] = url
  }
  return links
}

const RELEASE_TYPES = {
  alpha: 'Alpha Pre-Release 💣',
  beta: 'Beta Pre-Release 🚧',
  canary: 'Canary Pre-Release 🐤',
  rc: 'Release Candidate ✈️',
  other: 'Other Release ‍🤷',
  patch: 'Fix Release 🐛',
  minor: 'Feature Release ✨',
  major: 'Major Release 🏆'
}

const releaseType = version =>
  version.includes('alpha') ? 'alpha'
    : version.includes('beta') ? 'beta'
      : version.includes('canary') ? 'canary'
        : version.includes('rc') ? 'rc'
          : version.includes('-') ? 'other'
            : semver.patch(version) !== 0 ? 'patch'
              : semver.minor(version) !== 0 ? 'minor'
                : 'major'

export const getReleaseType = version => {
  return RELEASE_TYPES[releaseType(version)]
}

export const getChangelogReleaseUrl = (repo, version) => `${repo}/releases/tag/${version}`
