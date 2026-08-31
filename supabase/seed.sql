-- Local Growth OS demo seed
-- Safe to re-run after `supabase db reset` because all demo IDs are fixed.

insert into public.organizations (id, name, slug, plan, billing_email)
values ('10000000-0000-0000-0000-000000000001', 'Local Growth Lab', 'local-growth-lab', 'demo', 'ops@localgrowth.demo')
on conflict (id) do nothing;

insert into public.clients (
  id, organization_id, legal_name, public_brand_name, website, industry, business_model,
  primary_phone, timezone, contract_status, start_date, residential_commercial, emergency_services,
  minimum_job_size, business_address, trust_details, seasonal_notes, capacity_constraints
) values
(
  '20000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001',
  'Capital Comfort HVAC LLC','Capital Comfort HVAC','https://capitalcomforthvac.example','HVAC','service_area',
  '(202) 555-0144','America/New_York','active','2026-06-01','both',true,325,
  '{"city":"Washington","state":"DC","postal_code":"20002"}',
  '{"licensed":true,"insured":true,"financing":true,"warranty":"10-year parts on qualifying systems"}',
  'Cooling demand peaks May–August; heating tune-up push begins in September.',
  'Installation crews are capped at 8 replacements per week.'
),
(
  '20000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000001',
  'DMV Roofing and Exteriors LLC','DMV Roofing & Exteriors','https://dmvroofing.example','Roofing','service_area',
  '(301) 555-0199','America/New_York','active','2026-05-15','both',true,1500,
  '{"city":"Silver Spring","state":"MD","postal_code":"20910"}',
  '{"licensed":true,"insured":true,"financing":true,"certifications":["GAF Certified"]}',
  'Storm demand spikes after hail/wind events; spring and fall replacement volume is strongest.',
  'Do not overbook inspection slots beyond 18 per weekday.'
),
(
  '20000000-0000-0000-0000-000000000003','10000000-0000-0000-0000-000000000001',
  'Potomac Plumbing Company LLC','Potomac Plumbing Co.','https://potomacplumbing.example','Plumbing','hybrid',
  '(703) 555-0118','America/New_York','active','2026-07-01','residential',true,225,
  '{"city":"Alexandria","state":"VA","postal_code":"22314"}',
  '{"licensed":true,"insured":true,"warranty":"1-year workmanship"}',
  'Frozen-pipe demand rises in winter; sewer and water-heater work is steady year-round.',
  'Emergency dispatch must preserve two same-day slots.'
)
on conflict (id) do nothing;

insert into public.client_contacts (id, organization_id, client_id, name, email, phone, title, is_primary)
values
('21000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','Tanya Brooks','tanya@capitalcomforthvac.example','(202) 555-0101','General Manager',true),
('21000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000002','Marcus Hill','marcus@dmvroofing.example','(301) 555-0128','Owner',true),
('21000000-0000-0000-0000-000000000003','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000003','Alicia Grant','alicia@potomacplumbing.example','(703) 555-0170','Operations Manager',true)
on conflict (id) do nothing;

insert into public.campaigns (
  id, organization_id, client_id, name, status, baseline_date, primary_city, target_cities,
  target_zip_codes, excluded_areas, priority_markets, kpis, initial_notes, start_date
) values
('30000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','DC HVAC Local Growth','active','2026-06-01','Washington, DC',array['Washington, DC','Arlington, VA','Silver Spring, MD'],array['20002','20009','20011','22201','20910'],array['Baltimore, MD'],array['Washington, DC','Arlington, VA'],array['organic_leads','gbp_calls','local_pack_visibility','booked_estimates','reviews'],'Priority: AC replacement, emergency repair, heat pumps.','2026-06-01'),
('30000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000002','Maryland Roofing Growth','active','2026-05-15','Silver Spring, MD',array['Silver Spring, MD','Bethesda, MD','Rockville, MD','College Park, MD'],array['20910','20814','20850','20740'],array['Washington, DC'],array['Silver Spring, MD','Bethesda, MD'],array['organic_leads','gbp_calls','roof_replacement_leads','reviews','share_of_local_voice'],'Prioritize roof replacement and storm damage; de-emphasize tiny repair jobs.','2026-05-15'),
('30000000-0000-0000-0000-000000000003','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000003','Northern Virginia Plumbing','active','2026-07-01','Alexandria, VA',array['Alexandria, VA','Arlington, VA','Falls Church, VA','Springfield, VA'],array['22314','22201','22046','22150'],array['Manassas, VA'],array['Alexandria, VA','Arlington, VA'],array['organic_leads','gbp_calls','emergency_calls','booked_estimates','revenue'],'Priority: water heaters, sewer, emergency plumbing; never infer revenue when CRM data is absent.','2026-07-01')
on conflict (id) do nothing;

