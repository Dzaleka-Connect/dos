import { useState } from 'react';

interface TimelineEvent {
  year: number;
  title: string;
  description: string;
  details: string;
}

const timelineEvents: TimelineEvent[] = [
  {
    year: 1977,
    title: "Luwani Camp Opens",
    description: "Hosts Mozambican refugees",
    details: "Luwani Camp was opened to host Mozambican refugees during the civil war. It later hosted refugees from other nationalities until its closure in 2007."
  },
  {
    year: 1989,
    title: "Refugee Act Enacted",
    description: "Legal framework established",
    details: "Malawi ratified the UN Refugee Convention and enacted the Refugee Act, establishing a legal framework for refugee protection."
  },
  {
    year: 1994,
    title: "Dzaleka Camp Opens",
    description: "Repurposed political prison",
    details: "Dzaleka, originally a political prison, was repurposed as a refugee camp to accommodate the growing number of asylum seekers from Rwanda and Burundi after the Rwandan genocide."
  },
  {
    year: 2007,
    title: "Luwani Camp Closes",
    description: "End of an era",
    details: "Luwani Camp, which had been hosting refugees since 1977, was officially closed."
  },
  {
    year: 2018,
    title: "CRRF Adoption",
    description: "New framework signed",
    details: "Malawi signed to adopt the Comprehensive Refugee Response Framework (CRRF) under the New York Declaration."
  },
  {
    year: 2023,
    title: "Forced Re-encampment",
    description: "Urban refugees relocated",
    details: "Malawi's government began forcibly relocating refugees and asylum seekers from urban and rural areas back to Dzaleka Refugee Camp."
  },
  {
    year: 2024,
    title: "Current Situation",
    description: "Overcrowding in Dzaleka",
    details: "Dzaleka's population swelled to over 60,000 people, far exceeding its original capacity of 10,000 to 12,000 refugees."
  }
];

export function TimelineSection() {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Camp History Timeline</h3>

      <div className="relative pl-8 md:pl-0">
        <div className="absolute left-3 top-2 h-[calc(100%-1rem)] w-px bg-gray-200 md:left-1/2 md:-translate-x-1/2"></div>
        <div className="space-y-6 md:space-y-8">
          {timelineEvents.map((event, index) => (
            <div
              key={index}
              className={`relative flex md:items-center ${
                index % 2 === 0 ? 'md:justify-start' : 'md:justify-end'
              }`}
            >
              <div className="absolute left-0 top-5 md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-24 md:text-center">
                <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                  {event.year}
                </span>
              </div>

              <button
                type="button"
                className={`ml-10 w-full rounded-lg border border-gray-100 bg-white p-4 text-left shadow-sm transition-shadow hover:shadow-md md:ml-0 md:w-[calc(50%-2.5rem)] ${
                  selectedEvent?.year === event.year ? 'ring-2 ring-primary-500' : ''
                }`}
                onClick={() => setSelectedEvent(event)}
              >
                <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{event.description}</p>
              </button>
            </div>
          ))}
        </div>
      </div>

      {selectedEvent && (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-medium text-gray-900">{selectedEvent.title}</h3>
            <span className="text-sm font-medium text-primary-600">{selectedEvent.year}</span>
          </div>
          <p className="text-gray-600">{selectedEvent.details}</p>
        </div>
      )}
    </div>
  );
} 
