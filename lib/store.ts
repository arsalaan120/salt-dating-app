
import fs from "fs/promises";
import path from "path";

export type Profile = {
  id: number;
  name: string;
  age: number;
  city: string;
  bio: string;
  interests: string[];
  photo: string;
  likedByUser: boolean;
};

export type Swipe = {
  profileId: number;
  action: "like" | "pass";
};

type Database = {
  profiles: Profile[];
  swipes: Swipe[];
  matches: number[];
};

const filePath = path.join(process.cwd(), "data", "db.json");

const names = [
  "Aarav", "Ananya", "Ishaan", "Aditi", "Kabir",
  "Meera", "Rohan", "Sana", "Arjun", "Kiara",
  "Vivaan", "Zoya", "Reyansh", "Diya", "Advik",
  "Myra", "Ayaan", "Ira", "Dev", "Tara",
  "Krish", "Naina", "Yash", "Alisha", "Rudra",
  "Sara", "Aditya", "Riya", "Neil", "Avni"
];

const cities = [
  "Bangalore", "Delhi", "Mumbai", "Pune", "Hyderabad",
  "Jamshedpur", "Kolkata", "Chennai", "Gurgaon", "Jaipur"
];

const interestSets = [
  ["Music", "Travel", "Photography"],
  ["Movies", "Reading", "Coffee"],
  ["Fitness", "Technology", "Food"],
  ["Art", "Fashion", "Travel"],
  ["Gaming", "Music", "Sports"]
];

const bios = [
  "Always looking for new experiences and good conversations.",
  "Coffee lover, music enthusiast and weekend explorer.",
  "Building my dreams one day at a time.",
  "Life is better when shared with good people.",
  "Here to meet genuine people and make connections."
];

function createDatabase(): Database {
  const profiles = names.map((name, index) => ({
    id: index + 1,
    name,
    age: 20 + (index % 7),
    city: cities[index % cities.length],
    bio: bios[index % bios.length],
    interests: interestSets[index % interestSets.length],
    photo: `https://i.pravatar.cc/600?img=${index + 1}`,
    likedByUser: [3, 8, 14, 21, 27].includes(index + 1)
  }));

  return {
    profiles,
    swipes: [],
    matches: []
  };
}

export async function readDatabase(): Promise<Database> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });

  try {
    const content = await fs.readFile(filePath, "utf8");
    return JSON.parse(content) as Database;
  } catch {
    const database = createDatabase();
    await writeDatabase(database);
    return database;
  }
}

export async function writeDatabase(database: Database) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(database, null, 2));
}

export function publicProfile(profile: Profile) {
  const { likedByUser, ...safeProfile } = profile;
  return safeProfile;
}