insert into public.services (organization_id, client_id, campaign_id, name, priority, high_margin, average_ticket)
values
('10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','AC Replacement','critical',true,9800),
('10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','Emergency AC Repair','high',false,625),
('10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','Heat Pump Installation','high',true,12400),
('10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000002','30000000-0000-0000-0000-000000000002','Roof Replacement','critical',true,16800),
('10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000002','30000000-0000-0000-0000-000000000002','Storm Damage Inspection','high',false,0),
('10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000003','30000000-0000-0000-0000-000000000003','Water Heater Replacement','critical',true,2350),
('10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000003','30000000-0000-0000-0000-000000000003','Emergency Plumbing','high',false,475),
('10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000003','30000000-0000-0000-0000-000000000003','Sewer Line Repair','high',true,6400);

insert into public.competitors (id, organization_id, client_id, campaign_id, name, website, gbp_url, primary_category, review_count, rating, observed_services, notes)
values
('40000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','District Air Pros','https://districtair.example','https://maps.google.com/?cid=demo1','HVAC contractor',1184,4.8,array['AC repair','AC replacement','heat pumps'],'{"content":"Strong service + neighborhood pages","links":"Local sponsorship links visible"}'),
('40000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000002','30000000-0000-0000-0000-000000000002','Maryland Roof Masters','https://mdroofmasters.example','https://maps.google.com/?cid=demo2','Roofing contractor',742,4.7,array['Roof replacement','storm damage','gutters'],'{"content":"Strong storm pages","reviews":"High review velocity"}'),
('40000000-0000-0000-0000-000000000003','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000003','30000000-0000-0000-0000-000000000003','Old Town Plumbing','https://oldtownplumbing.example','https://maps.google.com/?cid=demo3','Plumber',936,4.9,array['Emergency plumbing','water heaters','drain cleaning'],'{"conversion":"Strong click-to-call UX","gbp":"Category coverage is broad"}')
on conflict (id) do nothing;

insert into public.audit_templates (id, organization_id, name, audit_type, version, template)
values
('50000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','Google Business Profile Audit','gbp',1,'{"policy_guardrails":["Never keyword-stuff business names","No fake locations or virtual-office abuse","No fake or gated reviews","High-risk GBP edits require acknowledgement"],"sections":["Eligibility & business model","NAP & service area","Categories & services","Links & UTM","Hours & attributes","Media","Reviews","Q&A & posts","Competitor comparison","Risk"]}'),
('50000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000001','Technical SEO Audit','technical',1,'{"sections":["Indexing","Crawlability","Canonicalization","Sitemaps & robots","Performance","Internal links","Structured data","Rendering & mobile"]}'),
('50000000-0000-0000-0000-000000000003','10000000-0000-0000-0000-000000000001','Citation & NAP Audit','citations',1,'{"sections":["NAP master","Priority directories","Duplicates","Ownership","Accuracy","Next actions"]}')
on conflict (id) do nothing;

insert into public.audits (id, organization_id, client_id, campaign_id, template_id, audit_type, name, status, health_score, client_visible)
values
('51000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','50000000-0000-0000-0000-000000000001','gbp','Capital Comfort GBP Audit','in_progress',72,false),
('51000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000002','30000000-0000-0000-0000-000000000002','50000000-0000-0000-0000-000000000003','citations','DMV Roofing Citation Audit','in_progress',64,false),
('51000000-0000-0000-0000-000000000003','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000003','30000000-0000-0000-0000-000000000003','50000000-0000-0000-0000-000000000002','technical','Potomac Plumbing Technical Audit','planned',81,false)
on conflict (id) do nothing;

