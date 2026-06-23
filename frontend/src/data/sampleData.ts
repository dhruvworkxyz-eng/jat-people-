// Sample data for the Jat People website
import samelanPhoto1 from '../assets/1.jpg';
import samelanPhoto2 from '../assets/2.jpg';
import samelanPhoto3 from '../assets/3.jpg';
import samelanPhoto4 from '../assets/4.jpg';
import samelanPhoto5 from '../assets/5.jpg';
import samelanPhoto6 from '../assets/6.jpg';
import samelanPhoto7 from '../assets/7.jpg';
import samelanPhoto8 from '../assets/8.jpg';
import samelanPhoto9 from '../assets/9.jpg';
import samelanPhoto10 from '../assets/10.jpg';
import samelanPhoto11 from '../assets/11.jpg';
import samelanPhoto12 from '../assets/12.jpg';
import samelanPhoto13 from '../assets/13.jpg';
import samelanPhoto14 from '../assets/14.jpg';

export const gotras = [
  'Ahlawat', 'Ajmeria', 'Antal', 'Asiyag', 'Aulakh',
  'Bains', 'Bajwa', 'Balhara', 'Bamraulia', 'Bana', 'Beniwal', 'Bhakar', 'Bhambu', 'Bhullar', 'Brar', 'Burdak',
  'Chahar', 'Cheema', 'Chhillar', 'Chhina',
  'Dabas', 'Dahiya', 'Dalal', 'Dhaka', 'Dhaliwal', 'Dhankhar', 'Dharan', 'Dudi', 'Deswal',
  'Gahlot (some lineages)', 'Gathwala', 'Ghuman', 'Gill', 'Godara', 'Gora', 'Goyat', 'Grewal',
  'Haga', 'Haldia', 'Hans', 'Hooda',
  'Jakhar', 'Jandu', 'Johiya', 'Joon',
  'Kahloon', 'Kajla', 'Kaliraman', 'Kang', 'Kaswan', 'Khokhar', 'Kundu', 'Kharb', 'Karwasra',
  'Lakhlan', 'Langrial', 'Legha', 'Lohan',
  'Madrak', 'Mahla', 'Malik', 'Maan', 'Mann', 'Mirdha',
  'Nain', 'Nalwa', 'Narwal', 'Nijjar',
  'Pannu', 'Pawar (some lineages)', 'Phogat', 'Pilania', 'Poonia', 'Punia',
  'Rathi', 'Rohilla', 'Ranwa',
  'Saharan', 'Sangwan', 'Sandhu', 'Saroha', 'Sehrawat', 'Sekhon', 'Sheoran', 'Sidhu', 'Siyag', 'Sinsinwar', 'Sunda',
  'Takhar', 'Teotia (Tewatia)', 'Tokas', 'Toor',
  'Uppal',
  'Virk',
  'Wadala', 'Wagha',
  'Yadav',
  'Other'
];

export const sortedGotras = [...gotras].sort((first, second) => first.localeCompare(second));

export const gotraMembers = [
  {
    name: 'Joginder Mann',
    gotra: 'Mann',
    profile: 'Profile directory member',
    profession: 'Community Member',
    location: 'Not provided'
  }
];

export const areas = [
  { name: 'Haryana', description: 'Heartland communities rooted in agriculture, leadership, and village institutions.', count: '2.5M+', image: '/images/jat-regions-panorama.png', imagePosition: '12% 50%' },
  { name: 'Rajasthan', description: 'Historic settlements shaped by desert resilience, sandstone towns, and warrior heritage.', count: '1.8M+', image: '/images/jat-regions-panorama.png', imagePosition: '38% 50%' },
  { name: 'Punjab', description: 'Farming excellence, strong rural networks, and a vibrant cross-border cultural identity.', count: '3.2M+', image: '/images/jat-regions-panorama.png', imagePosition: '20% 50%' },
  { name: 'Delhi', description: 'Urban Jat families active in public service, enterprise, politics, and professional life.', count: '800K+', image: '/images/jat-regions-panorama.png', imagePosition: '68% 50%' },
  { name: 'Uttar Pradesh', description: 'Diverse western UP communities with deep roots in farming, education, and local leadership.', count: '1.5M+', image: '/images/jat-regions-panorama.png', imagePosition: '28% 50%' },
  { name: 'Madhya Pradesh', description: 'Traditional settlements connected through agriculture, trade, and regional community networks.', count: '900K+', image: '/images/jat-regions-panorama.png', imagePosition: '48% 50%' },
  { name: 'Gujarat', description: 'Business-minded families contributing to trade, industry, and expanding community platforms.', count: '600K+', image: '/images/jat-regions-panorama.png', imagePosition: '58% 50%' },
  { name: 'Uttarakhand', description: 'Foothill and Terai communities connected through farming, service, and local networks.', count: '300K+', image: '/images/jat-regions-panorama.png', imagePosition: '72% 50%' },
  { name: 'Himachal Pradesh', description: 'Hill-state community presence supported by regional family and social networks.', count: '100K+', image: '/images/jat-regions-panorama.png', imagePosition: '78% 50%' },
  { name: 'International', description: 'A growing global diaspora preserving identity while building new opportunities abroad.', count: '500K+', image: '/images/jat-regions-panorama.png', imagePosition: '88% 50%' }
];

