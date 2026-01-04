import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getAreaTransactions } from "~/api/area.service";
import { formatPrice } from "~/utils/formatPrice";

type AreaTransactionData = {
  month: string;
  month_label: string;
  total_transactions: number;
  average_price_per_sqft: number;
  average_area_sqft: number;
  average_price: number;
  total_price: number;
  total_area: number;
};

type AreaTransactionsResponse = {
  success: boolean;
  area_name: string;
  total_transactions: number;
  data: AreaTransactionData[];
};

type Props = {
  community?: string;
};

export default function AveragePrices({ community }: Props) {
  const [chartData, setChartData] = useState<AreaTransactionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!community) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = (await getAreaTransactions(community)) as AreaTransactionsResponse;
        
        if (response.success && response.data && response.data.length > 0) {
          setChartData(response.data);
        } else {
          setChartData([]);
        }
      } catch (err) {
        console.error("Error fetching area transactions:", err);
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [community]);

  if (!community || loading || chartData.length === 0) {
    return null;
  }

  const formatCurrency = (value: number) => {
    return formatPrice(value);
  };

  const chartDataFormatted = chartData.map((item) => ({
    ...item,
    monthShort: item.month_label.split(" ")[0],
    averagePriceFormatted: formatCurrency(item.average_price),
  }));

  return (
    <div className="flex flex-col items-center gap-[22px] w-full max-w-[1080px] mx-auto mt-[75px] px-4">
      <p className="text-[36px] font-semibold">Average Prices Over Time</p>
      <div className="w-full" style={{ minHeight: "400px" }}>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartDataFormatted} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="monthShort" 
              stroke="#666"
              style={{ fontSize: "12px" }}
            />
            <YAxis 
              stroke="#666"
              style={{ fontSize: "12px" }}
              tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
              formatter={(value: number) => formatCurrency(value)}
              labelFormatter={(label) => {
                const item = chartDataFormatted.find((d) => d.monthShort === label);
                return item?.month_label || label;
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="average_price"
              stroke="#C6A45A"
              strokeWidth={2}
              dot={{ fill: "#C6A45A", r: 4 }}
              activeDot={{ r: 6 }}
              name="Average Price (AED)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}