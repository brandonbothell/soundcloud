import { Track, Playlist } from './entities'
import { parseUrl, request } from './util'
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
   * Get a track object from the ID of a track.
   * @param id The ID of the track.
   */
  public getTrack (id: string) {
    return this.getItemById('track', id) as Promise<Track>
  }

  /**
   * Get a playlist object from the ID of a playlist.
   * @param id The ID of the playlist.
   */
  public getPlaylist (id: string) {
    return this.getItemById('playlist', id) as Promise<Playlist>
  }

  /**
   * Get a track object from the url of a track.
   * @param url The url of the track.
   */
  public async getTrackByUrl (url: string) {
    const id = parseUrl(url)

    if (!id.track) {
      return Promise.reject('Not a valid video url')
    }

    return (await this.searchTracks(id.track, id.author))[0]
  }

  /**
   * Get a playlist object from the url of a playlist.
   * @param url The url of the playlist.
   */
  public async getPlaylistByUrl (url: string) {
    const id = parseUrl(url)

    if (!id.playlist) {
      return Promise.reject('Not a valid playlist url')
    }

    return (await this.searchPlaylists(id.playlist, id.author))[0]
  }

  public async getPlaylistTracks (playlistId: string) {
    const tracks: Track[] = []
    const results = await request.api('playlists/' + playlistId + '/tracks', {
      client_id: this.clientId
    })

    results.forEach(track => {
      tracks.push(new Track(this, track))
    })

    return tracks
  }

  private async search (type: 'tracks' | 'playlists', searchTerm: string, author?: string): Promise<Track[] | Playlist[]> {
    const results = await request.api(type, {
      q: encodeURIComponent(searchTerm),
      client_id: this.clientId
    })

    const items = []

    results.forEach(item => {
      if (author && item.user.username.toLowerCase() !== author.toLowerCase()) {
        return
      }

      switch (type) {
        case 'tracks':
          items.push(new Track(this, item))
          break
        case 'playlists':
          items.push(new Playlist(this, item))
          break
        default:
          throw new Error('Type must be tracks or playlists')
      }
    })

    return items
  }

  private async getItemById (type: 'track' | 'playlist', id: string): Promise<Track | Playlist> {
    let result

    if (type === 'track') {
      result = await request.api('tracks/' + id, {
        client_id: this.clientId
      })
    } else if (type === 'playlist') {
      result = await request.api('playlists/' + id, {
        client_id: this.clientId
      })
    }

    switch (type) {
      case 'track':
        return new Track(this, result)
      case 'playlist':
        return new Playlist(this, result)
      default:
        throw new Error('Type must be a track or playlist')
    }
  }
}
