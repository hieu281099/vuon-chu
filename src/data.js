/* ===================== LEARNING CONTENT ===================== */
// Each word: [english, vietnamese, example sentence containing the word]
const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1'];
const LEVEL_VI = {A1: 'Sơ cấp', A2: 'Cơ bản', B1: 'Trung cấp', B2: 'Trung cao cấp', C1: 'Cao cấp'};
const TRACKS = {
  general: {vi: 'Giao tiếp chung', en: 'General', levels: {
    A1: [['family','gia đình','I live with my family.'],['friend','bạn bè','She is my best friend.'],['water','nước','Plants need water.'],['morning','buổi sáng','I go to school in the morning.'],['happy','vui vẻ','I am happy today.'],['red','màu đỏ','The apple is red.'],['eat','ăn','We eat rice every day.'],['big','to, lớn','This is a big farm.'],['small','nhỏ','The chicken is small.'],['market','chợ','My mother goes to the market.'],['cheap','rẻ','These carrots are cheap.'],['tired','mệt','I am tired after work.']],
    A2: [['borrow','mượn','Can I borrow your pen?'],['delicious','ngon','This soup is delicious.'],['weather','thời tiết','The weather is nice today.'],['neighbor','hàng xóm','My neighbor has a big dog.'],['invite','mời','I want to invite you to my party.'],['busy','bận','I am busy this week.'],['careful','cẩn thận','Be careful with the knife.'],['remember','nhớ','I remember your name.'],['forget','quên','Don\'t forget your keys.'],['price','giá','What is the price of this hat?'],['healthy','khỏe mạnh','Vegetables keep you healthy.'],['journey','chuyến đi','The journey takes two hours.']],
    B1: [['improve','cải thiện','I want to improve my English.'],['experience','kinh nghiệm','She has a lot of experience.'],['decision','quyết định','It was a difficult decision.'],['suggest','gợi ý, đề xuất','I suggest we leave early.'],['environment','môi trường','We must protect the environment.'],['opportunity','cơ hội','This job is a great opportunity.'],['reliable','đáng tin cậy','He is a reliable friend.'],['harvest','thu hoạch','Farmers harvest rice in autumn.'],['achieve','đạt được','She worked hard to achieve her goal.'],['crowded','đông đúc','The market is crowded on Sunday.'],['advice','lời khuyên','Thank you for your advice.'],['effort','nỗ lực','Learning a language takes effort.']],
    B2: [['sustainable','bền vững','Organic farming is more sustainable.'],['reluctant','miễn cưỡng','He was reluctant to sell his land.'],['consequence','hậu quả','Every choice has a consequence.'],['negotiate','đàm phán','We need to negotiate a better price.'],['thorough','kỹ lưỡng','The doctor did a thorough check.'],['assume','cho rằng','Don\'t assume everyone agrees.'],['abundant','dồi dào','Water is abundant in this region.'],['emphasize','nhấn mạnh','The teacher likes to emphasize grammar.'],['inevitable','không thể tránh khỏi','Change is inevitable.'],['persuade','thuyết phục','She tried to persuade me to stay.'],['drought','hạn hán','The drought destroyed the crops.'],['versatile','đa năng','Rice is a versatile ingredient.']],
    C1: [['meticulous','tỉ mỉ','She keeps meticulous records of her farm.'],['ubiquitous','có mặt khắp nơi','Smartphones are ubiquitous today.'],['mitigate','giảm nhẹ','Trees help mitigate flooding.'],['scrutinize','xem xét kỹ','The board will scrutinize the budget.'],['resilient','kiên cường','Local farmers are remarkably resilient.'],['ambiguous','mơ hồ','The instructions were ambiguous.'],['compelling','thuyết phục, hấp dẫn','She made a compelling argument.'],['deteriorate','xấu đi','The soil will deteriorate without care.'],['endeavor','sự nỗ lực','Farming is a demanding endeavor.'],['pragmatic','thực tế','We need a pragmatic solution.'],['alleviate','làm dịu','Rain can alleviate the heat.'],['proliferate','sinh sôi, lan rộng','Weeds proliferate in warm weather.']]
  }},
  ielts: {vi: 'Luyện thi IELTS', en: 'IELTS', levels: {
    B1: [['benefit','lợi ích','Regular exercise brings a clear benefit to health.','advantage'],['increase','tăng','The number of tourists continues to increase.','rise'],['reduce','giảm','Governments should reduce air pollution.','decrease'],['opinion','quan điểm','In my opinion, public transport should be free.','view'],['issue','vấn đề','Traffic is a serious issue in big cities.','problem'],['support','ủng hộ','Many people support the new law.','back'],['provide','cung cấp','Schools should provide free lunches.','supply'],['affect','ảnh hưởng','Stress can affect your sleep.','influence'],['global','toàn cầu','Climate change is a global problem.','worldwide'],['compare','so sánh','The chart helps us compare sales in two cities.','contrast'],['trend','xu hướng','There is a clear trend towards online shopping.','tendency'],['solution','giải pháp','We need a long-term solution.','answer'],['improve','cải thiện','Technology can improve education.','enhance'],['cause','gây ra','Smoking can cause serious illness.','lead to'],['essential','thiết yếu','Clean water is essential for life.','vital'],['rapid','nhanh chóng','The city has seen rapid growth.','fast'],['decline','sự sụt giảm','There was a sharp decline in sales.','fall'],['approach','cách tiếp cận','This approach works well in schools.','method'],['public','công cộng','Public parks should be well maintained.','communal'],['rely','dựa vào','Many families rely on farming.','depend']],
    B2: [['significant','đáng kể','There was a significant rise in prices.','considerable'],['fluctuate','dao động','Sales tend to fluctuate during the year.','vary'],['consequently','do đó','Prices rose; consequently, demand fell.','therefore'],['advocate','ủng hộ (công khai)','Many experts advocate a sugar tax.','support'],['detrimental','có hại','Too much screen time is detrimental to children.','harmful'],['alleviate','làm giảm bớt','New roads may alleviate traffic congestion.','ease'],['prevalent','phổ biến','Obesity is prevalent in rich countries.','widespread'],['implement','thực hiện','The government should implement stricter laws.','carry out'],['crucial','then chốt','Education is crucial for development.','vital'],['diminish','giảm dần','The forest continues to diminish each year.','decrease'],['substantial','lớn, đáng kể','The project needs substantial funding.','large'],['urbanization','đô thị hoá','Urbanization has changed rural life.','city growth'],['tackle','giải quyết','We must tackle unemployment.','deal with'],['impose','áp đặt','The city may impose a tax on cars.','introduce'],['accessible','dễ tiếp cận','Higher education should be accessible to all.','available'],['proportion','tỷ lệ','A large proportion of students work part-time.','percentage'],['surge','sự tăng vọt','There was a surge in online sales.','sharp increase'],['drawback','nhược điểm','The main drawback is the high cost.','disadvantage'],['exacerbate','làm trầm trọng thêm','Cars exacerbate air pollution.','worsen'],['justify','biện minh','It is hard to justify such high prices.','defend']],
    C1: [['unprecedented','chưa từng có','The pandemic caused unprecedented disruption.','unparalleled'],['pervasive','lan tràn','Advertising is pervasive in modern life.','widespread'],['contentious','gây tranh cãi','Animal testing remains a contentious issue.','controversial'],['paramount','tối quan trọng','Safety is paramount in aviation.','supreme'],['curtail','cắt giảm','Governments must curtail carbon emissions.','limit'],['disparity','sự chênh lệch','The income disparity between regions is growing.','gap'],['proliferation','sự gia tăng nhanh','The proliferation of smartphones changed society.','spread'],['undermine','làm suy yếu','Corruption can undermine public trust.','weaken'],['incentivize','khuyến khích bằng lợi ích','Tax cuts can incentivize investment.','encourage'],['ramification','hệ quả phức tạp','Every ramification of the policy must be studied.','consequence'],['holistic','toàn diện','Schools should take a holistic approach to learning.','comprehensive'],['inextricably','không thể tách rời','Health is inextricably linked to diet.','closely'],['salient','nổi bật, chính','The chart shows several salient features.','key'],['notwithstanding','mặc dù','Notwithstanding the cost, the project is worthwhile.','despite'],['albeit','mặc dù','The economy grew, albeit slowly.','although'],['juxtapose','đặt cạnh để so sánh','The essay will juxtapose two views.','contrast'],['erode','xói mòn','Social media may erode privacy.','wear away'],['burgeoning','đang phát triển nhanh','The burgeoning tech sector creates jobs.','booming'],['plausible','hợp lý, có vẻ đúng','This is a plausible explanation.','credible'],['marginalized','bị gạt ra lề','Policies should protect marginalized groups.','excluded']]
  }},
  it: {vi: 'Công nghệ thông tin', en: 'IT', levels: {
    B1: [['software','phần mềm','This software is easy to use.'],['password','mật khẩu','Never share your password.'],['download','tải xuống','Download the file to your laptop.'],['update','cập nhật','Please update the app.'],['screen','màn hình','The screen is too bright.'],['keyboard','bàn phím','My keyboard is broken.'],['website','trang web','Our website is very fast.'],['backup','bản sao lưu','Make a backup of your photos.'],['network','mạng','The network is down.'],['install','cài đặt','Install the program first.']],
    B2: [['database','cơ sở dữ liệu','The database stores customer data.'],['bug','lỗi phần mềm','We found a bug in the login page.'],['deploy','triển khai','We deploy new code every Friday.'],['server','máy chủ','The server is in Singapore.'],['encrypt','mã hoá','Always encrypt sensitive data.'],['framework','khung phát triển','React is a popular framework.'],['debug','gỡ lỗi','It took hours to debug the code.'],['interface','giao diện','The interface is simple and clean.'],['bandwidth','băng thông','Video calls need more bandwidth.'],['repository','kho mã nguồn','Push your changes to the repository.']],
    C1: [['scalability','khả năng mở rộng','Scalability matters for a growing app.'],['latency','độ trễ','Low latency is vital for games.'],['vulnerability','lỗ hổng bảo mật','The team patched a serious vulnerability.'],['refactor','tái cấu trúc mã','We should refactor this old module.'],['algorithm','thuật toán','The algorithm sorts the list quickly.'],['authentication','xác thực','Two-factor authentication keeps accounts safe.'],['deprecated','không còn được khuyến dùng','This function is deprecated.'],['concurrency','xử lý đồng thời','Concurrency bugs are hard to find.'],['throughput','thông lượng','The new server doubled our throughput.'],['redundancy','dự phòng','Redundancy prevents data loss.']]
  }},
  business: {vi: 'Kinh doanh', en: 'Business', levels: {
    B1: [['customer','khách hàng','The customer wants a refund.'],['profit','lợi nhuận','Our profit grew this year.'],['meeting','cuộc họp','The meeting starts at nine.'],['salary','lương','She asked for a higher salary.'],['invoice','hoá đơn','Please send me the invoice.'],['deadline','hạn chót','The deadline is next Monday.'],['discount','giảm giá','We offer a ten percent discount.'],['budget','ngân sách','We are over budget.'],['manager','quản lý','Talk to the manager about it.'],['contract','hợp đồng','Read the contract carefully.']],
    B2: [['revenue','doanh thu','Revenue rose by twenty percent.'],['negotiation','cuộc đàm phán','The negotiation lasted three days.'],['stakeholder','bên liên quan','Every stakeholder must agree.'],['forecast','dự báo','The sales forecast looks good.'],['merger','sáp nhập','The merger created a giant company.'],['supplier','nhà cung cấp','We changed our supplier.'],['investment','khoản đầu tư','This investment is risky.'],['competitor','đối thủ cạnh tranh','Our competitor lowered prices.'],['strategy','chiến lược','We need a new marketing strategy.'],['shareholder','cổ đông','Every shareholder received a letter.']],
    C1: [['liquidity','tính thanh khoản','The company has a liquidity problem.'],['leverage','đòn bẩy','They used debt as leverage.'],['diversify','đa dạng hoá','Farmers should diversify their crops.'],['compliance','sự tuân thủ','Compliance with tax law is essential.'],['acquisition','thương vụ thâu tóm','The acquisition cost two billion dollars.'],['benchmark','chuẩn so sánh','We use last year as a benchmark.'],['incentive','ưu đãi khuyến khích','Bonuses are a strong incentive.'],['viable','khả thi','Is this plan financially viable?'],['overhead','chi phí chung','Rent is our biggest overhead.'],['entrepreneur','doanh nhân khởi nghiệp','She is a young entrepreneur.']]
  }},
  medical: {vi: 'Y tế', en: 'Medical', levels: {
    B1: [['fever','sốt','The child has a high fever.'],['medicine','thuốc','Take this medicine after meals.'],['patient','bệnh nhân','The patient is resting now.'],['injury','chấn thương','He has a knee injury.'],['headache','đau đầu','I have a terrible headache.'],['nurse','y tá','The nurse checked my temperature.'],['appointment','lịch hẹn','I have a doctor appointment today.'],['pharmacy','hiệu thuốc','The pharmacy is open late.'],['cough','ho','Her cough is getting worse.'],['allergy','dị ứng','I have an allergy to peanuts.']],
    B2: [['diagnosis','chẩn đoán','The diagnosis was a mild infection.'],['symptom','triệu chứng','Fever is a common symptom.'],['prescription','đơn thuốc','You need a prescription for this drug.'],['surgery','phẫu thuật','The surgery went well.'],['vaccine','vắc-xin','The vaccine protects against flu.'],['infection','nhiễm trùng','Clean the wound to prevent infection.'],['chronic','mãn tính','She has chronic back pain.'],['dosage','liều lượng','Check the dosage on the label.'],['therapy','liệu pháp','Physical therapy helped his recovery.'],['emergency','cấp cứu','Call an ambulance in an emergency.']],
    C1: [['prognosis','tiên lượng','The prognosis is very good.'],['contagious','dễ lây','Measles is highly contagious.'],['anesthesia','gây mê','The patient is under anesthesia.'],['benign','lành tính','Luckily the tumor was benign.'],['inflammation','viêm','Ice reduces inflammation.'],['immunity','miễn dịch','Sleep strengthens your immunity.'],['palliative','giảm nhẹ (chăm sóc)','She receives palliative care.'],['relapse','tái phát','The disease may relapse.'],['triage','phân loại cấp cứu','Nurses do triage in the emergency room.'],['dehydration','mất nước','Dehydration is common in summer.']]
  }},
  tourism: {vi: 'Du lịch & Khách sạn', en: 'Hospitality', levels: {
    B1: [['reservation','đặt chỗ','I have a reservation for two.'],['luggage','hành lý','Leave your luggage at the front desk.'],['receptionist','lễ tân','The receptionist gave us a map.'],['menu','thực đơn','Can I see the menu, please?'],['tip','tiền boa','We left a tip for the waiter.'],['tour','chuyến tham quan','The tour starts at eight.'],['passport','hộ chiếu','Show your passport at the gate.'],['souvenir','quà lưu niệm','I bought a souvenir in Hoi An.'],['guest','khách','The guest wants an extra towel.'],['booking','sự đặt phòng','My booking is for three nights.']],
    B2: [['itinerary','lịch trình','Our itinerary includes Ha Long Bay.'],['accommodation','chỗ ở','The price includes accommodation.'],['amenities','tiện nghi','The hotel has great amenities.'],['complimentary','miễn phí (tặng kèm)','Breakfast is complimentary.'],['concierge','nhân viên hỗ trợ khách','Ask the concierge for a taxi.'],['cuisine','ẩm thực','Vietnamese cuisine is famous.'],['occupancy','công suất phòng','Hotel occupancy is high in summer.'],['refund','hoàn tiền','You can get a full refund.'],['excursion','chuyến du ngoạn','We joined an excursion to the caves.'],['hospitality','sự hiếu khách','The village is known for its hospitality.']],
    C1: [['upscale','cao cấp','It is an upscale resort.'],['overbook','đặt quá số chỗ','Airlines often overbook flights.'],['ambiance','bầu không khí','The restaurant has a cozy ambiance.'],['gratuity','tiền thưởng phục vụ','A gratuity is included in the bill.'],['seasonal','theo mùa','Tourism here is very seasonal.'],['ecotourism','du lịch sinh thái','Ecotourism protects local forests.'],['hospitable','hiếu khách','The locals were very hospitable.'],['deluxe','hạng sang','We booked a deluxe room.'],['layover','điểm quá cảnh','We had a long layover in Bangkok.'],['patronage','sự ủng hộ (của khách)','Thank you for your patronage.']]
  }},
  engineering: {vi: 'Kỹ thuật', en: 'Engineering', levels: {
    B1: [['machine','máy móc','The machine is very loud.'],['tool','dụng cụ','Use the right tool for the job.'],['measure','đo','Measure the wall before you cut.'],['engine','động cơ','The engine needs oil.'],['repair','sửa chữa','He can repair the pump.'],['steel','thép','The bridge is made of steel.'],['power','điện, năng lượng','The power went out last night.'],['pipe','đường ống','Water leaks from the pipe.'],['battery','pin, ắc quy','The battery is almost empty.'],['design','thiết kế','We need a simple design.']],
    B2: [['prototype','nguyên mẫu','We tested the first prototype.'],['efficiency','hiệu suất','Solar panels improve efficiency.'],['voltage','điện áp','Check the voltage before you start.'],['friction','ma sát','Oil reduces friction.'],['blueprint','bản vẽ kỹ thuật','The engineer studied the blueprint.'],['maintenance','bảo trì','Regular maintenance saves money.'],['component','linh kiện','Each component is tested.'],['durable','bền','This material is very durable.'],['assemble','lắp ráp','It takes an hour to assemble the pump.'],['specification','thông số kỹ thuật','Follow the specification exactly.']],
    C1: [['tolerance','dung sai','The tolerance is half a millimeter.'],['torque','mô-men xoắn','The motor delivers high torque.'],['corrosion','sự ăn mòn','Paint protects against corrosion.'],['calibrate','hiệu chuẩn','Calibrate the sensor every month.'],['fatigue','sự mỏi (vật liệu)','Metal fatigue caused the crack.'],['hydraulic','thủy lực','The tractor has a hydraulic lift.'],['insulation','cách nhiệt, cách điện','Good insulation keeps the house cool.'],['feasibility','tính khả thi','We ran a feasibility study.'],['thermal','nhiệt','Thermal expansion can bend rails.'],['irrigation','thủy lợi, tưới tiêu','The new irrigation system saves water.']]
  }},
  design: {vi: 'Thiết kế & Kiến trúc', en: 'Design', levels: {
    B1: [['wall','bức tường','Paint the wall white.'],['ceiling','trần nhà','The ceiling is very high.'],['floor','sàn nhà','The floor is made of wood.'],['furniture','đồ nội thất','We bought new furniture.'],['sketch','bản phác thảo','She drew a quick sketch.'],['color','màu sắc','Choose a warm color for the bedroom.'],['lamp','đèn','Put a lamp next to the sofa.'],['shelf','kệ','The books are on the shelf.'],['curtain','rèm cửa','Open the curtain, please.'],['tile','gạch lát','The bathroom tile is blue.']],
    B2: [['layout','bố cục','The kitchen layout is open.'],['texture','chất liệu bề mặt','I love the texture of this stone.'],['lighting','chiếu sáng','Good lighting changes a room.'],['render','ảnh dựng','The client liked the render.'],['scale','tỷ lệ','The drawing is not to scale.'],['veneer','gỗ lạng','The cabinet has an oak veneer.'],['facade','mặt tiền','The facade faces the river.'],['partition','vách ngăn','A glass partition divides the office.'],['joinery','đồ mộc','The joinery is handmade.'],['palette','bảng màu','We chose a neutral palette.']],
    C1: [['minimalist','tối giản','Japandi style is calm and minimalist.'],['ergonomic','công thái học','We need an ergonomic chair.'],['cantilever','dầm công-xôn','The balcony is a cantilever.'],['juxtaposition','sự đặt cạnh tương phản','I like the juxtaposition of wood and concrete.'],['vernacular','kiến trúc bản địa','The house follows vernacular style.'],['circulation','lưu thông','Good circulation makes a home feel larger.'],['elevation','mặt đứng','Draw the north elevation first.'],['symmetry','sự đối xứng','The temple shows perfect symmetry.'],['ambient','(ánh sáng) nền','Ambient light should be soft.'],['aesthetic','thẩm mỹ','The aesthetic is warm and natural.']]
  }}
};
const WORDS = {};          // key -> word object
const TRACK_WORDS = {};    // track -> level -> [word]
for (const [tid, t] of Object.entries(TRACKS)) {
  TRACK_WORDS[tid] = {};
  for (const [lv, list] of Object.entries(t.levels)) {
    TRACK_WORDS[tid][lv] = list.map(([en, vi, ex, syn]) => {
      const w = {key: tid + ':' + en, en, vi, ex, syn, track: tid, level: lv};
      WORDS[w.key] = w; return w;
    });
  }
}
// game level needed before a CEFR level opens
const LEVEL_GATE = {A1: 1, A2: 1, B1: 1, B2: 1, C1: 1};
const IELTS_BAND = {A1: 'Nền tảng', A2: 'Band 4.0–4.5', B1: 'Band 5.0–5.5', B2: 'Band 6.0–6.5', C1: 'Band 7.0+'};

