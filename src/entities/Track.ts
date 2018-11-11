import { SoundCloud } from '..'
import { parseTags } from '../util'

/**
 * A SoundCloud track.
 */
export class Track {
  /**
   * The SoundCloud object that created the track.
   */
  public soundcloud: SoundCloud

  /**
   * The raw data of the track.
   */
  public data

  /**
   * The ID of the track.
   */
  public id: string

  /**
   * The title of the track.
   */
  public title: string

  /**
   * The description of the track.
   */
  public description: string

  /**
   * The artwork of the track.
   */
  public artwork: string

  /**
   * The date the track was published.
   */
  public datePublished: Date

  /**
   * The user that uploaded the track.
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

  private _length: number

  /**
   * The minutes of the track.
   */
  public minutes: number

  /**
   * The seconds of the track.
   */
  public seconds: number

  /**
   * The url of the track.
   */
  public url: string

  /**
   * The URL to the stream of the track.
   */
  public streamUrl: string

  /**
   * The number of times this track has been favorited.
   */
  public favorites: number

  /**
   * The genre of the track.
   */
  public genre: string

  /**
   * The tags assigned to this track.
   */
  public tags: string[]

  constructor (soundcloud: SoundCloud, data) {
    this.soundcloud = soundcloud
    this.data = data

    this._init(data)
  }

  private _init (data) {
    if (data.kind !== 'track') {
      throw new Error('Unknown type ' + data.kind)
    }
    this._length = data.duration
    this.minutes = Math.floor(this._length / 1000 / 60)
    this.seconds = Number((60 * ((this._length / 1000 / 60) % 1)).toFixed(2))

    this.id = data.id

    this.title = data.title
    this.description = data.description
    this.artwork = data.artwork_url
    this.datePublished = new Date(data.created_at)
    this.url = data.permalink_url
    this.streamUrl = data.stream_url + '?client_id=' + this.soundcloud.clientId
    this.genre = data.genre
    this.favorites = data.favoritings_count
    this.tags = parseTags(data.tag_list)
    this.user = {
      id: data.user.id,
      kind: data.user.kind,
      avatarUrl: data.user.avatar_url,
      apiUrl: data.user.uri + '?client_id=' + this.soundcloud.clientId,
      lastModified: new Date(data.user.lastModified),
      permalink: data.user.permalink_url,
      username: data.user.username
    }

    return this
  }

  /**
   * Fetches this track and reassigns this object to the new track object.
   * Only useful if you want updated track info.
   */
  public async fetch () {
    const track = await this.soundcloud.getTrack(this.id)
    return Object.assign(this, track)
  }
}
