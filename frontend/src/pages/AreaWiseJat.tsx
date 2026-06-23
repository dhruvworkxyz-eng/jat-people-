import React, { useEffect, useMemo, useState } from 'react';
import {
  FaEnvelope,
  FaLocationArrow,
  FaMapMarkedAlt,
  FaPaperPlane,
  FaPhoneAlt,
  FaReply,
  FaSearch,
  FaTimes,
  FaWhatsapp
} from 'react-icons/fa';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SearchBar from '../components/SearchBar';
import { getCurrentUser } from '../utils/authStorage';
import './AreaWiseJat.css';

const LOCAL_SIGNUPS_KEY = 'jat-people-signups';

type AreaLevel = 'country' | 'state' | 'district' | 'tehsil' | 'place' | 'block';

type AreaNode = {
  name: string;
  type: AreaLevel;
  count?: string;
  description?: string;
  children?: AreaNode[];
};

type ChatMessage = {
  id: number;
  sender: 'me' | 'member';
  text: string;
};

type RegisteredMember = {
  id?: string;
  name?: string;
  email?: string;
  placeType?: string;
  placeName?: string;
  area?: string;
  tehsil?: string;
  block?: string;
  district?: string;
  city?: string;
  state?: string;
  country?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
};

type AlipurSampleMember = RegisteredMember & {
  id: string;
  name: string;
  gotra: string;
  profession: string;
  familyCount: number;
  distance: string;
  phone: string;
  contactNote: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  mapPosition: {
    x: number;
    y: number;
  };
};

const districtNodes = (names: string[]): AreaNode[] => names.map(name => ({ name, type: 'district' }));
const stateNodes = (names: string[]): AreaNode[] => names.map(name => ({ name, type: 'state' }));
const normalize = (value: string) => value.trim().toLowerCase();
const alipurMapBounds = {
  north: 28.875,
  south: 28.735,
  east: 77.19,
  west: 77.02
};

const clampPercent = (value: number) => Math.max(2, Math.min(98, value));

const getAlipurPinPosition = (member: AlipurSampleMember) => ({
  left: `${clampPercent(((member.coordinates.lng - alipurMapBounds.west) / (alipurMapBounds.east - alipurMapBounds.west)) * 100)}%`,
  top: `${clampPercent(((alipurMapBounds.north - member.coordinates.lat) / (alipurMapBounds.north - alipurMapBounds.south)) * 100)}%`
});

const getChatStorageKey = (member: RegisteredMember) =>
  `jat-people-area-chat-${normalize(member.id || member.name || 'registered-member')}`;

const getDefaultMessages = (member: RegisteredMember): ChatMessage[] => [
  {
    id: 1,
    sender: 'member',
    text: `Namaste, this is ${member.name || 'a registered member'}. You can send me a message here.`
  }
];

const loadSavedMessages = (member: RegisteredMember) => {
  try {
    const savedMessages = window.localStorage.getItem(getChatStorageKey(member));
    if (!savedMessages) {
      return getDefaultMessages(member);
    }

    const parsedMessages = JSON.parse(savedMessages);
    if (!Array.isArray(parsedMessages)) {
      return getDefaultMessages(member);
    }

    return parsedMessages.filter(
      (message): message is ChatMessage =>
        typeof message?.id === 'number' &&
        (message.sender === 'me' || message.sender === 'member') &&
        typeof message.text === 'string'
    );
  } catch {
    return getDefaultMessages(member);
  }
};

