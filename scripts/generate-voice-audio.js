#!/usr/bin/env node

/**
 * ElevenLabs Voice Audio Generator
 * Generates MP3 files for all voice prompts used in the app
 */

const fs = require('fs');
const path = require('path');

// Load environment variables from .env
const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length) {
    env[key.trim()] = valueParts.join('=').trim();
  }
});

const API_KEY = env.ELEVENLABS_API_KEY;
const VOICE_ID = env.ELEVENLABS_VOICE_ID;
const OUTPUT_DIR = path.join(__dirname, '..', 'assets', 'audio', 'voice');

if (!API_KEY || API_KEY === 'your_api_key_here') {
  console.error('Please set ELEVENLABS_API_KEY in .env file');
  process.exit(1);
}

if (!VOICE_ID || VOICE_ID === 'your_voice_id_here') {
  console.error('Please set ELEVENLABS_VOICE_ID in .env file');
  process.exit(1);
}

// All voice prompts organized by category
const VOICE_PROMPTS = {
  // Guided Breathing - phase instructions
  breathing: {
    'inhale': 'Breathe in...',
    'hold': 'Hold...',
    'exhale': 'Breathe out...',
    'rest': 'Rest...',
    'start': 'Let\'s begin. Follow the rhythm.',
    'complete': 'Well done. Take a moment to notice how you feel.',
  },

  // Muscle Relaxation - muscle group instructions
  muscle: {
    'hands': 'Hands. Make tight fists with both hands.',
    'forearms': 'Forearms. Bend wrists back, tensing forearms.',
    'upper-arms': 'Upper Arms. Bend elbows and tense biceps.',
    'shoulders': 'Shoulders. Raise shoulders up toward your ears.',
    'face': 'Face. Scrunch up your whole face tightly.',
    'stomach': 'Stomach. Tighten your abdominal muscles.',
    'legs': 'Legs. Tense your thighs and calves.',
    'release': 'Release and relax. Let go of all tension.',
    'transition': 'Prepare for the next muscle group.',
    'complete': 'Session complete. Great job! Your muscles should feel relaxed.',
  },

  // Visualization - Beach scene
  beach: {
    'arrival-1': 'Close your eyes and take a deep breath...',
    'arrival-2': 'Imagine yourself walking toward a peaceful beach...',
    'arrival-3': 'Feel the warm sun on your skin...',
    'arrival-4': 'Hear the gentle sound of waves in the distance...',
    'immersion-1': 'Your feet sink into the warm, soft sand...',
    'immersion-2': 'A gentle breeze carries the scent of salt and sea...',
    'immersion-3': 'Watch the waves roll in, one after another...',
    'immersion-4': 'Each wave washes away a little more tension...',
    'immersion-5': 'The rhythm of the ocean matches your breathing...',
    'immersion-6': 'Feel completely at peace in this moment...',
    'deepening-1': 'Let any remaining thoughts drift away like clouds...',
    'deepening-2': 'You are safe, calm, and completely relaxed...',
    'deepening-3': 'Carry this peace with you as you return...',
  },

  // Visualization - Forest scene
  forest: {
    'arrival-1': 'Close your eyes and breathe deeply...',
    'arrival-2': 'You find yourself at the entrance of a quiet forest...',
    'arrival-3': 'Tall trees surround you, their leaves rustling gently...',
    'arrival-4': 'The air is fresh and filled with earthy scents...',
    'immersion-1': 'Walk slowly along the soft forest path...',
    'immersion-2': 'Sunlight filters through the canopy above...',
    'immersion-3': 'Birds sing peaceful melodies in the distance...',
    'immersion-4': 'Feel the cool, soft moss beneath your feet...',
    'immersion-5': 'Each step takes you deeper into tranquility...',
    'immersion-6': 'The forest embraces you with calm and safety...',
    'deepening-1': 'Find a quiet spot and rest against an old tree...',
    'deepening-2': 'Let the peace of nature fill your entire being...',
    'deepening-3': 'Carry this serenity with you always...',
  },

  // Visualization - Mountains scene
  mountains: {
    'arrival-1': 'Take a deep breath of crisp mountain air...',
    'arrival-2': 'You stand on a peaceful mountain meadow...',
    'arrival-3': 'Snow-capped peaks rise majestically around you...',
    'arrival-4': 'The air is pure and refreshingly cool...',
    'immersion-1': 'Gaze at the vast expanse before you...',
    'immersion-2': 'Clouds drift slowly past the distant peaks...',
    'immersion-3': 'Feel how small your worries seem from here...',
    'immersion-4': 'A gentle wind carries away all tension...',
    'immersion-5': 'The mountains have stood for millennia, unchanging...',
    'immersion-6': 'Feel their strength and stability within you...',
    'deepening-1': 'Sit on a sun-warmed rock and simply be...',
    'deepening-2': 'You are grounded, strong, and at peace...',
    'deepening-3': 'Take this mountain calm back with you...',
  },

  // Visualization - Night Sky scene
  'night-sky': {
    'arrival-1': 'Close your eyes and feel the cool night air...',
    'arrival-2': 'You lie on soft grass, gazing upward...',
    'arrival-3': 'Above you stretches an infinite canvas of stars...',
    'arrival-4': 'The world is quiet and still...',
    'immersion-1': 'Each star twinkles with ancient light...',
    'immersion-2': 'Feel how vast and peaceful the universe is...',
    'immersion-3': 'Your breathing slows to match the stillness...',
    'immersion-4': 'Shooting stars trace silent paths across the sky...',
    'immersion-5': 'You are part of something beautiful and infinite...',
    'immersion-6': 'All is calm, all is well...',
    'deepening-1': 'Let the cosmic peace wash over you completely...',
    'deepening-2': 'You are safe beneath this blanket of stars...',
    'deepening-3': 'Carry this infinite calm within you...',
  },

  // Visualization - completion
  visualization: {
    'complete': 'Journey complete. Take a moment to carry this peace with you.',
  },
};

