import { Pie } from 'react-chartjs-2';
import '../chartConfig';

interface NationalityGroup {
  nationality: string;
  percentage: number;
  population: number;
  background: string;
}

const demographics: NationalityGroup[] = [
  {
    nationality: "Democratic Republic of Congo",
    percentage: 64.9,
    population: 35952,
    background: "Majority fled conflicts in Eastern DRC, ongoing displacement due to violence"
  },
  {
    nationality: "Burundi",
    percentage: 21.9,
    population: 12113,
    background: "Displaced by political instability and human rights concerns"
  },
  {
    nationality: "Rwanda",
    percentage: 12.6,
    population: 6960,
    background: "Long-term residents since 1994 genocide"
  },
  {
    nationality: "Somalia",
    percentage: 0.3,
    population: 161,
    background: "Fled ongoing conflict and instability"
  },
  {
    nationality: "Ethiopia",
    percentage: 0.3,
    population: 164,
    background: "Recent arrivals from conflict zones"
  },
  {
    nationality: "Other Nationalities",
    percentage: 0.1,
    population: 75,
    background: "Various African nations"
  }
];

const chartData = {
  labels: demographics.map(d => d.nationality),
  datasets: [{
    data: demographics.map(d => d.percentage),
    backgroundColor: [
      'rgba(255, 99, 132, 0.5)',
      'rgba(54, 162, 235, 0.5)',
      'rgba(255, 206, 86, 0.5)',
      'rgba(75, 192, 192, 0.5)',
      'rgba(153, 102, 255, 0.5)',
      'rgba(255, 159, 64, 0.5)'
    ],
    borderColor: [
      'rgb(255, 99, 132)',
      'rgb(54, 162, 235)',
      'rgb(255, 206, 86)',
      'rgb(75, 192, 192)',
      'rgb(153, 102, 255)',
      'rgb(255, 159, 64)'
    ],
    borderWidth: 1
  }]
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        padding: 20,
        font: { size: 14 }
      }
    },
    title: {
      display: true,
      text: 'Nationality Distribution',
      padding: 20
    }
  }
};

export function DemographicsSection() {
  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <div className="h-[320px] w-full max-w-4xl sm:h-[420px]">
          <Pie options={chartOptions} data={chartData} />
        </div>
      </div>
      
      <div className="space-y-4">
        {demographics.map((group, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">{group.nationality}</h3>
              <div className="text-right">
                <span className="text-sm font-medium text-primary-600">{group.percentage}%</span>
                <span className="text-sm text-gray-500 ml-2">({group.population.toLocaleString()})</span>
              </div>
            </div>
            <p className="text-gray-600 mt-2">{group.background}</p>
          </div>
        ))}
        <p className="text-sm text-gray-500 mt-4 pt-4 border-t border-gray-100 italic">
          Source: UNHCR Malawi Fact Sheet - August 2024
        </p>
      </div>
    </div>
  );
}
