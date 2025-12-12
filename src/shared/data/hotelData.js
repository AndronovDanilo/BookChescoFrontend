export const HOTEL_TABS = [
    { id: 'description', label: 'Описание' },
    { id: 'rooms', label: 'Комнаты и цены' },
];

export const HOTEL_DETAILS = {
    id: 1,
    name: "Hotel Lviv Grand",
    city: "Lviv",
    address: "Freedom Ave, 10",
    description: "Наш отель расположен в самом центре Львова, предлагая гостям роскошные номера и лучшие виды на старый город. К услугам гостей бесплатный Wi-Fi и крупногабаритный ресторан.",
    minPrice: 1200,
    currency: "₴",
    photos: [
        { url: "https://static-cse.canva.com/blob/847132/paulskorupskas7KLaxLbSXAunsplash2.jpg", alt: "Главный фасад" },
        { url: "https://static-cse.canva.com/blob/847132/paulskorupskas7KLaxLbSXAunsplash2.jpg", alt: "Интерьер лобби" },
        { url: "https://static-cse.canva.com/blob/847132/paulskorupskas7KLaxLbSXAunsplash2.jpg", alt: "Номер стандарт" },
        { url: "https://static-cse.canva.com/blob/847132/paulskorupskas7KLaxLbSXAunsplash2.jpg", alt: "Вид из окна" },
    ],
};

export const ROOMS_DATA = [
    { id: 101, type: "Standard Double", price: 1200, isAvailable: true, capacity: 2 },
    { id: 102, type: "Standard Double", price: 1200, isAvailable: false, capacity: 2 },
    { id: 201, type: "Deluxe Suite", price: 2500, isAvailable: true, capacity: 4 },
    { id: 305, type: "Economy Single", price: 800, isAvailable: true, capacity: 1 },
];