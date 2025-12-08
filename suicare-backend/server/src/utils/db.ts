import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(__dirname, '../../salt_db.json');

// Simple JSON DB to store user salts
// In production, REPLACE this with Postgres or MongoDB
export const getSaltFromDB = (subject: string): string | null => {
  if (!fs.existsSync(DB_PATH)) return null;
  const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
  return data[subject] || null;
};

export const saveSaltToDB = (subject: string, salt: string) => {
  let data: Record<string, string> = {};
  if (fs.existsSync(DB_PATH)) {
    data = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
  }
  data[subject] = salt;
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};