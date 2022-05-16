export interface RootObject {
  Demographics: Demographics;
  "Mosaic Origins": MosaicOrigins;
  "General - Property": GeneralProperty;
  "General - Work Lives": GeneralWorkLives;
  "General - Finances": GeneralFinances;
  "General - Home Lives": GeneralHomeLives;
  "General - Perspectives": GeneralPerspectives;
  "Community Safety": CommunitySafety;
  Education: Education;
  Health: Health;
  "Engagement & Communications": EngagementCommunications;
  "Online Activity": OnlineActivity;
}

interface OnlineActivity {
  Total: Total;
  Automotive: Automotive;
  Aviation: Aviation;
  Business: Business;
  "Business and finance": BusinessAndFinance;
  Community: Community;
  "Computers and Internet": ComputersAndInternet;
  Education: Education2;
  Entertainment: Entertainment;
  "Food and beverage": FoodAndBeverage;
  Gambling: Gambling;
  Government: Government;
  "Health and medical": HealthAndMedical;
  Lifestyle: Lifestyle;
  Music: Music;
  "News and media": NewsAndMedia;
  "Shopping and classifieds": ShoppingAndClassifieds;
  Sports: Sports;
  Travel: Travel;
  Television: Television;
}

interface Television {
  "Television sites": GSICode;
  "Networks and channels sites": GSICode;
  "Programmes sites": GSICode;
}

interface Travel {
  "Travel sites": GSICode;
  "Destinations and accommodation sites": GSICode;
  "Transport sites": GSICode;
  "Agencies sites": GSICode;
  "Cruises sites": GSICode;
  TripAdvisor: GSICode;
  Virgin: GSICode;
  "National Rail": GSICode;
  "Transport for London": GSICode;
  Thetrainline: GSICode;
}

interface Sports {
  "Sports sites": GSICode;
  "Cricket sites": GSICode;
  "Cycling sites": GSICode;
  "Golf sites": GSICode;
  "Football sites": GSICode;
  "Horse racing sites": GSICode;
  "Brands sites": GSICode;
  "Motorsport sites": GSICode;
  "Fantasy sites": GSICode;
  Cricinfo: GSICode;
  "Premier League": GSICode;
  "Live Score": GSICode;
  "Racing Post": GSICode;
}

interface ShoppingAndClassifieds {
  "Shopping and classifieds sites": GSICode;
  "Classifieds sites": GSICode;
  "Auction sites": GSICode;
  "Apparel and accessories sites": GSICode;
  "Appliances and electronics sites": GSICode;
  "Flowers and gifts sites": GSICode;
  "Grocery and alcohol sites": GSICode;
  "House and garden sites": GSICode;
  "Music sites": GSICode;
  "Sport and fitness sites": GSICode;
  "Automotive sites": GSICode;
  "Ticketing sites": GSICode;
  "Baby products sites": GSICode;
  eBay: GSICode;
  Mothercare: GSICode;
  Gumtree: GSICode;
  Asda: GSICode;
  Littlewoods: GSICode;
  Groupon: GSICode;
  HotUKDeals: GSICode;
  Ticketmaster: GSICode;
}

interface NewsAndMedia {
  "News and media sites": GSICode;
  "Broadcast media sites": GSICode;
  "Weather sites": GSICode;
  "Daily Mail": GSICode;
  "The Guardian": GSICode;
  "The Telegraph": GSICode;
  "The Sun": GSICode;
  "The Independent": GSICode;
  Mirror: GSICode;
  "Which?": GSICode;
  "Financial Times": GSICode;
  "Met Office": GSICode;
  AccuWeather: GSICode;
  "Huffington Post": GSICode;
  NewsNow: GSICode;
}

interface Music {
  "Music sites": GSICode;
  "Bands and artists sites": GSICode;
}

interface Lifestyle {
  "Lifestyle sites": GSICode;
  "Fashion sites": GSICode;
  "Gay and lesbian sites": GSICode;
  "Womens sites": GSICode;
  "Mens sites": GSICode;
  "House and garden sites": GSICode;
  "Hobbies and crafts sites": GSICode;
  "Pets and animals sites": GSICode;
  "Blogs and personal sites": GSICode;
  "Family sites": GSICode;
  "Environment sites": GSICode;
  "Childrens sites": GSICode;
  Tumblr: GSICode;
  BabyCentre: GSICode;
  Ancestry: GSICode;
  Mumsnet: GSICode;
}

interface HealthAndMedical {
  "Health and medical sites": GSICode;
  "Wellbeing sites": GSICode;
  "Pharmaceutical and medical products sites": GSICode;
  "Primary and specialist sites": GSICode;
  "Organisations sites": GSICode;
  NHS: GSICode;
}

interface Government {
  "Government sites": GSICode;
  "Central sites": GSICode;
  Directgov: GSICode;
}

interface Gambling {
  "Bingo sites": GSICode;
  "Gambling sites": GSICode;
  "Games sites": GSICode;
  "Lottery sites": GSICode;
  "Sport betting sites": GSICode;
  "National Lottery": GSICode;
}

interface FoodAndBeverage {
  "Food and beverage sites": GSICode;
  "Brands and manufacturers sites": GSICode;
  "Lifestyle and reference sites": GSICode;
  "Restaurants and catering sites": GSICode;
}

interface Entertainment {
  "Entertainment sites": GSICode;
  "Arts sites": GSICode;
  "Gambling sites": GSICode;
  "Games sites": GSICode;
  "Humour sites": GSICode;
  "Mobile phones sites": GSICode;
  "Movies sites": GSICode;
  "Nightlife sites": GSICode;
  "Performing arts sites": GSICode;
  "Personalities sites": GSICode;
  "Radio sites": GSICode;
  BBC: GSICode;
  "Channel 4": GSICode;
  Dailymotion: GSICode;
  "Digital Spy": GSICode;
  Flickr: GSICode;
  IMDb: GSICode;
  Instagram: GSICode;
  ITV: GSICode;
  LOVEFiLM: GSICode;
  Netflix: GSICode;
  ROBLOX: GSICode;
  Sky: GSICode;
  YouTube: GSICode;
}