const PHRASES = [
  {lv:'A1', q:'How are you?', qv:'Bạn khỏe không?', a:'I am fine, thank you.', av:'Mình khỏe, cảm ơn.'},
  {lv:'A1', q:'What is your name?', qv:'Bạn tên là gì?', a:'My name is {name}.', av:'Mình tên là {name}.'},
  {lv:'A1', q:'Where are you from?', qv:'Bạn đến từ đâu?', a:'I am from Vietnam.', av:'Mình đến từ Việt Nam.'},
  {lv:'A1', q:'Nice to meet you.', qv:'Rất vui được gặp bạn.', a:'Nice to meet you too.', av:'Mình cũng rất vui được gặp bạn.'},
  {lv:'A1', q:'Goodbye!', qv:'Tạm biệt!', a:'See you later!', av:'Hẹn gặp lại!'},
  {lv:'A1', q:'Thank you so much!', qv:'Cảm ơn bạn nhiều!', a:'You are welcome.', av:'Không có gì.'},
  {lv:'A2', q:'What do you do?', qv:'Bạn làm nghề gì?', a:'I am a farmer.', av:'Mình là nông dân.'},
  {lv:'A2', q:'Can you help me?', qv:'Bạn giúp mình được không?', a:'Sure, no problem.', av:'Được chứ, không vấn đề gì.'},
  {lv:'A2', q:'What is the weather like?', qv:'Thời tiết thế nào?', a:'It is sunny and warm.', av:'Trời nắng và ấm.'},
  {lv:'A2', q:'Where is the market?', qv:'Chợ ở đâu?', a:'It is next to the school.', av:'Nó ở cạnh trường học.'},
  {lv:'A2', q:'Are you hungry?', qv:'Bạn có đói không?', a:'Yes, I want to eat.', av:'Có, mình muốn ăn.'},
  {lv:'A2', q:'Do you have a pet?', qv:'Bạn có nuôi thú cưng không?', a:'Yes, I have a chicken.', av:'Có, mình nuôi một con gà.'},
  {lv:'B1', q:'Could you recommend a good restaurant?', qv:'Bạn gợi ý giúp một nhà hàng ngon được không?', a:'Sure, try the noodle shop near the market.', av:'Được chứ, thử quán bún gần chợ nhé.'},
  {lv:'B1', q:'How long have you lived here?', qv:'Bạn sống ở đây bao lâu rồi?', a:'I have lived here for five years.', av:'Mình sống ở đây được năm năm rồi.'},
  {lv:'B1', q:'Do you mind if I open the window?', qv:'Bạn có phiền nếu mình mở cửa sổ không?', a:'Not at all, go ahead.', av:'Không sao, cứ mở đi.'},
  {lv:'B1', q:'Have you ever been abroad?', qv:'Bạn đã từng ra nước ngoài chưa?', a:'Yes, I have been to Japan.', av:'Rồi, mình đã từng đến Nhật.'},
  {lv:'B2', q:'What would you do if it rained all week?', qv:'Bạn sẽ làm gì nếu trời mưa cả tuần?', a:'I would stay in and read.', av:'Mình sẽ ở nhà đọc sách.'},
  {lv:'B2', q:'Why did you decide to become a farmer?', qv:'Vì sao bạn quyết định làm nông?', a:'Because I enjoy working outdoors.', av:'Vì mình thích làm việc ngoài trời.'}
];