const areaHierarchy: AreaNode[] = [
  {
    name: 'India',
    type: 'country',
    count: '11.3M+',
    description: 'Largest regional network with historic Jat communities across northern and western India.',
    children: [
      {
        name: 'Haryana',
        type: 'state',
        count: '2.5M+',
        children: [
          {
            name: 'Rohtak',
            type: 'district',
            children: [
              {
                name: 'Sampla',
                type: 'tehsil',
                children: [
                  {
                    name: 'Ismaila',
                    type: 'place',
                    children: [
                      { name: 'Ismaila Block 1', type: 'block', count: '42 families' },
                      { name: 'Ismaila Block 2', type: 'block', count: '38 families' }
                    ]
                  },
                  {
                    name: 'Kheri Sampla',
                    type: 'place',
                    children: [
                      { name: 'Kheri North Block', type: 'block', count: '31 families' },
                      { name: 'Kheri South Block', type: 'block', count: '27 families' }
                    ]
                  }
                ]
              },
              {
                name: 'Maham',
                type: 'tehsil',
                children: [
                  {
                    name: 'Maham Town',
                    type: 'place',
                    children: [
                      { name: 'Ward Block A', type: 'block', count: '58 families' },
                      { name: 'Ward Block B', type: 'block', count: '46 families' }
                    ]
                  }
                ]
              }
            ]
          },
          {
            name: 'Hisar',
            type: 'district',
            children: [
              {
                name: 'Hansi',
                type: 'tehsil',
                children: [
                  {
                    name: 'Sisai',
                    type: 'place',
                    children: [
                      { name: 'Sisai Village Block', type: 'block', count: '64 families' },
                      { name: 'Sisai Town Block', type: 'block', count: '49 families' }
                    ]
                  }
                ]
              }
            ]
          },
          ...districtNodes(['Jind', 'Sonipat', 'Jhajjar', 'Bhiwani', 'Charkhi Dadri', 'Kaithal', 'Karnal', 'Panipat', 'Sirsa', 'Fatehabad', 'Rewari', 'Gurugram'])
        ]
      },
      {
        name: 'Rajasthan',
        type: 'state',
        count: '1.8M+',
        children: [
          {
            name: 'Jhunjhunu',
            type: 'district',
            children: [
              {
                name: 'Nawalgarh',
                type: 'tehsil',
                children: [
                  {
                    name: 'Nawalgarh Town',
                    type: 'place',
                    children: [
                      { name: 'Market Block', type: 'block', count: '36 families' },
                      { name: 'Outer Ward Block', type: 'block', count: '29 families' }
                    ]
                  }
                ]
              }
            ]
          },
          {
            name: 'Sikar',
            type: 'district',
            children: [
              {
                name: 'Fatehpur',
                type: 'tehsil',
                children: [
                  {
                    name: 'Fatehpur Town',
                    type: 'place',
                    children: [
                      { name: 'Fatehpur Block 1', type: 'block', count: '44 families' },
                      { name: 'Fatehpur Block 2', type: 'block', count: '33 families' }
                    ]
                  }
                ]
              }
            ]
          },
          ...districtNodes(['Churu', 'Bikaner', 'Nagaur', 'Bharatpur', 'Dholpur', 'Jaipur', 'Jodhpur', 'Hanumangarh', 'Sri Ganganagar', 'Alwar', 'Kota'])
        ]
      },
      {
        name: 'Punjab',
        type: 'state',
        count: '3.2M+',
        children: [
          {
            name: 'Ludhiana',
            type: 'district',
            children: [
              {
                name: 'Jagraon',
                type: 'tehsil',
                children: [
                  {
                    name: 'Jagraon Town',
                    type: 'place',
                    children: [
                      { name: 'Jagraon Central Block', type: 'block', count: '52 families' },
                      { name: 'Jagraon Rural Block', type: 'block', count: '47 families' }
                    ]
                  }
                ]
              }
            ]
          },
          ...districtNodes(['Amritsar', 'Bathinda', 'Moga', 'Patiala', 'Sangrur', 'Barnala', 'Muktsar', 'Fazilka', 'Ferozepur', 'Jalandhar', 'Gurdaspur', 'Tarn Taran'])
        ]
      },
      {
        name: 'Uttar Pradesh',
        type: 'state',
        count: '1.5M+',
        children: [
          {
            name: 'Meerut',
            type: 'district',
            children: [
              {
                name: 'Sardhana',
                type: 'tehsil',
                children: [
                  {
                    name: 'Sardhana Town',
                    type: 'place',
                    children: [
                      { name: 'Sardhana Central Block', type: 'block', count: '72 families' },
                      { name: 'Sardhana Rural Block', type: 'block', count: '61 families' }
                    ]
                  }
                ]
              }
            ]
          },
          {
            name: 'Muzaffarnagar',
            type: 'district',
            children: [
              {
                name: 'Khatauli',
                type: 'tehsil',
                children: [
                  {
                    name: 'Khatauli Town',
                    type: 'place',
                    children: [
                      { name: 'Khatauli Ward Block', type: 'block', count: '54 families' },
                      { name: 'Khatauli Village Block', type: 'block', count: '68 families' }
                    ]
                  }
                ]
              }
            ]
          },
          ...districtNodes(['Baghpat', 'Shamli', 'Bijnor', 'Saharanpur', 'Ghaziabad', 'Hapur', 'Bulandshahr', 'Aligarh', 'Mathura', 'Agra', 'Moradabad'])
        ]
      },
      {
        name: 'Delhi',
        type: 'state',
        count: '800K+',
        children: [
          {
            name: 'South West Delhi',
            type: 'district',
            children: [
              {
                name: 'Najafgarh',
                type: 'tehsil',
                children: [
                  {
                    name: 'Najafgarh Town',
                    type: 'place',
                    children: [
                      { name: 'Najafgarh Urban Block', type: 'block', count: '84 families' },
                      { name: 'Najafgarh Rural Block', type: 'block', count: '92 families' }
                    ]
                  }
                ]
              }
            ]
          },
          {
            name: 'North West Delhi',
            type: 'district',
            children: [
              {
                name: 'Narela',
                type: 'tehsil',
                children: [
                  {
                    name: 'Narela Town',
                    type: 'place',
                    children: [
                      { name: 'Narela Block 1', type: 'block', count: '43 families' },
                      { name: 'Narela Block 2', type: 'block', count: '39 families' }
                    ]
                  }
                ]
              },
              {
                name: 'Pitampura',
                type: 'tehsil',
                children: [
                  {
                    name: 'Pitampura',
                    type: 'place',
                    children: [
                      {
                        name: 'CP House 13 - Joginder Mann',
                        type: 'block',
                        description: 'Profile: Joginder Mann'
                      }
                    ]
                  }
                ]
              }
            ]
          },
          ...districtNodes(['West Delhi', 'South Delhi', 'New Delhi', 'Central Delhi', 'North Delhi', 'Shahdara', 'East Delhi'])
        ]
      },
      {
        name: 'Madhya Pradesh',
        type: 'state',
        count: '900K+',
        children: [
          {
            name: 'Morena',
            type: 'district',
            children: [
              {
                name: 'Ambah',
                type: 'tehsil',
                children: [
                  {
                    name: 'Ambah Town',
                    type: 'place',
                    children: [
                      { name: 'Ambah Block A', type: 'block', count: '37 families' },
                      { name: 'Ambah Block B', type: 'block', count: '32 families' }
                    ]
                  }
                ]
              }
            ]
          },
          ...districtNodes(['Bhind', 'Gwalior', 'Shivpuri', 'Datia', 'Mandsaur', 'Neemuch', 'Ratlam', 'Ujjain', 'Indore'])
        ]
      },
      {
        name: 'Gujarat',
        type: 'state',
        count: '600K+',
        children: [
          {
            name: 'Ahmedabad',
            type: 'district',
            children: [
              {
                name: 'Daskroi',
                type: 'tehsil',
                children: [
                  {
                    name: 'Daskroi Town',
                    type: 'place',
                    children: [
                      { name: 'Daskroi Block 1', type: 'block', count: '28 families' },
                      { name: 'Daskroi Block 2', type: 'block', count: '24 families' }
                    ]
                  }
                ]
              }
            ]
          },
          ...districtNodes(['Surat', 'Vadodara', 'Rajkot', 'Kutch', 'Banaskantha', 'Mehsana', 'Gandhinagar', 'Anand', 'Bharuch'])
        ]
      },
      {
        name: 'Uttarakhand',
        type: 'state',
        children: [
          {
            name: 'Haridwar',
            type: 'district',
            children: [
              {
                name: 'Roorkee',
                type: 'tehsil',
                children: [
                  {
                    name: 'Roorkee Town',
                    type: 'place',
                    children: [
                      { name: 'Roorkee Central Block', type: 'block', count: '35 families' },
                      { name: 'Roorkee Rural Block', type: 'block', count: '41 families' }
                    ]
                  }
                ]
              }
            ]
          },
          ...districtNodes(['Udham Singh Nagar', 'Dehradun', 'Nainital', 'Pauri Garhwal'])
        ]
      },
      {
        name: 'Himachal Pradesh',
        type: 'state',
        children: [
          {
            name: 'Una',
            type: 'district',
            children: [
              {
                name: 'Una Tehsil',
                type: 'tehsil',
                children: [
                  {
                    name: 'Una Town',
                    type: 'place',
                    children: [
                      { name: 'Una Central Block', type: 'block', count: '18 families' },
                      { name: 'Una Rural Block', type: 'block', count: '21 families' }
                    ]
                  }
                ]
              }
            ]
          },
          ...districtNodes(['Kangra', 'Hamirpur', 'Solan', 'Bilaspur', 'Sirmaur'])
        ]
      }
    ]
  },
  {
    name: 'International',
    type: 'country',
    count: '500K+',
    description: 'Diaspora communities maintaining cultural links through families, associations, and events.',
    children: [
      {
        name: 'Pakistan',
        type: 'country',
        children: [
          { name: 'Punjab', type: 'state' },
          { name: 'Sindh', type: 'state' },
          { name: 'Khyber Pakhtunkhwa', type: 'state' },
          { name: 'Balochistan', type: 'state' },
          { name: 'Islamabad Capital Territory', type: 'state' }
        ]
      },
      {
        name: 'Canada',
        type: 'country',
        children: stateNodes(['Ontario', 'British Columbia', 'Alberta', 'Manitoba', 'Saskatchewan', 'Quebec'])
      },
      {
        name: 'United Kingdom',
        type: 'country',
        children: stateNodes(['England', 'Scotland', 'Wales', 'Northern Ireland'])
      },
      {
        name: 'United States',
        type: 'country',
        children: stateNodes(['California', 'New York', 'New Jersey', 'Texas', 'Washington', 'Illinois', 'Virginia', 'Florida'])
      },
      {
        name: 'Australia',
        type: 'country',
        children: stateNodes(['New South Wales', 'Victoria', 'Queensland', 'Western Australia', 'South Australia', 'Australian Capital Territory'])
      },
      {
        name: 'New Zealand',
        type: 'country',
        children: stateNodes(['Auckland', 'Waikato', 'Wellington', 'Canterbury', 'Bay of Plenty'])
      },
      {
        name: 'United Arab Emirates',
        type: 'country',
        children: stateNodes(['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah'])
      },
      {
        name: 'Saudi Arabia',
        type: 'country',
        children: stateNodes(['Riyadh', 'Makkah', 'Eastern Province', 'Madinah', 'Jeddah'])
      },
      {
        name: 'Qatar',
        type: 'country',
        children: stateNodes(['Doha', 'Al Rayyan', 'Al Wakrah', 'Umm Salal'])
      },
      {
        name: 'Italy',
        type: 'country',
        children: stateNodes(['Lombardy', 'Lazio', 'Emilia-Romagna', 'Veneto', 'Tuscany'])
      },
      {
        name: 'Germany',
        type: 'country',
        children: stateNodes(['North Rhine-Westphalia', 'Bavaria', 'Baden-Wurttemberg', 'Hesse', 'Berlin', 'Hamburg'])
      }
    ]
  }
];