interface Education2 {
  "Education sites": GSICode;
  "Institutions sites": GSICode;
  "Reference sites": GSICode;
  wikiHow: GSICode;
  Wikipedia: GSICode;
}

interface ComputersAndInternet {
  "Computers and internet sites": GSICode;
  "Social networking and forums sites": GSICode;
  "Web development sites": GSICode;
  Apple: GSICode;
  "Ask.fm": GSICode;
  Bing: GSICode;
  Facebook: GSICode;
  Google: GSICode;
  LinkedIn: GSICode;
  Myspace: GSICode;
  Pinterest: GSICode;
  Reddit: GSICode;
  Yahoo: GSICode;
}

interface Community {
  "Community sites": GSICode;
}

interface BusinessAndFinance {
  "Business information sites": GSICode;
  "Employment and training sites": GSICode;
  "Insurance sites": GSICode;
  "Property sites": GSICode;
  "Stocks and shares sites": GSICode;
  "Telecommunications sites": GSICode;
  "Utilities sites": GSICode;
  "London Stock Exchange": GSICode;
  "Money Saving Expert": GSICode;
  MoneySuperMarket: GSICode;
  PrimeLocation: GSICode;
  Propertyfinder: GSICode;
  RBS: GSICode;
  Rightmove: GSICode;
  "Royal Mail": GSICode;
  Yell: GSICode;
}

interface Business {
  "Business sites": GSICode;
}

interface Aviation {
  "Aviation sites": GSICode;
  "Commercial airlines sites": GSICode;
}

interface Automotive {
  "Automotive sites": GSICode;
  "Classifieds sites": GSICode;
  "Dealerships sites": GSICode;
  "Manufacturers sites": GSICode;
  "Motorcycling sites": GSICode;
  "Motorsport sites": GSICode;
  AutoTrader: GSICode;
}

interface Total {
  "Total pages per week": GSICode;
}

interface EngagementCommunications {
  "Banking channels": BankingChannels;
  "Online banking usage": OnlineBankingUsage;
  "Technology owned (or access)": TechnologyOwnedorAccess;
  "Attitude to new technology": AttitudeToNewTechnology;
  "Channel preference": ChannelPreference;
  "Contacting organisations preference": ContactingOrganisationsPreference;
  "Offers and promotions preference": OffersAndPromotionsPreference;
  "Customer research preference": OffersAndPromotionsPreference;
  "Internet usage": InternetUsage;
  "Internet speed": InternetSpeed;
  "Email access": EmailAccess;
  "Facebook access": EmailAccess;
  "Twitter access": EmailAccess;
  "Internet surfing": EmailAccess;
  "Online grocery shopping": EmailAccess;
  "Manage utility accounts online": EmailAccess;
  "Online banking": EmailAccess;
  "Video on smartphone, tablet, laptop or PC": EmailAccess;
  "Watching content on smartphone, tablet, laptop or PC": EmailAccess;
  "Listening to music on technology": EmailAccess;
  "Phone services": PhoneServices;
  "Mobile connection": MobileConnection;
  "Offline gaming": EmailAccess;
  "Online gaming": EmailAccess;
  Newspapers: Newspapers;
  "TV service provider (main TV)": TVServiceProvidermainTV;
  "Digital or cable TV provider": DigitalOrCableTVProvider;
}

interface DigitalOrCableTVProvider {
  "Cable digital": GSICode;
  "Talk Talk (formally Homechoice)": GSICode;
  "Virgin Media (formally NTL or Telewest)": GSICode;
  "Sky Digital": GSICode;
  "Sky+": GSICode;
  Other: GSICode;
}

interface TVServiceProvidermainTV {
  Freeview: GSICode;
  Freesat: GSICode;
  BT: GSICode;
  Sky: GSICode;
  "Virgin Media": GSICode;
}

interface Newspapers {
  "The Sun": GSICode;
  "Daily Mirror": GSICode;
  "Daily Record": GSICode;
  "Daily Star": GSICode;
  "Daily Mail": GSICode;
  "Daily Express": GSICode;
  "The Daily Telegraph": GSICode;
  "The Guardian": GSICode;
  "The Independent": GSICode;
  "The Times": GSICode;
}

interface MobileConnection {
  "Prepay (pay as you go)": GSICode;
  Contract: GSICode;
  "No mobile phone": GSICode;
}

interface PhoneServices {
  "Mobile phone": GSICode;
  "Home landline": GSICode;
  "Narrowband internet at home": GSICode;
  "Broadband internet at home": GSICode;
  "Narrowband internet at work / college": GSICode;
  "Broadband internet at work / college": GSICode;
  "VOIP (Voice Over IP)": GSICode;
  "Mobile broadband": GSICode;
}

interface EmailAccess {
  "Every day": GSICode;
  "Most days": GSICode;
  Weekly: GSICode;
  Monthly: GSICode;
  "Not at all": GSICode;
}

interface InternetSpeed {
  "<2Mbps": GSICode;
  "Mean Internet speed": GSICode;
  "Median Internet speed": GSICode;
  "Maximum Internet speed": GSICode;
}

interface InternetUsage {
  "Several times a day": GSICode;
  "Roughly every day": GSICode;
  "Less than every day": GSICode;
}

interface OffersAndPromotionsPreference {
  "Mobile call": GSICode;
  SMS: GSICode;
  Email: GSICode;
  Post: GSICode;
  Landline: GSICode;
  "Prefer not to be contacted": GSICode;
  "No preference": GSICode;
}

interface ContactingOrganisationsPreference {
  Phone: GSICode;
  Email: GSICode;
  Online: GSICode;
  Post: GSICode;
  "Shop / branch": GSICode;
  Other: GSICode;
}

interface ChannelPreference {
  "Mobile call": GSICode;
  SMS: GSICode;
  Email: GSICode;
  Post: GSICode;
  Landline: GSICode;
  "Prefer not to be contacted": GSICode;
}

interface AttitudeToNewTechnology {
  "Love technology and are always first to have latest gadgets": GSICode;
  "Like technology and get latest gadgets within 6 months": GSICode;
  "Like technology but will not pay a premium for latest gadgets": GSICode;
  "Will upgrade technology when old devices are obsolete": GSICode;
  "Do not like new technology and only change when necessary": GSICode;
}

