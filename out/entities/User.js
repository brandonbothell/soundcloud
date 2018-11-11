"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    /**
     * Fetches the user. Only useful if you want updated user info.
     */
    fetch() {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.soundcloud.getUser(this.id);
            return Object.assign(this, user);
        });
    }
    /**
     * Fetches the user's tracks.
     * @param pages The number of pages (of 50) to fetch. May fetch less, but never more pages.
     * There may be more than 50 tracks if the resource isn't paginated.
     */
    fetchTracks(pages = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            this.tracks = yield this.soundcloud.getUserTracks(this.id, pages);
            return this.tracks;
        });
    }
    /**
     * Fetches the user's followers.
     * @param pages The number of pages (of 50) to fetch. May fetch less, but never more pages.
     * There may be more than 50 users if the resource isn't paginated.
     */
    fetchFollowers(pages = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            this.followers = yield this.soundcloud.getUserFollowers(this.id, pages);
            return this.followers;
        });
    }
    /**
     * Fetches the user's followings.
     * @param pages The number of pages (of 50) to fetch. May fetch less, but never more pages.
     * There may be more than 50 users if the resource isn't paginated.
     */
    fetchFollowings(pages = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            this.followings = yield this.soundcloud.getUserFollowings(this.id, pages);
            return this.followings;
        });
    }
    /**
     * Fetches the user's favorites.
     * @param pages The number of pages (of 50) to fetch. May fetch less, but never more pages.
     * There may be more than 50 tracks if the resource isn't paginated.
     */
    fetchFavorites(pages = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            this.favorites = yield this.soundcloud.getUserFavorites(this.id, pages);
            return this.favorites;
        });
    }
    /**
     * Fetches the user's playlists.
     * @param pages The number of pages (of 50) to fetch. May fetch less, but never more pages.
     * There may be more than 50 playlists if the resource isn't paginated.
     */
    fetchPlaylists(pages = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            this.playlists = yield this.soundcloud.getUserPlaylists(this.id, pages);
            return this.playlists;
        });
    }
}
exports.User = User;
