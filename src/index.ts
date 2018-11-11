import { Track, Playlist, User } from './entities'
import { request } from './util'
export * from './entities'

/**
 * The main class used to interact with the SoundCloud API. Use this.
 */
export class SoundCloud {
  public clientId: string

  /**
   *
   * @param clientId Your SoundCloud client ID. Don't share this with anybody.
   */
  constructor (clientId: string) {
    this.clientId = clientId
  }

  /**
   * Search users on SoundCloud.
   * @param username What to search for on SoundCloud.
   */
  public searchUsers (username: string) {
    return this.search('users', username) as Promise<User[]>
  }

  /**
   * Search videos on SoundCloud.
   * @param searchTerm What to search for on SoundCloud.
   * @param author The author of the video.
   */
  public searchTracks (searchTerm: string, author?: string) {
    return this.search('tracks', searchTerm, author) as Promise<Track[]>
  }

  /**
   * Search playlists on SoundCloud.
   * @param searchTerm What to search for on SoundCloud.
   * @param author The author of the playlist.
   */
  public searchPlaylists (searchTerm: string, author?: string) {
    return this.search('playlists', searchTerm, author) as Promise<Playlist[]>
  }

  /**
   * Get a user object from the ID of a user.
   * @param id The ID of the user.
   */
  public getUser (id: string | number) {
    return this.getItemById('user', String(id)) as Promise<User>
  }

  /**
   * Get a track object from the ID of a track.
   * @param id The ID of the track.
   */
  public getTrack (id: string | number) {
    return this.getItemById('track', String(id)) as Promise<Track>
  }

  /**
   * Get a playlist object from the ID of a playlist.
   * @param id The ID of the playlist.
   */
  public getPlaylist (id: string | number) {
    return this.getItemById('playlist', String(id)) as Promise<Playlist>
  }

  /**
   * Get a user object from the url of a user.
   * @param url The url of the user.
   */
  public getUserByUrl (url: string) {
    return this.resolve('user', url) as Promise<User>
  }

  /**
   * Get a track object from the url of a track.
   * @param url The url of the track.
   */
  public getTrackByUrl (url: string) {
    return this.resolve('track', url) as Promise<Track>
  }

  /**
   * Get a playlist object from the url of a playlist.
   * @param url The url of the playlist.
   */
  public getPlaylistByUrl (url: string) {
    return this.resolve('playlist', url) as Promise<Playlist>
  }

  /**
   * Fetches a user's tracks.
   * @param userId The ID of the user.
   * @param pages The number of pages (of 50) to fetch. May fetch less, but never more pages.
   * There may be more than 50 tracks if the resource isn't paginated.
   */
  public getUserTracks (userId: string | number, pages: number = 1) {
    return this.getSubresource('user', userId, 'tracks', pages) as Promise<Track[]>
  }

  /**
   * Fetches a playlist's tracks.
   * @param playlistId The ID of the playlist.
   * @param pages The number of pages (of 50) to fetch. May fetch less, but never more pages.
   * There may be more than 50 tracks if the resource isn't paginated.
   */
  public getPlaylistTracks (playlistId: string | number, pages: number = 1) {
    return this.getSubresource('playlist', playlistId, 'tracks', pages) as Promise<Track[]>
  }

  /**
   * Fetches a user's followers.
   * @param userId The ID of the user.
   * @param pages The number of pages (of 50) to fetch. May fetch less, but never more pages.
   * There may be more than 50 users if the resource isn't paginated.
   */
  public getUserFollowers (userId: string | number, pages: number = 1) {
    return this.getSubresource('user', userId, 'followers', pages) as Promise<User[]>
  }

  /**
   * Fetches a user's followings.
   * @param userId The ID of the user.
   * @param pages The number of pages (of 50) to fetch. May fetch less, but never more pages.
   * There may be more than 50 users if the resource isn't paginated.
   */
  public getUserFollowings (userId: string | number, pages: number = 1) {
    return this.getSubresource('user', userId, 'followings', pages) as Promise<User[]>
  }

  /**
   * Fetches a user's favorites.
   * @param userId The ID of the user.
   * @param pages The number of pages (of 50) to fetch. May fetch less, but never more pages.
   * There may be more than 50 tracks if the resource isn't paginated.
   */
  public getUserFavorites (userId: string | number, pages: number = 1) {
    return this.getSubresource('user', userId, 'favorites', pages) as Promise<Track[]>
  }