const alipurSampleMembers: AlipurSampleMember[] = [
  {
    id: 'alipur-sample-1',
    name: 'Rakesh Dahiya',
    gotra: 'Dahiya',
    profession: 'Farmer',
    familyCount: 6,
    distance: '0.8 km',
    phone: '+91 98XX XX1201',
    contactNote: 'Available for village coordination after 6 PM.',
    placeType: 'Village',
    placeName: 'Alipur',
    area: 'Alipur',
    tehsil: 'Narela',
    block: 'Alipur Main Road',
    district: 'North Delhi',
    city: 'Delhi',
    state: 'Delhi',
    country: 'India',
    coordinates: { lat: 28.7986, lng: 77.1359 },
    mapPosition: { x: 48, y: 48 }
  },
  {
    id: 'alipur-sample-2',
    name: 'Suman Malik',
    gotra: 'Malik',
    profession: 'Teacher',
    familyCount: 4,
    distance: '1.4 km',
    phone: '+91 98XX XX1202',
    contactNote: 'Prefers first contact by message.',
    placeType: 'Colony',
    placeName: 'Bakhtawarpur',
    area: 'Alipur',
    tehsil: 'Narela',
    block: 'Bakhtawarpur Road',
    district: 'North Delhi',
    city: 'Delhi',
    state: 'Delhi',
    country: 'India',
    coordinates: { lat: 28.812, lng: 77.141 },
    mapPosition: { x: 58, y: 34 }
  },
  {
    id: 'alipur-sample-3',
    name: 'Naveen Sangwan',
    gotra: 'Sangwan',
    profession: 'Transport Business',
    familyCount: 5,
    distance: '2.1 km',
    phone: '+91 98XX XX1203',
    contactNote: 'Can help connect nearby families.',
    placeType: 'Village',
    placeName: 'Hiranki',
    area: 'Alipur',
    tehsil: 'Narela',
    block: 'Hiranki Link Road',
    district: 'North Delhi',
    city: 'Delhi',
    state: 'Delhi',
    country: 'India',
    coordinates: { lat: 28.803, lng: 77.116 },
    mapPosition: { x: 31, y: 44 }
  },
  {
    id: 'alipur-sample-4',
    name: 'Pooja Sehrawat',
    gotra: 'Sehrawat',
    profession: 'Nurse',
    familyCount: 3,
    distance: '2.7 km',
    phone: '+91 98XX XX1204',
    contactNote: 'Emergency helpline volunteer.',
    placeType: 'Village',
    placeName: 'Budhpur',
    area: 'Alipur',
    tehsil: 'Narela',
    block: 'Budhpur Extension',
    district: 'North Delhi',
    city: 'Delhi',
    state: 'Delhi',
    country: 'India',
    coordinates: { lat: 28.791, lng: 77.154 },
    mapPosition: { x: 68, y: 56 }
  },
  {
    id: 'alipur-sample-5',
    name: 'Amit Kadian',
    gotra: 'Kadian',
    profession: 'Student',
    familyCount: 4,
    distance: '3.2 km',
    phone: '+91 98XX XX1205',
    contactNote: 'Youth sports group member.',
    placeType: 'Village',
    placeName: 'Bakoli',
    area: 'Alipur',
    tehsil: 'Narela',
    block: 'Bakoli School Road',
    district: 'North Delhi',
    city: 'Delhi',
    state: 'Delhi',
    country: 'India',
    coordinates: { lat: 28.825, lng: 77.128 },
    mapPosition: { x: 42, y: 23 }
  },
  {
    id: 'alipur-sample-6',
    name: 'Sunita Ahlawat',
    gotra: 'Ahlawat',
    profession: 'Homemaker',
    familyCount: 7,
    distance: '3.9 km',
    phone: '+91 98XX XX1206',
    contactNote: 'Active in women community programs.',
    placeType: 'Village',
    placeName: 'Singhola',
    area: 'Alipur',
    tehsil: 'Narela',
    block: 'Singhola Village',
    district: 'North Delhi',
    city: 'Delhi',
    state: 'Delhi',
    country: 'India',
    coordinates: { lat: 28.837, lng: 77.118 },
    mapPosition: { x: 27, y: 15 }
  },
  {
    id: 'alipur-sample-7',
    name: 'Vikas Hooda',
    gotra: 'Hooda',
    profession: 'Police Service',
    familyCount: 5,
    distance: '4.6 km',
    phone: '+91 98XX XX1207',
    contactNote: 'Contact for verified local support only.',
    placeType: 'Village',
    placeName: 'Nangli Poona',
    area: 'Alipur',
    tehsil: 'Narela',
    block: 'Nangli Poona',
    district: 'North Delhi',
    city: 'Delhi',
    state: 'Delhi',
    country: 'India',
    coordinates: { lat: 28.783, lng: 77.126 },
    mapPosition: { x: 39, y: 66 }
  },
  {
    id: 'alipur-sample-8',
    name: 'Deepak Jakhar',
    gotra: 'Jakhar',
    profession: 'Shop Owner',
    familyCount: 4,
    distance: '5.1 km',
    phone: '+91 98XX XX1208',
    contactNote: 'Usually available in afternoon.',
    placeType: 'Market',
    placeName: 'Narela Mandi',
    area: 'Narela',
    tehsil: 'Narela',
    block: 'Mandi Road',
    district: 'North Delhi',
    city: 'Delhi',
    state: 'Delhi',
    country: 'India',
    coordinates: { lat: 28.852, lng: 77.092 },
    mapPosition: { x: 16, y: 8 }
  },
  {
    id: 'alipur-sample-9',
    name: 'Meena Mor',
    gotra: 'Mor',
    profession: 'Anganwadi Worker',
    familyCount: 6,
    distance: '5.8 km',
    phone: '+91 98XX XX1209',
    contactNote: 'Can share local program information.',
    placeType: 'Village',
    placeName: 'Palla',
    area: 'Alipur',
    tehsil: 'Narela',
    block: 'Palla Village',
    district: 'North Delhi',
    city: 'Delhi',
    state: 'Delhi',
    country: 'India',
    coordinates: { lat: 28.775, lng: 77.18 },
    mapPosition: { x: 82, y: 72 }
  },
  {
    id: 'alipur-sample-10',
    name: 'Rohit Grewal',
    gotra: 'Grewal',
    profession: 'Engineer',
    familyCount: 3,
    distance: '6.3 km',
    phone: '+91 98XX XX1210',
    contactNote: 'Prefers weekend calls.',
    placeType: 'Colony',
    placeName: 'Swaroop Nagar',
    area: 'Alipur',
    tehsil: 'Narela',
    block: 'Swaroop Nagar Extension',
    district: 'North Delhi',
    city: 'Delhi',
    state: 'Delhi',
    country: 'India',
    coordinates: { lat: 28.754, lng: 77.148 },
    mapPosition: { x: 62, y: 84 }
  },
  {
    id: 'alipur-sample-11',
    name: 'Kavita Beniwal',
    gotra: 'Beniwal',
    profession: 'Doctor',
    familyCount: 4,
    distance: '7.0 km',
    phone: '+91 98XX XX1211',
    contactNote: 'Medical camp volunteer.',
    placeType: 'Sector',
    placeName: 'Rohini Sector 34',
    area: 'Rohini',
    tehsil: 'Narela',
    block: 'Sector 34',
    district: 'North West Delhi',
    city: 'Delhi',
    state: 'Delhi',
    country: 'India',
    coordinates: { lat: 28.748, lng: 77.102 },
    mapPosition: { x: 24, y: 88 }
  },
  {
    id: 'alipur-sample-12',
    name: 'Manoj Rathee',
    gotra: 'Rathee',
    profession: 'Dairy Farmer',
    familyCount: 8,
    distance: '7.6 km',
    phone: '+91 98XX XX1212',
    contactNote: 'Community event logistics contact.',
    placeType: 'Village',
    placeName: 'Khera Kalan',
    area: 'Alipur',
    tehsil: 'Narela',
    block: 'Khera Kalan',
    district: 'North Delhi',
    city: 'Delhi',
    state: 'Delhi',
    country: 'India',
    coordinates: { lat: 28.792, lng: 77.088 },
    mapPosition: { x: 13, y: 55 }
  },
  {
    id: 'alipur-sample-13',
    name: 'Anjali Nain',
    gotra: 'Nain',
    profession: 'Advocate',
    familyCount: 3,
    distance: '8.4 km',
    phone: '+91 98XX XX1213',
    contactNote: 'Legal awareness group member.',
    placeType: 'Village',
    placeName: 'Bawana',
    area: 'Bawana',
    tehsil: 'Narela',
    block: 'Bawana Road',
    district: 'North West Delhi',
    city: 'Delhi',
    state: 'Delhi',
    country: 'India',
    coordinates: { lat: 28.799, lng: 77.034 },
    mapPosition: { x: 7, y: 42 }
  },
  {
    id: 'alipur-sample-14',
    name: 'Harish Sihag',
    gotra: 'Sihag',
    profession: 'Contractor',
    familyCount: 5,
    distance: '9.1 km',
    phone: '+91 98XX XX1214',
    contactNote: 'Helps with venue arrangements.',
    placeType: 'Village',
    placeName: 'Lampur',
    area: 'Narela',
    tehsil: 'Narela',
    block: 'Lampur Road',
    district: 'North Delhi',
    city: 'Delhi',
    state: 'Delhi',
    country: 'India',
    coordinates: { lat: 28.865, lng: 77.111 },
    mapPosition: { x: 36, y: 5 }
  },
  {
    id: 'alipur-sample-15',
    name: 'Priyanka Dhaka',
    gotra: 'Dhaka',
    profession: 'Entrepreneur',
    familyCount: 4,
    distance: '10.5 km',
    phone: '+91 98XX XX1215',
    contactNote: 'Women business network contact.',
    placeType: 'Village',
    placeName: 'Holambi Kalan',
    area: 'Narela',
    tehsil: 'Narela',
    block: 'Holambi Kalan',
    district: 'North Delhi',
    city: 'Delhi',
    state: 'Delhi',
    country: 'India',
    coordinates: { lat: 28.817, lng: 77.065 },
    mapPosition: { x: 12, y: 27 }
  }
];

