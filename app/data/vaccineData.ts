export type Language = "vi" | "en";

export type CountryCode = "VN" | "US" | "UK" | "AU";

export type Antigen =
  | "DTaP"
  | "DTP"
  | "Tdap"
  | "Td"
  | "IPV"
  | "OPV"
  | "Hib"
  | "HepA"
  | "HepB"
  | "Typhoid"
  | "Cholera"
  | "Tetanus"
  | "BCG"
  | "Measles"
  | "Mumps"
  | "Rubella"
  | "Varicella"
  | "Rotavirus"
  | "PCV"
  | "MenB"
  | "MenBC"
  | "MenACWY"
  | "HPV4"
  | "HPV9"
  | "Influenza"
  | "JE"
  | "Dengue"
  | "Zoster"
  | "RSV"
  | "Rabies";

export type VaccineGroupId =
  | "bcg"
  | "hepbBirth"
  | "dtapIpvHibHepb"
  | "dtapIpvHib"
  | "polio"
  | "pcv"
  | "rotavirus"
  | "mmr"
  | "influenza"
  | "je"
  | "dengue"
  | "hpv"
  | "meningococcal"
  | "menB"
  | "menBC"
  | "menACWY"
  | "hepa"
  | "hepab"
  | "typhoid"
  | "cholera"
  | "hibSingle"
  | "varicella"
  | "zoster"
  | "rsv"
  | "rabies"
  | "tetanusSingle";

export type ProductCaution = "routine" | "partial" | "country-specific" | "doctor-review";

export type VaccineProduct = {
  id: string;
  name: string;
  displayName?: Record<Language, string>;
  groupIds: VaccineGroupId[];
  antigens: Antigen[];
  countries: CountryCode[];
  caution: ProductCaution;
  note: Record<Language, string>;
};

export type ScheduleDose = {
  dose: number;
  recommendedDays: number;
  minAgeDays: number;
  minIntervalDays?: number;
  maxAgeDays?: number;
  label: Record<Language, string>;
};

export type ScheduleGroup = {
  id: VaccineGroupId;
  name: Record<Language, string>;
  requiredAntigens: Antigen[];
  category: "routine" | "service" | "special";
  doses: ScheduleDose[];
  note: Record<Language, string>;
};

export type SourceReference = {
  title: string;
  url: string;
  effective: string;
  reviewed: string;
};

export type CountryProfile = {
  code: CountryCode;
  name: Record<Language, string>;
  scheduleName: Record<Language, string>;
  lastReviewed: string;
  gracePeriodDays: number;
  sources: SourceReference[];
  groups: ScheduleGroup[];
};

export const todayIso = "2026-06-25";

const day = 1;
const week = 7 * day;
const month = 30.4375 * day;
const year = 365.25 * day;

const days = (value: number) => Math.round(value);
const weeks = (value: number) => days(value * week);
const months = (value: number) => days(value * month);
const years = (value: number) => days(value * year);

