import { SoundCloud, Track, Playlist } from '..'

export class User {

  /**
   * The SoundCloud object that created this Video object.
   */
  public soundcloud: SoundCloud

  /**
   * The raw data of this video.
   */
  public data: any

  /**
   * The ID of the user.
   */
  public id: number

  /**
   * The username of the user.
   */
  public username: string

  /**
   * The date the user's account was last modified.
   */
  public lastModified: Date

  /**
   * The API url to the user.
   */
  public apiUrl: string

  /**
   * The url to the user.
   */
  public url: string

  /**
   * The url to the user's avatar.
   */
  public avatarUrl: string

  /**
   * The country of the user.
   */
  public country: string

  /**
   * The user's first name.
   */
  public firstName: string

  /**
   * The user's last name.
   */
  public lastName: string

  /**
   * The user's description.
   */
  public description: string

  /**
   * The user's city.
   */
  public city: string

  public social: {
    /**
     * The user's Myspace username.
     */
    myspace: string

    /**
     * The user's Discogs username.
     */
    discogs: string
  }

  /**
   * The user's website.
   */
  public website: { url: string, title: string }

  /**
   * The amount of tracks the user has uploaded.
   */
  public trackCount: number

  /**
   * The amount of playlists the user has created.
   */
  public playlistCount: number

  /**
   * Whether or not the user is offline (at the time of fetching).
   */
  public online: boolean

  /**
   * The plan that the user has.
   */
  public plan: string

  /**
   * The number of items the user has favorited.
   */
  public favoritesCount: number

  /**
   * The number of followers the user has.
   */
  public followersCount: number

  /**
   * The number of users the user has followed.
   */
  public followingsCount: number

  /**
   * The subscriptions of the user.
   */
  public subscriptions: [ { product: { id: string, name: string } } ]

  /**
   * The number of items the user has liked.
   */
  public likesCount: number

  /**
   * The number of time the user has reposted an item.
   */
  public repostsCount: number

  /**
   * The number of comments the user has created.
   */
  public commentsCount: number

  /**
   * The user's tracks. Only available after calling `User#fetchTracks`.
   */
  public tracks: Track[]

  /**
   * The user's playlists. Only available after calling `User#fetchPlaylists`.
   */
  public playlists: Playlist[]

  /**
   * The user's followings. Only available after calling `User#fetchFollowings`.
   */
  public followings: User[]

  /**
   * The user's followers. Only available after calling `User#fetchFollowers`.
   */
  public followers: User[]

  /**
   * The user's favorites. Only available after calling `User#fetchFavorites`.
   */
  public favorites: Track[]

  public connections: {
    id: number,
    service: string,
    title: string,
    url: string,
    username: string,
    dateCreated: Date
  }[]

  constructor (soundcloud: SoundCloud, data: any) {
    this.soundcloud = soundcloud
    this.data = data

    this._init(data)
  }

  private _init (data) {
    if (data.kind !== 'user') {
      throw new Error('Unknown type ' + data.kind)
    }

    this.likesCount = data.likes_count
    this.id = data.id

    this.username = data.username
    this.description = data.description
    this.avatarUrl = data.avatar_url
    this.lastModified = new Date(data.last_modified)
    this.url = data.permalink_url
    this.apiUrl = data.uri + '?client_id=' + this.soundcloud.clientId
    this.city = data.city
    this.favoritesCount = data.favoritings_count
    this.commentsCount = data.comments_count
    this.country = data.country
    this.firstName = data.first_name
    this.lastName = data.last_name
    this.followersCount = data.followers_count
    this.followingsCount = data.followings_count
    this.online = data.online
    this.plan = data.plan
    this.subscriptions = data.subscriptions
    this.playlistCount = data.playlist_count
    this.trackCount = data.track_count
    this.repostsCount = data.reposts_count
    this.website = {
      url: data.website,
      title: data.website_title
    }
    this.social = {
      discogs: data.discogs_name,
      myspace: data.myspace_name
    }

    return this
  }

  /**
   * Fetches the user. Only useful if you want updated user info.
   */
  async fetch () {
    const user = await this.soundcloud.getUser(this.id)
    return Object.assign(this, user)
  }

  /**
   * Fetches the user's tracks.
   * @param pages The number of pages (of 50) to fetch. May fetch less, but never more pages.
   * There may be more than 50 tracks if the resource isn't paginated.
   */
  async fetchTracks (pages: number = 1) {
    this.tracks = await this.soundcloud.getUserTracks(this.id, pages)
    return this.tracks
  }

  /**
   * Fetches the user's followers.
   * @param pages The number of pages (of 50) to fetch. May fetch less, but never more pages.
   * There may be more than 50 users if the resource isn't paginated.
   */
  async fetchFollowers (pages: number = 1) {
    this.followers = await this.soundcloud.getUserFollowers(this.id, pages)
    return this.followers
  }

  /**
   * Fetches the user's followings.
   * @param pages The number of pages (of 50) to fetch. May fetch less, but never more pages.
   * There may be more than 50 users if the resource isn't paginated.
   */
  async fetchFollowings (pages: number = 1) {
    this.followings = await this.soundcloud.getUserFollowings(this.id, pages)
    return this.followings
  }

  /**
   * Fetches the user's favorites.
   * @param pages The number of pages (of 50) to fetch. May fetch less, but never more pages.
   * There may be more than 50 tracks if the resource isn't paginated.
   */
  async fetchFavorites (pages: number = 1) {
    this.favorites = await this.soundcloud.getUserFavorites(this.id, pages)
    return this.favorites
  }

  /**
   * Fetches the user's playlists.
   * @param pages The number of pages (of 50) to fetch. May fetch less, but never more pages.
   * There may be more than 50 playlists if the resource isn't paginated.
   */
  async fetchPlaylists (pages: number = 1) {
    this.playlists = await this.soundcloud.getUserPlaylists(this.id, pages)
    return this.playlists
  }
}
