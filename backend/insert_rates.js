const db = require('./db');

async function insertRates() {
    try {
        const [zones] = await db.query('SELECT * FROM zones');
        const orderTypes = ['B2B', 'B2C'];
        let inserted = 0;

        for (const fromZone of zones) {
            for (const toZone of zones) {
                for (const type of orderTypes) {
                    // Check if exists
                    const [existing] = await db.query(
                        'SELECT * FROM rate_cards WHERE from_zone = ? AND to_zone = ? AND order_type = ?',
                        [fromZone.zone_id, toZone.zone_id, type]
                    );

                    if (existing.length === 0) {
                        // Calculate some logic for rates
                        let isSameCity = false;
                        if (fromZone.zone_name.includes('Hyderabad') && toZone.zone_name.includes('Hyderabad')) {
                            isSameCity = true;
                        } else if (fromZone.zone_id === toZone.zone_id) {
                            isSameCity = true;
                        }

                        let rate = isSameCity ? 40.00 : 70.00;
                        let cod = isSameCity ? 30.00 : 50.00;

                        if (type === 'B2B') {
                            rate -= 5; // B2B is slightly cheaper per kg
                            cod -= 5;
                        }

                        await db.query(
                            'INSERT INTO rate_cards (from_zone, to_zone, order_type, rate_per_kg, cod_surcharge) VALUES (?, ?, ?, ?, ?)',
                            [fromZone.zone_id, toZone.zone_id, type, rate, cod]
                        );
                        inserted++;
                    }
                }
            }
        }
        
        console.log(`Successfully inserted ${inserted} new rate cards.`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

insertRates();