interface TechnologyOwnedorAccess {
  Smartphone: GSICode;
  Tablet: GSICode;
  Laptop: GSICode;
  "PC (not laptop)": GSICode;
  "Smart TV": GSICode;
}

interface OnlineBankingUsage {
  "Yes - Online facilities of traditional bank": GSICode;
  "Yes - Bank with online bank": GSICode;
  No: GSICode;
}

interface BankingChannels {
  "ATM (cash machine)": GSICode;
  Branch: GSICode;
  Online: GSICode;
  Telephone: GSICode;
  "Mobile phone (WAP/SMS)": GSICode;
  Post: GSICode;
}

interface Health {
  "Parking permits": ParkingPermits;
  "Care providers": CareProviders;
  "Health status": HealthStatus;
  "Activity limited": ActivityLimited;
  "Pharmaceutical and chemist products": PharmaceuticalAndChemistProducts;
  "Treatments used": TreatmentsUsed;
  "Talked about health issues": TalkedAboutHealthIssues;
  "Health references": HealthReferences;
  "Medical conditions": MedicalConditions;
  "Care for medical conditions": CareForMedicalConditions;
  "Visits to GP": VisitsToGP;
  "Corrective aids": CorrectiveAids;
  "Weight loss": WeightLoss;
  "Insomnia, stress & anxiety": InsomniaStressAnxiety;
  Supplements: Supplements;
  "Fast food": FastFood;
  Smoking: Smoking;
  "Alcohol consumption": AlcoholConsumption;
  "Alcohol consumption at home": AlcoholConsumptionAtHome;
  "Alcohol consumption away from home": AlcoholConsumptionAwayFromHome;
  "Private health and medical insurance": PrivateHealthAndMedicalInsurance;
  "Taking care of self": TakingCareOfSelf;
  "Feelings about weight": FeelingsAboutWeight;
  Dieting: Dieting;
  "Keeping in shape": KeepingInShape;
  "Sport participation": SportParticipation;
  "Exercise (jogging, walking, gym)": ExercisejoggingWalkingGym;
  "Self-diagnosed conditions": SelfdiagnosedConditions;
}

interface SelfdiagnosedConditions {
  "Allergy - Contact dermatitis": GSICode;
  "Allergy - Hay fever / Rhinitis": GSICode;
  "Allergy - Nut allergy": GSICode;
  "Allergy - Pet allergy": GSICode;
  "Allergy - Sinusitis": GSICode;
  "Allergy - Urticaria / Hives": GSICode;
  "Anaemia or iron deficiency": GSICode;
  Angina: GSICode;
  Anxiety: GSICode;
  ADHD: GSICode;
  "Bladder condition - Cystitis": GSICode;
  "Bladder condition - Incontinence": GSICode;
  "Bladder condition - Thrush": GSICode;
  "Cancer - Breast Cancer": GSICode;
  "Chest / lung condition - Asthma": GSICode;
  "Chest / lung condition - Bronchitis": GSICode;
  "Chest / lung condition - COPD": GSICode;
  Depression: GSICode;
  "Diabetes - not sure what type": GSICode;
  "Eye condition - Long-sightedness": GSICode;
  "Eye condition - Short-sightedness / Myopia": GSICode;
  "Gastric condition - Heartburn": GSICode;
  "Gastric condition - IBS": GSICode;
  Haemorrhoids: GSICode;
  "High blood pressure": GSICode;
  "Low blood pressure": GSICode;
  "High cholesterol": GSICode;
  Insomnia: GSICode;
  "Menopausal symptoms": GSICode;
  "Menstrual pain": GSICode;
  Migraine: GSICode;
  "Muscle / joint condition - Osteoarthritis": GSICode;
  Obesity: GSICode;
  "Post-natal depression": GSICode;
  Sciatica: GSICode;
  "Skin condition - Acne": GSICode;
  "Skin condition - Dermatitis": GSICode;
  "Skin condition - Eczema": GSICode;
  Stress: GSICode;
  Tinnitus: GSICode;
}

interface ExercisejoggingWalkingGym {
  "4+ hours a week": GSICode;
  "2-4 hours a week": GSICode;
  "1-2 hours a week": GSICode;
  "<1 hour a week": GSICode;
  "Do not exercise": GSICode;
}

interface SportParticipation {
  "4+ hours a week": GSICode;
  "2-4 hours a week": GSICode;
  "1-2 hours a week": GSICode;
  "<1 hour a week": GSICode;
  "Do not take part in sport": GSICode;
}

interface KeepingInShape {
  "I do a lot to keep in shape": GSICode;
}

interface Dieting {
  "Often diet": GSICode;
  "Sometimes diet": GSICode;
  "Rarely diet": GSICode;
  "Never diet": GSICode;
}

interface FeelingsAboutWeight {
  "Felt overweight in last year": GSICode;
}

interface TakingCareOfSelf {
  "Do not take care of self as well as should": GSICode;
  "Should do a lot more about own health": GSICode;
  "Eat 5 a day portions of fruit and vegetables": GSICode;
  "Did something to maintain / improve health in last year": GSICode;
}

interface PrivateHealthAndMedicalInsurance {
  "Have personal insurance": GSICode;
  "Do not have personal or household insurance": GSICode;
  "Others in household have insurance": GSICode;
  "Private insurance paid for by self or family member": GSICode;
}

interface AlcoholConsumptionAwayFromHome {
  "Drink alcohol 2 or 3 times a week": GSICode;
  "Drink alcohol once a week": GSICode;
  "Drink alcohol 2 or 3 times a month": GSICode;
  "Drink alcohol once a month": GSICode;
  "Drink alcohol less than once a month": GSICode;
}

interface AlcoholConsumptionAtHome {
  "Drink alcohol once a day or more": GSICode;
  "Drink alcohol 2 or 3 times a week": GSICode;
  "Drink alcohol once a week": GSICode;
  "Drink alcohol 2 or 3 times a month": GSICode;
  "Drink alcohol once a month": GSICode;
  "Drink alcohol less than once a month": GSICode;
}