/* ===================== FARM CONTENT ===================== */
// crops.png: cell 32x64; block A rows start y=0, block B rows start y=320; stages 0..3, 4 = harvested
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
,
  {id:'garlic',    en:'garlic',    vi:'tỏi',        lvl:2,  cost:7,  time:2400,  sell:21,  xp:10, one:'a head of garlic', pl:'heads of garlic'},
  {id:'spinach',   en:'spinach',   vi:'rau chân vịt',lvl:3, cost:9,  time:4500,  sell:28,  xp:12, one:'a bunch of spinach', pl:'bunches of spinach'},
  {id:'sweetpotato',en:'sweet potato',vi:'khoai lang',lvl:4, cost:11, time:6300,  sell:36,  xp:14, one:'a sweet potato', pl:'sweet potatoes'},
  {id:'peanut',    en:'peanut',    vi:'lạc',        lvl:5,  cost:13, time:9000,  sell:46,  xp:17, one:'a peanut plant', pl:'peanuts'},
  {id:'beans',     en:'green beans',vi:'đậu cô ve', lvl:6,  cost:15, time:12600, sell:58,  xp:20, one:'a handful of green beans', pl:'green beans'},
  {id:'sunflower', en:'sunflower', vi:'hoa hướng dương',lvl:7,cost:17,time:16200, sell:72,  xp:23, one:'a sunflower', pl:'sunflowers'},
  {id:'blueberry', en:'blueberry', vi:'việt quất',  lvl:9,  cost:23, time:25200, sell:105, xp:30, one:'a cup of blueberries', pl:'blueberries'},
  {id:'rose',      en:'rose',      vi:'hoa hồng',   lvl:10, cost:25, time:30600, sell:122, xp:33, one:'a rose', pl:'roses'},
  {id:'grape',     en:'grape',     vi:'nho',        lvl:12, cost:30, time:39600, sell:155, xp:39, one:'a bunch of grapes', pl:'bunches of grapes'},
  {id:'pineapple', en:'pineapple', vi:'dứa',        lvl:13, cost:34, time:46800, sell:178, xp:43, one:'a pineapple', pl:'pineapples'},
  {id:'dragonfruit',en:'dragon fruit',vi:'thanh long',lvl:14,cost:38,time:57600, sell:212, xp:48, one:'a dragon fruit', pl:'dragon fruits'},
  {id:'lotus',     en:'lotus',     vi:'hoa sen',    lvl:16, cost:46, time:72000, sell:280, xp:56, one:'a lotus flower', pl:'lotus flowers'},
  {id:'goldmelon', en:'golden melon',vi:'dưa lưới vàng',lvl:20,cost:70,time:129600,sell:520,xp:85, one:'a golden melon', pl:'golden melons'},
  {id:'ginseng',   en:'ginseng',   vi:'nhân sâm',   lvl:18, cost:0,  time:172800, sell:1200, xp:150, rare:1, one:'a ginseng root', pl:'ginseng roots'}
];
CROPS.sort((a, b) => a.lvl - b.lvl || a.time - b.time);
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
const NAMES = ['Mai','Nam','Lan','Tuấn','Hoa','Minh','Thảo','Khoa','Linh','Bảo','Trang','Phúc','Vy','Dũng'];
const FREE_ITEMS = ['top_tee','bot_pants'];
