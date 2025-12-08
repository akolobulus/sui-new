import { Router } from 'express';
import { generateRandomness } from '@mysten/zklogin';
import { getSaltFromDB, saveSaltToDB } from '../utils/db';

const router = Router();

// GET /auth/salt?sub=12345...
// This endpoint is called by the Frontend before generating a ZK Proof.
router.get('/salt', (req, res) => {
  const { sub } = req.query;

  if (!sub || typeof sub !== 'string') {
    return res.status(400).json({ error: 'Missing subject ID (sub)' });
  }

  // 1. Check if we already have a salt for this user
  let salt = getSaltFromDB(sub);

  // 2. If not, generate a new one and save it
  if (!salt) {
    salt = generateRandomness().toString();
    saveSaltToDB(sub, salt);
    console.log(`[Auth] New User! Generated salt for: ${sub}`);
  } else {
    console.log(`[Auth] Returning existing salt for: ${sub}`);
  }

  // 3. Return the salt to the frontend
  res.json({ salt });
});

export default router;