/* ===================== TEST BANK (original material written for Vườn Chữ) ===================== */
// Question shapes: {t:'mcq', q, options:[...], answer:index} | {t:'tfng', q, answer:'TRUE'|'FALSE'|'NOT GIVEN'}
//                  {t:'gap', q, answer:[accepted strings]} | {t:'write', ...} | {t:'speak', ...}
const IELTS_MOCK = {
  id: 'ielts1', kind: 'ielts', title: 'IELTS Academic · Đề mẫu 1 (rút gọn)',
  sections: [
    {id: 'L', skill: 'listening', title: 'Listening', minutes: 25, note: 'Bốn phần, 20 câu. Bạn được nghe tối đa 2 lần mỗi phần (đề thật chỉ 1 lần). Gõ đáp án vào ô trống, không quá hai từ hoặc một con số.',
      parts: [
        {title: 'Part 1 · Đăng ký lớp nấu ăn', audio: [
          ['A', 'Good morning, Riverside Community Centre. How can I help you?'], ['B', "Hi, I'd like to sign up for one of your evening cooking classes."],
          ['A', 'Of course. Can I take your name?'], ['B', "It's Laura Benson. That's B, E, N, S, O, N."],
          ['A', 'Thank you. Which class are you interested in? We have Italian, Thai and baking.'], ['B', 'Thai, please. My friend said it was excellent.'],
          ['A', 'Good choice. That one runs on Wednesday evenings from seven to nine.'], ['B', 'Great. How much does it cost?'],
          ['A', "It's ninety-five pounds for the six weeks, but members pay eighty."], ['B', "I'm not a member, so ninety-five then. Do I need to bring anything?"],
          ['A', 'Just an apron. We provide all the ingredients and the knives.']],
          questions: [
            {t: 'gap', q: 'Surname: ______', answer: ['benson']},
            {t: 'gap', q: 'Type of class: ______', answer: ['thai']},
            {t: 'gap', q: 'Day of the class: ______', answer: ['wednesday', 'wednesdays']},
            {t: 'gap', q: 'Price for non-members: £______', answer: ['95', 'ninety-five', 'ninety five']},
            {t: 'gap', q: 'Students must bring an ______', answer: ['apron']}]},
        {title: 'Part 2 · Vườn cộng đồng', audio: [
          ['C', 'Welcome to the Greenway Community Garden. The garden opened three years ago on land that used to be a car park. Today we have forty plots, and each one is looked after by a local family. Plots are free, but gardeners must volunteer for two hours a month.'],
          ['C', 'The most popular crop is tomatoes, though many people now grow herbs because they need very little space. Water comes from rain tanks on the roof of the tool shed, so we never use the city supply.'],
          ['C', "On Saturdays we run a workshop for children, which is the part I'm most proud of. If you'd like a plot, there is a waiting list of about six months, and you can add your name at the information board by the gate."]],
          questions: [
            {t: 'mcq', q: 'The garden was built on a former', options: ['park', 'car park', 'school field'], answer: 1},
            {t: 'mcq', q: 'Gardeners must', options: ['pay a monthly fee', 'volunteer two hours a month', 'grow tomatoes'], answer: 1},
            {t: 'mcq', q: 'Many people grow herbs because they', options: ['sell well', 'need little space', 'grow quickly'], answer: 1},
            {t: 'mcq', q: 'Water for the garden comes from', options: ['the city supply', 'a nearby river', 'rain tanks'], answer: 2},
            {t: 'mcq', q: 'The speaker is most proud of', options: ["the children's workshop", 'the tool shed', 'the waiting list'], answer: 0}]},
        {title: 'Part 3 · Hai sinh viên bàn dự án', audio: [
          ['B', 'Have you decided what to focus on for our transport project?'], ['A', 'I was thinking about bike-sharing schemes. The data from Hanoi is really interesting.'],
          ['B', 'True, but the lecturer said we should compare at least two cities.'], ['A', "Then let's add Bangkok. Their scheme started later but grew faster."],
          ['B', 'Good. What about the survey? I think fifty responses is too few.'], ['A', "Agreed. Let's aim for a hundred and fifty, mostly commuters."],
          ['B', 'The deadline is the twelfth of May, so we should finish the survey by the end of April.'], ['A', "Fine. I'll write the introduction, and you can analyse the survey results."],
          ['B', 'Deal. But we both need to check the references at the end.']],
          questions: [
            {t: 'gap', q: 'The students will compare bike-sharing in Hanoi and ______.', answer: ['bangkok']},
            {t: 'mcq', q: "Bangkok's scheme", options: ['started earlier', 'grew faster', 'costs less'], answer: 1},
            {t: 'gap', q: 'Target number of survey responses: ______', answer: ['150', 'one hundred and fifty', 'a hundred and fifty']},
            {t: 'gap', q: 'The survey should be finished by the end of ______.', answer: ['april']},
            {t: 'mcq', q: 'The woman (Mia) will', options: ['write the introduction', 'analyse the survey results', 'check the references alone'], answer: 1}]},
        {title: 'Part 4 · Bài giảng về đảo nhiệt đô thị', audio: [
          ['C', "Today I'll talk about urban heat islands. Cities are often up to five degrees warmer than the surrounding countryside. The main reason is that concrete and asphalt absorb heat during the day and release it slowly at night."],
          ['C', 'A second cause is the lack of trees, which normally cool the air through shade and evaporation. Heat islands also increase energy use, because people run air conditioners for longer.'],
          ['C', 'Fortunately, there are solutions. Green roofs, which are roofs covered with plants, can lower building temperatures significantly. Another simple method is painting roofs white so that they reflect sunlight.']],
          questions: [
            {t: 'gap', q: 'Cities can be up to ______ degrees warmer than the countryside.', answer: ['5', 'five']},
            {t: 'gap', q: 'Concrete and asphalt release heat slowly at ______.', answer: ['night']},
            {t: 'gap', q: 'Trees cool the air through shade and ______.', answer: ['evaporation']},
            {t: 'gap', q: 'Heat islands increase ______ use.', answer: ['energy']},
            {t: 'gap', q: 'Painting roofs white helps them ______ sunlight.', answer: ['reflect']}]}
      ]},
    {id: 'R', skill: 'reading', title: 'Reading', minutes: 30, note: 'Hai bài đọc, 16 câu. Với câu TRUE/FALSE/NOT GIVEN: FALSE là thông tin trái với bài, NOT GIVEN là bài không nhắc tới.',
      parts: [
        {title: 'Passage 1 · The Return of the Night Market', passage: `<p><b>A</b> Night markets have been part of Asian city life for centuries, but in the early 2000s many observers predicted their decline. Shopping malls offered air-conditioning, fixed prices and card payments, and younger shoppers seemed to prefer them. In several cities, authorities also closed street markets, citing traffic problems and hygiene concerns.</p>
<p><b>B</b> Two decades later, the picture is very different. Night markets in Taipei, Bangkok and Ho Chi Minh City now attract record numbers of visitors, many of them under thirty. Researchers suggest that social media played a central role: brightly lit food stalls photograph well, and short videos of unusual snacks regularly reach millions of viewers.</p>
<p><b>C</b> Local governments have responded by redesigning rather than removing the markets. In Taipei, for example, the city introduced shared washing stations and strict rules on waste sorting. Vendors must now hold a food-safety certificate, which is renewed every two years. These changes have reduced complaints from residents by almost half.</p>
<p><b>D</b> However, success has brought new problems. Rents for stall spaces have risen sharply, and some long-established vendors say they can no longer afford to trade. Critics also argue that markets are becoming tourist attractions that sell the same products everywhere, losing the local character that made them popular in the first place.</p>
<p><b>E</b> Some cities are experimenting with solutions. One approach reserves a share of stalls for vendors who have traded in the same place for more than ten years. Another limits the number of stalls selling identical items. It is too early to say whether these policies will protect the traditional night market, but they suggest that planners now see these markets as valuable public spaces rather than problems to be solved.</p>`,
          questions: [
            {t: 'tfng', q: 'In the early 2000s some people expected night markets to decline.', answer: 'TRUE'},
            {t: 'tfng', q: 'Most visitors to night markets today come from Europe.', answer: 'NOT GIVEN'},
            {t: 'tfng', q: 'Taipei closed several night markets because of traffic.', answer: 'NOT GIVEN'},
            {t: 'tfng', q: 'Vendors in Taipei must renew their food-safety certificate every year.', answer: 'FALSE'},
            {t: 'tfng', q: 'Complaints from residents in Taipei fell after the changes.', answer: 'TRUE'},
            {t: 'gap', q: 'Researchers believe ______ helped attract younger visitors. (TWO WORDS)', answer: ['social media']},
            {t: 'gap', q: 'Higher ______ for stall spaces have forced some vendors out. (ONE WORD)', answer: ['rents', 'rent']},
            {t: 'mcq', q: 'Which paragraph describes rules about waste?', options: ['B', 'C', 'D', 'E'], answer: 1}]},
        {title: 'Passage 2 · Learning a Language in Later Life', passage: `<p>Many adults believe that learning a foreign language becomes almost impossible after childhood. Scientific evidence presents a more complicated picture. It is true that children usually achieve a more native-like accent, particularly if they begin before the age of about ten. However, studies comparing adults and children over the same period often find that adults make faster progress at first, because they can apply grammar rules consciously and already understand how language works.</p>
<p>A large study of more than 600,000 learners suggested that the ability to master grammar remains strong until around the age of seventeen, after which it slowly declines. The authors stressed that this did not mean adults could not become fluent; rather, reaching the level of a native speaker becomes less likely. For most learners, who want to communicate at work or while travelling, this distinction matters little.</p>
<p>Motivation appears to be at least as important as age. Adults who learn a language for a specific purpose, such as a new job or moving abroad, tend to persist longer than those who study out of general interest. Regular practice also plays a role: thirty minutes a day is generally more effective than three hours once a week, because memory is strengthened through repeated retrieval.</p>
<p>Finally, learning a language may bring benefits beyond communication. Several studies have linked bilingualism to better attention control, and some research suggests it may delay the symptoms of dementia by several years, although scientists continue to debate the size of this effect.</p>`,
          questions: [
            {t: 'mcq', q: 'Adults often learn faster than children at first because they', options: ['have better memories', 'can apply grammar rules consciously', 'spend more time studying'], answer: 1},
            {t: 'mcq', q: 'The large study found grammar ability starts to decline after about age', options: ['ten', 'seventeen', 'thirty'], answer: 1},
            {t: 'tfng', q: 'Adults cannot become fluent in a new language.', answer: 'FALSE'},
            {t: 'tfng', q: 'Learners with a specific purpose tend to keep studying longer.', answer: 'TRUE'},
            {t: 'tfng', q: 'One long weekly session is more effective than short daily practice.', answer: 'FALSE'},
            {t: 'tfng', q: 'Bilingualism has been linked to better attention control.', answer: 'TRUE'},
            {t: 'tfng', q: 'Most adult learners study in order to pass exams.', answer: 'NOT GIVEN'},
            {t: 'gap', q: 'Memory is strengthened through repeated ______. (ONE WORD)', answer: ['retrieval']}]}
      ]},
    {id: 'W', skill: 'writing', title: 'Writing', minutes: 60, note: 'Task 1 khoảng 20 phút, ít nhất 150 từ. Task 2 khoảng 40 phút, ít nhất 250 từ. Bài được Claude chấm theo 4 tiêu chí IELTS.',
      parts: [
        {title: 'Task 1 · Mô tả biểu đồ', chart: {title: 'Households owning each vehicle type, 2023 (%)', groups: ['Hanoi', 'Bangkok', 'Singapore'], series: [['Bicycle', [22, 15, 25]], ['Car', [18, 45, 38]], ['Motorbike', [86, 52, 6]]]},
          questions: [{t: 'write', task: 1, min: 150, q: 'The chart shows the percentage of households in three cities that owned a bicycle, a car or a motorbike in 2023. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.'}]},
        {title: 'Task 2 · Bài luận', questions: [{t: 'write', task: 2, min: 250, q: 'Some people think that governments should spend more money on public transport, while others believe that building more roads is the better solution. Discuss both views and give your own opinion. Write at least 250 words.'}]}
      ]},
    {id: 'S', skill: 'speaking', title: 'Speaking', minutes: 14, note: 'Bấm "Nghe câu hỏi", rồi bấm "Nói" để trả lời bằng giọng nói (hoặc gõ nếu trình duyệt không hỗ trợ). Claude chấm theo độ trôi chảy, từ vựng, ngữ pháp dựa trên bản ghi lời nói.',
      parts: [
        {title: 'Part 1 · Câu hỏi làm quen', questions: [
          {t: 'speak', part: 1, q: 'Where do you live, and what do you like about it?'},
          {t: 'speak', part: 1, q: 'Do you prefer studying in the morning or at night? Why?'},
          {t: 'speak', part: 1, q: 'How often do you use public transport?'}]},
        {title: 'Part 2 · Thẻ chủ đề (1 phút chuẩn bị, nói 1–2 phút)', questions: [
          {t: 'speak', part: 2, q: 'Describe a skill you learned that you are proud of. You should say: what the skill is, when and how you learned it, who helped you, and explain why you are proud of it.'}]},
        {title: 'Part 3 · Thảo luận', questions: [
          {t: 'speak', part: 3, q: 'Why do some people find it hard to learn new skills as adults?'},
          {t: 'speak', part: 3, q: 'Should schools teach more practical skills? Why or why not?'}]}
      ]}
  ]
};

