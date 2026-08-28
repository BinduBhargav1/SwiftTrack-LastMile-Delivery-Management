USE lastmile_delivery;

CREATE TABLE IF NOT EXISTS points (
    point_id INT PRIMARY KEY AUTO_INCREMENT,
    zone_id INT NOT NULL,
    point_name VARCHAR(255) NOT NULL,
    FOREIGN KEY (zone_id) REFERENCES zones(zone_id)
);

INSERT INTO points (zone_id, point_name) VALUES 
((SELECT zone_id FROM zones WHERE zone_name = 'Hyderabad North'), 'Kukatpally'),
((SELECT zone_id FROM zones WHERE zone_name = 'Hyderabad North'), 'Miyapur'),
((SELECT zone_id FROM zones WHERE zone_name = 'Hyderabad South'), 'Gachibowli'),
((SELECT zone_id FROM zones WHERE zone_name = 'Hyderabad South'), 'Madhapur'),
((SELECT zone_id FROM zones WHERE zone_name = 'Vijayawada'), 'Benz Circle'),
((SELECT zone_id FROM zones WHERE zone_name = 'Guntur'), 'Arundelpet');