interface AlcoholConsumption {
  "Drank any alcoholic drinks in last year": GSICode;
  "Drink alcohol once a day or more": GSICode;
  "Drink alcohol 2 or 3 times a week": GSICode;
  "Drink alcohol once a week": GSICode;
  "Drink alcohol 2 or 3 times a month": GSICode;
  "Drink alcohol once a month": GSICode;
  "Drink alcohol less than once a month": GSICode;
}

interface Smoking {
  "Smoked cigarettes in last year": GSICode;
  "Heavy smokers": GSICode;
  "Medium smokers": GSICode;
  "Light smokers": GSICode;
  "Tried to give up smoking in last year": GSICode;
}

interface FastFood {
  "Takeaway fast food in last year": GSICode;
  "Eat-in fast food in last year": GSICode;
  "Takeaway fast food once a week or more": GSICode;
}

interface Supplements {
  "Taken vitamins / supplements in last year": GSICode;
}

interface InsomniaStressAnxiety {
  "Taken remedies in last year": GSICode;
  "Taken remedy for insomnia": GSICode;
  "Taken remedy for stress": GSICode;
  "Taken remedy for anxiety": GSICode;
}

interface WeightLoss {
  "Trying to lose weight": GSICode;
  "Use slimming products": GSICode;
}

interface CorrectiveAids {
  Dentures: GSICode;
  Glasses: GSICode;
  "Contact lenses": GSICode;
  "Hearing aids": GSICode;
}

interface VisitsToGP {
  "More than once a month": GSICode;
  "About once a month": GSICode;
  "Once every 2-3 months": GSICode;
  "Once every 4-6 months": GSICode;
  "Once every 7-12 months": GSICode;
  "Not seen GP at all": GSICode;
}

interface CareForMedicalConditions {
  "Regular medical check ups": GSICode;
  "Try to lead a healthy life": GSICode;
  "Follow a particular diet": GSICode;
  "Follow doctors prescription": GSICode;
  "Alternative medicine": GSICode;
  "I do nothing": GSICode;
}

interface MedicalConditions {
  Asthma: GSICode;
  Arthritis: GSICode;
  Rheumatism: GSICode;
  "High blood pressure": GSICode;
  "Poor blood circulation": GSICode;
  "Hearing problems": GSICode;
  "High cholesterol": GSICode;
  "Heart problems": GSICode;
  Diabetes: GSICode;
  Depression: GSICode;
}

interface HealthReferences {
  Books: GSICode;
  "NHS Direct website": GSICode;
  "Other Internet site": GSICode;
}

interface TalkedAboutHealthIssues {
  "Local GP": GSICode;
  "Specialist doctor": GSICode;
  "Chemist / pharmacist": GSICode;
  "NHS Direct helpline": GSICode;
  "Friends and family": GSICode;
}

interface TreatmentsUsed {
  "Oral care products (excluding toothpaste) in last year": GSICode;
  "Sun tan and sun protection products in last year": GSICode;
}

interface PharmaceuticalAndChemistProducts {
  "Talked to others about products in last year": GSICode;
}

interface ActivityLimited {
  "Health problem or disability limits activities / work": GSICode;
}

interface HealthStatus {
  "Very good health": GSICode;
  "Good health": GSICode;
  "Fair health": GSICode;
  "Bad health": GSICode;
  "Very bad health": GSICode;
}

interface CareProviders {
  "Provides no unpaid care": GSICode;
  "Provides 1-19 hours unpaid care a week": GSICode;
  "Provides 20-49 hours unpaid care a week": GSICode;
  "Provides 50+ hours unpaid care a week": GSICode;
}

interface ParkingPermits {
  "Disabled parking permit (Blue Badge)": GSICode;
}

interface Education {
  "Highest qualification": HighestQualification;
  "Student population": StudentPopulation;
  "Degree level studying": DegreeLevelStudying;
  "Subject area studying": SubjectAreaStudying;
  "Student age": StudentAge;
  "Student gender": Gender;
  "Student nationality": StudentNationality;
  "Term time accommodation": TermTimeAccommodation;
  "Mode of study": ModeOfStudy;
  "Foundation year": DrivingLicence;
  University: University;
  "Student lifestage": StudentLifestage;
  "Mature undergraduates": DrivingLicence;
  "Distance from term address to university": DistanceFromTermAddressToUniversity;
  "Distance from term address to home": DistanceFromTermAddressToHome;
}

interface DistanceFromTermAddressToHome {
  "Living at home": GSICode;
  "0km-10km": GSICode;
  "10km-50km": GSICode;
  "50km-100km": GSICode;
  "100km-200km": GSICode;
  "200km+": GSICode;
  "Not UK": GSICode;
}

interface DistanceFromTermAddressToUniversity {
  "0km-1km": GSICode;
  "1km-5km": GSICode;
  "5km-20km": GSICode;
  "20km-50km": GSICode;
  "50km+": GSICode;
}

interface StudentLifestage {
  "Full-time, Young, Undergraduate": GSICode;
  "Full-time, Young, Postgraduate": GSICode;
  "Part-time, Young, Undergraduate": GSICode;
  "Part-time, Young, Postgraduate": GSICode;
  "Full-time, Old, Undergraduate": GSICode;
  "Full-time, Old, Postgraduate": GSICode;
  "Part-time, Old, Undergraduate": GSICode;
  "Part-time, Old, Postgraduate": GSICode;
}

interface University {
  "Russell Group University": GSICode;
  "Oxford or Cambridge": GSICode;
  "Open University": GSICode;
}

interface ModeOfStudy {
  "Full-time": GSICode;
  Sandwich: GSICode;
  "Part-time": GSICode;
}

interface TermTimeAccommodation {
  "Institution maintained property": GSICode;
  "Parental / guardian home": GSICode;
  Other: GSICode;
  "Not in attendance at institution": GSICode;
  "Own residence": GSICode;
  "Other rented accommodation": GSICode;
  "Private or institution maintained halls of residence": GSICode;
}

interface StudentNationality {
  UK: GSICode;
  "Not UK": GSICode;
}

