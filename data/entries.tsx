// app/data/entries.ts
export interface Entry {
    id: string;
    date: string;
    title: string;
    location: string;
    images: string[];
    description: string;
    objects: string[];
    visibility: string;
    time: string;
  }
  
  export const dummyEntries: Entry[] = [
    {
      id: '1',
      date: '2024-06-15',
      title: 'Jupiter Sighting',
      location: 'Backyard',
      images: ['https://placekitten.com/100/100'],
      description: 'Saw Jupiter through the telescope!',
      objects: ['Jupiter'],
      visibility: 'Clear',
      time: '22:00',
    },
    {
      id: '2',
      date: '2024-06-10',
      title: 'Saturn Rings',
      location: 'Park',
      images: [],
      description: 'Saturn’s rings were visible tonight.',
      objects: ['Saturn'],
      visibility: 'Partly Cloudy',
      time: '21:30',
    },
    // Add more entries as needed
  ];