export const vaccineProducts: VaccineProduct[] = [
  {
    id: "hexaxim",
    name: "Hexaxim",
    groupIds: ["dtapIpvHibHepb", "dtapIpvHib"],
    antigens: ["DTaP", "IPV", "Hib", "HepB"],
    countries: ["VN", "US", "UK", "AU"],
    caution: "routine",
    note: {
      vi: "Vaccine phối hợp 6 thành phần; cần đối chiếu tuổi, khoảng cách và giấy phép tại quốc gia đang chọn.",
      en: "Six-component combination vaccine; check age, interval, and local authorization.",
    },
  },
  {
    id: "infanrix-hexa",
    name: "Infanrix Hexa",
    groupIds: ["dtapIpvHibHepb", "dtapIpvHib"],
    antigens: ["DTaP", "IPV", "Hib", "HepB"],
    countries: ["VN", "US", "UK", "AU"],
    caution: "routine",
    note: {
      vi: "Cùng nhóm kháng nguyên chính với các vaccine 6 trong 1 khác.",
      en: "Shares the main antigen group used by other six-in-one products.",
    },
  },
  {
    id: "vaxelis",
    name: "Vaxelis",
    groupIds: ["dtapIpvHibHepb", "dtapIpvHib"],
    antigens: ["DTaP", "IPV", "Hib", "HepB"],
    countries: ["US", "UK", "AU"],
    caution: "routine",
    note: {
      vi: "Vaccine phối hợp 6 thành phần; mức dùng phụ thuộc quốc gia và sẵn có sản phẩm.",
      en: "Six-component combination vaccine; use depends on country and availability.",
    },
  },
  {
    id: "pentaxim",
    name: "Pentaxim",
    groupIds: ["dtapIpvHib"],
    antigens: ["DTaP", "IPV", "Hib"],
    countries: ["VN"],
    caution: "partial",
    note: {
      vi: "Không chứa viêm gan B; nếu đổi từ 6 trong 1 cần kiểm tra riêng lịch HepB.",
      en: "Does not include hepatitis B; switching from six-in-one requires separate HepB review.",
    },
  },
  {
    id: "epi-5in1",
    name: "5 trong 1 TCMR",
    displayName: { vi: "5 trong 1 TCMR", en: "EPI 5-in-1" },
    groupIds: ["dtapIpvHibHepb"],
    antigens: ["DTP", "Hib", "HepB"],
    countries: ["VN"],
    caution: "partial",
    note: {
      vi: "Tên và thành phần cụ thể có thể thay đổi theo chương trình; cần đối chiếu sổ tiêm.",
      en: "Exact product and components may vary by programme; check the vaccination record.",
    },
  },
  {
    id: "quinvaxem",
    name: "Quinvaxem",
    groupIds: ["dtapIpvHibHepb"],
    antigens: ["DTP", "Hib", "HepB"],
    countries: ["VN"],
    caution: "partial",
    note: {
      vi: "Vaccine 5 trong 1 kiểu DTP-Hib-HepB; không có IPV nên cần đối chiếu riêng lịch bại liệt nếu quy đổi từ vaccine 6 trong 1.",
      en: "A pentavalent DTP-Hib-HepB vaccine; it does not include IPV, so polio history should be checked separately when converting from 6-in-1 schedules.",
    },
  },
  {
    id: "prevenar-13",
    name: "Prevenar 13",
    groupIds: ["pcv"],
    antigens: ["PCV"],
    countries: ["VN", "US", "UK", "AU"],
    caution: "country-specific",
    note: {
      vi: "Cùng nhóm PCV nhưng số type huyết thanh và chỉ định có thể khác vaccine PCV khác.",
      en: "PCV product; serotype coverage and indications can differ from other PCV products.",
    },
  },
  {
    id: "prevenar-20",
    name: "Prevenar 20",
    groupIds: ["pcv"],
    antigens: ["PCV"],
    countries: ["US", "AU", "VN"],
    caution: "country-specific",
    note: {
      vi: "PCV thế hệ khác; không tự động xem là giống hệt PCV10/13 trong mọi lịch.",
      en: "Different PCV generation; do not treat as identical to PCV10/13 in every schedule.",
    },
  },
  {
    id: "synflorix",
    name: "Synflorix",
    groupIds: ["pcv"],
    antigens: ["PCV"],
    countries: ["VN", "AU"],
    caution: "country-specific",
    note: {
      vi: "PCV10; cần rule riêng khi chuyển sang PCV13/20.",
      en: "PCV10; switching to PCV13/20 needs country/product-specific rules.",
    },
  },
  {
    id: "rotarix",
    name: "Rotarix",
    groupIds: ["rotavirus"],
    antigens: ["Rotavirus"],
    countries: ["VN", "US", "UK", "AU"],
    caution: "doctor-review",
    note: {
      vi: "Rota có giới hạn tuổi và số liều theo sản phẩm; nên cố gắng dùng cùng loại nếu có thể.",
      en: "Rotavirus has product-specific age limits and dose counts; use the same product when possible.",
    },
  },
  {
    id: "rotateq",
    name: "RotaTeq",
    groupIds: ["rotavirus"],
    antigens: ["Rotavirus"],
    countries: ["VN", "US", "AU"],
    caution: "doctor-review",
    note: {
      vi: "RotaTeq thường là phác đồ 3 liều; chuyển đổi cần đánh giá sản phẩm và tuổi.",
      en: "RotaTeq commonly uses a 3-dose series; switching needs product and age review.",
    },
  },
  {
    id: "mmr",
    name: "MMR",
    groupIds: ["mmr"],
    antigens: ["Measles", "Mumps", "Rubella"],
    countries: ["VN", "US", "UK", "AU"],
    caution: "routine",
    note: {
      vi: "Vaccine sống giảm độc lực; cần chú ý khoảng cách với vaccine sống khác và tình trạng miễn dịch.",
      en: "Live attenuated vaccine; consider live-vaccine spacing and immune status.",
    },
  },
  {
    id: "mmrv",
    name: "MMRV",
    groupIds: ["mmr"],
    antigens: ["Measles", "Mumps", "Rubella", "Varicella"],
    countries: ["UK", "AU", "US"],
    caution: "country-specific",
    note: {
      vi: "Có thêm thành phần thủy đậu; lịch dùng phụ thuộc quốc gia và tuổi.",
      en: "Adds varicella; use depends on country and age.",
    },
  },
  {
    id: "gardasil-4",
    name: "Gardasil 4",
    groupIds: ["hpv"],
    antigens: ["HPV4"],
    countries: ["VN", "US", "UK", "AU"],
    caution: "country-specific",
    note: {
      vi: "Cùng nhóm HPV nhưng khác type bao phủ với Gardasil 9.",
      en: "HPV vaccine with different type coverage from Gardasil 9.",
    },
  },
  {
    id: "gardasil-9",
    name: "Gardasil 9",
    groupIds: ["hpv"],
    antigens: ["HPV4", "HPV9"],
    countries: ["VN", "US", "UK", "AU"],
    caution: "country-specific",
    note: {
      vi: "Bao phủ nhiều type HPV hơn Gardasil 4; chuyển đổi cần theo khuyến cáo quốc gia.",
      en: "Broader HPV type coverage than Gardasil 4; switching follows national guidance.",
    },
  },
  {
    id: "bexsero",
    name: "Bexsero",
    groupIds: ["meningococcal", "menB"],
    antigens: ["MenB"],
    countries: ["UK", "AU", "US", "VN"],
    caution: "doctor-review",
    note: {
      vi: "MenB không thay thế MenACWY.",
      en: "MenB does not replace MenACWY.",
    },
  },
  {
    id: "menacwy",
    name: "MenACWY",
    groupIds: ["meningococcal", "menBC"],
    antigens: ["MenACWY"],
    countries: ["US", "UK", "AU", "VN"],
    caution: "doctor-review",
    note: {
      vi: "MenACWY không thay thế MenB.",
      en: "MenACWY does not replace MenB.",
    },
  },
  {
    id: "hepb-mono",
    name: "Vaccine viêm gan B đơn",
    displayName: { vi: "Vaccine viêm gan B đơn", en: "Single-antigen hepatitis B vaccine" },
    groupIds: ["hepbBirth"],
    antigens: ["HepB"],
    countries: ["VN", "US", "UK", "AU"],
    caution: "routine",
    note: {
      vi: "Vaccine viêm gan B đơn; cần đối chiếu liều sơ sinh, liều phối hợp và khoảng cách tối thiểu.",
      en: "Single-antigen hepatitis B vaccine; check birth dose, combination doses, and minimum intervals.",
    },
  },
  {
    id: "hepb-birth-dose",
    name: "Viêm gan B sơ sinh",
    displayName: { vi: "Viêm gan B sơ sinh", en: "Hepatitis B birth dose" },
    groupIds: ["hepbBirth"],
    antigens: ["HepB"],
    countries: ["VN"],
    caution: "routine",
    note: {
      vi: "Vaccine viêm gan B đơn giá dùng cho liều sơ sinh, ưu tiên trong 24 giờ đầu sau sinh theo tình trạng mẹ và hướng dẫn tại điểm tiêm.",
      en: "A monovalent hepatitis B vaccine entry for the newborn birth dose, ideally within the first 24 hours after birth according to maternal status and clinic guidance.",
    },
  },
  {
    id: "hepa-mono",
    name: "Vaccine viêm gan A",
    displayName: { vi: "Vaccine viêm gan A", en: "Hepatitis A vaccine" },
    groupIds: ["hepa"],
    antigens: ["HepA"],
    countries: ["VN", "US", "UK", "AU"],
    caution: "country-specific",
    note: {
      vi: "Vaccine viêm gan A; lịch dùng phụ thuộc quốc gia, tuổi và nguy cơ phơi nhiễm.",
      en: "Hepatitis A vaccine; schedule depends on country, age, and exposure risk.",
    },
  },
  {
    id: "varicella",
    name: "Vaccine thủy đậu",
    displayName: { vi: "Vaccine thủy đậu", en: "Varicella vaccine" },
    groupIds: ["varicella"],
    antigens: ["Varicella"],
    countries: ["VN", "US", "UK", "AU"],
    caution: "country-specific",
    note: {
      vi: "Vaccine sống giảm độc lực phòng thủy đậu; cần chú ý tình trạng miễn dịch và khoảng cách với vaccine sống khác.",
      en: "Live attenuated varicella vaccine; consider immune status and live-vaccine spacing.",
    },
  },
  {
    id: "measles-single",
    name: "Vaccine sởi đơn",
    displayName: { vi: "Vaccine sởi đơn", en: "Measles-only vaccine" },
    groupIds: ["mmr"],
    antigens: ["Measles"],
    countries: ["VN"],
    caution: "routine",
    note: {
      vi: "Vaccine sởi đơn; có thể được tính cho thành phần sởi, nhưng không thay thế quai bị/rubella.",
      en: "Single-antigen measles vaccine; counts for measles but does not cover mumps or rubella.",
    },
  },
  {
    id: "shingrix",
    name: "Shingrix",
    groupIds: ["zoster"],
    antigens: ["Zoster"],
    countries: ["VN", "US", "UK", "AU"],
    caution: "doctor-review",
    note: {
      vi: "Vaccine zona thường dành cho người lớn hoặc nhóm nguy cơ; không thuộc lịch trẻ em routine.",
      en: "Zoster vaccine is usually for adults or risk groups; it is not routine childhood vaccination.",
    },
  },
  {
    id: "rsv",
    name: "Vaccine RSV",
    displayName: { vi: "Vaccine RSV", en: "RSV vaccine" },
    groupIds: ["rsv"],
    antigens: ["RSV"],
    countries: ["VN", "US", "UK", "AU"],
    caution: "doctor-review",
    note: {
      vi: "RSV có chỉ định theo tuổi, thai kỳ, mùa dịch và nhóm nguy cơ; cần bác sĩ đánh giá.",
      en: "RSV products depend on age, pregnancy status, season, and risk group; clinician review is needed.",
    },
  },
  {
    id: "rabies",
    name: "Vaccine dại",
    displayName: { vi: "Vaccine dại", en: "Rabies vaccine" },
    groupIds: ["rabies"],
    antigens: ["Rabies"],
    countries: ["VN", "US", "UK", "AU"],
    caution: "doctor-review",
    note: {
      vi: "Vaccine dại thường dùng theo phác đồ trước hoặc sau phơi nhiễm; cần đánh giá vết cắn/phơi nhiễm và huyết thanh kháng dại nếu có chỉ định.",
      en: "Rabies vaccine is used for pre- or post-exposure schedules; exposure assessment and rabies immunoglobulin may be needed.",
    },
  },
  {
    id: "tetanus-single",
    name: "Vaccine uốn ván đơn",
    displayName: { vi: "Vaccine uốn ván đơn", en: "Single-antigen tetanus vaccine" },
    groupIds: ["tetanusSingle"],
    antigens: ["Tetanus"],
    countries: ["VN", "US", "UK", "AU"],
    caution: "doctor-review",
    note: {
      vi: "Vaccine uốn ván đơn thường liên quan xử trí vết thương, thai kỳ hoặc lịch nhắc; cần đối chiếu tiền sử tiêm và mức độ vết thương.",
      en: "Single-antigen tetanus vaccine is often tied to wound management, pregnancy, or boosters; check history and wound risk.",
    },
  },

  {
    id: "ivac-bcg",
    name: "Ivactuber (BCG)",
    groupIds: ["bcg"],
    antigens: ["BCG"],
    countries: ["VN"],
    caution: "routine",
    note: {
      vi: "BCG phòng các thể lao nặng ở trẻ nhỏ; thường dùng sớm sau sinh theo chương trình.",
      en: "BCG is used to prevent severe forms of tuberculosis in infants and is typically given soon after birth.",
    },
  },
  {
    id: "bopv-polyvac",
    name: "bOPV - Polyvac",
    groupIds: ["polio"],
    antigens: ["OPV"],
    countries: ["VN"],
    caution: "routine",
    note: {
      vi: "bOPV là vaccine bại liệt uống; không xem là tương đương hoàn toàn với IPV trong mọi tình huống.",
      en: "bOPV is an oral polio vaccine and should not be treated as fully interchangeable with IPV in every situation.",
    },
  },
  {
    id: "imovax-polio",
    name: "IMOVAX POLIO",
    displayName: { vi: "IPV - IMOVAX POLIO", en: "IPV - IMOVAX POLIO" },
    groupIds: ["polio"],
    antigens: ["IPV"],
    countries: ["VN", "US", "UK", "AU"],
    caution: "routine",
    note: {
      vi: "IPV là vaccine bại liệt chích bất hoạt; cần đối chiếu khi đổi giữa IPV và OPV.",
      en: "IPV is an inactivated injectable polio vaccine; review carefully when converting between IPV and OPV records.",
    },
  },
  {
    id: "vaxneuvance",
    name: "Vaxneuvance",
    groupIds: ["pcv"],
    antigens: ["PCV"],
    countries: ["VN", "US", "UK", "AU"],
    caution: "country-specific",
    note: {
      vi: "PCV15; bao phủ 15 type phế cầu, cần đối chiếu với các lịch dùng PCV10/13/20.",
      en: "PCV15 with 15 pneumococcal serotypes; compare carefully with PCV10/13/20 schedules.",
    },
  },
  {
    id: "pneumovax-23",
    name: "Pneumovax 23",
    groupIds: ["pcv"],
    antigens: ["PCV"],
    countries: ["VN", "US", "UK", "AU"],
    caution: "country-specific",
    note: {
      vi: "PPSV23 là vaccine phế cầu 23 type, thường dùng cho nhóm tuổi/nguy cơ cá nhân hóa hơn PCV.",
      en: "PPSV23 covers 23 pneumococcal serotypes and is usually used for age- or risk-based indications rather than routine infant PCV schedules.",
    },
  },
  {
    id: "rotavin-m1",
    name: "Rotavin-M1",
    groupIds: ["rotavirus"],
    antigens: ["Rotavirus"],
    countries: ["VN"],
    caution: "doctor-review",
    note: {
      vi: "Rotavin-M1 là vaccine rota uống nội địa; các giới hạn tuổi và việc đổi sản phẩm vẫn cần bác sĩ đánh giá.",
      en: "Rotavin-M1 is an oral rotavirus vaccine used in Vietnam; age limits and product switching still need clinician review.",
    },
  },
  {
    id: "vamengoc-bc",
    name: "VA-MENGOC-BC",
    displayName: { vi: "Mengoc BC (Cuba)", en: "VA-MENGOC-BC" },
    groupIds: ["meningococcal", "menBC"],
    antigens: ["MenB", "MenBC"],
    countries: ["VN"],
    caution: "doctor-review",
    note: {
      vi: "VA-MENGOC-BC hướng đến nhóm não mô cầu B/C; không xem là thay thế trực tiếp cho MenB hoặc MenACWY hiện đại.",
      en: "VA-MENGOC-BC targets meningococcal B/C and should not be treated as a direct substitute for modern MenB or MenACWY products.",
    },
  },
  {
    id: "menactra",
    name: "Menactra",
    groupIds: ["meningococcal"],
    antigens: ["MenACWY"],
    countries: ["VN", "US"],
    caution: "doctor-review",
    note: {
      vi: "MenACWY bao phủ A, C, W, Y; cần đối chiếu tuổi và lịch nhắc.",
      en: "MenACWY covers serogroups A, C, W, and Y; check age indications and booster timing.",
    },
  },
  {
    id: "menquadfi",
    name: "MenQuadfi",
    groupIds: ["meningococcal", "menACWY"],
    antigens: ["MenACWY"],
    countries: ["VN", "US", "AU"],
    caution: "doctor-review",
    note: {
      vi: "MenACWY phối hợp giải độc tố uốn ván; không thay thế MenB.",
      en: "A MenACWY tetanus-toxoid conjugate vaccine; it does not replace MenB.",
    },
  },
  {
    id: "nimenrix",
    name: "Nimenrix",
    groupIds: ["meningococcal", "menACWY"],
    antigens: ["MenACWY"],
    countries: ["VN", "UK", "AU"],
    caution: "doctor-review",
    note: {
      vi: "MenACWY giúp phòng A, C, W, Y; cần đối chiếu riêng với lịch MenB.",
      en: "A MenACWY vaccine covering A, C, W, and Y; compare separately from MenB history.",
    },
  },
  {
    id: "vaxigrip-tetra",
    name: "Vaxigrip Tetra",
    groupIds: ["influenza"],
    antigens: ["Influenza"],
    countries: ["VN", "AU", "UK"],
    caution: "country-specific",
    note: {
      vi: "Vaccine cúm tứ giá theo mùa; cần đối chiếu chủng cúm của mùa hiện hành.",
      en: "A seasonal influenza vaccine; match it to the current season's formulation and local guidance.",
    },
  },
  {
    id: "influvac-tetra",
    name: "Influvac Tetra",
    groupIds: ["influenza"],
    antigens: ["Influenza"],
    countries: ["VN", "AU", "UK"],
    caution: "country-specific",
    note: {
      vi: "Vaccine cúm bốn giá; thành phần thay đổi theo mùa.",
      en: "A quadrivalent influenza vaccine with season-specific strain composition.",
    },
  },
  {
    id: "ivacflu-s",
    name: "Ivacflu-S",
    groupIds: ["influenza"],
    antigens: ["Influenza"],
    countries: ["VN"],
    caution: "country-specific",
    note: {
      vi: "Vaccine cúm sản xuất tại Việt Nam; theo khuyến cáo mùa cúm hiện hành.",
      en: "A Vietnam-produced influenza vaccine used according to the current influenza season recommendations.",
    },
  },
  {
    id: "gcflu-quadrivalent",
    name: "GC Flu Quadrivalent",
    groupIds: ["influenza"],
    antigens: ["Influenza"],
    countries: ["VN"],
    caution: "country-specific",
    note: {
      vi: "Vaccine cúm bốn giá; cần cân theo mùa và nhóm tuổi.",
      en: "A quadrivalent influenza vaccine; use depends on age band and seasonal recommendations.",
    },
  },
  {
    id: "mvvac",
    name: "MVVAC",
    displayName: { vi: "Sởi đơn MVVAC", en: "MVVAC measles vaccine" },
    groupIds: ["mmr"],
    antigens: ["Measles"],
    countries: ["VN"],
    caution: "routine",
    note: {
      vi: "Sởi đơn; được tính cho thành phần sởi nhưng không bao phủ quai bị/rubella.",
      en: "A measles-only vaccine; it counts for measles but does not cover mumps or rubella.",
    },
  },
  {
    id: "mrvac",
    name: "MRVAC",
    displayName: { vi: "Sởi rubella MRVAC", en: "MRVAC measles-rubella vaccine" },
    groupIds: ["mmr"],
    antigens: ["Measles", "Rubella"],
    countries: ["VN"],
    caution: "routine",
    note: {
      vi: "Vaccine phối hợp sởi-rubella; không bao phủ quai bị.",
      en: "A measles-rubella vaccine; it does not cover mumps.",
    },
  },
  {
    id: "priorix",
    name: "Priorix",
    groupIds: ["mmr"],
    antigens: ["Measles", "Mumps", "Rubella"],
    countries: ["VN", "UK", "AU"],
    caution: "routine",
    note: {
      vi: "MMR; cần củng cố theo lịch quốc gia và khoảng cách tối thiểu.",
      en: "An MMR vaccine that should follow local schedule timing and minimum intervals.",
    },
  },
  {
    id: "mmr-ii",
    name: "MMR II",
    groupIds: ["mmr"],
    antigens: ["Measles", "Mumps", "Rubella"],
    countries: ["VN", "US"],
    caution: "routine",
    note: {
      vi: "MMR; tránh so ngang trực tiếp với vaccine chỉ có sởi hoặc MR.",
      en: "An MMR vaccine; do not equate it directly with measles-only or measles-rubella products.",
    },
  },
  {
    id: "serum-mmr-india",
    name: "MMR (India)",
    displayName: { vi: "Measles-mumps-rubella MMR (Ấn Độ)", en: "MMR (India)" },
    groupIds: ["mmr"],
    antigens: ["Measles", "Mumps", "Rubella"],
    countries: ["VN"],
    caution: "routine",
    note: {
      vi: "MMR phối hợp; cần đối chiếu nhãn sản phẩm và lịch tiêm tại cơ sở.",
      en: "A combined MMR product; compare the exact product label and local schedule when recording history.",
    },
  },
  {
    id: "sii-mmr",
    name: "SII MMR",
    displayName: { vi: "SII MMR", en: "SII MMR" },
    groupIds: ["mmr"],
    antigens: ["Measles", "Mumps", "Rubella"],
    countries: ["VN"],
    caution: "routine",
    note: {
      vi: "Tên gọi thường dùng theo hãng Serum Institute of India cho vaccine MMR; phòng sởi, quai bị và rubella.",
      en: "A common shorthand for the Serum Institute of India MMR vaccine; covers measles, mumps, and rubella.",
    },
  },
  {
    id: "varilrix",
    name: "Varilrix",
    groupIds: ["varicella"],
    antigens: ["Varicella"],
    countries: ["VN", "UK", "AU"],
    caution: "country-specific",
    note: {
      vi: "Vaccine thủy đậu sống giảm độc lực; cần lưu ý sàng lọc miễn dịch.",
      en: "A live attenuated varicella vaccine; immune screening remains important.",
    },
  },
  {
    id: "varivax",
    name: "Varivax",
    groupIds: ["varicella"],
    antigens: ["Varicella"],
    countries: ["VN", "US"],
    caution: "country-specific",
    note: {
      vi: "Vaccine thủy đậu đơn; vẫn cần đối chiếu lịch khi kết hợp với các vaccine varicella khác.",
      en: "A single-antigen varicella vaccine; it still needs schedule review when combined with other varicella products.",
    },
  },
  {
    id: "barycella",
    name: "Barycella",
    groupIds: ["varicella"],
    antigens: ["Varicella"],
    countries: ["VN"],
    caution: "country-specific",
    note: {
      vi: "Vaccine thủy đậu; cần đối chiếu độ tuổi và tiền sử vaccine sống khác.",
      en: "A varicella vaccine that should be reviewed alongside age and other live-vaccine history.",
    },
  },
  {
    id: "proquad",
    name: "ProQuad",
    groupIds: ["mmr", "varicella"],
    antigens: ["Measles", "Mumps", "Rubella", "Varicella"],
    countries: ["VN", "US", "AU"],
    caution: "country-specific",
    note: {
      vi: "MMRV; cần lưu ý tuổi và quy tắc với vaccine sống.",
      en: "An MMRV vaccine; check age use and live-vaccine spacing rules.",
    },
  },
  {
    id: "imojev",
    name: "Imojev",
    groupIds: ["je"],
    antigens: ["JE"],
    countries: ["VN", "AU"],
    caution: "country-specific",
    note: {
      vi: "Vaccine viêm não Nhật Bản dùng theo tuổi và nguy cơ phơi nhiễm.",
      en: "A Japanese encephalitis vaccine used according to age and exposure risk.",
    },
  },
  {
    id: "jevax",
    name: "Jevax",
    groupIds: ["je"],
    antigens: ["JE"],
    countries: ["VN"],
    caution: "country-specific",
    note: {
      vi: "Vaccine JE bất hoạt; lịch tiêm và nhắc lại cần theo cơ sở tiêm.",
      en: "An inactivated JE vaccine; series timing and boosters should follow clinic guidance.",
    },
  },
  {
    id: "jeev",
    name: "JEEV",
    groupIds: ["je"],
    antigens: ["JE"],
    countries: ["VN"],
    caution: "country-specific",
    note: {
      vi: "Vaccine viêm não Nhật Bản; cần đối chiếu lịch tiêm cá nhân.",
      en: "A Japanese encephalitis vaccine that should be matched with the individual's dosing schedule.",
    },
  },
  {
    id: "avaxim",
    name: "Avaxim",
    groupIds: ["hepa"],
    antigens: ["HepA"],
    countries: ["VN", "AU"],
    caution: "country-specific",
    note: {
      vi: "Vaccine viêm gan A bất hoạt; số liều và mũi nhắc tùy lịch.",
      en: "An inactivated hepatitis A vaccine; dose count and boosters depend on the schedule used.",
    },
  },
  {
    id: "havax",
    name: "Havax",
    groupIds: ["hepa"],
    antigens: ["HepA"],
    countries: ["VN"],
    caution: "country-specific",
    note: {
      vi: "Vaccine viêm gan A; cần đối chiếu mũi cơ bản và nhắc.",
      en: "A hepatitis A vaccine; compare primary and booster doses carefully.",
    },
  },
  {
    id: "twinrix",
    name: "Twinrix",
    groupIds: ["hepab", "hepa"],
    antigens: ["HepA", "HepB"],
    countries: ["VN", "US", "UK", "AU"],
    caution: "country-specific",
    note: {
      vi: "Vaccine phối hợp viêm gan A+B; khi quy đổi lịch cần tính cả hai thành phần HepA và HepB.",
      en: "A combined hepatitis A+B vaccine; record conversion should count both HepA and HepB components.",
    },
  },
  {
    id: "engerix-b",
    name: "Engerix B",
    groupIds: ["hepbBirth"],
    antigens: ["HepB"],
    countries: ["VN", "US", "UK", "AU"],
    caution: "routine",
    note: {
      vi: "Vaccine viêm gan B đơn; có thể dùng trong lịch sơ sinh hoặc bổ sung.",
      en: "A single-antigen hepatitis B vaccine that may be used for birth dose or follow-up dosing.",
    },
  },
  {
    id: "euvax-b",
    name: "Euvax B",
    groupIds: ["hepbBirth"],
    antigens: ["HepB"],
    countries: ["VN"],
    caution: "routine",
    note: {
      vi: "Vaccine viêm gan B đơn; cần tính theo lịch HepB hiện hành.",
      en: "A single-antigen hepatitis B vaccine to be counted under the HepB schedule in use.",
    },
  },
  {
    id: "heberbiovac-hb",
    name: "Heberbiovac HB",
    groupIds: ["hepbBirth"],
    antigens: ["HepB"],
    countries: ["VN"],
    caution: "routine",
    note: {
      vi: "Vaccine viêm gan B đơn; cần đối chiếu ngày tiêm và khoảng cách tối thiểu.",
      en: "A single-antigen hepatitis B vaccine; review dose timing and minimum intervals.",
    },
  },
  {
    id: "gene-hbvax",
    name: "Gene-HBVax",
    groupIds: ["hepbBirth"],
    antigens: ["HepB"],
    countries: ["VN"],
    caution: "routine",
    note: {
      vi: "Vaccine viêm gan B đơn; dùng theo lịch HepB cá nhân.",
      en: "A single-antigen hepatitis B vaccine to be interpreted within the individual's HepB series.",
    },
  },
  {
    id: "typhim-vi",
    name: "Typhim Vi",
    groupIds: ["typhoid"],
    antigens: ["Typhoid"],
    countries: ["VN", "AU"],
    caution: "country-specific",
    note: {
      vi: "Vaccine thương hàn; thường dùng theo nguy cơ/du lịch hơn là routine trẻ em.",
      en: "A typhoid vaccine usually used for risk-based or travel indications rather than routine childhood schedules.",
    },
  },
  {
    id: "typhoid-vn",
    name: "Typhoid",
    displayName: { vi: "Typhoid (Việt Nam)", en: "Typhoid vaccine (Vietnam)" },
    groupIds: ["typhoid"],
    antigens: ["Typhoid"],
    countries: ["VN"],
    caution: "country-specific",
    note: {
      vi: "Vaccine thương hàn; cần đối chiếu nguy cơ phơi nhiễm và mũi nhắc.",
      en: "A typhoid vaccine that should be reviewed with exposure risk and booster timing.",
    },
  },
  {
    id: "morcvax",
    name: "mORCVAX",
    groupIds: ["cholera"],
    antigens: ["Cholera"],
    countries: ["VN"],
    caution: "country-specific",
    note: {
      vi: "Vaccine tả uống; chưa nằm trong routine trẻ em phổ biến và thường cần chỉ định theo nguy cơ.",
      en: "An oral cholera vaccine generally used for specific risk settings rather than routine childhood use.",
    },
  },
  {
    id: "abrysvo",
    name: "Abrysvo",
    groupIds: ["rsv"],
    antigens: ["RSV"],
    countries: ["VN", "US", "UK", "AU"],
    caution: "doctor-review",
    note: {
      vi: "Vaccine RSV dùng theo chỉ định thai kỳ, người lớn hoặc nhóm nguy cơ.",
      en: "An RSV vaccine used according to pregnancy, adult, or risk-group indications.",
    },
  },
  {
    id: "arexvy",
    name: "Arexvy",
    groupIds: ["rsv"],
    antigens: ["RSV"],
    countries: ["VN", "US", "UK", "AU"],
    caution: "doctor-review",
    note: {
      vi: "Vaccine RSV hướng tới nhóm tuổi/nguy cơ cụ thể; cần bác sĩ đánh giá.",
      en: "An RSV vaccine for specific age or risk groups; clinician review is recommended.",
    },
  },
  {
    id: "tetraxim",
    name: "Tetraxim",
    groupIds: ["dtapIpvHib"],
    antigens: ["DTaP", "IPV"],
    countries: ["VN"],
    caution: "partial",
    note: {
      vi: "Vaccine 4 trong 1 DTaP-IPV; không chứa Hib hoặc HepB.",
      en: "A 4-in-1 DTaP-IPV vaccine that does not include Hib or hepatitis B.",
    },
  },
  {
    id: "adacel",
    name: "Adacel",
    groupIds: ["dtapIpvHib"],
    antigens: ["Tdap"],
    countries: ["VN", "US"],
    caution: "doctor-review",
    note: {
      vi: "Tdap 3 trong 1 dùng nhiều cho mũi nhắc; không tương đương với các vaccine 5/6 trong 1.",
      en: "A Tdap booster vaccine that should not be treated as equivalent to infant 5-in-1 or 6-in-1 products.",
    },
  },
  {
    id: "boostrix",
    name: "Boostrix",
    groupIds: ["dtapIpvHib"],
    antigens: ["Tdap"],
    countries: ["VN", "UK", "AU"],
    caution: "doctor-review",
    note: {
      vi: "Tdap 3 trong 1 cho nhắc/thai kỳ theo chỉ định cơ sở tiêm.",
      en: "A Tdap vaccine commonly used for boosters or pregnancy indications depending on local guidance.",
    },
  },
  {
    id: "td-vn",
    name: "Td",
    displayName: { vi: "Td (Việt Nam)", en: "Td vaccine (Vietnam)" },
    groupIds: ["tetanusSingle"],
    antigens: ["Td"],
    countries: ["VN"],
    caution: "doctor-review",
    note: {
      vi: "Td bao phủ bạch hầu và uốn ván; lưu ý khác với vaccine có thành phần ho gà.",
      en: "Td covers diphtheria and tetanus and should be distinguished from pertussis-containing products.",
    },
  },
  {
    id: "tt-vn",
    name: "TT",
    displayName: { vi: "TT (Việt Nam)", en: "TT vaccine (Vietnam)" },
    groupIds: ["tetanusSingle"],
    antigens: ["Tetanus"],
    countries: ["VN"],
    caution: "doctor-review",
    note: {
      vi: "TT là vaccine uốn ván đơn, thường dùng cho vết thương hoặc nhắc.",
      en: "TT is a single-antigen tetanus vaccine commonly used for wounds or boosters.",
    },
  },
  {
    id: "verorab",
    name: "Verorab",
    groupIds: ["rabies"],
    antigens: ["Rabies"],
    countries: ["VN", "AU"],
    caution: "doctor-review",
    note: {
      vi: "Vaccine dại dùng cho trước phơi nhiễm/sau phơi nhiễm; cần đánh giá phơi nhiễm và huyết thanh kháng dại khi cần.",
      en: "A rabies vaccine used in pre- and post-exposure schedules; exposure assessment and rabies immunoglobulin may still be needed.",
    },
  },
  {
    id: "abhayrab",
    name: "Abhayrab",
    groupIds: ["rabies"],
    antigens: ["Rabies"],
    countries: ["VN"],
    caution: "doctor-review",
    note: {
      vi: "Vaccine dại; cần đối chiếu phác đồ tiêm cá nhân với tình huống phơi nhiễm.",
      en: "A rabies vaccine that should be matched to the individual's pre- or post-exposure schedule.",
    },
  },
  {
    id: "indirab",
    name: "Indirab",
    groupIds: ["rabies"],
    antigens: ["Rabies"],
    countries: ["VN"],
    caution: "doctor-review",
    note: {
      vi: "Vaccine dại; cân nhắc cùng lúc với xử trí vết thương và RIG nếu có chỉ định.",
      en: "A rabies vaccine to be considered together with wound care and immunoglobulin when indicated.",
    },
  },
  {
    id: "qdenga",
    name: "Qdenga",
    groupIds: ["dengue"],
    antigens: ["Dengue"],
    countries: ["VN", "AU", "UK"],
    caution: "country-specific",
    note: {
      vi: "Vaccine sốt xuất huyết bao phủ 4 týp Dengue; chỉ định phụ thuộc tuổi/quốc gia.",
      en: "A dengue vaccine covering 4 dengue serotypes; indications vary by age and country.",
    },
  },
  {
    id: "cervarix",
    name: "Cervarix",
    groupIds: ["hpv"],
    antigens: ["HPV4"],
    countries: ["VN", "UK", "AU"],
    caution: "country-specific",
    note: {
      vi: "HPV type 16 và 18; không bao phủ các type như Gardasil 4/9.",
      en: "Targets HPV 16 and 18 and does not provide the same type coverage as Gardasil 4 or 9.",
    },
  },
  {
    id: "quimi-hib",
    name: "Quimi-Hib",
    groupIds: ["hibSingle"],
    antigens: ["Hib"],
    countries: ["VN"],
    caution: "country-specific",
    note: {
      vi: "Vaccine Hib đơn; cần tính riêng khi đối chiếu với các vaccine phối hợp chứa Hib.",
      en: "A single-antigen Hib vaccine that should be counted separately when compared with combination products containing Hib.",
    },
  },
];

