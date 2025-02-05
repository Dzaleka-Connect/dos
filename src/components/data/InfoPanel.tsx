import React from 'react';

interface InfoItem {
  title: string;
  content: string[];
  source?: string;
}

const infoData: Record<string, InfoItem> = {
  overview: {
    title: "Dzaleka Refugee Camp Overview",
    content: [
      "Established in 1994 in response to the Rwandan genocide and conflicts in Burundi and DRC",
      "Located in Dowa District, about 45km north of Lilongwe, Malawi's capital",
      "Originally designed for 10,000-12,000 refugees, now hosts over 60,000 people",
      "Faces significant challenges with overcrowding and limited resources",
      "Home to diverse entrepreneurial activities and small businesses",
      "Supported by UNHCR, WFP, and various NGOs providing essential services"
    ],
    source: "Dzaleka Refugee Information Hub, 2024"
  },
  incidents: {
    title: "Recent Major Events (2022-2024)",
    content: [
      "November 22, 2022: Unrest at Dzaleka Camp over distribution of aid materials",
      "December 14, 2022: Grenade attack on Burundian community leader Butoyi Fideli",
      "May 17, 2023: Forced relocation of urban refugees back to Dzaleka Camp",
      "July 17, 2024: Malawi Defence Force raid targeting suspected human traffickers",
      "October 12, 2024: Second widespread raid resulting in arrests and injuries"
    ],
    source: "Dzaleka Camp Security Reports, 2022-2024"
  },
  stakeholders: {
    title: "Key Stakeholders in Refugee Management",
    content: [
      "Government of Malawi: Responsible for policy development and enforcement of refugee laws",
      "UNHCR: Provides protection, assistance, and coordinates humanitarian efforts",
      "Implementing Partners: Contracted organizations delivering direct services",
      "Cooperating Partners: Organizations focusing on specific aspects, approved by Ministry",
      "Community-Based Organizations: Refugee-led initiatives providing essential services",
      "Donors: Governments and organizations providing funding support"
    ],
    source: "UNHCR Malawi Operations Report 2024"
  },
  economic: {
    title: "Economic Impact of Refugees",
    content: [
      "Refugees have transformed local commerce with reliable and affordable shops",
      "Partnerships with local landowners have revolutionized agriculture in Dowa District",
      "Refugee-led initiatives have created jobs for thousands of Malawians",
      "Skills transfer has helped fill gaps in education and various sectors",
      "Despite restrictive laws, refugees contribute significantly to local economy"
    ],
    source: "Dzaleka Economic Impact Assessment 2024"
  },
  healthcare: {
    title: "Healthcare Challenges and Services",
    content: [
      "One main clinic serving over 70,000 people, operated by Ministry of Health",
      "Severe shortage of medical staff and resources",
      "Limited access to specialized care and treatment for chronic conditions",
      "Presence of refugee-owned private pharmacies and medical services",
      "Ongoing challenges with medicine supply and emergency care"
    ],
    source: "Dzaleka Health Services Report 2024"
  },
  malawi: {
    title: "Refugee Context in Malawi",
    content: [
      "Malawi has been hosting refugees since the 1970s, with Dzaleka camp established in 1994 in response to the influx of refugees from Rwanda, Burundi, and the Democratic Republic of Congo (DRC).",
      "The camp was originally designed to accommodate 10,000-12,000 people but now hosts over 52,000 refugees and asylum seekers.",
      "Malawi maintains an encampment policy, requiring refugees to live in designated camps, primarily Dzaleka.",
      "The government provides land for the camp while UNHCR and partners provide protection and assistance."
    ],
    source: "UNHCR Malawi Operations Report 2024"
  },
  regional: {
    title: "Regional Refugee Situation",
    content: [
      "The East and Southern African region hosts over 5 million refugees and asylum seekers.",
      "Tanzania leads the region in refugee hosting, with established camps like Nyarugusu, Nduta, and Mtendeli.",
      "Zambia hosts refugees in settlements like Meheba and Mayukwayukwa, promoting local integration.",
      "Zimbabwe and Mozambique have smaller refugee populations but face challenges with internal displacement.",
      "Regional cooperation frameworks exist to address refugee protection and solutions."
    ],
    source: "UNHCR Regional Update 2024"
  },
  demographics: {
    title: "Camp Demographics & Community",
    content: [
      "The DRC community (62%) faces ongoing displacement due to conflict in Eastern DRC.",
      "Burundian refugees (19%) have seen both new arrivals and returns since 2015.",
      "The Rwandan community (7%) includes long-term residents since 1994.",
      "Growing Somali (5%) and Ethiopian (4%) communities reflect newer displacement trends.",
      "The camp has a young population, with over 60% under the age of 25.",
      "Women and children make up approximately 70% of the camp population."
    ],
    source: "Dzaleka Camp Demographics Report 2024"
  },
  education: {
    title: "Education & Skills Development",
    content: [
      "Dzaleka Community Secondary School is the main secondary education provider.",
      "Jesuit Worldwide Learning (JWL) offers higher education opportunities through online programs.",
      "There's a significant teacher shortage with ratios exceeding 1:100 in some classes.",
      "Vocational training programs include tailoring, carpentry, and IT skills.",
      "Language barriers and certification recognition remain major challenges.",
      "Adult education focuses on literacy, numeracy, and life skills.",
      "Several youth programs combine education with sports and arts."
    ],
    source: "UNHCR Education Report 2024"
  },
  infrastructure: {
    title: "Infrastructure & Services",
    content: [
      "Water supply is limited to 15-20 liters per person per day, below UNHCR standards.",
      "The camp has one main health center and several health posts, operating beyond capacity.",
      "Housing consists mainly of self-built structures, with severe overcrowding.",
      "Limited electricity access affects education, business, and safety.",
      "Sanitation facilities are strained, with some areas lacking proper waste management.",
      "Road infrastructure within the camp needs significant improvement.",
      "Internet connectivity is available but limited, supporting online education and communication."
    ],
    source: "Camp Infrastructure Assessment 2024"
  },
  foodSecurity: {
    title: "Food Security & Livelihoods",
    content: [
      "WFP provides food assistance through a combination of in-kind food and cash transfers.",
      "Recent funding cuts led to 50% ration reductions affecting most camp residents.",
      "Some refugees have developed small-scale agriculture projects where possible.",
      "Market activities within the camp provide additional food sources and income.",
      "Community support systems help the most vulnerable access food.",
      "Malnutrition monitoring programs focus on children under 5 and pregnant women.",
      "Food security is closely linked to protection concerns, particularly for women and girls."
    ],
    source: "WFP Malawi Food Security Report 2024"
  },
  protection: {
    title: "Protection & Community Services",
    content: [
      "Protection services focus on documentation, legal assistance, and SGBV prevention.",
      "Child protection mechanisms include foster care arrangements and youth programs.",
      "Community leadership structures represent different nationalities and groups.",
      "Mental health and psychosocial support services are available but limited.",
      "Women's centers provide safe spaces and empowerment programs.",
      "Security is managed through cooperation between camp authorities and refugee leaders.",
      "Registration and documentation processes are ongoing to maintain accurate data."
    ],
    source: "UNHCR Protection Update 2024"
  }
};

interface InfoPanelProps {
  activeChart: string;
}

export function InfoPanel({ activeChart }: InfoPanelProps) {
  const info = infoData[activeChart] || infoData.overview;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-full">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">{info.title}</h3>
      <div className="space-y-3">
        {info.content.map((text, index) => (
          <p key={index} className="text-sm text-gray-600 leading-relaxed">
            {text}
          </p>
        ))}
      </div>
      {info.source && (
        <p className="text-xs text-gray-500 mt-6 pt-4 border-t border-gray-100 italic">
          Source: {info.source}
        </p>
      )}
    </div>
  );
}
