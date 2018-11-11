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
        return this.getItemById('user', id);
    }
    /**
     * Get a track object from the ID of a track.
     * @param id The ID of the track.
     */
    getTrack(id) {
        return this.getItemById('track', id);
    }
    /**
     * Get a playlist object from the ID of a playlist.
     * @param id The ID of the playlist.
     */
    getPlaylist(id) {
        return this.getItemById('playlist', id);
    }
    /**
     * Get a user object from the url of a user.
     * @param url The url of the user.
     */
    getUserByUrl(url) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.resolve('user', url);
        });
    }
    /**
     * Get a track object from the url of a track.
     * @param url The url of the track.
     */
    getTrackByUrl(url) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.resolve('track', url);
        });
    }
    /**
     * Get a playlist object from the url of a playlist.
     * @param url The url of the playlist.
     */
    getPlaylistByUrl(url) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.resolve('playlist', url);
        });
    }
    getPlaylistTracks(playlistId) {
        return __awaiter(this, void 0, void 0, function* () {
            const tracks = [];
            const results = yield util_1.request.api('playlists/' + playlistId + '/tracks', {
                client_id: this.clientId
            });
            results.forEach(track => {
                tracks.push(new entities_1.Track(this, track));
            });
            return tracks;
        });
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
                const found = itemsApi.filter(item => item.permalink === searchTerm);
                if (found.length > 0) {
                    if (type === 'tracks') {
                        found.forEach(item => items.push(new entities_1.Track(this, item)));
                    }
                    else if (type === 'playlists') {
                        found.forEach(item => items.push(new entities_1.Playlist(this, item)));
                    }
                    else {
                        return Promise.reject('Incompatible type with author: ' + type);
                    }
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
}
exports.SoundCloud = SoundCloud;
