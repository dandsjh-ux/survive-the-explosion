// Word Quiz: vocabulary questions about explosions and safe building.
// Simple English, short sentences. Nothing about how explosives are made.
//
// Question: { id, word, type, q, options: [4 strings], answer: index, explain }
//   type 'meaning': word -> pick the meaning
//   type 'word':    meaning -> pick the word
//   type 'gap':     fill the gap in a sentence

export const VOCAB_COINS_PER_CORRECT = 20;
export const VOCAB_ROUND_SIZE = 20;

// Compact builders. The right option is written first, then moved to a spread-out place.
let n = 0;
function make(word, type, q, right, wrong, explain) {
  const k = n++;
  const spot = (k * 3 + 1) % 4;
  const options = wrong.slice();
  options.splice(spot, 0, right);
  return { id: `v${String(k + 1).padStart(2, '0')}`, word, type, q, options, answer: spot, explain };
}
const M = (word, right, wrong, explain) => make(word, 'meaning', `What does "${word.toLowerCase()}" mean?`, right, wrong, explain);
const W = (word, meaning, wrong, explain) => make(word, 'word', `Which word means: ${meaning}`, word.toLowerCase(), wrong, explain);
const G = (word, sentence, right, wrong, explain) => make(word, 'gap', sentence, right, wrong, explain);