const TOEIC_MOCK = {
  id: 'toeic1', kind: 'toeic', title: 'TOEIC Listening & Reading · Đề mẫu 1 (rút gọn)',
  sections: [
    {id: 'L', skill: 'listening', title: 'Listening', minutes: 15, note: 'Part 2, 3, 4 như đề thật, 15 câu. Bạn nghe được tối đa 2 lần mỗi phần.',
      parts: [
        {title: 'Part 2 · Question–Response', audio: [
          ['A', 'Number one. Where is the staff meeting being held?'], ['B', 'A. At three o\'clock. B. In conference room B. C. Yes, I\'ll be there.'],
          ['A', 'Number two. Would you like me to send you the report?'], ['B', 'A. That would be great, thanks. B. It\'s on page four. C. He reported it yesterday.'],
          ['A', 'Number three. Why was the flight delayed?'], ['B', 'A. Gate twelve. B. Because of bad weather. C. About two hours long.'],
          ['A', 'Number four. Who is in charge of the new project?'], ['B', 'A. Ms. Tanaka is. B. No, it\'s free of charge. C. Next Monday.'],
          ['A', 'Number five. Haven\'t you finished the budget yet?'], ['B', 'A. I\'ll have it done by noon. B. It was very expensive. C. Yes, the budget meeting.'],
          ['A', 'Number six. How about ordering lunch for the team?'], ['B', 'A. I had a sandwich. B. Good idea, I\'ll call the restaurant. C. At the front desk.']],
          questions: [1, 0, 1, 0, 0, 1].map((a, i) => ({t: 'mcq', q: `Câu ${i + 1}: chọn câu trả lời phù hợp nhất`, options: ['A', 'B', 'C'], answer: a}))},
        {title: 'Part 3 · Conversations', audio: [
          ['B', 'Hi Ken, the printer on the third floor isn\'t working again.'], ['A', 'I know. The technician is coming this afternoon, but not until four.'],
          ['B', 'I need to print the handouts for the client presentation at two.'], ['A', 'You can use the printer in the marketing department on the second floor. I\'ll email them to let them know you\'re coming.'],
          ['A', 'Good morning, Harbor Hotel. How can I help?'], ['B', 'I booked a room for three nights starting Friday, but I need to arrive a day early.'],
          ['A', 'Let me check. Yes, we have a room available on Thursday, but it\'s a standard room, not the sea-view room you reserved.'], ['B', 'That\'s fine for one night. Can I move to the sea-view room on Friday?'],
          ['A', 'Of course. I\'ll update your reservation and send you a new confirmation by email.']],
          questions: [
            {t: 'mcq', q: 'What is the problem?', options: ['A printer is not working', 'A presentation was cancelled', 'A client is late', 'The email system is down'], answer: 0},
            {t: 'mcq', q: 'When will the technician arrive?', options: ['At 2:00', 'At 3:00', 'At 4:00', 'Tomorrow'], answer: 2},
            {t: 'mcq', q: 'What will the man do?', options: ['Fix the printer', 'Email the marketing department', 'Print the handouts', 'Call the client'], answer: 1},
            {t: 'mcq', q: 'Why is the woman calling the hotel?', options: ['To cancel a booking', 'To change her arrival date', 'To ask about prices', 'To complain about a room'], answer: 1},
            {t: 'mcq', q: 'What does the man say about Thursday?', options: ['The hotel is full', 'Only a standard room is available', 'The price is higher', 'Breakfast is not included'], answer: 1},
            {t: 'mcq', q: 'What will the man send?', options: ['A map', 'An invoice', 'A new confirmation', 'A discount code'], answer: 2}]},
        {title: 'Part 4 · Talk', audio: [
          ['C', 'Attention all passengers on the nine fifteen train to Lakeside. Due to track maintenance near Pine Street, this train will depart from platform six instead of platform two. The journey will take about ten minutes longer than usual. Passengers travelling to the airport should change at Central Station, where a free shuttle bus is available. We apologize for the inconvenience.']],
          questions: [
            {t: 'mcq', q: 'Why has the platform changed?', options: ['A train broke down', 'Track maintenance', 'Bad weather', 'A staff shortage'], answer: 1},
            {t: 'mcq', q: 'How much longer will the journey take?', options: ['Five minutes', 'Ten minutes', 'Fifteen minutes', 'Thirty minutes'], answer: 1},
            {t: 'mcq', q: 'What is available at Central Station?', options: ['A waiting room', 'Discount tickets', 'A free shuttle bus', 'Taxis'], answer: 2}]}
      ]},
    {id: 'R', skill: 'reading', title: 'Reading', minutes: 20, note: 'Part 5, 6, 7 như đề thật, 22 câu.',
      parts: [
        {title: 'Part 5 · Incomplete Sentences', questions: [
          {t: 'mcq', q: 'The new software will be installed ____ all computers next week.', options: ['on', 'at', 'by', 'of'], answer: 0},
          {t: 'mcq', q: 'Ms. Lee asked her assistant to ____ the meeting until Thursday.', options: ['postpone', 'postponed', 'postponing', 'postpones'], answer: 0},
          {t: 'mcq', q: 'Applicants must submit their forms ____ the end of the month.', options: ['by', 'until', 'since', 'during'], answer: 0},
          {t: 'mcq', q: 'The marketing team worked ____ to finish the campaign on time.', options: ['diligently', 'diligent', 'diligence', 'more diligent'], answer: 0},
          {t: 'mcq', q: 'Neither the manager ____ the staff were informed about the change.', options: ['nor', 'or', 'and', 'but'], answer: 0},
          {t: 'mcq', q: 'The conference room is ____ booked for the entire afternoon.', options: ['already', 'yet', 'ever', 'once'], answer: 0},
          {t: 'mcq', q: 'If the shipment ____ late, we will notify customers immediately.', options: ['arrives', 'arrived', 'will arrive', 'arriving'], answer: 0},
          {t: 'mcq', q: 'Our quarterly sales were ____ than expected.', options: ['higher', 'high', 'highest', 'highly'], answer: 0},
          {t: 'mcq', q: 'Employees ____ wish to attend the training should register online.', options: ['who', 'which', 'whose', 'whom'], answer: 0},
          {t: 'mcq', q: 'The contract will be signed once both parties have ____ the terms.', options: ['reviewed', 'review', 'reviewing', 'reviews'], answer: 0},
          {t: 'mcq', q: 'Please keep your receipt ____ you need to return the item.', options: ['in case', 'so that', 'unless', 'although'], answer: 0},
          {t: 'mcq', q: "The CEO's speech was ____ received by the shareholders.", options: ['warmly', 'warm', 'warmth', 'warmer'], answer: 0}]},
        {title: 'Part 6 · Text Completion', passage: `<p><b>To:</b> All staff<br><b>Subject:</b> Office renovation</p><p>Starting next Monday, the second floor will be closed for <b>(1)</b> ____. During this time, staff from that floor will work in the training rooms on the first floor. Please <b>(2)</b> ____ your personal items by Friday afternoon. The work is expected to <b>(3)</b> ____ about three weeks. <b>(4)</b> ____ Thank you for your patience.</p>`,
          questions: [
            {t: 'mcq', q: '(1)', options: ['renovation', 'renovate', 'renovated', 'renovating'], answer: 0},
            {t: 'mcq', q: '(2)', options: ['remove', 'removing', 'removal', 'removed'], answer: 0},
            {t: 'mcq', q: '(3)', options: ['last', 'lasting', 'lasted', 'lastly'], answer: 0},
            {t: 'mcq', q: '(4)', options: ['If you have any questions, please contact the facilities team.', 'The training rooms were built in 1998.', 'Lunch will be served at noon.', 'The second floor now has a new carpet.'], answer: 0}]},
        {title: 'Part 7 · Reading Comprehension', passage: `<p><b>Greenfield Library – Summer Hours</b><br>From June 1 to August 31, the library will open at 9:00 a.m. and close at 6:00 p.m. on weekdays. On Saturdays, hours are 10:00 a.m. to 2:00 p.m. The library will be closed on Sundays. Members can still return books 24 hours a day using the drop box at the main entrance. Our free children's reading club meets every Wednesday at 3:00 p.m.</p>
<hr><p><b>From:</b> Hana Kim, Customer Service, PrintPro<br><b>To:</b> Mr. Alvarez</p><p>Dear Mr. Alvarez, thank you for your order of 200 printed notebooks. Unfortunately, the blue cover you selected is temporarily out of stock. We can either ship the order with a green cover this week or wait until the blue covers arrive on May 20, which would delay delivery by about ten days. As an apology, we will include 20 extra notebooks free of charge with either option. Please reply by Friday to let us know your choice.</p>`,
          questions: [
            {t: 'mcq', q: 'What time does the library close on weekdays in summer?', options: ['2:00 p.m.', '3:00 p.m.', '6:00 p.m.', '9:00 p.m.'], answer: 2},
            {t: 'mcq', q: 'When is the library closed?', options: ['Saturdays', 'Sundays', 'Wednesdays', 'Every evening'], answer: 1},
            {t: 'mcq', q: "What is true about the children's reading club?", options: ['It is free', 'It meets on Saturdays', 'It is for adults', 'It costs $3'], answer: 0},
            {t: 'mcq', q: 'Why did Ms. Kim write to Mr. Alvarez?', options: ['To confirm a payment', 'To explain a problem with an order', 'To advertise a new product', 'To request a meeting'], answer: 1},
            {t: 'mcq', q: 'What does PrintPro offer?', options: ['A full refund', 'Free extra notebooks', 'Free delivery', 'A blue pen'], answer: 1},
            {t: 'mcq', q: 'What must Mr. Alvarez do by Friday?', options: ['Pay the invoice', 'Choose an option', 'Return the notebooks', 'Visit the store'], answer: 1}]}
      ]}
  ]
};