  /**
   * Fetches the user's playlists.
   * @param userId The ID of the user.
   * @param pages The number of pages (of 50) to fetch. May fetch less, but never more pages.
   * There may be more than 50 playlists if the resource isn't paginated.
   */
  public getUserPlaylists (userId: string | number, pages: number = 1) {
    return this.getSubresource('user', userId, 'playlists', pages) as Promise<Playlist[]>
  }

  private async search (type: 'tracks' | 'playlists' | 'users', searchTerm: string, author?: string): Promise<Track[] | Playlist[] | User[]> {
    const items = []

    if (author) {
      const loc: string = (await request.api('resolve', {
        url: 'https://soundcloud.com/' + author + '/' + type === 'tracks' ? type : type === 'playlists' ? 'sets' : undefined,
        client_id: this.clientId
      })).location

      const itemsApi: any[] = await request.api(loc, {
        client_id: this.clientId
      })

      let found = itemsApi.filter(item => item.permalink === searchTerm)

      if (found.length === 0) {
        found = itemsApi.filter(item => item.permalink.includes(searchTerm))
      }

      if (type === 'tracks') {
        found.forEach(item => items.push(new Track(this, item)))
      } else if (type === 'playlists') {
        found.forEach(item => items.push(new Playlist(this, item)))
      } else {
        return Promise.reject('Incompatible type with author: ' + type)
      }

      if (items.length > 0) {
        return items
      }
    }

    const results = await request.api(type, {
      q: searchTerm,
      client_id: this.clientId
    })

    results.forEach(item => {
      switch (type) {
        case 'tracks':
          items.push(new Track(this, item))
          break
        case 'playlists':
          items.push(new Playlist(this, item))
          break
        case 'users':
          items.push(new User(this, item))
          break
        default:
          return Promise.reject('Type must be tracks or playlists')
      }
    })

    return items
  }

  private async getItemById (type: 'track' | 'playlist' | 'user', id: string): Promise<Track | Playlist | User> {
    let result

    result = await request.api(type + 's/' + id, {
      client_id: this.clientId
    })

    switch (type) {
      case 'track':
        return new Track(this, result)
      case 'playlist':
        return new Playlist(this, result)
      case 'user':
        return new User(this, result)
      default:
        return Promise.reject('Type must be a track, playlist, or user')
    }
  }

  private async resolve (type: 'track' | 'playlist' | 'user', url: string): Promise<Track | Playlist | User> {
    const loc: string = (await request.api('resolve', {
      url,
      client_id: this.clientId
    })).location

    const result = await request.get(loc)

    switch (type) {
      case 'track':
        return new Track(this, result)
      case 'playlist':
        return new Playlist(this, result)
      case 'user':
        return new User(this, result)
      default:
        return Promise.reject('Type must be a track, playlist, or user')
    }
  }

  private async getSubresource (item: 'track' | 'playlist' | 'user', itemId: string | number, subresource: Subresource, pages: number = 1) {
    const items = []
    let results = await request.api(item + 's/' + itemId + '/' + subresource, {
      client_id: this.clientId
    })

    if (results.collection) {
      if (pages <= 1) {
        results = results.collection
      } else {
        for (let i = 0; i < pages - 1; i++) {
          if (results.next_href) {
            results.collection.push(...((await request.get(results.next_href)).collection))
          } else {
            break
          }
        }

        results = results.collection
      }
    }

    results.forEach(item => {
      switch (subresource) {
        case 'favorites':
        case 'tracks':
          items.push(new Track(this, item))
          break
        case 'playlists':
          items.push(new Playlist(this, item))
          break
        case 'followings':
        case 'followers':
          items.push(new User(this, item))
          break
        case 'web-profiles':
          items.push({
            id: item.id,
            service: item.service,
            title: item.title,
            url: item.url,
            username: item.username,
            dateCreated: new Date(item.created_at)
          })
          break
      }
    })

    return items
  }
}

type Subresource = 'tracks' | 'playlists' | 'followings' | 'followers' | 'favorites' | 'web-profiles'