const commonNotes = {
  combo: {
    vi: "Nhóm phối hợp cần tính theo kháng nguyên, không chỉ theo tên thương mại.",
    en: "Combination vaccines are counted by antigens, not only by brand name.",
  },
  rota: {
    vi: "Rota có giới hạn tuổi rất chặt theo từng sản phẩm: Rotarix 2 liều, RotaTeq 3 liều, Rotavin 2 liều; nếu trễ hoặc đổi sản phẩm cần bác sĩ đánh giá.",
    en: "Rotavirus has strict product-specific age limits: Rotarix 2 doses, RotaTeq 3 doses, Rotavin 2 doses; delays or product switching need clinician review.",
  },
  pcv: {
    vi: "PCV khác nhau theo type huyết thanh và cả lịch 2+1 hoặc 3+1 tùy sản phẩm, độ tuổi bắt đầu và quốc gia.",
    en: "PCV products differ by serotype coverage and may follow either 2+1 or 3+1 schedules depending on product, starting age, and country.",
  },
};

const comboDose = (dose: number, recommendedDays: number): ScheduleDose => ({
  dose,
  recommendedDays,
  minAgeDays: weeks(6),
  minIntervalDays: dose === 1 ? undefined : weeks(4),
  label: {
    vi: `Mũi ${dose}`,
    en: `Dose ${dose}`,
  },
});