// grammar items by CEFR level for the weekly placement test and the auto-farm test
const GRAMMAR = {
  A1: [['She ____ a teacher.', ['is', 'are', 'am', 'be'], 0], ['I ____ to school every day.', ['go', 'goes', 'going', 'gone'], 0], ['There ____ two cats in the garden.', ['are', 'is', 'am', 'be'], 0], ['This is ____ book.', ['my', 'me', 'I', 'mine'], 0], ['He ____ coffee in the morning.', ['drinks', 'drink', 'drinking', 'drunk'], 0]],
  A2: [['I ____ TV when you called.', ['was watching', 'watch', 'am watching', 'have watched'], 0], ['She has lived here ____ 2019.', ['since', 'for', 'from', 'at'], 0], ['This bag is ____ than that one.', ['cheaper', 'cheap', 'cheapest', 'more cheap'], 0], ['We ____ visit our grandparents tomorrow.', ['are going to', 'goes', 'went', 'going'], 0], ['Did you ____ the email?', ['send', 'sent', 'sending', 'sends'], 0]],
  B1: [['If it rains, we ____ at home.', ['will stay', 'stay', 'stayed', 'would stayed'], 0], ['This book ____ by millions of people.', ['has been read', 'has read', 'is reading', 'reads'], 0], ["I'm used to ____ up early.", ['getting', 'get', 'got', 'gets'], 0], ['He asked me where I ____.', ['lived', 'live', 'do live', 'living'], 0], ['You ____ wear a helmet. It is the law.', ['must', 'might', 'could', 'would'], 0]],
  B2: [['If I had known, I ____ you.', ['would have told', 'will tell', 'told', 'would tell'], 0], ['Hardly ____ arrived when it started to rain.', ['had we', 'we had', 'we have', 'did we'], 0], ['She denied ____ the money.', ['taking', 'to take', 'take', 'taken'], 0], ['The bridge, ____ was built in 1990, is being repaired.', ['which', 'that', 'what', 'who'], 0], ['By next year, they ____ the new airport.', ['will have finished', 'finish', 'have finished', 'are finishing'], 0]],
  C1: [['Not only ____ late, but he also forgot the documents.', ['was he', 'he was', 'he is', 'is he'], 0], ['Had I known earlier, I ____ differently.', ['would have acted', 'acted', 'will act', 'would act'], 0], ['It is essential that every applicant ____ the form in person.', ['submit', 'submits', 'submitted', 'will submit'], 0], ['____ the bad weather, the event went ahead.', ['Despite', 'Although', 'Even though', 'However'], 0], ['Little ____ that the decision would change everything.', ['did they know', 'they knew', 'they did know', 'knew they'], 0]]
};
