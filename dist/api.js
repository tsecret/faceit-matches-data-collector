"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDomain = exports.updateWebhooksSettings = exports.getWebhooksSettings = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("./config"));
const headers = { "Authorization": `Bearer ${config_1.default.FACEIT_AUTH_TOKEN}` };
const getWebhooksSettings = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield axios_1.default.get('https://api.faceit.com/webhooks/v1/subscriptions', { params: { app_id: config_1.default.FACEIT_APP_ID }, headers })
        .then((response) => response.data.payload[0])
        .catch((error) => { console.log("getWebhooksSettings error:", error.response.data); });
});
exports.getWebhooksSettings = getWebhooksSettings;
// Webhooks id, new settings
const updateWebhooksSettings = (settings) => __awaiter(void 0, void 0, void 0, function* () {
    return yield axios_1.default.put(`https://api.faceit.com/webhooks/v1/subscriptions/${settings.id}`, settings, { headers })
        .then((response) => response.data.payload)
        .catch((error) => { console.log("updateWebhooksSettings error", error.response.data); });
});
exports.updateWebhooksSettings = updateWebhooksSettings;
const updateDomain = (domain) => __awaiter(void 0, void 0, void 0, function* () {
    const settings = yield exports.getWebhooksSettings();
    settings.url = `https://${domain}.loca.lt/webhooks/add`;
    return yield exports.updateWebhooksSettings(settings);
});
exports.updateDomain = updateDomain;