const pcvDose = (dose: number, recommendedDays: number): ScheduleDose => ({
  dose,
  recommendedDays,
  minAgeDays: weeks(6),
  minIntervalDays: dose === 1 ? undefined : weeks(4),
  label: {
    vi: `PCV mũi ${dose}`,
    en: `PCV dose ${dose}`,
  },
});

const rotaDose = (dose: number, recommendedDays: number): ScheduleDose => ({
  dose,
  recommendedDays,
  minAgeDays: weeks(6),
  minIntervalDays: dose === 1 ? undefined : weeks(4),
  maxAgeDays: weeks(32),
  label: {
    vi: `Rota mũi ${dose}`,
    en: `Rotavirus dose ${dose}`,
  },
});

export const countryProfiles: CountryProfile[] = [
  {
    code: "VN",
    name: { vi: "Việt Nam", en: "Vietnam" },
    scheduleName: {
      vi: "Lịch tiêm chủng mở rộng Việt Nam, kèm mốc vaccine dịch vụ thường gặp",
      en: "Vietnam expanded immunization schedule with common service-vaccine milestones",
    },
    lastReviewed: todayIso,
    gracePeriodDays: 0,
    sources: [
      {
        title: "Thông tư 52/2025/TT-BYT, Chương trình tiêm chủng mở rộng",
        url: "https://cmsapi.tiemchungmorong.vn/assets/e5510aa2-618f-499a-8da6-7f4bbe05f33e",
        effective: "2025-12-31",
        reviewed: todayIso,
      },
      {
        title: "HCDC: Lịch tiêm vắc xin trong chương trình Tiêm chủng mở rộng",
        url: "https://hcdc.vn/lich-tiem-vac-xin-trong-chuong-trinh-tiem-chung-mo-rong-6GNqhH.html",
        effective: "2026-01-01",
        reviewed: todayIso,
      },
      {
        title: "TTTC Long Châu: Lịch tiêm chủng vắc xin trọn đời theo tuổi",
        url: "file:///C:/Users/ngock/OneDrive/Ho%C3%A0ng%20Anh/Ti%C3%AAm%20ch%E1%BB%A7ng/long%20ch%C3%A2u/L%E1%BB%8Bch-ti%C3%AAm-ch%E1%BB%A7ng-tr%E1%BB%8Dn-%C4%91%E1%BB%9Di-t%E1%BA%A1i-TTTC-Long-Ch%C3%A2u-c%E1%BA%ADp-nh%E1%BA%ADt-180526.pdf",
        effective: "2026-05-18",
        reviewed: todayIso,
      },
    ],
    groups: [
      {
        id: "hepbBirth",
        name: { vi: "Viêm gan B sơ sinh", en: "Hepatitis B birth dose" },
        requiredAntigens: ["HepB"],
        category: "routine",
        doses: [
          {
            dose: 1,
            recommendedDays: 0,
            minAgeDays: 0,
            maxAgeDays: days(28),
            label: { vi: "Liều sơ sinh", en: "Birth dose" },
          },
        ],
        note: {
          vi: "Ưu tiên trong 24 giờ sau sinh; nếu không đúng lịch cần xử trí theo hướng dẫn địa phương.",
          en: "Preferred within 24 hours after birth; missed doses follow local guidance.",
        },
      },
      {
        id: "bcg",
        name: { vi: "Lao BCG", en: "BCG tuberculosis" },
        requiredAntigens: ["BCG"],
        category: "routine",
        doses: [
          {
            dose: 1,
            recommendedDays: 0,
            minAgeDays: 0,
            maxAgeDays: years(1),
            label: { vi: "Một liều", en: "One dose" },
          },
        ],
        note: {
          vi: "Theo chương trình, tiêm sớm sau sinh và trước 12 tháng nếu lỡ lịch.",
          en: "Given soon after birth; catch up before 12 months under programme guidance.",
        },
      },
      {
        id: "dtapIpvHibHepb",
        name: { vi: "6 trong 1 / 5 trong 1", en: "6-in-1 / 5-in-1 combination" },
        requiredAntigens: ["Hib", "HepB"],
        category: "routine",
        doses: [
          comboDose(1, months(2)),
          comboDose(2, months(3)),
          comboDose(3, months(4)),
          {
            dose: 4,
            recommendedDays: months(16),
            minAgeDays: months(10),
            minIntervalDays: months(6),
            maxAgeDays: months(24),
            label: { vi: "Mũi 4", en: "Dose 4" },
          },
        ],
        note: {
          vi: "Đối chiếu theo lịch 6 trong 1 tại Long Châu: thường 2, 3, 4 và 16 tháng; mũi 4 có thể hoàn thành sớm hơn nếu đã cách mũi 3 ít nhất 6 tháng và chưa quá 24 tháng tuổi.",
          en: "Aligned to the common Vietnamese 6-in-1 schedule used by Long Chau: usually at 2, 3, 4, and 16 months; dose 4 may be completed earlier if it is at least 6 months after dose 3 and before 24 months of age.",
        },
      },
      {
        id: "rotavirus",
        name: { vi: "Rota", en: "Rotavirus" },
        requiredAntigens: ["Rotavirus"],
        category: "routine",
        doses: [rotaDose(1, months(2)), rotaDose(2, months(3))],
        note: commonNotes.rota,
      },
      {
        id: "mmr",
        name: { vi: "Sởi / Sởi-Rubella", en: "Measles-containing vaccine" },
        requiredAntigens: ["Measles"],
        category: "routine",
        doses: [
          {
            dose: 1,
            recommendedDays: months(9),
            minAgeDays: months(9),
            label: { vi: "Sởi mũi 1", en: "Measles dose 1" },
          },
          {
            dose: 2,
            recommendedDays: months(18),
            minAgeDays: months(18),
            minIntervalDays: weeks(4),
            label: { vi: "Sởi/Rubella nhắc", en: "Measles-containing booster" },
          },
        ],
        note: {
          vi: "Mũi nhắc có thể là vaccine phối hợp chứa sởi/rubella theo chương trình.",
          en: "Booster may be a combination measles/rubella-containing product.",
        },
      },
      {
        id: "pcv",
        name: { vi: "Phế cầu PCV", en: "Pneumococcal conjugate vaccine" },
        requiredAntigens: ["PCV"],
        category: "service",
        doses: [pcvDose(1, months(2)), pcvDose(2, months(4)), pcvDose(3, months(12))],
        note: commonNotes.pcv,
      },
      {
        id: "menB",
        name: { vi: "Não mô cầu B", en: "Meningococcal B" },
        requiredAntigens: ["MenBC"],
        category: "service",
        doses: [
          {
            dose: 1,
            recommendedDays: months(2),
            minAgeDays: months(2),
            maxAgeDays: years(50),
            label: { vi: "Bexsero mũi 1", en: "Bexsero dose 1" },
          },
          {
            dose: 2,
            recommendedDays: months(4),
            minAgeDays: months(4),
            minIntervalDays: months(2),
            maxAgeDays: years(50),
            label: { vi: "Bexsero mũi 2", en: "Bexsero dose 2" },
          },
          {
            dose: 3,
            recommendedDays: months(12),
            minAgeDays: months(12),
            minIntervalDays: months(8),
            maxAgeDays: years(50),
            label: { vi: "Bexsero mũi nhắc", en: "Bexsero booster" },
          },
        ],
        note: {
          vi: "Theo lịch Long Châu: Bexsero dùng từ tròn 2 tháng đến tròn 50 tuổi. Có thể tiêm cùng vaccine khác khi đã giải thích lợi ích/nguy cơ; không cần khoảng cách với Mengoc BC và Menactra. Tiêm cùng ngày với Bexsero và phế cầu có thể tăng sốt, sưng đau.",
          en: "Long Chau schedule: Bexsero is used from 2 months through 50 years. It may be given with other vaccines after benefit/risk discussion; no spacing is required with Mengoc BC or Menactra. Same-day Bexsero with pneumococcal vaccines may increase fever or local reactions.",
        },
      },
      {
        id: "menBC",
        name: { vi: "Não mô cầu B+C", en: "Meningococcal B+C" },
        requiredAntigens: ["MenBC"],
        category: "service",
        doses: [
          {
            dose: 1,
            recommendedDays: months(6),
            minAgeDays: months(6),
            maxAgeDays: years(46),
            label: { vi: "Mengoc BC mũi 1", en: "Mengoc BC dose 1" },
          },
          {
            dose: 2,
            recommendedDays: months(8),
            minAgeDays: months(6),
            minIntervalDays: weeks(6),
            maxAgeDays: years(46),
            label: { vi: "Mengoc BC mũi 2", en: "Mengoc BC dose 2" },
          },
        ],
        note: {
          vi: "Theo lịch Long Châu: VA-Mengoc-BC dùng từ tròn 6 tháng đến trước sinh nhật 46 tuổi, 2 mũi cách 2 tháng; khoảng cách tối thiểu 42 ngày. Có thể tiêm cùng vaccine khác khi đã giải thích lợi ích/nguy cơ; không cần khoảng cách với Bexsero và Menactra, nhưng tiêm cùng ngày với Bexsero, Menactra và Prevenar 13 có thể tăng sốt, sưng đau.",
          en: "Long Chau schedule: VA-Mengoc-BC is used from 6 months until before the 46th birthday, with 2 doses 2 months apart; minimum interval is 42 days. It may be given with other vaccines after benefit/risk discussion; no spacing is required with Bexsero and Menactra, though same-day Bexsero, Menactra, and Prevenar 13 may increase fever or local reactions.",
        },
      },
      {
        id: "menACWY",
        name: { vi: "Não mô cầu ACWY", en: "Meningococcal ACWY" },
        requiredAntigens: ["MenACWY"],
        category: "service",
        doses: [
          {
            dose: 1,
            recommendedDays: weeks(6),
            minAgeDays: weeks(6),
            label: { vi: "MenACWY mũi 1", en: "MenACWY dose 1" },
          },
          {
            dose: 2,
            recommendedDays: months(4),
            minAgeDays: months(4),
            minIntervalDays: months(2),
            label: { vi: "MenACWY mũi 2", en: "MenACWY dose 2" },
          },
          {
            dose: 3,
            recommendedDays: months(6),
            minAgeDays: months(6),
            minIntervalDays: months(2),
            label: { vi: "MenACWY mũi 3 nếu cần theo sản phẩm", en: "MenACWY dose 3 if needed by product" },
          },
          {
            dose: 4,
            recommendedDays: months(12),
            minAgeDays: months(12),
            minIntervalDays: months(2),
            label: { vi: "MenACWY mũi sau 12 tháng nếu cần", en: "MenACWY dose after 12 months if needed" },
          },
        ],
        note: {
          vi: "MenQuadfi và Nimenrix dùng từ 6 tuần tuổi. Đây là vaccine cộng hợp; có thể cân nhắc tiêm đồng thời với vaccine khác. Không tiêm đồng thời MenQuadfi/Nimenrix với Menactra hoặc Mengoc BC; tiêm cùng ngày với Bexsero và phế cầu có thể tăng sốt, sưng đau.",
          en: "MenQuadfi and Nimenrix start from 6 weeks. These are conjugate vaccines and may be considered with other vaccines. Do not give MenQuadfi/Nimenrix at the same time as Menactra or Mengoc BC; same-day Bexsero and pneumococcal vaccination may increase fever or local reactions.",
        },
      },
      {
        id: "influenza",
        name: { vi: "Cúm mùa", en: "Seasonal influenza" },
        requiredAntigens: ["Influenza"],
        category: "service",
        doses: [
          { dose: 1, recommendedDays: months(6), minAgeDays: months(6), label: { vi: "Cúm mũi 1", en: "Influenza dose 1" } },
          {
            dose: 2,
            recommendedDays: months(7),
            minAgeDays: months(6),
            minIntervalDays: weeks(4),
            label: { vi: "Cúm mũi 2 nếu trẻ dưới 9 tuổi mới tiêm lần đầu", en: "Influenza dose 2 if first season under 9 years" },
          },
        ],
        note: {
          vi: "Theo lịch Long Châu: từ 6 tháng tuổi có thể tiêm cúm; trẻ dưới 9 tuổi lần đầu tiêm thường cần 2 mũi cách 1 tháng, sau đó nhắc hằng năm. Mốc nhắc hằng năm cần điểm tiêm đối chiếu theo mùa và lịch đã tiêm.",
          en: "Long Chau schedule: influenza can start from 6 months; children under 9 years receiving influenza vaccine for the first time usually need 2 doses 1 month apart, then annual vaccination. Annual boosters should be checked by season and history.",
        },
      },
      {
        id: "hepa",
        name: { vi: "Viêm gan A", en: "Hepatitis A" },
        requiredAntigens: ["HepA"],
        category: "service",
        doses: [
          { dose: 1, recommendedDays: months(12), minAgeDays: months(12), label: { vi: "Viêm gan A mũi 1", en: "Hepatitis A dose 1" } },
          {
            dose: 2,
            recommendedDays: months(18),
            minAgeDays: months(18),
            minIntervalDays: months(6),
            label: { vi: "Viêm gan A mũi 2", en: "Hepatitis A dose 2" },
          },
        ],
        note: {
          vi: "Avaxim/Havax thường tiêm từ 12 tháng tuổi, 2 mũi cách nhau tối thiểu 6 tháng; cần đối chiếu đúng sản phẩm và tuổi.",
          en: "Avaxim/Havax generally start from 12 months, with 2 doses at least 6 months apart; verify the exact product and age.",
        },
      },
      {
        id: "hepab",
        name: { vi: "Viêm gan A+B", en: "Hepatitis A+B" },
        requiredAntigens: ["HepA", "HepB"],
        category: "service",
        doses: [
          { dose: 1, recommendedDays: months(12), minAgeDays: months(12), label: { vi: "Twinrix mũi 1", en: "Twinrix dose 1" } },
          { dose: 2, recommendedDays: months(13), minAgeDays: months(12), minIntervalDays: weeks(4), label: { vi: "Twinrix mũi 2", en: "Twinrix dose 2" } },
          { dose: 3, recommendedDays: months(18), minAgeDays: months(12), minIntervalDays: months(5), label: { vi: "Twinrix mũi 3", en: "Twinrix dose 3" } },
        ],
        note: {
          vi: "Twinrix là vaccine phối hợp viêm gan A+B; lịch nhanh N0-N7-N21 là trường hợp riêng và không được app tự quy đổi.",
          en: "Twinrix is a combined hepatitis A+B vaccine; accelerated day 0-7-21 schedules are special cases and are not auto-converted here.",
        },
      },
      {
        id: "varicella",
        name: { vi: "Thủy đậu", en: "Varicella" },
        requiredAntigens: ["Varicella"],
        category: "service",
        doses: [
          { dose: 1, recommendedDays: months(12), minAgeDays: months(12), label: { vi: "Thủy đậu mũi 1", en: "Varicella dose 1" } },
          { dose: 2, recommendedDays: months(15), minAgeDays: months(12), minIntervalDays: months(3), label: { vi: "Thủy đậu mũi 2", en: "Varicella dose 2" } },
        ],
        note: {
          vi: "Varilrix/Varivax/Varicella/Barycela thường bắt đầu từ 12 tháng; mũi 2 cách mũi 1 tối thiểu 3 tháng ở trẻ nhỏ. Vaccine sống cần giữ khoảng cách với vaccine sống khác nếu không tiêm cùng ngày.",
          en: "Varilrix/Varivax/Varicella/Barycela generally start from 12 months; dose 2 is at least 3 months later in young children. Live vaccines need spacing if not given on the same day.",
        },
      },
      {
        id: "hpv",
        name: { vi: "HPV", en: "HPV" },
        requiredAntigens: ["HPV4"],
        category: "service",
        doses: [
          { dose: 1, recommendedDays: years(9), minAgeDays: years(9), label: { vi: "HPV mũi 1", en: "HPV dose 1" } },
          { dose: 2, recommendedDays: years(9) + months(6), minAgeDays: years(9), minIntervalDays: months(6), label: { vi: "HPV mũi 2", en: "HPV dose 2" } },
        ],
        note: {
          vi: "Gardasil 4/9 và Cervarix khác type bao phủ; số mũi phụ thuộc tuổi bắt đầu, sản phẩm và tình trạng miễn dịch.",
          en: "Gardasil 4/9 and Cervarix differ by covered HPV types; dose count depends on starting age, product, and immune status.",
        },
      },
      {
        id: "typhoid",
        name: { vi: "Thương hàn", en: "Typhoid" },
        requiredAntigens: ["Typhoid"],
        category: "service",
        doses: [
          { dose: 1, recommendedDays: years(2), minAgeDays: years(2), label: { vi: "Thương hàn một mũi", en: "Typhoid single dose" } },
        ],
        note: {
          vi: "Typhim Vi/vaccine thương hàn tiêm thường dùng từ 2 tuổi; nhắc lại theo nguy cơ phơi nhiễm và hướng dẫn tại điểm tiêm.",
          en: "Injectable typhoid vaccines generally start from 2 years; boosters depend on exposure risk and local clinic guidance.",
        },
      },
      {
        id: "cholera",
        name: { vi: "Tả", en: "Cholera" },
        requiredAntigens: ["Cholera"],
        category: "service",
        doses: [
          { dose: 1, recommendedDays: years(2), minAgeDays: years(2), label: { vi: "Tả liều 1", en: "Cholera dose 1" } },
          { dose: 2, recommendedDays: years(2) + weeks(2), minAgeDays: years(2), minIntervalDays: weeks(2), label: { vi: "Tả liều 2", en: "Cholera dose 2" } },
        ],
        note: {
          vi: "mORCVAX dùng đường uống, 2 liều cách đúng 14 ngày theo lưu ý Long Châu; không áp dụng tiêm sớm 2 ngày cho mũi này.",
          en: "mORCVAX is oral, 2 doses exactly 14 days apart per Long Chau notes; the 2-day early rule should not be applied here.",
        },
      },
      {
        id: "dengue",
        name: { vi: "Sốt xuất huyết", en: "Dengue" },
        requiredAntigens: ["Dengue"],
        category: "service",
        doses: [
          { dose: 1, recommendedDays: years(4), minAgeDays: years(4), label: { vi: "Qdenga mũi 1", en: "Qdenga dose 1" } },
          { dose: 2, recommendedDays: years(4) + months(3), minAgeDays: years(4), minIntervalDays: months(3), label: { vi: "Qdenga mũi 2", en: "Qdenga dose 2" } },
        ],
        note: {
          vi: "Qdenga phòng 4 týp Dengue; chỉ định cần đối chiếu tuổi, tiền sử bệnh và sàng lọc theo hướng dẫn tại thời điểm tiêm.",
          en: "Qdenga covers 4 dengue serotypes; indication should be checked against age, prior dengue history, and clinic screening.",
        },
      },
      {
        id: "zoster",
        name: { vi: "Zona thần kinh", en: "Zoster / shingles" },
        requiredAntigens: ["Zoster"],
        category: "service",
        doses: [
          { dose: 1, recommendedDays: years(50), minAgeDays: years(50), label: { vi: "Shingrix mũi 1", en: "Shingrix dose 1" } },
          { dose: 2, recommendedDays: years(50) + months(2), minAgeDays: years(50), minIntervalDays: months(2), label: { vi: "Shingrix mũi 2", en: "Shingrix dose 2" } },
        ],
        note: {
          vi: "Shingrix thường dùng từ 50 tuổi, hoặc từ 18 tuổi nếu suy giảm miễn dịch; trường hợp suy giảm miễn dịch cần bác sĩ chọn khoảng cách 1-2 tháng.",
          en: "Shingrix generally starts from 50 years, or from 18 years if immunocompromised; immunocompromised schedules need clinician-directed 1-2 month spacing.",
        },
      },
      {
        id: "rsv",
        name: { vi: "RSV", en: "RSV" },
        requiredAntigens: ["RSV"],
        category: "special",
        doses: [
          { dose: 1, recommendedDays: years(60), minAgeDays: years(60), label: { vi: "RSV người lớn từ 60 tuổi", en: "RSV from 60 years" } },
        ],
        note: {
          vi: "Arexvy/Abrysvo có chỉ định cho người từ 60 tuổi; Abrysvo trong thai kỳ cần biết tuổi thai 24-36 tuần và hồ sơ khám thai nên app không tự kết luận nếu chỉ có ngày sinh.",
          en: "Arexvy/Abrysvo may be indicated from 60 years; Abrysvo in pregnancy needs gestational age and obstetric records, so this app does not infer it from date of birth alone.",
        },
      },
    ],
  },
  {
    code: "US",
    name: { vi: "Hoa Kỳ", en: "United States" },
    scheduleName: {
      vi: "CDC/ACIP Child and Adolescent Immunization Schedule",
      en: "CDC/ACIP Child and Adolescent Immunization Schedule",
    },
    lastReviewed: todayIso,
    gracePeriodDays: 4,
    sources: [
      {
        title: "CDC Child and Adolescent Immunization Schedule by Age",
        url: "https://www.cdc.gov/vaccines/hcp/imz-schedules/child-adolescent-age.html",
        effective: "2025-07-02 addendum",
        reviewed: todayIso,
      },
      {
        title: "CDC Catch-up Immunization Schedule",
        url: "https://www.cdc.gov/vaccines/hcp/imz-schedules/child-adolescent-catch-up.html",
        effective: "2025-07-02 addendum",
        reviewed: todayIso,
      },
    ],
    groups: [
      {
        id: "hepbBirth",
        name: { vi: "Viêm gan B", en: "Hepatitis B" },
        requiredAntigens: ["HepB"],
        category: "routine",
        doses: [
          { dose: 1, recommendedDays: 0, minAgeDays: 0, label: { vi: "Liều sơ sinh", en: "Birth dose" } },
          { dose: 2, recommendedDays: months(1), minAgeDays: weeks(4), minIntervalDays: weeks(4), label: { vi: "Mũi 2", en: "Dose 2" } },
          { dose: 3, recommendedDays: months(6), minAgeDays: weeks(24), minIntervalDays: weeks(8), label: { vi: "Mũi 3", en: "Dose 3" } },
        ],
        note: {
          vi: "HepB có điều kiện khoảng cách riêng; công cụ này chỉ mô phỏng mức sơ bộ.",
          en: "HepB has detailed interval rules; this tool gives a preliminary model.",
        },
      },
      {
        id: "dtapIpvHibHepb",
        name: { vi: "DTaP-IPV-Hib-HepB", en: "DTaP-IPV-Hib-HepB" },
        requiredAntigens: ["DTaP", "IPV", "Hib", "HepB"],
        category: "routine",
        doses: [comboDose(1, months(2)), comboDose(2, months(4)), comboDose(3, months(6))],
        note: commonNotes.combo,
      },
      {
        id: "pcv",
        name: { vi: "Phế cầu PCV", en: "Pneumococcal conjugate vaccine" },
        requiredAntigens: ["PCV"],
        category: "routine",
        doses: [pcvDose(1, months(2)), pcvDose(2, months(4)), pcvDose(3, months(6)), pcvDose(4, months(12))],
        note: commonNotes.pcv,
      },
      {
        id: "rotavirus",
        name: { vi: "Rota", en: "Rotavirus" },
        requiredAntigens: ["Rotavirus"],
        category: "routine",
        doses: [rotaDose(1, months(2)), rotaDose(2, months(4))],
        note: commonNotes.rota,
      },
      {
        id: "mmr",
        name: { vi: "MMR", en: "MMR" },
        requiredAntigens: ["Measles", "Mumps", "Rubella"],
        category: "routine",
        doses: [
          { dose: 1, recommendedDays: months(12), minAgeDays: months(12), label: { vi: "Mũi 1", en: "Dose 1" } },
          { dose: 2, recommendedDays: years(4), minAgeDays: months(13), minIntervalDays: weeks(4), label: { vi: "Mũi 2", en: "Dose 2" } },
        ],
        note: {
          vi: "Liều 2 có thể ở 4-6 tuổi hoặc theo lịch catch-up.",
          en: "Dose 2 may be at 4-6 years or by catch-up rules.",
        },
      },
      {
        id: "influenza",
        name: { vi: "Cúm mùa", en: "Seasonal influenza" },
        requiredAntigens: ["Influenza"],
        category: "routine",
        doses: [
          { dose: 1, recommendedDays: months(6), minAgeDays: months(6), label: { vi: "Hằng năm từ 6 tháng", en: "Annual from 6 months" } },
        ],
        note: {
          vi: "Một số trẻ lần đầu tiêm cần 2 liều trong mùa đầu.",
          en: "Some children need 2 doses in their first influenza season.",
        },
      },
    ],
  },
  {
    code: "UK",
    name: { vi: "Vương quốc Anh", en: "United Kingdom" },
    scheduleName: {
      vi: "NHS / GOV.UK routine childhood immunisation schedule",
      en: "NHS / GOV.UK routine childhood immunisation schedule",
    },
    lastReviewed: todayIso,
    gracePeriodDays: 0,
    sources: [
      {
        title: "GOV.UK Routine childhood immunisation schedule",
        url: "https://www.gov.uk/government/publications/routine-childhood-immunisation-schedule",
        effective: "2026-01-01",
        reviewed: todayIso,
      },
    ],
    groups: [
      {
        id: "dtapIpvHibHepb",
        name: { vi: "6 trong 1", en: "6-in-1" },
        requiredAntigens: ["DTaP", "IPV", "Hib", "HepB"],
        category: "routine",
        doses: [comboDose(1, weeks(8)), comboDose(2, weeks(12)), comboDose(3, weeks(16))],
        note: commonNotes.combo,
      },
      {
        id: "meningococcal",
        name: { vi: "MenB", en: "MenB" },
        requiredAntigens: ["MenB"],
        category: "routine",
        doses: [pcvDose(1, weeks(8)), pcvDose(2, weeks(12))],
        note: {
          vi: "MenB và MenACWY không thay thế nhau.",
          en: "MenB and MenACWY are not substitutes.",
        },
      },
      {
        id: "rotavirus",
        name: { vi: "Rota", en: "Rotavirus" },
        requiredAntigens: ["Rotavirus"],
        category: "routine",
        doses: [rotaDose(1, weeks(8)), rotaDose(2, weeks(12))],
        note: commonNotes.rota,
      },
      {
        id: "pcv",
        name: { vi: "Phế cầu PCV", en: "Pneumococcal conjugate vaccine" },
        requiredAntigens: ["PCV"],
        category: "routine",
        doses: [pcvDose(1, weeks(16)), pcvDose(2, months(12))],
        note: commonNotes.pcv,
      },
      {
        id: "mmr",
        name: { vi: "MMR / MMRV", en: "MMR / MMRV" },
        requiredAntigens: ["Measles", "Mumps", "Rubella"],
        category: "routine",
        doses: [
          { dose: 1, recommendedDays: months(12), minAgeDays: months(12), label: { vi: "Mũi 1", en: "Dose 1" } },
          { dose: 2, recommendedDays: months(18), minAgeDays: months(18), minIntervalDays: weeks(4), label: { vi: "Mũi 2", en: "Dose 2" } },
        ],
        note: {
          vi: "Từ 01/01/2026 lịch có thêm mốc 18 tháng và MMRV trong routine offer.",
          en: "From 1 Jan 2026 the routine offer includes an 18-month visit and MMRV.",
        },
      },
    ],
  },
  {
    code: "AU",
    name: { vi: "Úc", en: "Australia" },
    scheduleName: {
      vi: "National Immunisation Program Schedule",
      en: "National Immunisation Program Schedule",
    },
    lastReviewed: todayIso,
    gracePeriodDays: 0,
    sources: [
      {
        title: "Australian Government National Immunisation Program schedule",
        url: "https://www.health.gov.au/resources/publications/national-immunisation-program-schedule?language=en",
        effective: "2026-06-23 publication",
        reviewed: todayIso,
      },
      {
        title: "Australian Immunisation Handbook: catch-up vaccination",
        url: "https://immunisationhandbook.health.gov.au/contents/catch-up-vaccination",
        effective: "Current digital handbook",
        reviewed: todayIso,
      },
    ],
    groups: [
      {
        id: "hepbBirth",
        name: { vi: "Viêm gan B sơ sinh", en: "Hepatitis B birth dose" },
        requiredAntigens: ["HepB"],
        category: "routine",
        doses: [{ dose: 1, recommendedDays: 0, minAgeDays: 0, label: { vi: "Liều sơ sinh", en: "Birth dose" } }],
        note: {
          vi: "Liều sơ sinh là một phần lịch NIP; cần đối chiếu các liều kết hợp sau đó.",
          en: "Birth dose is part of the NIP schedule; later combination doses are checked separately.",
        },
      },
      {
        id: "dtapIpvHibHepb",
        name: { vi: "DTPa-HepB-IPV-Hib", en: "DTPa-HepB-IPV-Hib" },
        requiredAntigens: ["DTaP", "IPV", "Hib", "HepB"],
        category: "routine",
        doses: [comboDose(1, months(2)), comboDose(2, months(4)), comboDose(3, months(6))],
        note: commonNotes.combo,
      },
      {
        id: "pcv",
        name: { vi: "Phế cầu PCV", en: "Pneumococcal conjugate vaccine" },
        requiredAntigens: ["PCV"],
        category: "routine",
        doses: [pcvDose(1, months(2)), pcvDose(2, months(4)), pcvDose(3, months(12))],
        note: commonNotes.pcv,
      },
      {
        id: "rotavirus",
        name: { vi: "Rota", en: "Rotavirus" },
        requiredAntigens: ["Rotavirus"],
        category: "routine",
        doses: [rotaDose(1, months(2)), rotaDose(2, months(4))],
        note: commonNotes.rota,
      },
      {
        id: "mmr",
        name: { vi: "MMR / MMRV", en: "MMR / MMRV" },
        requiredAntigens: ["Measles", "Mumps", "Rubella"],
        category: "routine",
        doses: [
          { dose: 1, recommendedDays: months(12), minAgeDays: months(12), label: { vi: "MMR", en: "MMR" } },
          { dose: 2, recommendedDays: months(18), minAgeDays: months(18), minIntervalDays: weeks(4), label: { vi: "MMRV", en: "MMRV" } },
        ],
        note: {
          vi: "MMRV thường nằm ở mốc 18 tháng trong NIP.",
          en: "MMRV is commonly scheduled at 18 months in the NIP.",
        },
      },
      {
        id: "influenza",
        name: { vi: "Cúm mùa", en: "Seasonal influenza" },
        requiredAntigens: ["Influenza"],
        category: "routine",
        doses: [
          { dose: 1, recommendedDays: months(6), minAgeDays: months(6), label: { vi: "Hằng năm từ 6 tháng", en: "Annual from 6 months" } },
        ],
        note: {
          vi: "NIP có điều kiện tài trợ theo nhóm tuổi/nguy cơ; cần kiểm tra bang/lãnh thổ.",
          en: "NIP funding may depend on age/risk group; check state/territory guidance.",
        },
      },
    ],
  },
];