insert into public.audit_findings (id, organization_id, client_id, campaign_id, audit_id, title, checklist_item, severity, impact, effort, confidence, status, recommendation, client_explanation, client_visible)
values
('52000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','51000000-0000-0000-0000-000000000001','Primary category under-represents replacement work','Primary and secondary categories','high',5,2,5,'planned','Test a compliant secondary-category expansion around HVAC installation and heat pump services.','The profile currently signals repair more strongly than higher-value replacement services.',true),
('52000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','51000000-0000-0000-0000-000000000001','Review velocity trails top local competitors','Reviews and review velocity','critical',5,2,5,'in_progress','Launch a policy-compliant post-job review request workflow without gating or incentives.','Capital Comfort is adding reviews more slowly than businesses holding the strongest map visibility.',true),
('52000000-0000-0000-0000-000000000003','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000002','30000000-0000-0000-0000-000000000002','51000000-0000-0000-0000-000000000002','Old phone number persists on two priority citations','NAP accuracy','high',4,2,5,'waiting_on_client','Confirm the current public phone, then correct Angi and BBB listings.','Two high-trust directories show an outdated number, which creates inconsistency for customers and search systems.',true),
('52000000-0000-0000-0000-000000000004','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000003','30000000-0000-0000-0000-000000000003','51000000-0000-0000-0000-000000000003','Water-heater service page is orphaned','Internal linking','medium',4,2,4,'planned','Add contextual links from plumbing-services, financing, and relevant FAQ pages.','The water-heater page is hard for users and crawlers to reach from the strongest parts of the site.',false)
on conflict (id) do nothing;

insert into public.strategy_roadmaps (id, organization_id, client_id, campaign_id, name, horizon_days, status, human_approved, client_visible)
values
('60000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','Capital Comfort — First 90 Days',90,'active',true,true),
('60000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000002','30000000-0000-0000-0000-000000000002','DMV Roofing — First 90 Days',90,'active',true,true),
('60000000-0000-0000-0000-000000000003','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000003','30000000-0000-0000-0000-000000000003','Potomac Plumbing — First 90 Days',90,'draft',false,false)
on conflict (id) do nothing;

insert into public.roadmap_initiatives (id, organization_id, client_id, campaign_id, roadmap_id, name, initiative_type, business_objective, search_objective, priority_score, expected_impact, effort, confidence, status, kpi_connection, source_finding_id, human_approved, client_visible)
values
('61000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','60000000-0000-0000-0000-000000000001','Increase review velocity','reputation','Build more trust after completed jobs','Strengthen GBP trust signals in priority markets',12.50,5,2,5,'in_progress','review_count','52000000-0000-0000-0000-000000000002',true,true),
('61000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000002','30000000-0000-0000-0000-000000000002','60000000-0000-0000-0000-000000000002','Repair priority citation NAP','citation','Reduce lost calls and listing confusion','Improve NAP corroboration',10.00,4,2,5,'waiting_on_client','citation_accuracy','52000000-0000-0000-0000-000000000003',true,true),
('61000000-0000-0000-0000-000000000003','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000003','30000000-0000-0000-0000-000000000003','60000000-0000-0000-0000-000000000003','Strengthen water-heater internal links','on-page','Increase qualified water-heater leads','Improve crawl depth and topical reinforcement',8.00,4,2,4,'planned','organic_leads','52000000-0000-0000-0000-000000000004',false,false)
on conflict (id) do nothing;

insert into public.tasks (id, organization_id, client_id, campaign_id, roadmap_initiative_id, audit_finding_id, title, workstream, priority, due_date, status, estimated_minutes, approval_status, client_visible, internal_notes)
values
('70000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','61000000-0000-0000-0000-000000000001','52000000-0000-0000-0000-000000000002','Build post-job review request workflow','reputation','critical',current_date + 5,'in_progress',120,'approved',true,'No gating. Ask every eligible customer using the same neutral flow.'),
('70000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001',null,'52000000-0000-0000-0000-000000000001','Confirm GBP manager access before category edit','gbp','high',current_date + 2,'blocked',30,'pending',false,'Blocked until owner access is received.'),
('70000000-0000-0000-0000-000000000003','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000002','30000000-0000-0000-0000-000000000002','61000000-0000-0000-0000-000000000002','52000000-0000-0000-0000-000000000003','Correct Angi and BBB phone records','citations','high',current_date + 7,'waiting_on_client',75,'approved',true,'Waiting for client to confirm which number should be the NAP master.'),
('70000000-0000-0000-0000-000000000004','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000002','30000000-0000-0000-0000-000000000002',null,null,'Get storm-project photos from client','content','medium',current_date + 3,'blocked',20,'not_required',true,'Case study cannot publish without real project proof.'),
('70000000-0000-0000-0000-000000000005','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000003','30000000-0000-0000-0000-000000000003','61000000-0000-0000-0000-000000000003','52000000-0000-0000-0000-000000000004','Add water-heater contextual internal links','on-page','high',current_date + 6,'planned',60,'pending',false,'Link from relevant service and FAQ pages; avoid sitewide exact-match anchors.'),
('70000000-0000-0000-0000-000000000006','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000003','30000000-0000-0000-0000-000000000003',null,null,'Confirm holiday emergency hours','gbp','medium',current_date + 4,'waiting_on_client',15,'not_required',true,'Do not guess special hours.')
on conflict (id) do nothing;

