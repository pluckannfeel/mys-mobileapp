export type PostalCode = {
    postal_code: string;
    en_prefecture: string;
    jp_prefecture: string;
    en_municipality: string;
    jp_municipality: string;
    en_town: string;
    jp_town: string;
}

export type Prefecture = {
    // id: number;
    // name: string;
    en_prefecture: string;
    jp_prefecture: string;
}

export type Municipality = {
    // id: number;
    // name: string;
    jp_prefecture: string;
    en_municipality: string;
    jp_municipality: string;
}