async function generateAudio(text, filename) {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': API_KEY,
    },
    body: JSON.stringify({
      text: text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.75,
        similarity_boost: 0.75,
        style: 0.0,
        use_speaker_boost: true,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`ElevenLabs API error: ${response.status} - ${error}`);
  }

  const buffer = await response.arrayBuffer();
  fs.writeFileSync(filename, Buffer.from(buffer));
}

async function main() {
  console.log('ElevenLabs Voice Audio Generator');
  console.log('================================\n');

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Collect all prompts
  const allPrompts = [];
  for (const [category, prompts] of Object.entries(VOICE_PROMPTS)) {
    for (const [id, text] of Object.entries(prompts)) {
      const filename = `${category}-${id}.mp3`;
      allPrompts.push({ category, id, text, filename });
    }
  }

  console.log(`Found ${allPrompts.length} prompts to generate\n`);

  let generated = 0;
  let skipped = 0;
  let failed = 0;

  for (const prompt of allPrompts) {
    const filepath = path.join(OUTPUT_DIR, prompt.filename);

    // Skip if file already exists
    if (fs.existsSync(filepath)) {
      console.log(`[SKIP] ${prompt.filename} (already exists)`);
      skipped++;
      continue;
    }

    try {
      process.stdout.write(`[GEN]  ${prompt.filename}...`);
      await generateAudio(prompt.text, filepath);
      console.log(' done');
      generated++;

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.log(` FAILED: ${error.message}`);
      failed++;
    }
  }

  console.log('\n================================');
  console.log(`Generated: ${generated}`);
  console.log(`Skipped:   ${skipped}`);
  console.log(`Failed:    ${failed}`);
  console.log(`Total:     ${allPrompts.length}`);

  // Generate index file for easy importing
  const indexContent = generateIndexFile(allPrompts);
  fs.writeFileSync(path.join(OUTPUT_DIR, 'index.ts'), indexContent);
  console.log('\nGenerated index.ts for imports');
}

function generateIndexFile(prompts) {
  const lines = ['// Auto-generated voice audio imports', ''];

  // Group by category
  const byCategory = {};
  for (const p of prompts) {
    if (!byCategory[p.category]) byCategory[p.category] = [];
    byCategory[p.category].push(p);
  }

  // Generate imports
  for (const [category, items] of Object.entries(byCategory)) {
    const safeCat = category.replace(/-/g, '_');
    for (const item of items) {
      const safeId = item.id.replace(/-/g, '_');
      const varName = `${safeCat}_${safeId}`;
      lines.push(`export const ${varName} = require('./${item.filename}');`);
    }
    lines.push('');
  }

  // Generate lookup object
  lines.push('export const VOICE_AUDIO: Record<string, Record<string, any>> = {');
  for (const [category, items] of Object.entries(byCategory)) {
    const safeCat = category.replace(/-/g, '_');
    lines.push(`  '${category}': {`);
    for (const item of items) {
      const safeId = item.id.replace(/-/g, '_');
      const varName = `${safeCat}_${safeId}`;
      lines.push(`    '${item.id}': ${varName},`);
    }
    lines.push('  },');
  }
  lines.push('};');

  return lines.join('\n');
}

main().catch(console.error);
