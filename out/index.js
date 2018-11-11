"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const entities_1 = require("./entities");
const util_1 = require("./util");
__export(require("./entities"));
/**
 * The main class used to interact with the SoundCloud API. Use this.
 */
class SoundCloud {
    /**
     *
     * @param clientId Your SoundCloud client ID. Don't share this with anybody.
     */
    constructor(clientId) {
        this.clientId = clientId;
    }
    /**
     * Search users on SoundCloud.
     * @param username What to search for on SoundCloud.
     */
    searchUsers(username) {
        return this.search('users', username);
    }
    /**
     * Search videos on SoundCloud.
     * @param searchTerm What to search for on SoundCloud.
     * @param author The author of the video.
     */
    searchTracks(searchTerm, author) {
        return this.search('tracks', searchTerm, author);
    }
    /**
     * Search playlists on SoundCloud.
     * @param searchTerm What to search for on SoundCloud.
     * @param author The author of the playlist.
     */
    searchPlaylists(searchTerm, author) {
        return this.search('playlists', searchTerm, author);
    }
    /**
     * Get a user object from the ID of a user.
     * @param id The ID of the user.
     */
    getUser(id) {
        return this.getItemById('user', String(id));
    }
    /**
     * Get a track object from the ID of a track.
     * @param id The ID of the track.
     */
    getTrack(id) {
        return this.getItemById('track', String(id));
    }
    /**
     * Get a playlist object from the ID of a playlist.
     * @param id The ID of the playlist.
     */
    getPlaylist(id) {
        return this.getItemById('playlist', String(id));
    }
    /**
     * Get a user object from the url of a user.
     * @param url The url of the user.
     */
    getUserByUrl(url) {
        return this.resolve('user', url);
    }
    /**
     * Get a track object from the url of a track.
     * @param url The url of the track.
     */
    getTrackByUrl(url) {
        return this.resolve('track', url);
    }
    /**
     * Get a playlist object from the url of a playlist.
     * @param url The url of the playlist.
     */
    getPlaylistByUrl(url) {
        return this.resolve('playlist', url);
    }
    /**
     * Fetches a user's tracks.
     * @param userId The ID of the user.
     * @param pages The number of pages (of 50) to fetch. May fetch less, but never more pages.
     * There may be more than 50 tracks if the resource isn't paginated.
     */
    getUserTracks(userId, pages = 1) {
        return this.getSubresource('user', userId, 'tracks', pages);
    }
    /**
     * Fetches a playlist's tracks.
     * @param playlistId The ID of the playlist.
     * @param pages The number of pages (of 50) to fetch. May fetch less, but never more pages.
     * There may be more than 50 tracks if the resource isn't paginated.
     */
    getPlaylistTracks(playlistId, pages = 1) {
        return this.getSubresource('playlist', playlistId, 'tracks', pages);
    }
    /**
     * Fetches a user's followers.
     * @param userId The ID of the user.
     * @param pages The number of pages (of 50) to fetch. May fetch less, but never more pages.
     * There may be more than 50 users if the resource isn't paginated.
     */
    getUserFollowers(userId, pages = 1) {
        return this.getSubresource('user', userId, 'followers', pages);
    }
    /**
     * Fetches a user's followings.
     * @param userId The ID of the user.
     * @param pages The number of pages (of 50) to fetch. May fetch less, but never more pages.
     * There may be more than 50 users if the resource isn't paginated.
     */
    getUserFollowings(userId, pages = 1) {
        return this.getSubresource('user', userId, 'followings', pages);
    }
    /**
     * Fetches a user's favorites.
     * @param userId The ID of the user.
     * @param pages The number of pages (of 50) to fetch. May fetch less, but never more pages.
     * There may be more than 50 tracks if the resource isn't paginated.
     */
    getUserFavorites(userId, pages = 1) {
        return this.getSubresource('user', userId, 'favorites', pages);
    }
    /**
     * Fetches the user's playlists.
     * @param userId The ID of the user.
     * @param pages The number of pages (of 50) to fetch. May fetch less, but never more pages.
     * There may be more than 50 playlists if the resource isn't paginated.
     */
    getUserPlaylists(userId, pages = 1) {
        return this.getSubresource('user', userId, 'playlists', pages);
    }
    search(type, searchTerm, author) {
        return __awaiter(this, void 0, void 0, function* () {
            const items = [];
            if (author) {
                const loc = (yield util_1.request.api('resolve', {
                    url: 'https://soundcloud.com/' + author + '/' + type === 'tracks' ? type : type === 'playlists' ? 'sets' : undefined,
                    client_id: this.clientId
                })).location;
                const itemsApi = yield util_1.request.api(loc, {
                    client_id: this.clientId
                });
                let found = itemsApi.filter(item => item.permalink === searchTerm);
                if (found.length === 0) {
                    found = itemsApi.filter(item => item.permalink.includes(searchTerm));
                }
                if (type === 'tracks') {
                    found.forEach(item => items.push(new entities_1.Track(this, item)));
                }
                else if (type === 'playlists') {
                    found.forEach(item => items.push(new entities_1.Playlist(this, item)));
                }
                else {
                    return Promise.reject('Incompatible type with author: ' + type);
                }
                if (items.length > 0) {
                    return items;
                }
            }
            const results = yield util_1.request.api(type, {
                q: searchTerm,
                client_id: this.clientId
            });
            results.forEach(item => {
                switch (type) {
                    case 'tracks':
                        items.push(new entities_1.Track(this, item));
                        break;
                    case 'playlists':
                        items.push(new entities_1.Playlist(this, item));
                        break;
                    case 'users':
                        items.push(new entities_1.User(this, item));
                        break;
                    default:
                        return Promise.reject('Type must be tracks or playlists');
                }
            });
            return items;
        });
    }
    getItemById(type, id) {
        return __awaiter(this, void 0, void 0, function* () {
            let result;
            result = yield util_1.request.api(type + 's/' + id, {
                client_id: this.clientId
            });
            switch (type) {
                case 'track':
                    return new entities_1.Track(this, result);
                case 'playlist':
                    return new entities_1.Playlist(this, result);
                case 'user':
                    return new entities_1.User(this, result);
                default:
                    return Promise.reject('Type must be a track, playlist, or user');
            }
        });
    }
    resolve(type, url) {
        return __awaiter(this, void 0, void 0, function* () {
            const loc = (yield util_1.request.api('resolve', {
                url,
                client_id: this.clientId
            })).location;
            const result = yield util_1.request.get(loc);
            switch (type) {
                case 'track':
                    return new entities_1.Track(this, result);
                case 'playlist':
                    return new entities_1.Playlist(this, result);
                case 'user':
                    return new entities_1.User(this, result);
                default:
                    return Promise.reject('Type must be a track, playlist, or user');
            }
        });
    }
    getSubresource(item, itemId, subresource, pages = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            const items = [];
            let results = yield util_1.request.api(item + 's/' + itemId + '/' + subresource, {
                client_id: this.clientId
            });
            if (results.collection) {
                if (pages <= 1) {
                    results = results.collection;
                }
                else {
                    for (let i = 0; i < pages - 1; i++) {
                        if (results.next_href) {
                            results.collection.push(...((yield util_1.request.get(results.next_href)).collection));
                        }
                        else {
                            break;
                        }
                    }
                    results = results.collection;
                }
            }
            results.forEach(item => {
                switch (subresource) {
                    case 'favorites':
                    case 'tracks':
                        items.push(new entities_1.Track(this, item));
                        break;
                    case 'playlists':
                        items.push(new entities_1.Playlist(this, item));
                        break;
                    case 'followings':
                    case 'followers':
                        items.push(new entities_1.User(this, item));
                        break;
                    case 'web-profiles':
                        items.push({
                            id: item.id,
                            service: item.service,
                            title: item.title,
                            url: item.url,
                            username: item.username,
                            dateCreated: new Date(item.created_at)
                        });
                        break;
                }
            });
            return items;
        });
    }
}
exports.SoundCloud = SoundCloud;
