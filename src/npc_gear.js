/* ===================== NPC OUTFITS: every villager wears a unique, fully upgraded set ===================== */
// _lv: tier for every equipped piece (6 = Cầu vồng, 5 = Hoàng kim). No two NPCs share a hat, wings, held item, aura or pet.
const NPC_GEAR = {
  mai:  {hat: 'hat_tiara', face2: 'face_heart', back: 'back_butterfly', hand: 'hand_bouquet', aura: 'aura_sakura', pet: 'pet_kitty', neck: 'neck_pearl', ear: 'ear_pearl', shoes: 'shoes_glass', bag: 'bag_luxury', top: 'top_idol', topC: '#FF6FB5'},
  ba:   {hat: 'hat_cowboy', face2: 'face_aviator', back: 'back_teddy', hand: 'hand_lantern', aura: 'aura_leaves', pet: 'pet_corgi', neck: 'neck_gold', shoes: 'shoes_boots', bag: 'bag_belt', mouth: 'mouth_pocky', _lv: 5},
  tu:   {hat: 'hat_mushroom', face2: 'face_monocle', back: 'back_dragon', hand: 'hand_moonstaff', aura: 'aura_stars', pet: 'pet_owl', neck: 'neck_amulet', shoes: 'shoes_winged', bag: 'bag_treasure', _lv: 5},
  nam:  {hat: 'hat_witch', face2: 'face_cyber', back: 'back_light', hand: 'hand_scepter', aura: 'aura_flame', pet: 'pet_dragon', neck: 'neck_diamond', ear: 'ear_dragon', shoes: 'shoes_flame', bag: 'bag_star', deco: 'deco_rune'},
  lan:  {hat: 'hat_grad', face2: 'face_starshades', back: 'back_angel', hand: 'hand_magicbook', aura: 'aura_sparkle', pet: 'pet_bunny', neck: 'neck_medal', ear: 'ear_star', shoes: 'shoes_sneaker', bag: 'bag_crystal', top: 'top_school', topC: '#4D8BFF'},
  na:   {hat: 'hat_bunny', back: 'back_fairy', hand: 'hand_balloon', aura: 'aura_hearts', pet: 'pet_hamster', ear: 'ear_cherry', shoes: 'shoes_bunny', bag: 'bag_strawberry', mouth: 'mouth_gum', deco: 'deco_blush'},
  tom:  {hat: 'hat_cap', face2: 'face_goggles', back: 'back_jetpack', hand: 'hand_saber', aura: 'aura_bubbles', pet: 'pet_puppy', neck: 'neck_scarf', shoes: 'shoes_skates', mouth: 'mouth_lollipop'},
  sau:  {hat: 'hat_pirate', face2: 'face_eyepatch', back: 'back_cape', hand: 'hand_trident', aura: 'aura_snow', pet: 'pet_penguin', neck: 'neck_lei', shoes: 'shoes_rain', mouth: 'mouth_rose', _lv: 5},
  ha:   {hat: 'hat_halo', face2: 'face_visor', back: 'back_crystal', hand: 'hand_starstaff', aura: 'aura_galaxy', pet: 'pet_unicorn', neck: 'neck_ruby', ear: 'ear_moon', shoes: 'shoes_rainbow', bag: 'bag_galaxy'},
  bao:  {hat: 'hat_headphones', face2: 'face_star', back: 'back_guitar', hand: 'hand_mic', aura: 'aura_rainbow', pet: 'pet_fox', neck: 'neck_choker', shoes: 'shoes_cloud', bag: 'bag_heart'},
  ngan: {hat: 'hat_flower', face2: 'face_butterfly', back: 'back_phoenix', hand: 'hand_fan', aura: 'aura_butterfly', pet: 'pet_phoenix', neck: 'neck_heart', ear: 'ear_butterfly', shoes: 'shoes_sandals', bag: 'bag_tote'},
  thu:  {hat: 'hat_unicorn', face2: 'face_rainbowshades', back: 'back_ninetails', hand: 'hand_cotton', aura: 'aura_dragon', pet: 'pet_panda', neck: 'neck_galaxy', ear: 'ear_galaxy', bag: 'bag_bear', deco: 'deco_heartglitter', shape: 'vline', feats: ['lashes', 'glow']}
};
const GEAR_SLOTS = ['hat', 'face2', 'back', 'hand', 'aura', 'pet', 'neck', 'ear', 'shoes', 'bag', 'mouth', 'deco'];
for (const d of NPC_DEFS) {
  const g = NPC_GEAR[d.id]; if (!g) continue;
  const tier = g._lv || 6, gear = Object.assign({}, g); delete gear._lv;
  Object.assign(d.look, gear); d.look.lv = {};
  for (const k of GEAR_SLOTS) if (d.look[k] && FASH[d.look[k]]) d.look.lv[d.look[k]] = tier;
}