export const religions = [
  {
    name: 'Hindu Jat',
    description: 'Traditional Hindu practices and customs',
    members: [
      {
        name: 'Joginder Mann',
        gotra: 'Mann',
        profile: 'Profile directory member'
      }
    ]
  },
  { name: 'Sikh Jat', description: 'Sikh faith and warrior traditions' },
  { name: 'Muslim Jat', description: 'Islamic faith with Jat heritage' },
  { name: 'Other Faiths', description: 'Various other religious practices' }
];

export const professions = [
  { name: 'Healthcare', description: 'Doctors, nurses, pharmacists, therapists, and healthcare support roles.' },
  { name: 'Education', description: 'Teachers, professors, tutors, trainers, and academic administrators.' },
  { name: 'Engineering', description: 'Civil, mechanical, electrical, and other engineering professionals.' },
  { name: 'Information Technology (IT)', description: 'Software, support, cybersecurity, data, cloud, and digital technology roles.' },
  { name: 'Business / Entrepreneurship', description: 'Business owners, founders, traders, and enterprise builders.' },
  { name: 'Banking & Finance', description: 'Banking, accounting, insurance, investment, and financial services roles.' },
  { name: 'Government Services', description: 'Civil services, public administration, and government department roles.' },
  { name: 'Legal Profession', description: 'Advocates, legal advisors, court staff, and law-related professionals.' },
  { name: 'Defense & Police', description: 'Armed forces, police, paramilitary, security, and protective services.' },
  { name: 'Agriculture', description: 'Farming, dairy, agribusiness, crop production, and rural livelihoods.' },
  { name: 'Sales & Marketing', description: 'Sales, marketing, brand promotion, customer growth, and business development.' },
  { name: 'Human Resources (HR)', description: 'Recruitment, employee relations, payroll, training, and people operations.' },
  { name: 'Media & Journalism', description: 'News, reporting, editing, broadcasting, digital media, and publishing.' },
  { name: 'Arts & Entertainment', description: 'Artists, performers, creators, production teams, and entertainment professionals.' },
  { name: 'Hospitality & Tourism', description: 'Hotels, restaurants, travel, events, and tourism services.' },
  { name: 'Construction & Real Estate', description: 'Construction, contracting, property dealing, architecture, and real estate services.' },
  { name: 'Manufacturing & Industrial Work', description: 'Factory, production, industrial operations, quality, and plant management roles.' },
  { name: 'Transportation & Logistics', description: 'Drivers, transport operators, supply chain, warehousing, and logistics roles.' },
  { name: 'Science & Research', description: 'Research, laboratories, scientific study, innovation, and technical analysis.' },
  { name: 'Skilled Trades (Electrician, Plumber, Carpenter, etc.)', description: 'Electricians, plumbers, carpenters, mechanics, technicians, and craft workers.' },
  { name: 'Retail & E-commerce', description: 'Retail shops, online selling, marketplaces, customer service, and store operations.' },
  { name: 'Social Work / NGO', description: 'Community service, nonprofit work, social development, and welfare programs.' },
  { name: 'Student', description: 'School, college, university, coaching, and professional-course students.' },
  { name: 'Homemaker', description: 'Household management, family care, and home-based responsibilities.' },
  { name: 'Retired', description: 'Retired community members with professional and life experience.' },
  { name: 'Self-Employed / Freelancer', description: 'Independent professionals, consultants, gig workers, and freelancers.' },
  { name: 'Unemployed / Seeking Work', description: 'Members currently looking for employment, training, or new opportunities.' },
  { name: 'Other', description: 'Any profession or work category not listed above.' }
];

export const professionMembers = [
  {
    name: 'Joginder Mann',
    profession: 'Legal Profession',
    role: 'Advocate',
    gotra: 'Mann',
    location: 'Not provided'
  }
];

export const events = [
  {
    title: 'Jaat Samelan 2026',
    date: '2026-03-22',
    displayDate: '22 March 2026',
    location: 'Jaat Samaj Community Gathering',
    description: 'This Jaat Samelan was held on 22 March with community members, cultural moments, and shared samaj connections.',
    type: 'Past Event',
    image: samelanPhoto3,
    images: [
      samelanPhoto1,
      samelanPhoto2,
      samelanPhoto3,
      samelanPhoto4,
      samelanPhoto5,
      samelanPhoto6,
      samelanPhoto7,
      samelanPhoto8,
      samelanPhoto9,
      samelanPhoto10,
      samelanPhoto11,
      samelanPhoto12,
      samelanPhoto13,
      samelanPhoto14
    ],
    actionLabel: 'View Memories',
    registrationClosed: true
  },
  {
    title: 'Jaat Samelan Coming Soon',
    date: '2026-12-31',
    displayDate: 'Coming Soon',
    location: 'Venue will be announced soon',
    description: 'The next Jaat Samelan is coming soon. Register your interest and stay ready for the upcoming community gathering.',
    type: 'Upcoming Samelan',
    image: samelanPhoto2,
    actionLabel: 'Register For Samelan'
  }
];