interface StudentAge {
  "<25": GSICode;
  "26-35": GSICode;
  "36-45": GSICode;
  "46-55": GSICode;
  "56-65": GSICode;
  "66+": GSICode;
}

interface SubjectAreaStudying {
  "1. Medicine & dentistry": GSICode;
  "2. Subjects allied to medicine": GSICode;
  "3. Biological sciences": GSICode;
  "4. Veterinary science": GSICode;
  "5. Agriculture & related subjects": GSICode;
  "6. Physical sciences": GSICode;
  "7. Mathematical sciences": GSICode;
  "8. Computer science": GSICode;
  "9. Engineering & technology": GSICode;
  "A Architecture, building & planning": GSICode;
  "B Social studies": GSICode;
  "C Law": GSICode;
  "D Business & administrative studies": GSICode;
  "E Mass communications & documentation": GSICode;
  "F Languages": GSICode;
  "G Historical & philosophical studies": GSICode;
  "H Creative arts & design": GSICode;
  "I Education": GSICode;
  "J Combined": GSICode;
}

interface DegreeLevelStudying {
  "Doctoral degree": GSICode;
  "Masters degree": GSICode;
  "Bachelors degree with honours": GSICode;
  "Ordinary degree": GSICode;
  "Higher National Diploma": GSICode;
  "Certificates of Higher Education": GSICode;
  "Postgraduate students": GSICode;
  "Undergraduate students": GSICode;
}

interface StudentPopulation {
  "Schoolchildren and students aged 16-17": GSICode;
  "Schoolchildren and students aged 18+": GSICode;
}

interface HighestQualification {
  "No qualifications": GSICode;
  "1-4 GCSE or equivalent": GSICode;
  "A level or 5+ GCSE A*-C or equivalent": GSICode;
  "2+ A level or 4+ AS level or equivalent": GSICode;
  "Degree or higher": GSICode;
  "Other e.g. foreign or work-related": GSICode;
  Apprenticeships: GSICode;
}

interface CommunitySafety {
  "Crime rate": CrimeRate;
}

interface CrimeRate {
  Burglary: GSICode;
  Robbery: GSICode;
  "Criminal damage": GSICode;
  "Drugs crime": GSICode;
  "Public disorder": GSICode;
  Shoplifting: GSICode;
  "Vehicle crimes": GSICode;
  "Violent crimes": GSICode;
  "Anti-social behaviour": GSICode;
}

interface GeneralPerspectives {
  "Values and personality": ValuesAndPersonality;
}

interface ValuesAndPersonality {
  "A womans place is in the home": GSICode;
  "Cannabis should be legalised": GSICode;
  "Contraception is a womans responsibility": GSICode;
  "It is important that companies act ethically": GSICode;
  "Like to be surrounded by different people, cultures and ideas": GSICode;
  "Like to buy from companies who give back to society": GSICode;
  "Children should eat what they are given": GSICode;
  "It is more important to do duty than enjoy oneself": GSICode;
  "Real men dont cry": GSICode;
  "Reports on violence and crime affect the way lead life": GSICode;
  "Rules made to be broken": GSICode;
  "London 2012 Olympics had a positive effect on people": GSICode;
  "Quality of human contact improved by technology": GSICode;
  "Discuss major decisions with partner": GSICode;
  "See self as perfectionist": GSICode;
  "See self as optimist": GSICode;
  "Usually the first to know whats going on": GSICode;
  "See self as a spiritual person": GSICode;
  "Dont like to show real feelings": GSICode;
  "Find it difficult to say no to kids": GSICode;
  "Easily swayed by other peoples views": GSICode;
  "Keen sense of adventure": GSICode;
  "Enjoy life and dont worry about future": GSICode;
  "Like control over people and resources": GSICode;
  "Loathe doing any housework": GSICode;
  "Often do things on the spur of the moment": GSICode;
  "Prefer to work as part of a team": GSICode;
  "Try to keep up with developments in technology": GSICode;
  "Worry a lot about oneself": GSICode;
  "Important family thinks they are doing well": GSICode;
  "Faith is really important": GSICode;
  "A person can be judged by the car they drive": GSICode;
  "Perfectly happy with standard of living": GSICode;
  "Willing to sacrifice time with family to get ahead": GSICode;
  "Dont want responsibility - rather be told what to do": GSICode;
  "Like taking risks": GSICode;
  "Like to pursue a life of challenge, novelty and change": GSICode;
  "Look on work as a career rather than a job": GSICode;
  "Only go to work for money": GSICode;
  "Want to get to the very top in career": GSICode;
  "Worry about work during leisure time": GSICode;
  "Would like to set up own business one day": GSICode;
  "It is important to juggle various tasks": GSICode;
  "There are not enough hours in the day": GSICode;
  "There is little that can be done to change life": GSICode;
  "There is too much concern with the environment": GSICode;
  "Pay more for environmentally friendly products": GSICode;
  "Never buy toiletries and cosmetics tested on animals": GSICode;
  "People have a duty to recycle": GSICode;
  "Worry about car pollution and congestion": GSICode;
  "Ban on smoking in public places is a good idea": GSICode;
  "Make a conscious effort to recycle": GSICode;
  "Would make compromises to help the environment": GSICode;
  "Take positive steps to reduce energy": GSICode;
  "Effects of climate change are too far in future to worry": GSICode;
  "Do environmentally-friendly things if it saves money": GSICode;
  "Not worth helping environment if others dont": GSICode;
  "Companies tend to over-claim their green credentials": GSICode;
  "Do not leave TV / PC on standby for long periods": GSICode;
  "Do not leave tap running while brushing teeth": GSICode;
  "Do not leave heating on when out for a few hours": GSICode;
  "Do not buy something if it has too much packaging": GSICode;
  "Take own shopping bags when shopping": GSICode;
  "Re-use items like empty bottles and envelopes": GSICode;
  "Do not leave mobile phone charger in socket": GSICode;
  "Recycle items rather than throwing away": GSICode;
  "Make effort to cut down on gas / electricity": GSICode;
  "Make effort to cut down on water": GSICode;
  "Reasonable knowledge of climate change / global warming": GSICode;
  "Reasonable knowledge of carbon footprints": GSICode;
  "Reasonable knowledge of CO2 emissions": GSICode;
  "Reasonable knowledge of carbon offsetting": GSICode;
}