insert into public.keyword_clusters (id, organization_id, client_id, campaign_id, name, service, location, intent, funnel_stage, business_value, priority, preferred_url)
values
('80000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','AC Replacement DC','AC Replacement','Washington, DC','transactional','bottom',5,'critical','/ac-replacement-washington-dc/'),
('80000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','Emergency HVAC DC','Emergency AC Repair','Washington, DC','emergency','bottom',5,'critical','/emergency-hvac-repair-dc/'),
('80000000-0000-0000-0000-000000000003','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000002','30000000-0000-0000-0000-000000000002','Roof Replacement Silver Spring','Roof Replacement','Silver Spring, MD','transactional','bottom',5,'critical','/roof-replacement-silver-spring-md/'),
('80000000-0000-0000-0000-000000000004','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000003','30000000-0000-0000-0000-000000000003','Water Heater Alexandria','Water Heater Replacement','Alexandria, VA','transactional','bottom',5,'critical','/water-heater-replacement-alexandria-va/')
on conflict (id) do nothing;

insert into public.keywords (organization_id, client_id, campaign_id, cluster_id, keyword, intent, monthly_volume, difficulty, cpc, business_value, target_city, priority, serp_features)
values
('10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','80000000-0000-0000-0000-000000000001','ac replacement washington dc','transactional',390,31,28.40,5,'Washington, DC','critical',array['local_pack','ads','people_also_ask']),
('10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','80000000-0000-0000-0000-000000000002','emergency hvac repair dc','emergency',260,27,34.10,5,'Washington, DC','critical',array['local_pack','ads']),
('10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000002','30000000-0000-0000-0000-000000000002','80000000-0000-0000-0000-000000000003','roof replacement silver spring md','transactional',210,29,22.75,5,'Silver Spring, MD','critical',array['local_pack','ads','directories']),
('10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000003','30000000-0000-0000-0000-000000000003','80000000-0000-0000-0000-000000000004','water heater replacement alexandria va','transactional',170,24,19.90,5,'Alexandria, VA','critical',array['local_pack','ads','people_also_ask']);

insert into public.rank_snapshots (organization_id, client_id, campaign_id, snapshot_date, location_label, zip_code, result_type, rank_position, ranking_url, notes)
values
('10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001',current_date,'NoMa','20002','local_pack',2,'https://capitalcomforthvac.example/ac-replacement-washington-dc/','Core grid winner'),
('10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001',current_date,'Petworth','20011','local_pack',7,'https://capitalcomforthvac.example/ac-replacement-washington-dc/','Outer grid weakness'),
('10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000002','30000000-0000-0000-0000-000000000002',current_date,'Silver Spring','20910','local_pack',4,'https://dmvroofing.example/roof-replacement-silver-spring-md/','Improved from 7'),
('10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000003','30000000-0000-0000-0000-000000000003',current_date,'Old Town','22314','local_pack',3,'https://potomacplumbing.example/water-heater-replacement-alexandria-va/','Stable');

insert into public.gbp_profiles (id, organization_id, client_id, campaign_id, google_location_id, profile_url, primary_category, secondary_categories, services, owner_access_status, suspension_risk)
values
('90000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','demo-capital','https://maps.google.com/?cid=capital','HVAC contractor',array['Air conditioning repair service','Heating contractor'],array['AC repair','AC installation','Heat pumps'],'requested','low'),
('90000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000002','30000000-0000-0000-0000-000000000002','demo-roof','https://maps.google.com/?cid=roof','Roofing contractor',array['Gutter cleaning service'],array['Roof replacement','Storm damage inspection'],'connected','low'),
('90000000-0000-0000-0000-000000000003','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000003','30000000-0000-0000-0000-000000000003','demo-plumb','https://maps.google.com/?cid=plumb','Plumber',array['Drainage service','Water heater installation service'],array['Emergency plumbing','Water heaters','Sewer repair'],'connected','low')
on conflict (id) do nothing;

