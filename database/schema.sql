CREATE DATABASE IF NOT EXISTS lastmile_delivery;
USE lastmile_delivery;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS tracking_history;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS rate_cards;
DROP TABLE IF EXISTS agents;
DROP TABLE IF EXISTS points;
DROP TABLE IF EXISTS zones;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS order_tracking;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE IF NOT EXISTS users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'customer'
);

CREATE TABLE IF NOT EXISTS zones (
    zone_id INT PRIMARY KEY AUTO_INCREMENT,
    zone_name VARCHAR(100) NOT NULL,
    areas TEXT
);

CREATE TABLE IF NOT EXISTS points (
    point_id INT PRIMARY KEY AUTO_INCREMENT,
    zone_id INT NOT NULL,
    point_name VARCHAR(255) NOT NULL,
    FOREIGN KEY (zone_id) REFERENCES zones(zone_id)
);

CREATE TABLE IF NOT EXISTS agents (
    agent_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    zone_id INT NOT NULL,
    available TINYINT(1) DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (zone_id) REFERENCES zones(zone_id)
);

CREATE TABLE IF NOT EXISTS rate_cards (
    rate_id INT PRIMARY KEY AUTO_INCREMENT,
    from_zone INT NOT NULL,
    to_zone INT NOT NULL,
    order_type VARCHAR(20) NOT NULL, -- B2B, B2C
    rate_per_kg DECIMAL(10, 2) NOT NULL,
    cod_surcharge DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (from_zone) REFERENCES zones(zone_id),
    FOREIGN KEY (to_zone) REFERENCES zones(zone_id)
);

CREATE TABLE IF NOT EXISTS orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    tracking_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id INT NOT NULL,
    pickup_address TEXT NOT NULL,
    drop_address TEXT NOT NULL,
    pickup_zone INT,
    drop_zone INT,
    length DECIMAL(10, 2),
    width DECIMAL(10, 2),
    height DECIMAL(10, 2),
    actual_weight DECIMAL(10, 2),
    volumetric_weight DECIMAL(10, 2),
    chargeable_weight DECIMAL(10, 2),
    order_type VARCHAR(20) NOT NULL,
    payment_type VARCHAR(20) NOT NULL,
    delivery_charge DECIMAL(10, 2),
    agent_id INT,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reschedule_date DATE,
    FOREIGN KEY (customer_id) REFERENCES users(user_id),
    FOREIGN KEY (pickup_zone) REFERENCES zones(zone_id),
    FOREIGN KEY (drop_zone) REFERENCES zones(zone_id),
    FOREIGN KEY (agent_id) REFERENCES agents(agent_id)
);

CREATE TABLE IF NOT EXISTS tracking_history (
    history_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    status VARCHAR(50) NOT NULL,
    changed_by INT, -- Can be agent or admin, or null if system
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

-- Insert Sample Data
INSERT INTO users (name, email, phone, password, role) VALUES 
('Admin User', 'admin@swifttrack.com', '0000000000', '123456', 'admin'),
('Ravi Agent', 'ravi@swifttrack.com', '1111111111', '123456', 'agent'),
('Suresh Agent', 'suresh@swifttrack.com', '2222222222', '123456', 'agent'),
('Arun Agent', 'arun@swifttrack.com', '3333333333', '123456', 'agent'),
('Bhargav Customer', 'bhargav@gmail.com', '9876543210', '123456', 'customer');

INSERT INTO zones (zone_name, areas) VALUES 
('Hyderabad North', 'Kukatpally, Miyapur, Bachupally'),
('Hyderabad South', 'Gachibowli, Madhapur, Hitec City'),
('Vijayawada', 'Benz Circle, Patamata'),
('Guntur', 'Arundelpet, Brodipet');

INSERT INTO points (zone_id, point_name) VALUES 
(1, 'Kukatpally'),
(1, 'Miyapur'),
(1, 'Bachupally'),
(2, 'Gachibowli'),
(2, 'Madhapur'),
(2, 'Hitec City'),
(3, 'Benz Circle'),
(3, 'Patamata'),
(4, 'Arundelpet'),
(4, 'Brodipet');

-- Get Zone IDs
SET @hyd_north = (SELECT zone_id FROM zones WHERE zone_name = 'Hyderabad North');
SET @hyd_south = (SELECT zone_id FROM zones WHERE zone_name = 'Hyderabad South');
SET @vijayawada = (SELECT zone_id FROM zones WHERE zone_name = 'Vijayawada');
SET @guntur = (SELECT zone_id FROM zones WHERE zone_name = 'Guntur');

-- Agents linking
INSERT INTO agents (user_id, zone_id, available) VALUES 
((SELECT user_id FROM users WHERE email = 'ravi@swifttrack.com'), @hyd_north, 1),
((SELECT user_id FROM users WHERE email = 'suresh@swifttrack.com'), @vijayawada, 1),
((SELECT user_id FROM users WHERE email = 'arun@swifttrack.com'), @guntur, 1);

-- Rate Cards
INSERT INTO rate_cards (from_zone, to_zone, order_type, rate_per_kg, cod_surcharge) VALUES 
(@hyd_north, @hyd_north, 'B2C', 40.00, 30.00),
(@hyd_north, @vijayawada, 'B2C', 60.00, 35.00),
(@hyd_north, @hyd_north, 'B2B', 35.00, 25.00);
