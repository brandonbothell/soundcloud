"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class User {
    constructor(soundcloud, data) {
        this.soundcloud = soundcloud;
        this.data = data;
        this._init(data);
    }
    _init(data) {
        if (data.kind !== 'user') {
            throw new Error('Unknown type ' + data.kind);
        }
        this.likesCount = data.likes_count;
        this.id = data.id;
        this.username = data.username;
        this.description = data.description;
        this.avatarUrl = data.avatar_url;
        this.lastModified = new Date(data.last_modified);
        this.url = data.permalink_url;
        this.apiUrl = data.uri + '?client_id=' + this.soundcloud.clientId;
        this.city = data.city;
        this.favoritesCount = data.favoritings_count;
        this.commentsCount = data.comments_count;
        this.country = data.country;
        this.firstName = data.first_name;
        this.lastName = data.last_name;
        this.followersCount = data.followers_count;
        this.followingsCount = data.followings_count;
        this.online = data.online;
        this.plan = data.plan;
        this.subscriptions = data.subscriptions;
        this.playlistCount = data.playlist_count;
        this.trackCount = data.track_count;
        this.repostsCount = data.reposts_count;
        this.website = {
            url: data.website,
            title: data.website_title
        };
        this.social = {
            discogs: data.discogs_name,
            myspace: data.myspace_name
        };
        return this;
    }
}
exports.User = User;
