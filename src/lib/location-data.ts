
export const INDIAN_STATES = [
    "Kerala",
    "Karnataka",
    "Tamil Nadu",
    "Maharashtra",
    "Delhi",
    "Telangana",
    "Andhra Pradesh",
    "West Bengal"
] as const;

export type StateName = typeof INDIAN_STATES[number];

interface LocationHierarchy {
    [state: string]: {
        [district: string]: string[];
    };
}

export const LOCATION_DATA: LocationHierarchy = {
    "Kerala": {
        "Thiruvananthapuram": [
            "Thiruvananthapuram City",
            "Technopark",
            "Sreekaryam",
            "Kazhakkoottam",
            "Pattom",
            "Kowdiar",
            "Vattiyoorkavu",
            "Neyyattinkara",
            "Nedumangad",
            "Attingal",
            "Varkala"
        ],
        "Ernakulam": [
            "Kochi",
            "Edappally",
            "Kakkanad",
            "Aluva",
            "Angamaly",
            "Paravur",
            "Tripunithura",
            "Kalamassery",
            "Vyttila",
            "Marine Drive"
        ],
        "Kozhikode": [
            "Kozhikode City",
            "Vadakara",
            "Koyilandy",
            "Ramanattukara",
            "Feroke",
            "Beypore",
            "Mukkam"
        ],
        "Thrissur": [
            "Thrissur City",
            "Chalakudy",
            "Kodungallur",
            "Kunnamkulam",
            "Guruvayur",
            "Irinjalakuda"
        ],
        "Kollam": [
            "Kollam City",
            "Karunagappally",
            "Punalur",
            "Kottarakkara",
            "Paravur"
        ],
        "Alappuzha": [
            "Alappuzha City",
            "Cherthala",
            "Kayamkulam",
            "Mavelikara",
            "Chengannur"
        ],
        "Kottayam": [
            "Kottayam City",
            "Changanassery",
            "Pala",
            "Ettumanoor",
            "Vaikom"
        ],
        "Palakkad": [
            "Palakkad City",
            "Ottapalam",
            "Shornur",
            "Chittur",
            "Mannarkkad"
        ],
        "Malappuram": [
            "Malappuram City",
            "Manjeri",
            "Perinthalmanna",
            "Tirur",
            "Ponnani",
            "Nilambur"
        ],
        "Kannur": [
            "Kannur City",
            "Thalassery",
            "Payyanur",
            "Taliparamba",
            "Mattannur"
        ],
        "Idukki": [
            "Thodupuzha",
            "Munnar",
            "Adimali",
            "Kattappana",
            "Kumily"
        ],
        "Wayanad": [
            "Kalpetta",
            "Sulthan Bathery",
            "Mananthavady"
        ],
        "Pathanamthitta": [
            "Pathanamthitta City",
            "Thiruvalla",
            "Adoor",
            "Pandalam"
        ],
        "Kasaragod": [
            "Kasaragod City",
            "Kanhangad",
            "Nileshwaram"
        ]
    },
    "Karnataka": {
        "Bangalore Urban": [
            "Bangalore City",
            "Whitefield",
            "Indiranagar",
            "Koramangala",
            "HSR Layout",
            "Jayanagar",
            "Malleswaram",
            "Hebbal",
            "Electronic City",
            "Marathahalli"
        ],
        "Mysore": [
            "Mysore City",
            "Hunsur",
            "Nanjangud"
        ],
        "Dakshina Kannada": [
            "Mangalore",
            "Puttur",
            "Bantwal"
        ],
        "Udupi": [
            "Udupi City",
            "Manipal",
            "Kundapura"
        ]
    },
    "Tamil Nadu": {
        "Chennai": [
            "Chennai City",
            "T Nagar",
            "Adyar",
            "Velachery",
            "Anna Nagar",
            "Tambaram",
            "OMR"
        ],
        "Coimbatore": [
            "Coimbatore City",
            "Gandhipuram",
            "Peelamedu",
            "RS Puram"
        ],
        "Madurai": [
            "Madurai City",
            "Anna Nagar",
            "KK Nagar"
        ]
    },
    "Maharashtra": {
        "Mumbai City": [
            "South Mumbai",
            "Bandra",
            "Juhu",
            "Andheri",
            "Powai"
        ],
        "Pune": [
            "Pune City",
            "Kothrud",
            "Viman Nagar",
            "Hinjewadi"
        ]
    },
    "Delhi": {
        "New Delhi": [
            "Connaught Place",
            "Chanakyapuri",
            "Vasant Vihar"
        ],
        "South Delhi": [
            "Saket",
            "Hauz Khas",
            "Greater Kailash"
        ]
    }
};