export const organisations = [
  {
    name: 'All India Jat Mahasabha',
    description: 'Premier organization representing Jat community interests',
    members: '50K+',
    founded: '1922'
  },
  {
    name: 'Jat Sabha Haryana',
    description: 'State-level organization for Haryana Jats',
    members: '25K+',
    founded: '1950'
  },
  {
    name: 'Jat Federation Rajasthan',
    description: 'Rajasthan Jat community federation',
    members: '20K+',
    founded: '1965'
  },
  {
    name: 'Punjab Jat Association',
    description: 'Punjab-based Jat community organization',
    members: '30K+',
    founded: '1947'
  }
];

export const clubs = [
  {
    name: 'Jat Youth Club',
    description: 'Youth engagement and skill development',
    members: '5K+',
    activities: 'Sports, Education, Networking'
  },
  {
    name: 'Jat Business Club',
    description: 'Entrepreneurship and business networking',
    members: '3K+',
    activities: 'Mentorship, Investments, Trade'
  },
  {
    name: 'Jat Cultural Club',
    description: 'Preservation of Jat traditions and culture',
    members: '4K+',
    activities: 'Festivals, Arts, Heritage'
  },
  {
    name: 'Jat Sports Club',
    description: 'Sports and fitness activities',
    members: '6K+',
    activities: 'Tournaments, Training, Fitness'
  }
];

export const helplineContacts = [
  {
    title: 'Emergency Helpline',
    number: '+91 99998 85350',
    description: '24/7 emergency assistance for Jat community members',
    type: 'Emergency'
  },
  {
    title: 'Legal Aid Helpline',
    number: '+91 99998 85350',
    description: 'Legal assistance and guidance',
    type: 'Legal'
  },
  {
    title: 'Medical Helpline',
    number: '+91 99998 85350',
    description: 'Medical emergencies and health support',
    type: 'Medical'
  },
  {
    title: 'Business Support',
    number: '+91 99998 85350',
    description: 'Business guidance and entrepreneurship support',
    type: 'Business'
  }
];

export const galleryImages = [
  { src: samelanPhoto1, alt: 'Jaat Samelan community welcome moment on 22 March', category: 'Jaat Samelan' },
  { src: samelanPhoto2, alt: 'Jaat Samelan members gathered for the community event', category: 'Jaat Samelan' },
  { src: samelanPhoto3, alt: 'Jaat Samelan stage and audience atmosphere', category: 'Jaat Samelan' },
  { src: samelanPhoto4, alt: 'Jaat Samelan cultural photo moment', category: 'Jaat Samelan' },
  { src: samelanPhoto5, alt: 'Jaat Samelan group interaction', category: 'Jaat Samelan' },
  { src: samelanPhoto6, alt: 'Jaat Samelan community participation', category: 'Jaat Samelan' },
  { src: samelanPhoto7, alt: 'Jaat Samelan gathering photo', category: 'Jaat Samelan' },
  { src: samelanPhoto8, alt: 'Jaat Samelan event memory', category: 'Jaat Samelan' },
  { src: samelanPhoto9, alt: 'Jaat Samelan shared community moment', category: 'Jaat Samelan' },
  { src: samelanPhoto10, alt: 'Jaat Samelan people and program photo', category: 'Jaat Samelan' },
  { src: samelanPhoto11, alt: 'Jaat Samelan event highlight', category: 'Jaat Samelan' },
  { src: samelanPhoto12, alt: 'Jaat Samelan celebration and connection', category: 'Jaat Samelan' },
  { src: samelanPhoto13, alt: 'Jaat Samelan community members photo', category: 'Jaat Samelan' },
  { src: samelanPhoto14, alt: 'Jaat Samelan closing memory', category: 'Jaat Samelan' },
  { src: '/images/jat-community-gathering.png', alt: 'Community gathering in a courtyard', category: 'Community' },
  { src: '/images/jat-agriculture-fields.png', alt: 'Agricultural fields and rural landscape', category: 'Agriculture' },
  { src: '/images/jat-youth-network.png', alt: 'Youth and professional networking event', category: 'Youth' },
  { src: '/images/jat-heritage-hero.png', alt: 'Heritage landscape with rural architecture', category: 'Culture' },
  { src: '/images/jat-regions-panorama.png', alt: 'Regional heritage panorama', category: 'Regions' },
  { src: '/images/jat-community-gathering.png', alt: 'Family and community celebration', category: 'Culture' },
  { src: '/images/jat-youth-network.png', alt: 'Professional excellence and mentorship', category: 'Business' },
  { src: '/images/jat-agriculture-fields.png', alt: 'Farming excellence and land stewardship', category: 'Agriculture' }
];