interface GeneralHomeLives {
  "Length of residency": LengthOfResidency;
  Supermarkets: Supermarkets;
  "Driving licence": DrivingLicence;
  "Car ownership": CarOwnership;
  "Transport owned": TransportOwned;
  "Organisations belong to": OrganisationsBelongTo;
  "Driving mileage (average per year)": DrivingMileageaveragePerYear;
  "Value of charitable donations": ValueOfCharitableDonations;
  "Charities donated to in last year": CharitiesDonatedToInLastYear;
  "Motivated to donate by": MotivatedToDonateBy;
}

interface MotivatedToDonateBy {
  "Appeals on TV": GSICode;
  "Someone collecting in street / calling at home": GSICode;
  "Direct mail to home": GSICode;
  "Fundraising by friends / colleagues / self": GSICode;
  "News / current affairs report": GSICode;
}

interface CharitiesDonatedToInLastYear {
  "Poppy Day Appeal": GSICode;
  "Visually Impaired": GSICode;
  "Cancer Research": GSICode;
  "Heart Disease Research": GSICode;
  "Mental Health": GSICode;
  Elderly: GSICode;
  Children: GSICode;
  "Animal Welfare": GSICode;
  "Wildlife / Conservation / Environment": GSICode;
  Disabled: GSICode;
  "Overseas Development / Relief": GSICode;
  "Famine Relief": GSICode;
  "Hospitals & Hospices": GSICode;
  "Religious Groups": GSICode;
  "Voluntary Emergency Services": GSICode;
}

interface ValueOfCharitableDonations {
  "�200+ in last year": GSICode;
  "<�10 in last year": GSICode;
}

interface DrivingMileageaveragePerYear {
  "<2,000 miles": GSICode;
  "2,000-3,999 miles": GSICode;
  "4,000-5,999 miles": GSICode;
  "6,000-8,999 miles": GSICode;
  "9,000-12,499 miles": GSICode;
  "12,500+ miles": GSICode;
}

interface OrganisationsBelongTo {
  Religious: GSICode;
  "Sports / Hobbies": GSICode;
  Charity: GSICode;
}

interface TransportOwned {
  Car: GSICode;
  "Van / light commercial vehicle": GSICode;
  Campervan: GSICode;
  Motorcycle: GSICode;
  Bicycle: GSICode;
}

interface CarOwnership {
  "Yes - Owned": GSICode;
  "Yes - Leased / company car": GSICode;
  "Yes - Other": GSICode;
  No: GSICode;
}

interface DrivingLicence {
  Yes: GSICode;
}

interface Supermarkets {
  Aldi: GSICode;
  Asda: GSICode;
  "Co-op": GSICode;
  Iceland: GSICode;
  Lidl: GSICode;
  "M&S": GSICode;
  Morrisons: GSICode;
  Netto: GSICode;
  Sainsburys: GSICode;
  Spar: GSICode;
  Tesco: GSICode;
  Waitrose: GSICode;
  "None of these": GSICode;
}

interface LengthOfResidency {
  "Average length of residency": GSICode;
  "<1 year": GSICode;
  "1-3 years": GSICode;
  "4-10 years": GSICode;
  "11+ years": GSICode;
  "1 year": GSICode;
  "2 years": GSICode;
  "3 years": GSICode;
  "4 years": GSICode;
  "5 years": GSICode;
  "6 years": GSICode;
  "7 years": GSICode;
  "8 years": GSICode;
  "9 years": GSICode;
  "10 years": GSICode;
}

interface GeneralFinances {
  "Personal income": PersonalIncome;
  "Household income": HouseholdIncome;
  "Affluence band": AffluenceBand;
  "Small or home office": SmallOrHomeOffice;
  "Outstanding mortgage": OutstandingMortgage;
  "Financial stress": FinancialStress;
  "Benefit claimants (adults)": BenefitClaimantsadults;
  "Benefit claimants (households)": BenefitClaimantshouseholds;
  "State benefits received": StateBenefitsReceived;
  "Method of receipt of state benefits": MethodOfReceiptOfStateBenefits;
  "Current accounts": CurrentAccounts;
}

interface CurrentAccounts {
  "Hold no current accounts": GSICode;
}

interface MethodOfReceiptOfStateBenefits {
  "Paid into bank / building society account": GSICode;
  "Paid into Post Office card account": GSICode;
}

interface StateBenefitsReceived {
  "Council Tax Benefit": GSICode;
  "Housing Benefit": GSICode;
}

interface BenefitClaimantshouseholds {
  "Child Benefit": GSICode;
  "Tax Credits": GSICode;
}

interface BenefitClaimantsadults {
  "Jobseekers Allowance": GSICode;
  "Income Support Allowance": GSICode;
  "State Pension": GSICode;
  "Disability Living Allowance": GSICode;
  "Employment and Support Allowance": GSICode;
  "Incapacity Benefit / Severe Disability Allowance": GSICode;
  "Pension Credit": GSICode;
}

interface FinancialStress {
  "Comfortable on household income": GSICode;
  "Coping on household income": GSICode;
  "Difficult on household income": GSICode;
  "Very difficult on household income": GSICode;
}

interface OutstandingMortgage {
  "Outstanding mortgage value": GSICode;
  "No outstanding mortgage": GSICode;
  "<�50k": GSICode;
  "�50k-�99k": GSICode;
  "�100k-�149k": GSICode;
  "�150k-�249k": GSICode;
  "�250k+": GSICode;
}

interface SmallOrHomeOffice {
  "Small or home office": GSICode;
}

interface AffluenceBand {
  "0-5%": GSICode;
  "6-10%": GSICode;
  "11-15%": GSICode;
  "16-20%": GSICode;
  "21-25%": GSICode;
  "26-30%": GSICode;
  "31-35%": GSICode;
  "36-40%": GSICode;
  "41-45%": GSICode;
  "46-50%": GSICode;
  "51-55%": GSICode;
  "56-60%": GSICode;
  "61-65%": GSICode;
  "66-70%": GSICode;
  "71-75%": GSICode;
  "76-80%": GSICode;
  "81-85%": GSICode;
  "86-90%": GSICode;
  "91-95%": GSICode;
  "96-100%": GSICode;
}

