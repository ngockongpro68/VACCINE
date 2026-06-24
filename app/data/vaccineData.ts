export type Language = "vi" | "en";

export type CountryCode = "VN" | "US" | "UK" | "AU";

export type Antigen =
  | "DTaP"
  | "DTP"
  | "IPV"
  | "OPV"
  | "Hib"
  | "HepA"
  | "HepB"
  | "Tetanus"
  | "BCG"
  | "Measles"
  | "Mumps"
  | "Rubella"
  | "Varicella"
  | "Rotavirus"
  | "PCV"
  | "MenB"
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
  | "pcv"
  | "rotavirus"
  | "mmr"
  | "influenza"
  | "je"
  | "hpv"
  | "meningococcal"
  | "hepa"
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

export const todayIso = "2026-06-23";

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
    antigens: ["HPV9"],
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
    groupIds: ["meningococcal"],
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
    groupIds: ["meningococcal"],
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
];

const commonNotes = {
  combo: {
    vi: "Nhóm phối hợp cần tính theo kháng nguyên, không chỉ theo tên thương mại.",
    en: "Combination vaccines are counted by antigens, not only by brand name.",
  },
  rota: {
    vi: "Rota có giới hạn tuổi bắt đầu/kết thúc; nếu trễ hoặc đổi sản phẩm cần bác sĩ đánh giá.",
    en: "Rotavirus has start/end age limits; delays or product switching need clinician review.",
  },
  pcv: {
    vi: "PCV có thể khác type huyết thanh theo sản phẩm và quốc gia.",
    en: "PCV serotype coverage can differ by product and country.",
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
        name: { vi: "Nhóm 5/6 trong 1", en: "DTP/DTaP-Hib-HepB-containing series" },
        requiredAntigens: ["Hib", "HepB"],
        category: "routine",
        doses: [comboDose(1, months(2)), comboDose(2, months(3)), comboDose(3, months(4))],
        note: commonNotes.combo,
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
        name: { vi: "DTaP/IPV/Hib/HepB", en: "DTaP/IPV/Hib/HepB-containing" },
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
