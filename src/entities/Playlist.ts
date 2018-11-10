import { SoundCloud, Track } from '..'
import { parseTags } from '../util'

/**
 * A SoundCloud playlist.
 */
export class Playlist {
  /**
   * The SoundCloud object that created this playlist.
   */
  public soundcloud: SoundCloud

  /**
   * The raw data of this playlist.
   */
  public data: any

  /**
   * The ID of this playlist.
   */
  public id: string

  /**
   * The title of the playlist.
   */
  public title: string

  /**
   * The description of the playlist.
   */
  public description: string

  /**
   * The tracks in the playlist. Only available after calling `Playlist#fetchTracks()`.
   */
  public tracks: Track[]

  /**
   * The creator of the playlist.
   */
  public user: {
    avatarUrl: string
    id: number
    kind: 'user'
    apiUrl: string
    username: string
    permalink: string
    lastModified: Date
  }

  /**
   * The date the playlist was created.
   */
  public dateCreated: Date

  /**
   * The number of items in the playlist.
   */
  public length: number

  /**
   * The genre of the playlist.
   */
  public genre: string

  /**
   * The tags given to the playlist.
   */
  public tags: string[]

  /**
   * The URL of the artwork of this playlist.
   */
  public artwork: string

  /**
   * The URL of this playlist.
   */
  public url: string

  constructor (soundcloud: SoundCloud, data) {
    this.soundcloud = soundcloud
    this.data = data

    this._init(data)
  }

  private _init (data) {
    if (data.kind !== 'playlist') {
      throw new Error(`Invalid playlist type: ${data.kind}`)
    }

    this.id = data.id
    this.genre = data.genre
    this.length = data.track_count
    this.description = data.description
    this.title = data.title
    this.dateCreated = new Date(data.created_at)
    this.tags = parseTags(data.tag_list)
    this.artwork = data.artwork_url
    this.url = data.permalink_url
    this.user = {
      id: data.user.id,
      kind: data.user.kind,
      avatarUrl: data.user.avatar_url,
      apiUrl: data.user.uri + '?client_id=' + this.soundcloud.clientId,
      lastModified: new Date(data.user.lastModified),
      permalink: data.user.permalink_url,
      username: data.user.username
    }
  }

  /**
   * Fetches this playlist and reassigns this object to the new playlist object.
   * Only useful if you want updated playlist info.
   */
  public async fetch () {
    const playlist = await this.soundcloud.getPlaylist(this.id)
    return Object.assign(this, playlist)
  }

  /**
   * Fetches all of the tracks in this playlist, and
   * assigns them to `Playlist#tracks`.
   */
  public async fetchTracks () {
    const tracks = await this.soundcloud.getPlaylistTracks(this.id)
    this.tracks = tracks
    return tracks
  }
}