const levelLabels: Record<AreaLevel, string> = {
  country: 'Country',
  state: 'State',
  district: 'District',
  tehsil: 'Tehsil',
  place: 'Village / Town',
  block: 'Block'
};

const getInitialPath = () => {
  const india = areaHierarchy.find(area => area.name === 'India');
  return india ? [india] : [];
};

const getDirectoryHeading = (selectedArea: AreaNode | undefined, currentLevel: AreaLevel) => {
  if (!selectedArea && currentLevel === 'country') {
    return 'COUNTRIES / REGIONS';
  }

  if (selectedArea?.name === 'India' && currentLevel === 'state') {
    return 'STATES / PROVINCES IN INDIA';
  }

  return `${levelLabels[currentLevel].toUpperCase()}S IN ${selectedArea?.name.toUpperCase() || 'DIRECTORY'}`;
};

const getDirectorySubtitle = (selectedArea: AreaNode | undefined, currentLevel: AreaLevel) => {
  if (currentLevel === 'block') {
    return 'Open a final block to reach the member directory for this area.';
  }

  return selectedArea
    ? `Tap a ${levelLabels[currentLevel].toLowerCase()} to continue the directory path.`
    : 'Choose a country to begin exploring the community directory.';
};

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
};

const SectionHeader = ({ eyebrow, title, subtitle }: SectionHeaderProps) => (
  <div className="directory-section-header">
    <span>{eyebrow}</span>
    <h2>{title}</h2>
    {subtitle && <p>{subtitle}</p>}
  </div>
);

