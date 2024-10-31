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
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 9090;
const API_KEY = '4E0VK7BnkdeUuh1vegAt808v2IUjzUR6lxcvBMT2';
const BASE_URL = 'https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_nWt0zMjdaiyV231agnEl29JGN2HIPjPzKfTlyUfF';
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/api/convert', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { from, to, amount } = req.query;
    try {
        const response = yield axios_1.default.get(`${BASE_URL}`, {
            params: { base_currency: from, currencies: to },
        });
        // console.log(response.data.data[to as string])
        const conversionRate = response.data.data[to];
        const convertedAmount = parseFloat(amount) * conversionRate;
        res.json({ convertedAmount, conversionRate });
    }
    catch (error) {
        console.error('Error fetching data from Currency API:', error);
        res.status(500).json({ error: 'Error fetching data' });
    }
}));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
