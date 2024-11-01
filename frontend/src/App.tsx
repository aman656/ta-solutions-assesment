import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
// const apiUrl = process.env.REACT_APP_API_BASE_URL
const apiUrl = "https://ta-solutions-assesment.vercel.app"

interface ConversionRecord {
  id: number;
  fromCurrency: string;
  toCurrency: string;
  amount: number;
  convertedAmount: number;
  conversionRate: number;
  date: string;
}
const currecyList = [
  "EUR","USD","JPY","BGN","CZK","DKK","GBP","HUF","PLN","RON","SEK","CHF","ISK","NOK","HRK","RUB","TRY","AUD","BRL","CAD","CNY","HKD","IDR","ILS","INR","KRW","MXN","MYR","NZD","PHP","SGD","THB","ZHR"
]

const App: React.FC = () => {
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [amount, setAmount] = useState<number>(1);
  const [conversionRate, setConversionRate] = useState<number | null>(null);
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [conversionHistory, setConversionHistory] = useState<ConversionRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const savedHistory = localStorage.getItem('conversionHistory');
    if (savedHistory) {
      setConversionHistory(JSON.parse(savedHistory));
    }
  }, []);

  const handleConvert = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/api/convert`, {
        params: { from: fromCurrency, to: toCurrency, amount }
      });
      const { convertedAmount, conversionRate } = response.data;

      setConversionRate(conversionRate);
      setConvertedAmount(convertedAmount);

      const newRecord: ConversionRecord = {
        id: conversionHistory.length + 1,
        fromCurrency,
        toCurrency,
        amount,
        convertedAmount,
        conversionRate,
        date: new Date().toLocaleString(),
      };

      const updatedHistory = [...conversionHistory, newRecord];
      setConversionHistory(updatedHistory);
      localStorage.setItem('conversionHistory', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error("Conversion error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Currency Converter</h2>
      <div className="form-group mb-3">
        <label>From Currency:</label>
        <select
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
          className="form-control"
        >
          <option value="" disabled>Select currency</option>
          {currecyList.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group mb-3">
        <label>To Currency:</label>
        <select
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
          className="form-control"
        >
          <option value="" disabled>Select currency</option>
          {currecyList.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group mb-3">
        <label>Amount:</label>
        <input type="number" className="form-control" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
      </div>
      <button className="btn btn-primary" style={{width:"100%",marginTop:"20px"}} onClick={handleConvert}>
        {loading ? "Wait..." : "Convert"}
      </button>
      {convertedAmount && (
        <div className="mt-3">
          <h4>Converted Amount: {convertedAmount} {toCurrency}</h4>
          <p>Conversion Rate: 1 {fromCurrency} = {conversionRate} {toCurrency}</p>
        </div>
      )}
      <hr />
      <h4> History</h4>
      <ul className="list-group">
        {conversionHistory.map(record => (
          <li key={record.id} className="list-group-item">
            {record.amount} {record.fromCurrency} to {record.toCurrency} = {record.convertedAmount} at {record.date}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
