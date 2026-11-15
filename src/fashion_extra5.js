/* ===================== FASHION BATCH 5: more Epic and Mythic pieces (variants of existing shapes in new materials) ===================== */
// `base` = the shape it is drawn with; `col` = its own colour or material (gradients: gold, galaxy, rainbow, fire, ocean, silver).
const GOLD = 'url(#hg_gold)', GALAXY = 'url(#hg_galaxy)', RAINBOW = 'url(#rb)', OCEAN = 'url(#hg_ocean)', SILVER = 'url(#hg_silver)', FIRE = 'url(#hg_fire)';
FASHION.push(
  // hats
  {id:'hat_tiara_rose', base:'hat_tiara', slot:'hat', en:'rose tiara', vi:'Vương miện hoa hồng', price:20, cur:'gem', rar:2, lvl:7, col:'#FF6FB5'},
  {id:'hat_witch_galaxy', base:'hat_witch', slot:'hat', en:'galaxy witch hat', vi:'Mũ phù thủy ngân hà', price:0, rar:4, chest:1, col:GALAXY},
  {id:'hat_crown_obsidian', base:'hat_crown', slot:'hat', en:'obsidian crown', vi:'Vương miện hắc diệu', price:220, cur:'gem', rar:4, lvl:20, col:'#2B2A40', hot:1},
  // glasses
  {id:'face_heart_gold', base:'face_heart', slot:'face', en:'golden heart glasses', vi:'Kính tim hoàng kim', price:20, cur:'gem', rar:2, lvl:7, col:GOLD},
  {id:'face_cyber_galaxy', base:'face_cyber', slot:'face', en:'galaxy visor', vi:'Kính cyber ngân hà', price:180, cur:'gem', rar:4, lvl:20, col:GALAXY},
  // mouth / face stickers
  {id:'mouth_rose_black', base:'mouth_rose', slot:'mouth', en:'black rose', vi:'Hoa hồng đen', price:16, cur:'gem', rar:2, lvl:7, col:'#3B0A2A', hot:1},
  {id:'mouth_frost_void', base:'mouth_frost', slot:'mouth', en:'void breath', vi:'Hơi thở hư không', price:200, cur:'gem', rar:4, lvl:20, col:'#9B5CFF'},
  {id:'deco_tear_ruby', base:'deco_tear', slot:'deco', en:'ruby tear', vi:'Lệ hồng ngọc', price:14, cur:'gem', rar:2, lvl:6, col:'#FF3552'},
  {id:'deco_rune_gold', base:'deco_rune', slot:'deco', en:'golden marks', vi:'Ấn ký hoàng kim', price:180, cur:'gem', rar:4, lvl:20, col:GOLD},
  // earrings / necklaces
  {id:'ear_crystal_rose', base:'ear_crystal', slot:'ear', en:'rose crystal drops', vi:'Hoa tai pha lê hồng', price:16, cur:'gem', rar:2, lvl:6, col:'#FF8FC7'},
  {id:'ear_moon_galaxy', base:'ear_moon', slot:'ear', en:'galaxy moon earrings', vi:'Hoa tai trăng ngân hà', price:180, cur:'gem', rar:4, lvl:20, col:GALAXY},
  {id:'neck_pearl_black', base:'neck_pearl', slot:'neck', en:'black pearl necklace', vi:'Chuỗi ngọc trai đen', price:18, cur:'gem', rar:2, lvl:7, col:'#3B3550'},
  {id:'neck_diamond_rainbow', base:'neck_diamond', slot:'neck', en:'rainbow diamond', vi:'Kim cương cầu vồng', price:220, cur:'gem', rar:4, lvl:22, col:RAINBOW, hot:1},
  // shoes / bags
  {id:'shoes_glass_rose', base:'shoes_glass', slot:'shoes', en:'rose glass slippers', vi:'Giày pha lê hồng', price:18, cur:'gem', rar:2, lvl:7, col:'#FF8FC7'},
  {id:'shoes_winged_gold', base:'shoes_winged', slot:'shoes', en:'golden winged shoes', vi:'Giày cánh hoàng kim', price:200, cur:'gem', rar:4, lvl:20, col:GOLD},
  {id:'bag_luxury_white', base:'bag_luxury', slot:'bag', en:'ivory designer bag', vi:'Túi hàng hiệu trắng ngọc', price:20, cur:'gem', rar:2, lvl:8, col:'#F4F1EA'},
  {id:'bag_star_galaxy', base:'bag_star', slot:'bag', en:'galaxy star purse', vi:'Ví sao ngân hà', price:0, rar:4, chest:1, col:GALAXY},
  // wings and back
  {id:'back_bat_red', base:'back_bat', slot:'back', en:'crimson bat wings', vi:'Cánh dơi huyết', price:25, cur:'gem', rar:2, lvl:7, col:'#B3123E'},
  {id:'back_angel_dark', base:'back_angel', slot:'back', en:'dark angel wings', vi:'Cánh thiên thần bóng đêm', price:0, rar:4, chest:1, col:'#2B2A40', hot:1},
  {id:'back_butterfly_galaxy', base:'back_butterfly', slot:'back', en:'galaxy butterfly wings', vi:'Cánh bướm ngân hà', price:260, cur:'gem', rar:4, lvl:22, col:GALAXY},
  {id:'back_dragon_fire', base:'back_dragon', slot:'back', en:'inferno dragon wings', vi:'Cánh rồng hoả ngục', price:280, cur:'gem', rar:4, lvl:24, col:FIRE},
  // held items
  {id:'hand_wand_dark', base:'hand_wand', slot:'hand', en:'shadow wand', vi:'Đũa phép hắc ám', price:22, cur:'gem', rar:2, lvl:7, col:'#6D3FD8'},
  {id:'hand_saber_red', base:'hand_saber', slot:'hand', en:'red energy sword', vi:'Kiếm năng lượng đỏ', price:24, cur:'gem', rar:2, lvl:8, col:'#FF3552', hot:1},
  {id:'hand_trident_gold', base:'hand_trident', slot:'hand', en:'golden trident', vi:'Đinh ba hoàng kim', price:220, cur:'gem', rar:4, lvl:22, col:GOLD},
  // auras
  {id:'aura_flame_blue', base:'aura_flame', slot:'aura', en:'blue flame aura', vi:'Hào quang lửa xanh', price:24, cur:'gem', rar:2, lvl:8, col:'#4D8BFF'},
  {id:'aura_hearts_gold', base:'aura_hearts', slot:'aura', en:'golden heart aura', vi:'Hào quang tim vàng', price:200, cur:'gem', rar:4, lvl:20, col:'#FFC83D'},
  {id:'aura_snow_crystal', base:'aura_snow', slot:'aura', en:'diamond dust aura', vi:'Hào quang bụi kim cương', price:0, rar:4, chest:1, col:'#B9E6FF'},
  // pets
  {id:'pet_kitty_black', base:'pet_kitty', slot:'pet', en:'black cat', vi:'Mèo đen huyền bí', price:24, cur:'gem', rar:2, lvl:6, col:'#2B2A40', hot:1},
  {id:'pet_fox_ice', base:'pet_fox', slot:'pet', en:'snow fox', vi:'Cáo tuyết', price:28, cur:'gem', rar:2, lvl:8, col:'#E6F4FF'},
  {id:'pet_dragon_gold', base:'pet_dragon', slot:'pet', en:'golden dragon', vi:'Rồng hoàng kim', price:260, cur:'gem', rar:4, lvl:22, col:GOLD},
  {id:'pet_owl_galaxy', base:'pet_owl', slot:'pet', en:'galaxy owl', vi:'Cú ngân hà', price:0, rar:4, chest:1, col:GALAXY}
);
// the shape an item is drawn with (variants reuse an existing design in their own material)
const artId = id => (id && FASH[id] && FASH[id].base) || id;
