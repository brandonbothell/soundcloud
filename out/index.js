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
     * Search videos on SoundCloud.
     * @param searchTerm What to search for on SoundCloud.
     */
    searchTracks(searchTerm) {
        return this.search('tracks', searchTerm);
    }
    /**
     * Search playlists on SoundCloud.
     * @param searchTerm What to search for on SoundCloud.
     */
    searchPlaylists(searchTerm) {
        return this.search('playlists', searchTerm);
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
     * Get a track object from the url of a track.
     * @param url The url of the track.
     */
    getTrackByUrl(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = util_1.parseUrl(url);
            if (!id.track) {
                return Promise.reject('Not a valid video url');
            }
            return (yield this.searchTracks(id.track))[0];
        });
    }
    /**
     * Get a playlist object from the url of a playlist.
     * @param url The url of the playlist.
     */
    getPlaylistByUrl(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = util_1.parseUrl(url);
            if (!id.playlist) {
                return Promise.reject('Not a valid playlist url');
            }
            return (yield this.searchPlaylists(id.playlist))[0];
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
    search(type, searchTerm) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield util_1.request.api(type, {
                q: encodeURIComponent(searchTerm),
                client_id: this.clientId
            });
            const items = [];
            results.forEach(item => {
                switch (type) {
                    case 'tracks':
                        items.push(new entities_1.Track(this, item));
                        break;
                    case 'playlists':
                        items.push(new entities_1.Playlist(this, item));
                        break;
                    default:
                        throw new Error('Type must be tracks or playlists');
                }
            });
            return items;
        });
    }
    getItemById(type, id) {
        return __awaiter(this, void 0, void 0, function* () {
            let result;
            if (type === 'track') {
                result = yield util_1.request.api('tracks/' + id, {
                    client_id: this.clientId
                });
            }
            else if (type === 'playlist') {
                result = yield util_1.request.api('playlists/' + id, {
                    client_id: this.clientId
                });
            }
            switch (type) {
                case 'track':
                    return new entities_1.Track(this, result);
                case 'playlist':
                    return new entities_1.Playlist(this, result);
                default:
                    throw new Error('Type must be a track or playlist');
            }
        });
    }
}
exports.SoundCloud = SoundCloud;
