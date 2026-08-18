export type BankInstallmentRule = {
    id: string;
    bankName: string;
    commercialMax: number;
    individualMax: number;
    isSupported: boolean;
};

export const BANK_INSTALLMENT_RULES: BankInstallmentRule[] = [
    { id: "akbank", bankName: "AKBANK", commercialMax: 6, individualMax: 12, isSupported: true },
    { id: "denizbank", bankName: "DENİZBANK", commercialMax: 6, individualMax: 6, isSupported: true },
    { id: "finansbank", bankName: "FİNANSBANK", commercialMax: 3, individualMax: 12, isSupported: true },
    { id: "garanti", bankName: "GARANTİ", commercialMax: 6, individualMax: 6, isSupported: true },
    { id: "halkbank", bankName: "HALKBANK", commercialMax: 12, individualMax: 12, isSupported: true },
    { id: "is_bankasi", bankName: "İŞ BANKASI", commercialMax: 12, individualMax: 12, isSupported: true },
    { id: "kuveyt_turk", bankName: "KUVEYT TÜRK", commercialMax: 12, individualMax: 12, isSupported: true },
    { id: "teb", bankName: "TEB", commercialMax: 12, individualMax: 12, isSupported: true },
    { id: "vakifbank", bankName: "VAKIFBANK", commercialMax: 3, individualMax: 12, isSupported: true },
    { id: "yapi_kredi", bankName: "YAPI KREDİ", commercialMax: 12, individualMax: 12, isSupported: true },
    { id: "ziraat", bankName: "ZİRAAT BANKASI", commercialMax: 3, individualMax: 12, isSupported: true },
];

export function getBankRule(bankName: string, groupName: string): BankInstallmentRule | null {
    if (!bankName) return null;
    const name = bankName.toUpperCase();
    const group = groupName ? groupName.toUpperCase() : "";

    // Moka'dan gelen BankName veya GroupName'e göre eşleştirme
    if (name.includes("AKBANK") || group.includes("AXESS")) return BANK_INSTALLMENT_RULES.find(r => r.id === "akbank") || null;
    if (name.includes("DENIZ") || name.includes("DENİZ") || group.includes("BONUS")) {
         // Note: Garanti and Denizbank both use Bonus. We prefer exact bank name first.
         if (name.includes("DENIZ") || name.includes("DENİZ")) return BANK_INSTALLMENT_RULES.find(r => r.id === "denizbank") || null;
    }
    if (name.includes("FINANS") || name.includes("FİNANS") || group.includes("CARDFINANS")) return BANK_INSTALLMENT_RULES.find(r => r.id === "finansbank") || null;
    if (name.includes("GARANTI") || name.includes("GARANTİ")) return BANK_INSTALLMENT_RULES.find(r => r.id === "garanti") || null;
    if (name.includes("HALK")) return BANK_INSTALLMENT_RULES.find(r => r.id === "halkbank") || null;
    if (name.includes("IS BANKASI") || name.includes("İŞ BANKASI") || group.includes("MAXIMUM")) return BANK_INSTALLMENT_RULES.find(r => r.id === "is_bankasi") || null;
    if (name.includes("KUVEYT")) return BANK_INSTALLMENT_RULES.find(r => r.id === "kuveyt_turk") || null;
    if (name.includes("TEB") || group.includes("BONUS")) {
        if (name.includes("TEB")) return BANK_INSTALLMENT_RULES.find(r => r.id === "teb") || null;
    }
    if (name.includes("VAKIF")) return BANK_INSTALLMENT_RULES.find(r => r.id === "vakifbank") || null;
    if (name.includes("YAPI KREDI") || name.includes("YAPI KREDİ") || group.includes("WORLD")) return BANK_INSTALLMENT_RULES.find(r => r.id === "yapi_kredi") || null;
    if (name.includes("ZIRAAT") || name.includes("ZİRAAT")) return BANK_INSTALLMENT_RULES.find(r => r.id === "ziraat") || null;
    
    // Default fallback if not found in list (Unsupported)
    return null;
}