interface HouseholdIncome {
  "Median income": GSICode;
  "Mean income": GSICode;
  "<�15k": GSICode;
  "�15k-�19k": GSICode;
  "�20k-�29k": GSICode;
  "�30k-�39k": GSICode;
  "�40k-�49k": GSICode;
  "�50k-�59k": GSICode;
  "�60k-�69k": GSICode;
  "�70k-�99k": GSICode;
  "�100k-�149k": GSICode;
  "�150k+": GSICode;
}

interface PersonalIncome {
  "Median income": GSICode;
  "Mean income": GSICode;
  "<�10k": GSICode;
  "�10k-�14k": GSICode;
  "�15k-�19k": GSICode;
  "�20k-�29k": GSICode;
  "�30k-�39k": GSICode;
  "�40k-�49k": GSICode;
  "�50k-�59k": GSICode;
  "�60k-�69k": GSICode;
  "�70k-�99k": GSICode;
  "�100k+": GSICode;
}

interface GeneralWorkLives {
  "Employment status": EmploymentStatus;
  Directors: Directors;
  "Directors in household": Directors;
  "Level of responsibility": LevelOfResponsibility;
  Industry: Industry;
}

interface Industry {
  "A Agriculture, forestry and fishing": GSICode;
  "B Mining and quarrying": GSICode;
  "C Manufacturing": GSICode;
  "D Electricity, gas, steam and air conditioning": GSICode;
  "E Water supply, sewerage, waste management": GSICode;
  "F Construction": GSICode;
  "G Wholesale and retail trade": GSICode;
  "H Transport and storage": GSICode;
  "I Accommodation and food service": GSICode;
  "J Information and communication": GSICode;
  "K Financial and insurance": GSICode;
  "L Real estate activities": GSICode;
  "M Professional, scientific and technical": GSICode;
  "N Administrative and support service": GSICode;
  "O Public administration and defence": GSICode;
  "P Education": GSICode;
  "Q Human health and social work": GSICode;
  "R,S Arts, entertainment and recreation": GSICode;
}

interface LevelOfResponsibility {
  "1. Higher managerial, administrative and professional": GSICode;
  "1.1 Large employers, higher managerial and administrative": GSICode;
  "1.2 Higher professional occupations": GSICode;
  "2. Lower managerial, administrative and professional": GSICode;
  "3. Intermediate occupations": GSICode;
  "4. Small employers and own account workers": GSICode;
  "5. Lower supervisory and technical occupations": GSICode;
  "6. Semi-routine occupations": GSICode;
  "7. Routine occupations": GSICode;
  "8. Never worked and long-term unemployed": GSICode;
  "8.1 Never worked": GSICode;
  "8.2 Long-term unemployed": GSICode;
}

interface Directors {
  "Not director": GSICode;
  "Director of small company (<50 employees)": GSICode;
  "Director of large company (>=50 employees)": GSICode;
}

interface EmploymentStatus {
  "Employed full-time / other": GSICode;
  "Student / unemployed": GSICode;
  "Part-time / housewife": GSICode;
  Retired: GSICode;
}

interface GeneralProperty {
  "Number of bedrooms": NumberOfBedrooms;
  "Property type": PropertyType;
  Tenure: Tenure;
  "Property build year": PropertyBuildYear;
  "Access to amenities": AccessToAmenities;
  "Land use": LandUse;
  Accessibility: Accessibility;
  Urbanity: Urbanity;
  "Residential property value": ResidentialPropertyValue;
  "Council tax band": CouncilTaxBand;
}

interface CouncilTaxBand {
  A: GSICode;
  B: GSICode;
  C: GSICode;
  D: GSICode;
  E: GSICode;
  F: GSICode;
  G: GSICode;
  H: GSICode;
  I: GSICode;
}

interface ResidentialPropertyValue {
  "Median value": GSICode;
  "Mean value": GSICode;
  "<�40k": GSICode;
  "�40k-�59k": GSICode;
  "�60k-�79k": GSICode;
  "�80k-�99k": GSICode;
  "�100k-�124k": GSICode;
  "�125k-�149k": GSICode;
  "�150k-�199k": GSICode;
  "�200k-�249k": GSICode;
  "�250k-�299k": GSICode;
  "�300k-�399k": GSICode;
  "�400k-�499k": GSICode;
  "�500k-�749k": GSICode;
  "�750k-�999k": GSICode;
  "�1m+": GSICode;
}

interface Urbanity {
  "Generalised urbanity measure": GSICode;
}

interface Accessibility {
  "Access to shopping centres": GSICode;
  "Access to high streets": GSICode;
}

interface LandUse {
  "Hospital area within 125 metres": GSICode;
  "Sports complex within 125 metres": GSICode;
  "University within 125 metres": GSICode;
}

interface AccessToAmenities {
  "Distance to motorway (km)": GSICode;
  "Distance to university (km)": GSICode;
  "Distance to school (km)": GSICode;
  "Distance to railway station (km)": GSICode;
  "Distance to GP surgery (km)": GSICode;
  "Distance to dentist (km)": GSICode;
  "Distance to pharmacy (km)": GSICode;
}

interface PropertyBuildYear {
  "Pre 1870": GSICode;
  "1871-1919": GSICode;
  "1920-1945": GSICode;
  "1946-1954": GSICode;
  "1955-1979": GSICode;
  "Post 1980": GSICode;
}

interface Tenure {
  Owned: GSICode;
  Rented: GSICode;
  "Council / HA": GSICode;
}

interface PropertyType {
  Detached: GSICode;
  "Semi-detached": GSICode;
  Bungalow: GSICode;
  Terraced: GSICode;
  Flat: GSICode;
  "Purpose built flats": GSICode;
  "Converted flats": GSICode;
  Farm: GSICode;
  "Named building": GSICode;
}

interface NumberOfBedrooms {
  "1 bedroom": GSICode;
  "2 bedrooms": GSICode;
  "3 bedrooms": GSICode;
  "4 bedrooms": GSICode;
  "5+ bedrooms": GSICode;
}

