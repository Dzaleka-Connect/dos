import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const news = [
    {
      id: 1,
      title: "Refugee Entrepreneurship Boosts Local Economy",
      content: "Refugees have transformed local commerce through reliable shops and extended business hours. Their initiatives have created sustainable employment for thousands of Malawians.",
      date: new Date().toISOString(),
      source: "Dzaleka Economic Report",
      url: "https://hub.dzaleka.com/economic-impact"
    },
    {
      id: 2,
      title: "Agricultural Partnerships Flourish",
      content: "Successful partnerships between refugees and Malawian landowners in Dowa District have revolutionized tomato farming and boosted soya and groundnut production.",
      date: new Date().toISOString(),
      source: "Agricultural Development Office",
      url: "https://hub.dzaleka.com/agriculture"
    },
    {
      id: 3,
      title: "Healthcare Challenges at Camp Clinic",
      content: "The camp's single clinic, operated by the Ministry of Health, faces challenges serving over 70,000 people. Private refugee-owned pharmacies help fill some gaps.",
      date: new Date().toISOString(),
      source: "Health Services Report",
      url: "https://hub.dzaleka.com/health"
    },
    {
      id: 4,
      title: "Education System Under Pressure",
      content: "Schools face overcrowding and resource shortages. Limited secondary education opportunities, with some hope through scholarships and distance learning programs.",
      date: new Date().toISOString(),
      source: "Education Office",
      url: "https://hub.dzaleka.com/education"
    }
  ];

  return new Response(JSON.stringify(news), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