insert into public.gbp_metrics (organization_id, client_id, campaign_id, gbp_profile_id, metric_date, calls, website_clicks, direction_requests, views, search_impressions, source_fresh_at)
values
('10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','90000000-0000-0000-0000-000000000001',current_date - 1,118,82,21,3840,9220,now() - interval '18 hours'),
('10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000002','30000000-0000-0000-0000-000000000002','90000000-0000-0000-0000-000000000002',current_date - 1,76,54,13,2710,6830,now() - interval '12 hours'),
('10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000003','30000000-0000-0000-0000-000000000003','90000000-0000-0000-0000-000000000003',current_date - 1,93,61,18,3050,7440,now() - interval '10 hours');

insert into public.citations (organization_id, client_id, campaign_id, directory_name, listing_url, listing_status, observed_nap, nap_match_score, duplicate_risk, priority, date_checked, next_action)
values
('10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','Yelp','https://yelp.example/capital-comfort','claimed','{"name":"Capital Comfort HVAC","phone":"(202) 555-0144"}',100,'low','high',current_date - 4,'No action'),
('10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','MapQuest','https://mapquest.example/capital-comfort','incorrect','{"name":"Capital Comfort Heating & Cooling","phone":"(202) 555-0190"}',55,'medium','medium',current_date - 9,'Correct name and phone'),
('10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000002','30000000-0000-0000-0000-000000000002','BBB','https://bbb.example/dmv-roofing','incorrect','{"name":"DMV Roofing & Exteriors","phone":"(301) 555-0100"}',72,'low','critical',current_date - 3,'Waiting for NAP confirmation'),
('10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000002','30000000-0000-0000-0000-000000000002','Angi','https://angi.example/dmv-roofing','incorrect','{"name":"DMV Roofing & Exteriors","phone":"(301) 555-0100"}',72,'medium','high',current_date - 3,'Waiting for NAP confirmation'),
('10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000003','30000000-0000-0000-0000-000000000003','Yelp','https://yelp.example/potomac-plumbing','claimed','{"name":"Potomac Plumbing Co.","phone":"(703) 555-0118"}',100,'low','high',current_date - 6,'No action');

insert into public.content_items (id, organization_id, client_id, campaign_id, item_type, title, intent, target_url, location, service, primary_cta, status, publish_date, approval_status, client_assets_required)
values
('a0000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','service_page','AC Replacement in Washington, DC','transactional','/ac-replacement-washington-dc/','Washington, DC','AC Replacement','Request an in-home replacement estimate','editing',current_date + 9,'internal_review',array['Recent installation photos','Financing details']),
('a0000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000002','30000000-0000-0000-0000-000000000002','project_case_study','Storm-Damaged Roof Replacement in Silver Spring','commercial_investigation','/projects/silver-spring-storm-roof/','Silver Spring, MD','Roof Replacement','Request a free storm-damage inspection','waiting_on_client',null,'draft',array['Before photos','After photos','Roof material','Project timeline']),
('a0000000-0000-0000-0000-000000000003','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000003','30000000-0000-0000-0000-000000000003','pricing_cost_page','Water Heater Replacement Cost in Northern Virginia','commercial_investigation','/water-heater-replacement-cost-northern-va/','Northern Virginia','Water Heater Replacement','Book a water-heater estimate','brief',current_date + 16,'draft',array['Approved price ranges','Warranty language'])
on conflict (id) do nothing;

insert into public.reviews (organization_id, client_id, campaign_id, source, review_date, reviewer, rating, review_text, response_status, sentiment, service_mentioned, location_mentioned)
values
('10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','Google',current_date - 2,'J. Carter',5,'Fast AC repair during a hot weekend.','responded','positive','Emergency AC Repair','Washington, DC'),
('10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000002','30000000-0000-0000-0000-000000000002','Google',current_date - 5,'M. Lewis',5,'Crew protected the landscaping and finished the roof in one day.','pending','positive','Roof Replacement','Bethesda, MD'),
('10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000003','30000000-0000-0000-0000-000000000003','Google',current_date - 1,'R. Nguyen',4,'Water heater was replaced same day. Communication could have been better before arrival.','pending','mixed','Water Heater Replacement','Alexandria, VA');