const AreaCard = ({ item, onSelect }: { item: AreaNode; onSelect: (item: AreaNode) => void }) => (
  <button
    type="button"
    className="directory-area-card"
    onClick={() => onSelect(item)}
    disabled={!item.children?.length}
  >
    <strong>{item.name}</strong>
    <span>{item.children?.length ? 'Tap to explore ->' : 'Member directory ->'}</span>
    {item.count && <small>{item.count}</small>}
    {item.description && <p>{item.description}</p>}
  </button>
);

const AreaGrid = ({ items, onSelect }: { items: AreaNode[]; onSelect: (item: AreaNode) => void }) => (
  <div className="directory-area-grid">
    {items.map(item => (
      <AreaCard key={`${item.type}-${item.name}`} item={item} onSelect={onSelect} />
    ))}
  </div>
);

type AlipurMapPanelProps = {
  members: AlipurSampleMember[];
  selectedMember: AlipurSampleMember;
  currentLocation?: {
    lat: number;
    lng: number;
  } | null;
  onSelectMember: (member: AlipurSampleMember) => void;
  onContactMember: (member: AlipurSampleMember) => void;
};

const AlipurMapPanel = ({
  members,
  selectedMember,
  currentLocation,
  onSelectMember,
  onContactMember
}: AlipurMapPanelProps) => {
  const mapSrc = currentLocation
    ? `https://maps.google.com/maps?q=${currentLocation.lat},${currentLocation.lng}&z=15&output=embed`
    : 'https://maps.google.com/maps?q=Alipur%20Delhi&z=12&output=embed';

  return (
  <section className="alipur-sample-section" aria-labelledby="alipur-sample-heading">
    <div className="alipur-sample-heading">
      <div>
        <span>{currentLocation ? 'Current Location Map' : 'Sample Area Map'}</span>
        <h2 id="alipur-sample-heading">
          {currentLocation ? 'Your current location' : 'Alipur Delhi nearby Jat people'}
        </h2>
        <p>
          {currentLocation
            ? 'Map has been centered on your detected browser location. Sample member pins remain visible for demo profiles.'
            : 'Demo data for 15 nearby profiles around Alipur, Narela and North Delhi. Pins and contact details are sample-only.'}
        </p>
      </div>
      <div className="alipur-summary">
        <strong>{members.length}</strong>
        <small>sample profiles</small>
      </div>
    </div>

    <div className="alipur-sample-layout">
      <div
        className={`alipur-map-card${currentLocation ? ' current-location-map' : ''}`}
        aria-label={currentLocation ? 'Map near your current location' : 'Sample member map near Alipur Delhi'}
      >
        <iframe
          title={currentLocation ? 'Map around your current location' : 'Real map around Alipur Delhi'}
          src={mapSrc}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
        {currentLocation && (
          <div className="current-location-badge">
            <FaLocationArrow aria-hidden="true" />
            Current location
          </div>
        )}
        <div className="alipur-pin-layer" aria-label="Sample pins on Delhi map">
          {members.map((member, index) => (
            <button
              key={member.id}
              type="button"
              className={`alipur-map-pin ${member.id === selectedMember.id ? 'active' : ''}`}
              style={getAlipurPinPosition(member)}
              onClick={() => onSelectMember(member)}
              aria-label={`Select ${member.name} in ${member.placeName}`}
              aria-pressed={member.id === selectedMember.id}
            >
              <span>{index + 1}</span>
            </button>
          ))}
        </div>
      </div>

      <aside className="alipur-details-panel" aria-label="Selected sample profile details">
        <div className="alipur-selected-card">
          <div className="member-avatar" aria-hidden="true">
            {selectedMember.name.slice(0, 2).toUpperCase()}
          </div>
          <span className="sample-badge">Sample Profile</span>
          <h3>{selectedMember.name}</h3>
          <p>{selectedMember.contactNote}</p>

          <dl className="alipur-profile-list">
            <div>
              <dt>Area</dt>
              <dd>{selectedMember.placeName}, {selectedMember.district}</dd>
            </div>
            <div>
              <dt>Distance</dt>
              <dd>{selectedMember.distance} from Alipur</dd>
            </div>
            <div>
              <dt>Gotra</dt>
              <dd>{selectedMember.gotra}</dd>
            </div>
            <div>
              <dt>Profession</dt>
              <dd>{selectedMember.profession}</dd>
            </div>
            <div>
              <dt>Family</dt>
              <dd>{selectedMember.familyCount} members</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>{selectedMember.phone}</dd>
            </div>
          </dl>

          <div className="alipur-contact-actions">
            <button type="button" onClick={() => onContactMember(selectedMember)}>
              <FaEnvelope aria-hidden="true" />
              Message
            </button>
            <button type="button" onClick={() => onContactMember(selectedMember)}>
              <FaWhatsapp aria-hidden="true" />
              WhatsApp
            </button>
            <button type="button" onClick={() => onContactMember(selectedMember)}>
              <FaPhoneAlt aria-hidden="true" />
              Call
            </button>
            <button type="button" onClick={() => onSelectMember(selectedMember)}>
              <FaMapMarkedAlt aria-hidden="true" />
              Highlight Pin
            </button>
          </div>
        </div>

        <div className="alipur-member-list" aria-label="Sample profiles list">
          {members.map(member => (
            <button
              type="button"
              key={member.id}
              className={member.id === selectedMember.id ? 'active' : ''}
              onClick={() => onSelectMember(member)}
              aria-pressed={member.id === selectedMember.id}
            >
              <strong>{member.name}</strong>
              <span>{member.placeName} - {member.distance}</span>
            </button>
          ))}
        </div>
      </aside>
    </div>
  </section>
  );
};