export const VOCAB_QUESTIONS = [
  // ---- meaning: word -> pick the meaning
  M('Explosion', 'A very fast burst of energy with a loud bang', ['A slow wind that moves leaves', 'A soft sound in a quiet room', 'A kind of warm rain'], 'An explosion is a fast burst of energy. It pushes the air hard.'),
  M('Explosive', 'A thing that can make an explosion', ['A thing that keeps food cold', 'A thing that makes light for a room', 'A thing that cleans the floor'], 'Explosives are very dangerous. Only trained experts work with them.'),
  M('Fragment', 'A small, fast piece of metal from an explosion', ['A big soft pillow', 'A cloud of white smoke', 'A drop of water'], 'Fragments fly out very fast. Sandbags stop them well.'),
  M('Debris', 'Broken bits of things that fly around', ['A strong new wall', 'A safe room under a house', 'A loud bang'], 'Debris is the broken bits that are left after something breaks.'),
  M('Shockwave', 'A wall of pushed air from an explosion', ['A wave in the sea', 'A bright flash of light', 'A very loud song'], 'A shockwave hits like a giant hand made of air.'),
  M('Blast radius', 'How far the danger reaches from the explosion', ['How tall a wall is', 'How loud a bang is', 'How many blocks you can buy'], 'A bigger explosion has a bigger blast radius.'),
  M('Pressure', 'How hard the air pushes on something', ['How hot the air is', 'How fast a person runs', 'How bright a flash is'], 'A shockwave has very high pressure for a short time.'),
  M('Heat flash', 'A burst of light and heat that can start fires', ['A cold wind from the north', 'A piece of hot metal', 'A loud bang'], 'A big explosion can make a heat flash. Thick walls block it.'),
  M('Radiation', 'Invisible energy from a nuclear bomb', ['A kind of thick smoke', 'A fast piece of metal', 'A loud noise'], 'You cannot see radiation. Thick, heavy materials block it.'),
  M('Shelter', 'A safe place to stay', ['A place that is very far away', 'A kind of heavy block', 'A bright light'], 'A basement is a good shelter.'),
  M('Absorb', 'To soak up energy, like a sponge soaks up water', ['To bounce something back', 'To throw something far', 'To make something hot'], 'Sand absorbs the energy of fragments.'),
  M('Durable', 'Strong, and it lasts for a long time', ['Easy to break', 'Very light', 'Very hot'], 'Steel is durable. It does not break easily.'),
  M('Fragile', 'Weak, and it breaks easily', ['Strong and heavy', 'Hot and bright', 'Far away'], 'A glass window is fragile. Cardboard is fragile too.'),
  M('Shield', 'Something that blocks danger', ['Something that makes danger bigger', 'Something that makes a loud noise', 'Something that is very hot'], 'A strong wall can shield the house.'),
  M('Reflect', 'To bounce back, like a mirror bounces light', ['To soak up like a sponge', 'To break into pieces', 'To fall down'], 'Shiny foil can reflect heat.'),
  M('Dense', 'Packed tight, so it is heavy for its size', ['Light like a feather', 'Clear like glass', 'Soft like a pillow'], 'Lead is very dense. That is why it blocks radiation.'),
  M('Heavy', 'Hard to lift', ['Easy to carry', 'Very bright', 'Full of air'], 'Heavy blocks are hard for a shockwave to push over.'),
  M('Basement', 'A room under the house', ['A room on the roof', 'A fence around the yard', 'A door at the front'], 'The ground above a basement is extra protection.'),
  M('Reinforce', 'To make something stronger', ['To make something smaller', 'To move something away', 'To paint something'], 'You can reinforce a wall with more blocks.'),
  M('Protect', 'To keep someone or something safe', ['To make something dirty', 'To throw something away', 'To hide a secret'], 'Walls protect the house from danger.'),
  M('Defend', 'To guard something and keep danger away', ['To open a door', 'To lose a game', 'To run away from home'], 'A strong wall helps to defend the house.'),
  M('Distance', 'How far one thing is from another', ['How heavy a block is', 'How hot a flash is', 'How loud a bang is'], 'More distance from the bomb means less danger.'),
  M('Material', 'What a thing is made of', ['A loud bang', 'A kind of weather', 'A tool for digging'], 'Sand, wood and steel are all materials.'),
  M('Wall', 'A tall, flat barrier', ['A small hole in the ground', 'A fast piece of metal', 'A tool for painting'], 'A wall of blocks can stop fragments.'),
  M('Upgrade', 'To make something better', ['To make something worse', 'To take something away', 'To count something'], 'Boarding up the windows is an upgrade for the house.'),
  M('Fireball', 'A ball of very hot, glowing gas', ['A ball made of paper', 'A block of ice', 'A ball for sports'], 'A fireball is bright and very hot. It grows fast.'),
  M('Mushroom cloud', 'A huge cloud in the shape of a mushroom', ['A cloud that brings snow', 'A cloud of dust from a field', 'A small cloud in a picture'], 'A nuclear bomb makes a mushroom cloud that rises very high.'),
  M('Kiloton', 'A way to measure big explosions', ['A way to measure the weather', 'A way to measure time', 'A way to measure a wall'], 'One kiloton is the power of 1,000 tonnes of TNT.'),
  M('Evacuate', 'To leave a place and go somewhere safe', ['To stay in a place and wait', 'To build a new wall', 'To clean a room'], 'When people evacuate, they go far away from danger.'),
  M('Sturdy', 'Strong and steady', ['Weak and shaky', 'Small and light', 'Cold and wet'], 'A sturdy wall does not fall over easily.'),
  M('Flammable', 'Easy to set on fire', ['Hard to lift', 'Easy to break', 'Wet and heavy'], 'Paper and cardboard are flammable. Stone and steel are not.'),
  M('Crack', 'A thin line where something starts to break', ['A very loud song', 'A kind of door', 'A soft pillow'], 'A crack in a wall means the wall is hurt.'),
  M('Shatter', 'To break into many small pieces', ['To bend a little', 'To grow bigger', 'To become warm'], 'Glass can shatter. Boards over the window help.'),
  M('Survive', 'To stay safe after something dangerous', ['To start a big job', 'To win a race', 'To fall asleep'], 'Your goal is that the house and the family survive.'),

  // ---- word: meaning -> pick the word
  W('Fragile', 'weak, and it breaks easily.', ['durable', 'sturdy', 'heavy'], 'Fragile things break easily. Cardboard is fragile.'),
  W('Durable', 'strong, and it lasts for a long time.', ['fragile', 'flammable', 'shatter'], 'Durable things last. Concrete is durable.'),
  W('Debris', 'broken bits of things that fly around.', ['shelter', 'pressure', 'material'], 'Debris can fly far, so keep your distance.'),
  W('Absorb', 'to soak up energy.', ['reflect', 'shatter', 'evacuate'], 'Sand and water barrels absorb energy.'),
  W('Evacuate', 'to leave a place and go somewhere safe.', ['reinforce', 'survive', 'upgrade'], 'Evacuate means leave and go to safety.'),
  W('Shelter', 'a safe place to stay.', ['fireball', 'kiloton', 'crack'], 'A shelter keeps people safe from danger.'),
  W('Reinforce', 'to make something stronger.', ['evacuate', 'shatter', 'reflect'], 'Reinforce a weak wall with extra blocks.'),
  W('Kiloton', 'a way to measure big explosions.', ['distance', 'pressure', 'material'], 'We say a bomb is "10 kilotons" to show its power.'),
  W('Reflect', 'to bounce back.', ['absorb', 'protect', 'survive'], 'A mirror reflects light. Foil reflects heat.'),
  W('Flammable', 'easy to set on fire.', ['durable', 'sturdy', 'dense'], 'Wood is flammable. Concrete is not.'),
  W('Shield', 'something that blocks danger.', ['debris', 'crack', 'upgrade'], 'A shield stands between you and the danger.'),
  W('Mushroom cloud', 'a huge cloud shaped like a mushroom, made by a nuclear bomb.', ['fireball', 'shockwave', 'heat flash'], 'The mushroom cloud rises high into the sky.'),

  // ---- gap: fill the gap in a sentence
  G('Absorb', 'Sand can ____ the energy of fragments.', 'absorb', ['reflect', 'shatter', 'evacuate'], 'Absorb means soak up. Sand is great at it.'),
  G('Fragment', 'Fast pieces of metal are called ____.', 'fragments', ['shelters', 'basements', 'upgrades'], 'Fragments are the small, fast pieces from a grenade.'),
  G('Shockwave', 'A ____ is a wall of pushed air.', 'shockwave', ['fireball', 'basement', 'material'], 'A shockwave pushes on everything in its way.'),
  G('Radiation', 'Thick concrete helps to block ____.', 'radiation', ['fragments', 'balloons', 'kilotons'], 'Radiation is invisible. Thick, heavy materials block it.'),
  G('Distance', 'The house is safer when you build far from the bomb. ____ helps.', 'Distance', ['Pressure', 'Debris', 'Flash'], 'More distance means a weaker blast.'),
  G('Fragile', 'Cardboard is ____. It breaks very easily.', 'fragile', ['durable', 'sturdy', 'heavy'], 'Fragile things break easily.'),
  G('Sturdy', 'A thick brick wall is ____. It stands firm.', 'sturdy', ['fragile', 'flammable', 'weak'], 'Sturdy means strong and steady.'),
  G('Basement', 'The family can hide in the ____ under the house.', 'basement', ['roof', 'fence', 'window'], 'A basement is under the house. It is very safe.'),
  G('Protect', 'Strong walls ____ the family from danger.', 'protect', ['shatter', 'crack', 'evacuate'], 'Protect means keep safe.'),
  G('Survive', 'The goal is that the house can ____ the explosion.', 'survive', ['upgrade', 'absorb', 'reflect'], 'Survive means stay safe after danger.'),
  G('Shatter', 'A glass window can ____ into many small pieces.', 'shatter', ['absorb', 'protect', 'reinforce'], 'Shatter means break into small pieces.'),
  G('Crack', 'A thin ____ in the wall shows it is hurt.', 'crack', ['shield', 'kiloton', 'shelter'], 'A crack is a thin line where something breaks.'),
  G('Wall', 'Build a ____ of sandbags in front of the house.', 'wall', ['fireball', 'crack', 'pressure'], 'A wall of blocks stops fragments.'),
  G('Dense', 'Lead is very ____. A small block is very heavy.', 'dense', ['fragile', 'flammable', 'empty'], 'Dense things are packed tight and heavy.'),
  G('Upgrade', 'Boarding up the windows is an ____ for your house.', 'upgrade', ['explosion', 'evacuate', 'fragment'], 'An upgrade makes something better.'),
  G('Material', 'Sand, wood and steel are different kinds of ____.', 'material', ['pressure', 'distance', 'radiation'], 'A material is what a thing is made of.'),
  G('Flammable', 'Wood and paper are ____. They burn easily.', 'flammable', ['durable', 'dense', 'sturdy'], 'Flammable things catch fire easily.'),
  G('Defend', 'Guards ____ the castle gate so nobody can get in.', 'defend', ['shatter', 'evacuate', 'reflect'], 'Defend means guard and keep danger away.'),
  G('Explosion', 'After the ____, a big cloud of smoke rose up.', 'explosion', ['shelter', 'material', 'upgrade'], 'An explosion is a fast burst of energy.'),
  G('Heavy', 'A ____ block is hard for the shockwave to push over.', 'heavy', ['light', 'fragile', 'hot'], 'Heavy blocks stay in place.'),
];

// ---- a round of questions
function shuffled(arr, rng) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Returns n distinct questions, one per word where possible, with options shuffled.
export function pickVocabRound(rng = Math.random, n = VOCAB_ROUND_SIZE) {
  const byWord = new Map();
  for (const q of VOCAB_QUESTIONS) {
    const key = q.word.toLowerCase();
    if (!byWord.has(key)) byWord.set(key, []);
    byWord.get(key).push(q);
  }
  const picks = shuffled([...byWord.values()], rng).map((list) => list[Math.floor(rng() * list.length)]);
  let chosen = picks.slice(0, n);
  if (chosen.length < n) {
    const left = VOCAB_QUESTIONS.filter((q) => !chosen.includes(q));
    chosen = chosen.concat(shuffled(left, rng).slice(0, n - chosen.length));
  }
  return shuffled(chosen, rng).map((q) => {
    const right = q.options[q.answer];
    const options = shuffled(q.options, rng);
    return { ...q, options, answer: options.indexOf(right) };
  });
}