export const countryOptions = countryProfiles.map((profile) => ({
  value: profile.code,
  label: profile.name,
}));

export const healthConditions = [
  {
    id: "healthy",
    label: { vi: "Khỏe, không triệu chứng đáng kể", en: "Well, no significant symptoms" },
    severity: "none",
  },
  {
    id: "mild-cold",
    label: { vi: "Sổ mũi/ho nhẹ", en: "Mild cough/runny nose" },
    severity: "caution",
  },
  {
    id: "fever",
    label: { vi: "Sốt hoặc bệnh cấp tính vừa/nặng", en: "Fever or moderate/severe acute illness" },
    severity: "doctor",
  },
  {
    id: "diarrhea",
    label: { vi: "Tiêu chảy/nôn ói", en: "Diarrhea/vomiting" },
    severity: "doctor",
  },
  {
    id: "allergy",
    label: { vi: "Từng phản vệ/dị ứng nặng sau tiêm", en: "Prior anaphylaxis/severe vaccine allergy" },
    severity: "doctor",
  },
  {
    id: "immunocompromised",
    label: { vi: "Suy giảm miễn dịch/đang dùng thuốc ức chế miễn dịch", en: "Immunocompromised or immunosuppressive therapy" },
    severity: "doctor",
  },
  {
    id: "premature",
    label: { vi: "Sinh non/nhẹ cân", en: "Premature birth/low birth weight" },
    severity: "doctor",
  },
  {
    id: "chronic",
    label: { vi: "Bệnh nền mạn tính", en: "Chronic medical condition" },
    severity: "doctor",
  },
] as const;
