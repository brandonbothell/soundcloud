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
 * A SoundCloud track.
 */
class Track {
    constructor(soundcloud, data) {
        this.soundcloud = soundcloud;
        this.data = data;
        this._init(data);
    }
    _init(data) {
        if (data.kind !== 'track') {
            throw new Error('Unknown type ' + data.kind);
        }
        this._length = data.duration;
        this.minutes = Math.floor(this._length / 1000 / 60);
        this.seconds = Number((60 * ((this._length / 1000 / 60) % 1)).toFixed(2));
        this.id = data.id;
        this.title = data.title;
        this.description = data.description;
        this.artwork = data.artwork_url;
        this.datePublished = new Date(data.created_at);
        this.url = data.permalink_url;
        this.streamUrl = data.stream_url + '?client_id=' + this.soundcloud.clientId;
        this.genre = data.genre;
        this.favorites = data.favoritings_count;
        this.tags = util_1.parseTags(data.tag_list);
        this.user = {
            id: data.user.id,
            kind: data.user.kind,
            avatarUrl: data.user.avatar_url,
            apiUrl: data.user.uri + '?client_id=' + this.soundcloud.clientId,
            lastModified: new Date(data.user.lastModified),
            permalink: data.user.permalink_url,
            username: data.user.username
        };
        return this;
    }
    /**
     * Fetches this track and reassigns this object to the new track object.
     * Only useful if you want updated track info.
     */
    fetch() {
        return __awaiter(this, void 0, void 0, function* () {
            const track = yield this.soundcloud.getTrack(this.id);
            return Object.assign(this, track);
        });
    }
}
exports.Track = Track;
