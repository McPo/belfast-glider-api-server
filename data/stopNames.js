
const g1 = [
    'McKinstry Road',
    'Lagmore Avenue',
    'Twinbrook Road',
    'Colin Connect',
    'Upper Dunmurry Lane',
    'Glengoland',
    'Woodbourne (Andersonstown Road)',
    'Lenadoon Avenue (Andersonstown Road)',
    'St Genevieve\'s',
    'Shaws Road',
    'Slievegallion Drive',
    'Casement Park',
    'Fruithill Park',
    'Beech Hall',
    'Kennedy Centre',
    'Falls Park',
    'City Cemetery',
    'Beechview Park',
    'Beechmount',
    'Children\'s Hospital',
    'Royal Hospitals (Falls Road)',
    'Clonard',
    'Twin Spires',
    'Divis Tower',
    'Millfield',
    'Wellington Place',
    'Chichester Street',
    'Custom House Square',
    'Waterfront',
    'May Street [St George\'s Market]',
    'May Street [City Hall]',
    'College Square East',
    'Lanyon Place Station',
    'Short Strand (Albertbridge Road)',
    'Templemore Avenue',
    'Avoniel',
    'Connswater',
    'Holywood Arches',
    'Beersbridge Road',
    'Oakland Avenue',
    'North Road (Upper Newtownards Road)',
    'Ballyhackamore',
    'Astoria Gardens',
    'Greenwood Park',
    'Knock Road (Upper Newtownards Road)',
    'Cabin Hill',
    'Stormont',
    'Summerhill Avenue',
    'Rosepark',
    'Comber Road',
    'Ulster Hospital',
    'Cherryhill',
    'Dundonald Park & Ride'
];

const g2 = [
    'Catalyst Inc',
    'Thompson Dry Dock',
    'Titanic',
    'Odyssey',
    'Waterfront',
    'May Street [St George\'s Market]',
    'May Street [City Hall]',
    'College Square East',
    'Wellington Place',
    'Chichester Street',
    'Custom House Square'
];

const all = Array.from(new Set([
    ...g1,
    ...g2
]));

module.exports = {
    all,
    g1,
    g2
};
