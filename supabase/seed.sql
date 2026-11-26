-- Sample clubs, businesses, and events. Run AFTER schema.sql.
insert into public.organizations (name, type, category, description, email) values
 ('Consulting & Careers Network','club','Career & Networking','Case workshops, résumé reviews, and networking mixers with alumni.','ccn@example.edu'),
 ('Cville Community Kitchen Volunteers','club','Community Service','We cook and serve meals with local partners around Charlottesville every weekend.','kitchen@example.edu'),
 ('Global Grounds Collective','club','Cultural','A home for international and out-of-state students. Food nights, city trips, and a buddy program for first years.','ggc@example.edu'),
 ('Hoos Who Code','club','Tech','Hack nights, interview prep, and project teams for students who want to build things.','hwc@example.edu'),
 ('Lawn Film Society','club','Arts','Weekly screenings, outdoor movie nights, and a student short-film festival each spring.','film@example.edu'),
 ('Cavalier Capital','club','Career & Networking','Student-run venture fund: pitch nights, deal sourcing, and investing workshops.','cc@example.edu'),
 ('Corner Coffee Co.','business','Food','Neighborhood roaster hosting latte-art nights and student study sessions.','hello@cornercoffee.example'),
 ('Downtown Mall Records','business','Music','Indie record shop with live in-store sets and vinyl swaps.','shop@mallrecords.example'),
 ('Blue Ridge Climbing Gym','business','Athletics & Rec','Student-night discounts, intro-to-bouldering clinics, and weekend meetups.','info@brclimb.example');

insert into public.events (name, date, time, location, description, cost, category, org_id, status, popular_majors)
select v.name, current_date + v.d, v.time, v.location, v.description, v.cost, v.category, o.id, 'approved', v.majors
from (values
 ('Alumni Networking Mixer',1,'7:00 PM','Robertson Hall Forum','Meet alumni working in finance, consulting, and policy. Business casual; bring questions.','Free','Career & Networking','Consulting & Careers Network','{Economics,Commerce}'::text[]),
 ('Case Interview Workshop',2,'6:30 PM','Robertson Hall 120','Practice consulting case interviews in small groups with feedback from upperclassmen.','Free','Career & Networking','Consulting & Careers Network','{Economics,Commerce}'::text[]),
 ('Technical Interview Mock Session',3,'6:00 PM','Rice Hall 340','Mock coding interviews and resume tips from students who landed internships.','Free','Tech','Hoos Who Code','{"Computer Science",Engineering}'::text[]),
 ('Community Kitchen Shift',4,'10:00 AM','Charlottesville Community Center','Help prep and serve meals. Transportation provided from Grounds.','Free','Community Service','Cville Community Kitchen Volunteers','{}'::text[]),
 ('Outdoor Movie Night',5,'8:00 PM','Alumni Hall Lawn','Blankets, popcorn, and a fan-voted classic under the stars.','Free','Arts','Lawn Film Society','{}'::text[]),
 ('International Food Night',6,'5:30 PM','Newcomb Hall Commonwealth Room','Dishes from 12 countries cooked by members. Come hungry.','$5','Cultural','Global Grounds Collective','{}'::text[]),
 ('Latte Art Night',7,'7:00 PM','Corner Coffee Co., Downtown Mall','Learn to pour a rosetta from a barista. First 20 students get a free drink.','$8','Food','Corner Coffee Co.','{}'::text[]),
 ('Live Set: Local Indie Showcase',8,'8:30 PM','Downtown Mall Records','Three local acts play in-store. All ages.','Free','Music','Downtown Mall Records','{}'::text[]),
 ('Student Night Bouldering',9,'6:00 PM','Blue Ridge Climbing Gym','Half-price day pass with a UVA ID plus a beginner clinic at 6:30.','$8','Athletics & Rec','Blue Ridge Climbing Gym','{}'::text[]),
 ('Startup Pitch Night',10,'6:00 PM','McIntire School of Commerce','Student founders pitch to a panel of investors; networking after.','Free','Career & Networking','Cavalier Capital','{Economics,Commerce}'::text[])
) as v(name,d,time,location,description,cost,category,org,majors)
join public.organizations o on o.name = v.org;
