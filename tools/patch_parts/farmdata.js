// times in seconds: Avatar-style long growth (30 minutes to 24 hours). Water lasts about half the time.
const CROPS = [
  {id:'carrot',    en:'carrot',    vi:'cà rốt',     lvl:1,  cost:5,  time:1800,  sell:14,  xp:8,  one:'a carrot', pl:'carrots'},
  {id:'radish',    en:'radish',    vi:'củ cải đỏ',  lvl:1,  cost:6,  time:2700,  sell:18,  xp:9,  one:'a radish', pl:'radishes'},
  {id:'lettuce',   en:'lettuce',   vi:'xà lách',    lvl:2,  cost:8,  time:3600,  sell:24,  xp:11, one:'a lettuce', pl:'lettuces'},
  {id:'potato',    en:'potato',    vi:'khoai tây',  lvl:3,  cost:10, time:5400,  sell:32,  xp:13, one:'a potato', pl:'potatoes'},
  {id:'onion',     en:'onion',     vi:'hành tây',   lvl:4,  cost:12, time:7200,  sell:40,  xp:15, one:'an onion', pl:'onions'},
  {id:'cabbage',   en:'cabbage',   vi:'bắp cải',    lvl:5,  cost:14, time:10800, sell:52,  xp:18, one:'a cabbage', pl:'cabbages'},
  {id:'tomato',    en:'tomato',    vi:'cà chua',    lvl:6,  cost:16, time:14400, sell:66,  xp:21, one:'a tomato', pl:'tomatoes'},
  {id:'cucumber',  en:'cucumber',  vi:'dưa chuột',  lvl:7,  cost:18, time:18000, sell:78,  xp:24, one:'a cucumber', pl:'cucumbers'},
  {id:'chili',     en:'chili',     vi:'ớt',         lvl:8,  cost:20, time:21600, sell:90,  xp:27, one:'a chili', pl:'chilies'},
  {id:'strawberry',en:'strawberry',vi:'dâu tây',    lvl:9,  cost:24, time:28800, sell:115, xp:31, one:'a strawberry', pl:'strawberries'},
  {id:'eggplant',  en:'eggplant',  vi:'cà tím',     lvl:10, cost:26, time:32400, sell:128, xp:34, one:'an eggplant', pl:'eggplants'},
  {id:'corn',      en:'corn',      vi:'ngô',        lvl:11, cost:28, time:36000, sell:140, xp:37, one:'an ear of corn', pl:'ears of corn'},
  {id:'pepper',    en:'bell pepper',vi:'ớt chuông', lvl:12, cost:32, time:43200, sell:165, xp:41, one:'a bell pepper', pl:'bell peppers'},
  {id:'cauliflower',en:'cauliflower',vi:'súp lơ trắng',lvl:13,cost:36,time:50400, sell:190, xp:45, one:'a cauliflower', pl:'cauliflowers'},
  {id:'pumpkin',   en:'pumpkin',   vi:'bí ngô',     lvl:15, cost:42, time:64800, sell:240, xp:52, one:'a pumpkin', pl:'pumpkins'},
  {id:'watermelon',en:'watermelon',vi:'dưa hấu',    lvl:17, cost:50, time:86400, sell:320, xp:60, one:'a watermelon', pl:'watermelons'}
];
const CROP = Object.fromEntries(CROPS.map(c => [c.id, c]));
const ANIMALS = [
  {id:'chicken', en:'chicken', vi:'con gà',   lvl:1,  cost:30,  time:7200,  product:'egg'},
  {id:'duck',    en:'duck',    vi:'con vịt',  lvl:2,  cost:45,  time:10800, product:'duckegg'},
  {id:'rabbit',  en:'rabbit',  vi:'con thỏ',  lvl:3,  cost:60,  time:14400, product:'fur'},
  {id:'pig',     en:'pig',     vi:'con lợn',  lvl:5,  cost:90,  time:18000, product:'truffle'},
  {id:'goat',    en:'goat',    vi:'con dê',   lvl:6,  cost:120, time:21600, product:'cheese'},
  {id:'sheep',   en:'sheep',   vi:'con cừu',  lvl:8,  cost:160, time:28800, product:'wool'},
  {id:'cow',     en:'cow',     vi:'con bò',   lvl:9,  cost:180, time:28800, product:'milk'},
  {id:'buffalo', en:'buffalo', vi:'con trâu', lvl:11, cost:220, time:36000, product:'manure'},
  {id:'horse',   en:'horse',   vi:'con ngựa', lvl:14, cost:300, time:43200, product:'horseshoe'}
];
const ANIMAL = Object.fromEntries(ANIMALS.map(a => [a.id, a]));
const PRODUCTS = {
  egg:{id:'egg',en:'egg',vi:'trứng gà',sell:22,one:'an egg',pl:'eggs'},
  duckegg:{id:'duckegg',en:'duck egg',vi:'trứng vịt',sell:30,one:'a duck egg',pl:'duck eggs'},
  fur:{id:'fur',en:'rabbit fur',vi:'lông thỏ',sell:42,one:'some rabbit fur',pl:'bags of rabbit fur'},
  truffle:{id:'truffle',en:'mushroom',vi:'nấm',sell:55,one:'a mushroom',pl:'mushrooms'},
  cheese:{id:'cheese',en:'goat cheese',vi:'phô mai dê',sell:70,one:'a piece of goat cheese',pl:'pieces of goat cheese'},
  wool:{id:'wool',en:'wool',vi:'lông cừu',sell:95,one:'a bag of wool',pl:'bags of wool'},
  milk:{id:'milk',en:'milk',vi:'sữa bò',sell:95,one:'a bottle of milk',pl:'bottles of milk'},
  manure:{id:'manure',en:'fertilizer',vi:'phân bón',sell:60,one:'a bag of fertilizer',pl:'bags of fertilizer', use:true},
  horseshoe:{id:'horseshoe',en:'horseshoe',vi:'móng ngựa may mắn',sell:180,one:'a horseshoe',pl:'horseshoes', use:true},
  fish:{id:'fish',en:'fish',vi:'cá',sell:30,one:'a fish',pl:'fish'},
  bigfish:{id:'bigfish',en:'tuna',vi:'cá ngừ',sell:90,one:'a tuna',pl:'tuna'}
};
const ITEM = id => CROP[id] || PRODUCTS[id];