interface MosaicOrigins {
  "Ethnic background": EthnicBackground;
}

interface EthnicBackground {
  English: GSICode;
  Celtic: GSICode;
  Irish: GSICode;
  "Western European": GSICode;
  Pakistani: GSICode;
  "Eastern European": GSICode;
  Italian: GSICode;
  Hindu: GSICode;
  Hispanic: GSICode;
  Sikh: GSICode;
  "Other Muslim": GSICode;
  "Black African": GSICode;
  Bangladeshi: GSICode;
  Chinese: GSICode;
  "Other East Asian": GSICode;
  "Greek / Greek Cypriot": GSICode;
  Turkish: GSICode;
  "Jewish / Armenian": GSICode;
  "Tamil and Sri Lanka": GSICode;
  Somali: GSICode;
  "Black Caribbean": GSICode;
}

interface Demographics {
  Gender: Gender;
  Age: Age;
  "Presence of children": PresenceOfChildren;
  "Number of children": NumberOfChildren;
  "Children age groups": ChildrenAgeGroups;
  Motherhood: Motherhood;
  "Household additions": HouseholdAdditions;
  "Marital status": MaritalStatus;
  "Household population": HouseholdPopulation;
  "Household composition": HouseholdComposition;
  "Family lifestage": FamilyLifestage;
  "Household structure": HouseholdStructure;
  "National Social Grade": NationalSocialGrade;
  "Indices of Deprivation": IndicesOfDeprivation;
}

interface IndicesOfDeprivation {
  "Index of Multiple Deprivation": GSICode;
  Income: GSICode;
  Employment: GSICode;
  Health: GSICode;
  Education: GSICode;
  Children: GSICode;
  Skills: GSICode;
  "Housing barriers": GSICode;
  "Geographic barriers": GSICode;
  "Wider barriers": GSICode;
  Crime: GSICode;
  "Living environment": GSICode;
  Indoors: GSICode;
  Outdoors: GSICode;
}

interface NationalSocialGrade {
  A: GSICode;
  B: GSICode;
  C1: GSICode;
  C2: GSICode;
  D: GSICode;
  E: GSICode;
}

interface HouseholdStructure {
  "Lone parent at address": GSICode;
}

interface FamilyLifestage {
  "Young singles / homesharers": GSICode;
  "Young family no children <18": GSICode;
  "Young family with children <18": GSICode;
  "Young household with children <18": GSICode;
  "Mature singles / homesharers": GSICode;
  "Mature family no children <18": GSICode;
  "Mature family with children <18": GSICode;
  "Mature household with children <18": GSICode;
  "Older single": GSICode;
  "Older family no children <18": GSICode;
  "Older family / household with children <18": GSICode;
  "Elderly single": GSICode;
  "Elderly family no children <18": GSICode;
}

interface HouseholdComposition {
  Family: GSICode;
  "Pseudo family": GSICode;
  "Family + other adults": GSICode;
  Single: GSICode;
  "Homesharers + others": GSICode;
  "Extended family": GSICode;
  "Extended household": GSICode;
  "Single GSICode": GSICode;
  "Single feGSICode": GSICode;
  "GSICode homesharers": GSICode;
  "FeGSICode homesharers": GSICode;
  "Mixed homesharers": GSICode;
  "Abbreviated GSICode families": GSICode;
  "Abbreviated feGSICode families": GSICode;
  "Multi-occupancy dwelling": GSICode;
}

interface HouseholdPopulation {
  "Population per household": GSICode;
}

interface MaritalStatus {
  Single: GSICode;
  Married: GSICode;
}

interface HouseholdAdditions {
  "Young person at address": GSICode;
  "Elderly parent at address": GSICode;
}

interface Motherhood {
  "Age at first childbirth": GSICode;
  "Average age of motherhood": GSICode;
}

interface ChildrenAgeGroups {
  "<5": GSICode;
  "5-11": GSICode;
  "12-17": GSICode;
  ">18": GSICode;
}

interface NumberOfChildren {
  "No children": GSICode;
  "1 child": GSICode;
  "2 children": GSICode;
  "3 children": GSICode;
  "4+ children": GSICode;
}

interface PresenceOfChildren {
  "Children in household": GSICode;
}

interface Age {
  "Mean age of heads of household": GSICode;
  "Median age of adults": GSICode;
  "Mean age of adults": GSICode;
  "18-25": GSICode;
  "26-30": GSICode;
  "31-35": GSICode;
  "36-40": GSICode;
  "41-45": GSICode;
  "46-50": GSICode;
  "51-55": GSICode;
  "56-60": GSICode;
  "61-65": GSICode;
  "66-70": GSICode;
  "71-75": GSICode;
  "76-80": GSICode;
  "81-85": GSICode;
  "86-90": GSICode;
  "91+": GSICode;
}

interface Gender {
  Male: GSICode;
  Female: GSICode;
}

interface GSICode {
  A01: number;
  A02: number;
  A03: number;
  A04: number;
  B05: number;
  B06: number;
  B07: number;
  B08: number;
  B09: number;
  C10: number;
  C11: number;
  C12: number;
  C13: number;
  D14: number;
  D15: number;
  D16: number;
  D17: number;
  E18: number;
  E19: number;
  E20: number;
  E21: number;
  F22: number;
  F23: number;
  F24: number;
  F25: number;
  G26: number;
  G27: number;
  G28: number;
  G29: number;
  H30: number;
  H31: number;
  H32: number;
  H33: number;
  H34: number;
  H35: number;
  I36: number;
  I37: number;
  I38: number;
  I39: number;
  J40: number;
  J41: number;
  J42: number;
  J43: number;
  J44: number;
  J45: number;
  K46: number;
  K47: number;
  K48: number;
  L49: number;
  L50: number;
  L51: number;
  L52: number;
  M53: number;
  M54: number;
  M55: number;
  M56: number;
  N57: number;
  N58: number;
  N59: number;
  N60: number;
  N61: number;
  O62: number;
  O63: number;
  O64: number;
  O65: number;
  O66: number;
}