insert into public.leads (organization_id, client_id, campaign_id, occurred_at, source, lead_type, landing_page, service, city, qualified_status, booked_status, closed_status, estimated_job_value, actual_revenue, attribution_confidence)
values
('10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001',now() - interval '2 days','GBP','phone call','/ac-replacement-washington-dc/','AC Replacement','Washington, DC','qualified','booked','open',9800,null,92),
('10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001',now() - interval '5 days','organic search','form','/heat-pump-installation-dc/','Heat Pump Installation','Washington, DC','qualified','booked','closed',12400,11850,88),
('10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000002','30000000-0000-0000-0000-000000000002',now() - interval '3 days','organic search','form','/roof-replacement-silver-spring-md/','Roof Replacement','Silver Spring, MD','qualified','booked','open',16800,null,84),
('10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000003','30000000-0000-0000-0000-000000000003',now() - interval '1 day','GBP','phone call','/water-heater-replacement-alexandria-va/','Water Heater Replacement','Alexandria, VA','qualified','booked','open',2350,null,94);

insert into public.monthly_reports (id, organization_id, client_id, campaign_id, reporting_period, executive_summary, snapshot_data, strategist_notes, lead_seo_approval, publish_status, published_at, data_freshness, client_visible)
values
('b0000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001',daterange(date '2026-08-01',date '2026-09-01','[)'),
'Local visibility improved in the core DC grid, while review velocity and outer-grid reach remain the biggest constraints.',
'{"organic_clicks":2384,"organic_impressions":68920,"organic_ctr":3.46,"organic_leads":87,"gbp_calls":118,"gbp_website_clicks":82,"direction_requests":21,"booked_estimates":31,"review_count":286,"review_rating":4.8,"ranking_visibility":61}',
'Keep next month centered on reviews, AC replacement page proof, and outer-grid category/service relevance.','approved','published',now() - interval '1 day',
'{"ga4":"2026-08-29T08:00:00Z","gsc":"2026-08-28T00:00:00Z","gbp":"2026-08-29T12:00:00Z","rankings":"2026-08-28T14:30:00Z"}',true)
on conflict (id) do nothing;

insert into public.client_requests (id, organization_id, client_id, campaign_id, request_type, title, why_it_matters, exact_requested_item, due_date, status, client_contact_id, related_content_item_id)
values
('c0000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','photos','Upload two recent AC replacement projects','Real project proof makes the replacement page more credible and useful.','Please upload 6–10 before/after photos from two recent DC-area AC replacement jobs. No customer faces or private documents.',current_date + 6,'open','21000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001'),
('c0000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000002','30000000-0000-0000-0000-000000000002','service_update','Confirm the public business phone','Two priority directories still show an older phone number.','Confirm whether (301) 555-0199 is the permanent public NAP phone used across Google, the website, and directories.',current_date + 2,'open','21000000-0000-0000-0000-000000000002',null),
('c0000000-0000-0000-0000-000000000003','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000003','30000000-0000-0000-0000-000000000003','business_hours_update','Confirm Labor Day emergency hours','Google special hours should reflect the real schedule and must not be guessed.','Confirm the Labor Day office hours and whether emergency dispatch remains available.',current_date + 3,'open','21000000-0000-0000-0000-000000000003',null)
on conflict (id) do nothing;

insert into public.integrations (organization_id, client_id, campaign_id, provider, connection_state, last_sync_at, data_fresh_at, config)
values
('10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','ga4','connected',now() - interval '3 hours',now() - interval '18 hours','{"mode":"mock"}'),
('10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','gsc','connected',now() - interval '5 hours',now() - interval '1 day','{"mode":"mock"}'),
('10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','google_business_profile','requested',null,null,'{"mode":"mock"}'),
('10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000002','30000000-0000-0000-0000-000000000002','brightlocal','connected',now() - interval '2 hours',now() - interval '12 hours','{"mode":"mock"}'),
('10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000003','30000000-0000-0000-0000-000000000003','callrail','blocked',null,null,'{"mode":"mock","reason":"Awaiting client admin access"}');
