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
const util_1 = require("../util");
/**
 * A SoundCloud playlist.
 */
class Playlist {
    constructor(soundcloud, data) {
        this.soundcloud = soundcloud;
        this.data = data;
        this._init(data);
    }
    _init(data) {
        if (data.kind !== 'playlist') {
            throw new Error(`Invalid playlist type: ${data.kind}`);
        }
        this.id = data.id;
        this.genre = data.genre;
        this.length = data.track_count;
        this.description = data.description;
        this.title = data.title;
        this.dateCreated = new Date(data.created_at);
        this.tags = util_1.parseTags(data.tag_list);
        this.artwork = data.artwork_url;
        this.url = data.permalink_url;
        this.user = {
            id: data.user.id,
            kind: data.user.kind,
            avatarUrl: data.user.avatar_url,
            apiUrl: data.user.uri + '?client_id=' + this.soundcloud.clientId,
            lastModified: new Date(data.user.lastModified),
            permalink: data.user.permalink_url,
            username: data.user.username
        };
    }
    /**
     * Fetches this playlist and reassigns this object to the new playlist object.
     * Only useful if you want updated playlist info.
     */
    fetch() {
        return __awaiter(this, void 0, void 0, function* () {
            const playlist = yield this.soundcloud.getPlaylist(this.id);
            return Object.assign(this, playlist);
        });
    }
    /**
     * Fetches all of the tracks in this playlist, and
     * assigns them to `Playlist#tracks`.
     */
    fetchTracks() {
        return __awaiter(this, void 0, void 0, function* () {
            const tracks = yield this.soundcloud.getPlaylistTracks(this.id);
            this.tracks = tracks;
            return tracks;
        });
    }
}
exports.Playlist = Playlist;