const mergeAreaNodes = (baseNodes: AreaNode[], addedNodes: AreaNode[]): AreaNode[] => {
  const merged: AreaNode[] = baseNodes.map(node => ({
    ...node,
    children: node.children ? [...node.children] : undefined
  }));

  addedNodes.forEach(addedNode => {
    const existing = merged.find(
      node => node.type === addedNode.type && node.name.toLowerCase() === addedNode.name.toLowerCase()
    );

    if (!existing) {
      merged.push(addedNode);
      return;
    }

    if (addedNode.children?.length) {
      existing.children = mergeAreaNodes(existing.children || [], addedNode.children);
    }
  });

  return merged;
};

const createSignupAreaNodes = (signups: Record<string, string>[]): AreaNode[] =>
  signups.reduce<AreaNode[]>((nodes, signup) => {
    if (!signup.country || !signup.state || !signup.district) {
      return nodes;
    }

    const countryName = signup.country.trim();
    const stateName = signup.state.trim();
    const districtName = signup.district.trim();
    const placeName = (signup.placeName || signup.city || '').trim();
    if (!countryName || !stateName || !districtName) {
      return nodes;
    }

    const leaf: AreaNode = {
      name: signup.block || `${signup.name} - Registered Member`,
      type: 'block',
      description: signup.nearbyLandmark
        ? `${signup.name}, near ${signup.nearbyLandmark}`
        : `Profile: ${signup.name}`
    };
    const place: AreaNode | undefined = placeName
      ? { name: placeName, type: 'place', children: [leaf] }
      : undefined;
    const tehsil: AreaNode | undefined = signup.tehsil
      ? { name: signup.tehsil, type: 'tehsil', children: place ? [place] : [leaf] }
      : undefined;
    const district: AreaNode = {
      name: districtName,
      type: 'district',
      children: tehsil ? [tehsil] : place ? [place] : [leaf]
    };
    const state: AreaNode = { name: stateName, type: 'state', children: [district] };
    const country: AreaNode = { name: countryName, type: 'country', children: [state] };

    return mergeAreaNodes(nodes, [country]);
  }, []);

