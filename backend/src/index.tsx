import express, { Request, Response } from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 9090;
const API_KEY = '4E0VK7BnkdeUuh1vegAt808v2IUjzUR6lxcvBMT2';
const BASE_URL = 'https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_nWt0zMjdaiyV231agnEl29JGN2HIPjPzKfTlyUfF';

app.use(cors());
app.use(express.json());


app.get('/api/convert', async (req: Request, res: Response) => {
  const { from, to, amount } = req.query;

  try {
    const response = await axios.get(`${BASE_URL}`, {
      params: { base_currency: from, currencies: to },
    });
    // console.log(response.data.data[to as string])
    const conversionRate = response.data.data[to as string];
    const convertedAmount = parseFloat(amount as string) * conversionRate;
    
    res.json({ convertedAmount, conversionRate });
  } catch (error) {
    console.error('Error fetching data from Currency API:', error);
    res.status(500).json({ error: 'Error fetching data' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
