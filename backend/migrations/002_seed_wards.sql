-- Abaji Wards
INSERT INTO wards (id, area_council_id, name, total_polling_units, registered_voters) VALUES
('abaji-ward-1', 'abaji', 'Abaji Central', 16, 9000),
('abaji-ward-2', 'abaji', 'Agyana', 15, 8500),
('abaji-ward-3', 'abaji', 'Alu', 15, 8800),
('abaji-ward-4', 'abaji', 'Ewu', 15, 8900),
('abaji-ward-5', 'abaji', 'Gawu', 16, 9100),
('abaji-ward-6', 'abaji', 'Gurdi', 15, 8700),
('abaji-ward-7', 'abaji', 'Nuku', 16, 9200),
('abaji-ward-8', 'abaji', 'Pandagi', 15, 8600),
('abaji-ward-9', 'abaji', 'Rimba', 15, 8800),
('abaji-ward-10', 'abaji', 'Yaba', 18, 9820)
ON CONFLICT (id) DO NOTHING;

-- Bwari Wards
INSERT INTO wards (id, area_council_id, name, total_polling_units, registered_voters) VALUES
('bwari-ward-1', 'bwari', 'Bwari Central', 30, 25000),
('bwari-ward-2', 'bwari', 'Byazhin', 30, 24000),
('bwari-ward-3', 'bwari', 'Igu', 29, 23000),
('bwari-ward-4', 'bwari', 'Kawu', 29, 23500),
('bwari-ward-5', 'bwari', 'Kuduru', 30, 24500),
('bwari-ward-6', 'bwari', 'Shere', 30, 25000),
('bwari-ward-7', 'bwari', 'Tokulo', 29, 23800),
('bwari-ward-8', 'bwari', 'Ushafa', 30, 25500),
('bwari-ward-9', 'bwari', 'Usuma', 30, 26000),
('bwari-ward-10', 'bwari', 'Uzango', 31, 25480)
ON CONFLICT (id) DO NOTHING;

-- Gwagwalada Wards
INSERT INTO wards (id, area_council_id, name, total_polling_units, registered_voters) VALUES
('gwagwalada-ward-1', 'gwagwalada', 'Gwagwa I', 19, 17000),
('gwagwalada-ward-2', 'gwagwalada', 'Gwagwa II', 19, 16500),
('gwagwalada-ward-3', 'gwagwalada', 'Ibwa', 18, 16000),
('gwagwalada-ward-4', 'gwagwalada', 'Ikwa', 19, 16800),
('gwagwalada-ward-5', 'gwagwalada', 'Kutunku', 19, 17200),
('gwagwalada-ward-6', 'gwagwalada', 'Paiko', 19, 16900),
('gwagwalada-ward-7', 'gwagwalada', 'Passo', 18, 16400),
('gwagwalada-ward-8', 'gwagwalada', 'Tungamaje', 19, 17100),
('gwagwalada-ward-9', 'gwagwalada', 'Zuba I', 20, 17500),
('gwagwalada-ward-10', 'gwagwalada', 'Zuba II', 19, 17140)
ON CONFLICT (id) DO NOTHING;

-- Kuje Wards
INSERT INTO wards (id, area_council_id, name, total_polling_units, registered_voters) VALUES
('kuje-ward-1', 'kuje', 'Chibiri', 18, 14500),
('kuje-ward-2', 'kuje', 'Gaube', 17, 14000),
('kuje-ward-3', 'kuje', 'Gwargwada', 18, 14200),
('kuje-ward-4', 'kuje', 'Kabi', 17, 13800),
('kuje-ward-5', 'kuje', 'Kuje', 18, 14800),
('kuje-ward-6', 'kuje', 'Kujekwa', 18, 14100),
('kuje-ward-7', 'kuje', 'Kwaku', 17, 13900),
('kuje-ward-8', 'kuje', 'Rubochi', 18, 14600),
('kuje-ward-9', 'kuje', 'Sabo Wuse', 18, 14400),
('kuje-ward-10', 'kuje', 'Yenche', 19, 14590)
ON CONFLICT (id) DO NOTHING;

-- Kwali Wards
INSERT INTO wards (id, area_council_id, name, total_polling_units, registered_voters) VALUES
('kwali-ward-1', 'kwali', 'Dafa', 15, 10000),
('kwali-ward-2', 'kwali', 'Gbaupe', 14, 9500),
('kwali-ward-3', 'kwali', 'Gwagwa', 14, 9800),
('kwali-ward-4', 'kwali', 'Kilankwa', 15, 9900),
('kwali-ward-5', 'kwali', 'Kundu', 14, 9600),
('kwali-ward-6', 'kwali', 'Kwali', 15, 10200),
('kwali-ward-7', 'kwali', 'Pai', 14, 9700),
('kwali-ward-8', 'kwali', 'Sheda', 15, 10100),
('kwali-ward-9', 'kwali', 'Wako', 14, 9400),
('kwali-ward-10', 'kwali', 'Yangoji', 15, 10460)
ON CONFLICT (id) DO NOTHING;

-- AMAC Wards
INSERT INTO wards (id, area_council_id, name, total_polling_units, registered_voters) VALUES
('amac-ward-1', 'amac', 'City Centre', 58, 75000),
('amac-ward-2', 'amac', 'Garki I', 57, 74000),
('amac-ward-3', 'amac', 'Garki II', 57, 73500),
('amac-ward-4', 'amac', 'Gwarinpa', 58, 76000),
('amac-ward-5', 'amac', 'Gwagwa', 57, 74500),
('amac-ward-6', 'amac', 'Jiwa', 57, 74000),
('amac-ward-7', 'amac', 'Kabusa', 58, 75500),
('amac-ward-8', 'amac', 'Karu', 57, 73800),
('amac-ward-9', 'amac', 'Nyanya', 58, 75200),
('amac-ward-10', 'amac', 'Orozo', 57, 74200),
('amac-ward-11', 'amac', 'Wuse I', 57, 73000),
('amac-ward-12', 'amac', 'Wuse II', 56, 73750)
ON CONFLICT (id) DO NOTHING;