const AreaWiseJat: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'directory' | 'map'>(() =>
    searchParams.get('view') === 'map' ? 'map' : 'directory'
  );
  const [path, setPath] = useState<AreaNode[]>(getInitialPath);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChatMember, setActiveChatMember] = useState<RegisteredMember | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [mapMessage, setMapMessage] = useState('');
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedAlipurMemberId, setSelectedAlipurMemberId] = useState(alipurSampleMembers[0].id);
  const signupAreaNodes = useMemo(() => {
    try {
      const parsed = JSON.parse(window.localStorage.getItem(LOCAL_SIGNUPS_KEY) || '[]');
      return Array.isArray(parsed) ? createSignupAreaNodes(parsed) : [];
    } catch {
      return [];
    }
  }, []);
  const directoryHierarchy = useMemo(
    () => mergeAreaNodes(areaHierarchy, signupAreaNodes),
    [signupAreaNodes]
  );
  const registeredMembers = useMemo(() => {
    try {
      const parsed = JSON.parse(window.localStorage.getItem(LOCAL_SIGNUPS_KEY) || '[]');
      if (!Array.isArray(parsed)) return [];

      return (parsed as RegisteredMember[]).filter(member => {
        const searchable = [
          member.name,
          member.placeType,
          member.placeName,
          member.area,
          member.tehsil,
          member.block,
          member.district,
          member.city,
          member.state,
          member.country
        ].join(' ').toLowerCase();
        return searchable.includes(searchQuery.toLowerCase());
      });
    } catch {
      return [];
    }
  }, [searchQuery]);
  const currentUserProfile = useMemo(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return null;
    }

    try {
      const parsed = JSON.parse(window.localStorage.getItem(LOCAL_SIGNUPS_KEY) || '[]');
      if (!Array.isArray(parsed)) return null;

      return (parsed as RegisteredMember[]).find(member =>
        member.id === currentUser.id ||
        (member.email && currentUser.email && normalize(member.email) === normalize(currentUser.email))
      ) || null;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (searchParams.get('view') === 'map') {
      setActiveTab('map');
      setMapMessage('');
    }
  }, [searchParams]);

  useEffect(() => {
    if (!activeChatMember || messages.length === 0) {
      return;
    }

    window.localStorage.setItem(getChatStorageKey(activeChatMember), JSON.stringify(messages));
  }, [activeChatMember, messages]);

  const currentItems = useMemo(() => {
    if (path.length === 0) {
      return directoryHierarchy;
    }

    return path[path.length - 1].children || [];
  }, [directoryHierarchy, path]);

  const currentLevel = currentItems[0]?.type || 'block';
  const selectedArea = path[path.length - 1];
  const selectedAlipurMember =
    alipurSampleMembers.find(member => member.id === selectedAlipurMemberId) || alipurSampleMembers[0];
  const filteredItems = useMemo(() => {
    const query = searchQuery.toLowerCase();

    return currentItems.filter(item =>
      `${item.name} ${item.type} ${item.count || ''} ${item.description || ''}`.toLowerCase().includes(query)
    );
  }, [currentItems, searchQuery]);

  const handleSelect = (item: AreaNode) => {
    if (item.children?.length) {
      setPath(prevPath => [...prevPath, item]);
      setSearchQuery('');
    }
  };

  const handleBreadcrumb = (index: number) => {
    setPath(prevPath => prevPath.slice(0, index + 1));
    setSearchQuery('');
  };

  const resetPath = () => {
    setPath(getInitialPath());
    setSearchQuery('');
  };

  const openAreaMap = () => {
    setMapMessage('');
    setActiveTab('map');
  };

  const openMemberMap = (member: RegisteredMember) => {
    const sampleMember = alipurSampleMembers.find(sample => sample.id === member.id);
    if (sampleMember) {
      setSelectedAlipurMemberId(sampleMember.id);
      setMapMessage(`${sampleMember.name} selected. Details are highlighted on the side.`);
    } else {
      setMapMessage('Showing nearby sample pins around Alipur Delhi.');
    }
    setActiveTab('map');
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setMapMessage('Location access is not supported in this browser.');
      return;
    }

    setMapMessage('Requesting your current location...');
    navigator.geolocation.getCurrentPosition(
      position => {
        const nextLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setCurrentLocation(nextLocation);
        setMapMessage(
          `Your location was detected at ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}. Nearby Alipur sample pins remain visible.`
        );
      },
      () => {
        setMapMessage('Unable to access your current location. Please allow location permission and try again.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const openCurrentProfileMap = () => {
    if (!currentUserProfile) {
      setMapMessage('Sign up or complete your profile to show your saved location pin.');
      return;
    }

    setMapMessage('Your saved profile is available. Nearby Alipur sample pins remain visible on this map.');
    setActiveTab('map');
  };

  const openChat = (member: RegisteredMember) => {
    setActiveChatMember(member);
    setMessages(loadSavedMessages(member));
    setChatInput('');
  };

  const handleSendMessage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextMessage = chatInput.trim();
    if (!nextMessage) {
      return;
    }

    setMessages(currentMessages => [
      ...currentMessages,
      {
        id: Date.now(),
        sender: 'me',
        text: nextMessage
      }
    ]);
    setChatInput('');
  };

  const handleMemberReply = () => {
    if (!activeChatMember) {
      return;
    }

    setMessages(currentMessages => [
      ...currentMessages,
      {
        id: Date.now(),
        sender: 'member',
        text: `Reply from ${activeChatMember.name || 'member'}: I received your message and will respond soon.`
      }
    ]);
  };

  return (
    <div className="area-wise-jat">
      <Navbar />

      {activeChatMember && (
        <aside className="chat-drawer" aria-label={`Chat with ${activeChatMember.name || 'registered member'}`}>
          <div className="chat-header">
            <div>
              <span className="chat-kicker">Messenger</span>
              <h2>{activeChatMember.name || 'Registered Member'}</h2>
              <p>
                {[activeChatMember.district, activeChatMember.state, activeChatMember.country]
                  .filter(Boolean)
                  .join(', ') || 'Area member'}
              </p>
            </div>
            <button className="chat-icon-btn" type="button" onClick={() => setActiveChatMember(null)} aria-label="Close chat">
              <FaTimes aria-hidden="true" />
            </button>
          </div>

          <div className="chat-messages" aria-live="polite">
            {messages.map(message => (
              <div className={`chat-bubble ${message.sender === 'me' ? 'chat-bubble-me' : 'chat-bubble-member'}`} key={message.id}>
                {message.text}
              </div>
            ))}
          </div>

          <button className="member-reply-btn" type="button" onClick={handleMemberReply}>
            <FaReply aria-hidden="true" />
            Other person reply
          </button>

          <form className="chat-form" onSubmit={handleSendMessage}>
            <input
              value={chatInput}
              onChange={event => setChatInput(event.target.value)}
              placeholder="Type a message"
              aria-label="Type a message"
            />
            <button type="submit" aria-label="Send message">
              <FaPaperPlane aria-hidden="true" />
            </button>
          </form>
        </aside>
      )}

      <main className={`area-directory-page ${activeTab === 'map' ? 'map-tab-active' : ''}`}>
        <section className="directory-shell area-tabs-section">
          <div className="area-tabs" role="tablist" aria-label="Area wise options">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'directory'}
              className={activeTab === 'directory' ? 'active' : ''}
              onClick={() => setActiveTab('directory')}
            >
              <FaSearch aria-hidden="true" />
              Area Wise Search
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'map'}
              className={activeTab === 'map' ? 'active' : ''}
              onClick={openAreaMap}
            >
              <FaMapMarkedAlt aria-hidden="true" />
              Map
            </button>
          </div>
        </section>

        {activeTab === 'directory' ? (
          <section className="directory-shell explorer-section" role="tabpanel">
            <div className="explorer-topbar">
              <SectionHeader
                eyebrow={`${levelLabels[currentLevel]} Wise`}
                title={getDirectoryHeading(selectedArea, currentLevel)}
                subtitle={getDirectorySubtitle(selectedArea, currentLevel)}
              />
              <div className="explorer-actions">
                <button type="button" className="directory-action-btn directory-map-btn" onClick={openAreaMap}>
                  <FaMapMarkedAlt aria-hidden="true" />
                  Open Map
                </button>
                <button type="button" className="directory-action-btn" onClick={resetPath}>
                  India
                </button>
              </div>
            </div>

            <nav className="directory-breadcrumbs" aria-label="Selected area path">
              <button type="button" onClick={() => setPath([])} className={path.length === 0 ? 'active' : ''}>
                Country
              </button>
              {path.map((item, index) => (
                <button
                  key={`${item.type}-${item.name}`}
                  type="button"
                  onClick={() => handleBreadcrumb(index)}
                  className={index === path.length - 1 ? 'active' : ''}
                >
                  {item.name}
                </button>
              ))}
            </nav>

            <div className="directory-search-wrap">
              <SearchBar placeholder="Search by country, state, district, tehsil or village..." onSearch={setSearchQuery} />
            </div>

            {filteredItems.length > 0 ? (
              <AreaGrid items={filteredItems} onSelect={handleSelect} />
            ) : (
              <div className="member-directory-panel">
                <SectionHeader
                  eyebrow="Member Directory"
                  title={selectedArea ? `${selectedArea.name} Members` : 'Registered Members'}
                  subtitle={searchQuery ? 'No matching area cards found. Matching members are shown below.' : 'This is the final directory level.'}
                />
                {registeredMembers.length > 0 ? (
                  <div className="member-directory-grid">
                    {registeredMembers.map(member => (
                      <article className="directory-member-card" key={member.id || member.name}>
                        <div className="member-avatar" aria-hidden="true">
                          {(member.name || 'Member').slice(0, 2).toUpperCase()}
                        </div>
                        <h3>{member.name || 'Registered Member'}</h3>
                        <p>
                          {[member.placeType && member.placeName ? `${member.placeType}: ${member.placeName}` : '', member.district, member.state, member.country]
                            .filter(Boolean)
                            .join(', ') || 'Location not provided'}
                        </p>
                        <div className="member-card-actions">
                          <button className="area-chat-link" type="button" onClick={() => openChat(member)}>
                            Chat
                          </button>
                          <button className="area-chat-link member-map-link" type="button" onClick={() => openMemberMap(member)}>
                            <FaMapMarkedAlt aria-hidden="true" />
                            Map
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="area-empty-state">
                    <h4>No registered members found</h4>
                    <p>Members will appear here after completing their area profile.</p>
                  </div>
                )}
              </div>
            )}
          </section>
        ) : (
          <section className="full-map-section" role="tabpanel" aria-label="Area map">
            <div className="full-map-toolbar">
              <div className="full-map-title">
                <span>Nearby Map</span>
                <h2>Jat people near Alipur Delhi</h2>
                <p>Click any map pin to highlight that person's side details.</p>
              </div>
              <div className="map-actions">
                <button type="button" className="explore-map-btn" onClick={openCurrentProfileMap}>
                  <FaMapMarkedAlt aria-hidden="true" />
                  My Saved Pin
                </button>
                <button type="button" className="explore-map-btn location-pin-btn" onClick={useCurrentLocation}>
                  <FaLocationArrow aria-hidden="true" />
                  Use My Location
                </button>
                <button type="button" className="explore-map-btn map-back-btn" onClick={() => setActiveTab('directory')}>
                  Area Search
                </button>
              </div>
              {mapMessage && <p className="map-message">{mapMessage}</p>}
            </div>
            <AlipurMapPanel
              members={alipurSampleMembers}
              selectedMember={selectedAlipurMember}
              currentLocation={currentLocation}
              onSelectMember={member => {
                setSelectedAlipurMemberId(member.id);
                setMapMessage(`${member.name} selected. Details are highlighted on the side.`);
              }}
              onContactMember={openChat}
            />
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default AreaWiseJat;
