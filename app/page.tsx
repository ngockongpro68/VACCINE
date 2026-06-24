"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  countryProfiles,
  healthConditions,
  todayIso,
  type CountryCode,
  type Language,
  type VaccineProduct,
  vaccineProducts,
} from "./data/vaccineData";
import {
  assessVaccines,
  checkSubstitution,
  getCountryProfile,
  productDisplayName,
  toInputDate,
  type DoseAssessment,
  type DoseStatus,
  type VaccinationRecord,
} from "./lib/vaccineEngine";

type Tab = "checker" | "switch" | "diseases" | "sources";

const copy = {
  vi: {
    appName: "Vaccine Check",
    tagline: "Đúng vắc xin. Đúng thời điểm.",
    headline: "Hôm nay bạn cần vắc xin nào?",
    subhead:
      "Nhập vài thông tin cơ bản để xem mũi nào đang tới hạn, mũi nào nên chờ thêm và mũi nào cần hỏi kỹ tại điểm tiêm.",
    country: "Quốc gia áp dụng lịch",
    language: "Ngôn ngữ",
    birthDate: "Ngày sinh",
    checkDate: "Ngày kiểm tra",
    health: "Tình trạng hiện tại",
    history: "Lịch sử đã tiêm",
    product: "Vaccine đã tiêm",
    doseDate: "Ngày tiêm",
    addDose: "Thêm mũi",
    remove: "Xóa",
    noHistory: "Chưa nhập lịch sử tiêm. Kết quả sẽ xem như chưa có mũi nào được ghi nhận.",
    result: "Kết quả hôm nay",
    childAge: "Tuổi hiện tại",
    schedule: "Lịch đang dùng",
    due: "Đến lịch",
    catchUp: "Tiêm bù",
    upcoming: "Sắp tới",
    notEligible: "Chưa đủ điều kiện",
    doctorReview: "Cần bác sĩ đánh giá",
    completed: "Đã đủ trong mô hình",
    recommended: "Mốc khuyến cáo",
    earliest: "Ngày sớm nhất có thể hợp lệ",
    validDoses: "Mũi hợp lệ đã ghi nhận",
    invalidDoses: "Mũi cần kiểm tra lại",
    routine: "Lịch routine",
    service: "Dịch vụ/ngoài routine",
    special: "Nhóm đặc biệt",
    warningTitle: "Cảnh báo sàng lọc",
    disclaimer:
      "Công cụ này chỉ cung cấp thông tin tham khảo, không thay thế khám sàng lọc và quyết định của bác sĩ hoặc cơ sở tiêm chủng. Lịch tiêm có thể thay đổi theo quốc gia, bang/tỉnh, sản phẩm và tình trạng sức khỏe thực tế.",
    tabChecker: "Kiểm tra lịch",
    tabSwitch: "Đổi vaccine",
    tabDiseases: "Theo bệnh",
    tabSources: "Nguồn",
    diseaseTitle: "Danh sách bệnh có thể phòng ngừa bằng vaccine",
    diseaseIntro:
      "Chọn một bệnh hoặc nhóm tác nhân ở cột trái để xem các vaccine đang có trong dữ liệu hiện tại và type/chủng được bao phủ.",
    diseaseProducts: "Vaccine có thể phòng bệnh này",
    diseaseCoverage: "Type/chủng/thành phần bao phủ",
    diseaseNote: "Ghi chú sử dụng",
    quickShareTitle: "Tóm tắt dễ gửi cho gia đình",
    quickShareHint: "Không dùng tên hay ngày sinh đầy đủ, chỉ giữ thông tin đủ để trao đổi với bác sĩ.",
    askDoctorTitle: "Câu hỏi nên hỏi bác sĩ",
    compareTitle: "So sánh lịch giữa 2 quốc gia",
    compareIntro: "Hữu ích khi bé đã tiêm ở một nước rồi chuyển sang nước khác.",
    compareFrom: "Đã tiêm theo lịch",
    compareTo: "Muốn đối chiếu sang",
    compareResult: "Điểm cần đối chiếu",
    mythTitle: "Hiểu đúng nhanh",
    adultTitle: "Người lớn & thai kỳ",
    adultIntro: "Tên Vaccine Check có thể mở rộng cho người lớn, thai kỳ, du lịch và nhóm nguy cơ mà không làm rối trải nghiệm hiện tại.",
    trustTitle: "Vì sao có thể tin tưởng hơn",
    switchTitle: "Kiểm tra 2 vaccine có thể thay thế nhau không",
    previousProduct: "Vaccine đã dùng trước đó",
    candidateProduct: "Vaccine hiện có",
    shared: "Thành phần chung",
    missing: "Thiếu so với mũi trước",
    added: "Thành phần thêm",
    sourceTitle: "Nguồn và ngày hiệu lực",
    reviewed: "Website rà soát",
    effective: "Hiệu lực/cập nhật",
    prototypeNote:
      "Dữ liệu cần được bác sĩ hoặc đơn vị chuyên môn duyệt trước khi dùng trong thực tế.",
  },
  en: {
    appName: "Vaccine Check",
    tagline: "Right vaccine. Right time.",
    headline: "Which vaccines do you need today?",
    subhead:
      "Enter a few basic details to see what may be due, what may need more time, and what should be checked at the clinic.",
    country: "Schedule country",
    language: "Language",
    birthDate: "Date of birth",
    checkDate: "Check date",
    health: "Current condition",
    history: "Vaccination history",
    product: "Vaccine received",
    doseDate: "Dose date",
    addDose: "Add dose",
    remove: "Remove",
    noHistory: "No vaccination history entered. Results assume no recorded valid doses.",
    result: "Today's result",
    childAge: "Current age",
    schedule: "Schedule profile",
    due: "Due now",
    catchUp: "Catch-up",
    upcoming: "Upcoming",
    notEligible: "Not eligible yet",
    doctorReview: "Ask doctor first",
    completed: "Completed in model",
    recommended: "Recommended date",
    earliest: "Earliest valid date",
    validDoses: "Recorded valid doses",
    invalidDoses: "Doses to re-check",
    routine: "Routine",
    service: "Service/non-routine",
    special: "Special group",
    warningTitle: "Screening warning",
    disclaimer:
      "This tool provides educational information only. It does not replace clinical screening or decisions by a qualified healthcare professional or vaccination provider. Schedules can vary by country, state/province, product, and the child's real health status.",
    tabChecker: "Schedule check",
    tabSwitch: "Vaccine switch",
    tabDiseases: "By disease",
    tabSources: "Sources",
    diseaseTitle: "Vaccine-preventable disease list",
    diseaseIntro:
      "Choose a disease or pathogen group on the left to see vaccine products in the current data and the strains/types they cover.",
    diseaseProducts: "Vaccines that may prevent this disease",
    diseaseCoverage: "Covered strains/types/components",
    diseaseNote: "Use note",
    quickShareTitle: "A family-friendly summary",
    quickShareHint: "No full name or full date of birth, just enough context to discuss with a clinician.",
    askDoctorTitle: "Questions to ask your clinician",
    compareTitle: "Compare schedules between countries",
    compareIntro: "Useful when a child started vaccines in one country and moved to another.",
    compareFrom: "Started with",
    compareTo: "Compare to",
    compareResult: "What to check",
    mythTitle: "Quick clarity",
    adultTitle: "Adults & pregnancy",
    adultIntro: "Vaccine Check can grow into adults, pregnancy, travel, and risk-group guidance without making this screen busy.",
    trustTitle: "Why this feels safer",
    switchTitle: "Check whether two vaccine products may be interchangeable",
    previousProduct: "Previously used vaccine",
    candidateProduct: "Currently available vaccine",
    shared: "Shared components",
    missing: "Missing from candidate",
    added: "Added components",
    sourceTitle: "Sources and effective dates",
    reviewed: "Website reviewed",
    effective: "Effective/updated",
    prototypeNote:
      "This data needs expert clinical review before real-world use.",
  },
};

const statusClass: Record<DoseStatus, string> = {
  due: "status status-due",
  "catch-up": "status status-catchup",
  upcoming: "status status-upcoming",
  "not-eligible": "status status-ineligible",
  completed: "status status-complete",
  "doctor-review": "status status-doctor",
};

function statusLabel(status: DoseStatus, language: Language) {
  const t = copy[language];
  const labels: Record<DoseStatus, string> = {
    due: t.due,
    "catch-up": t.catchUp,
    upcoming: t.upcoming,
    "not-eligible": t.notEligible,
    completed: t.completed,
    "doctor-review": t.doctorReview,
  };
  return labels[status];
}

function categoryLabel(category: DoseAssessment["category"], language: Language) {
  const t = copy[language];
  return category === "routine" ? t.routine : category === "service" ? t.service : t.special;
}

const productTargets: Record<string, Record<Language, string>> = {
  hexaxim: {
    vi: "6 trong 1: bạch hầu, uốn ván, ho gà, bại liệt, Hib, viêm gan B",
    en: "6-in-1: diphtheria, tetanus, pertussis, polio, Hib, hepatitis B",
  },
  "infanrix-hexa": {
    vi: "6 trong 1: bạch hầu, uốn ván, ho gà, bại liệt, Hib, viêm gan B",
    en: "6-in-1: diphtheria, tetanus, pertussis, polio, Hib, hepatitis B",
  },
  vaxelis: {
    vi: "6 trong 1: bạch hầu, uốn ván, ho gà, bại liệt, Hib, viêm gan B",
    en: "6-in-1: diphtheria, tetanus, pertussis, polio, Hib, hepatitis B",
  },
  pentaxim: {
    vi: "5 trong 1: bạch hầu, uốn ván, ho gà, bại liệt, Hib",
    en: "5-in-1: diphtheria, tetanus, pertussis, polio, Hib",
  },
  "epi-5in1": {
    vi: "bạch hầu, uốn ván, ho gà, Hib, viêm gan B",
    en: "EPI 5-in-1: diphtheria, tetanus, pertussis, Hib, hepatitis B",
  },
  "prevenar-13": { vi: "Phế cầu", en: "Pneumococcal disease" },
  "prevenar-20": { vi: "Phế cầu", en: "Pneumococcal disease" },
  synflorix: { vi: "Phế cầu", en: "Pneumococcal disease" },
  rotarix: { vi: "Rota", en: "Rotavirus" },
  rotateq: { vi: "Rota", en: "Rotavirus" },
  mmr: { vi: "Sởi, quai bị, rubella", en: "Measles, mumps, rubella" },
  mmrv: { vi: "Sởi, quai bị, rubella, thủy đậu", en: "Measles, mumps, rubella, varicella" },
  "gardasil-4": { vi: "HPV", en: "HPV" },
  "gardasil-9": { vi: "HPV", en: "HPV" },
  bexsero: { vi: "Não mô cầu B", en: "Meningococcal B" },
  menacwy: { vi: "Não mô cầu ACWY", en: "Meningococcal ACWY" },
  "hepb-mono": { vi: "Viêm gan B", en: "Hepatitis B" },
  "hepa-mono": { vi: "Viêm gan A", en: "Hepatitis A" },
  varicella: { vi: "Thủy đậu", en: "Varicella" },
  "measles-single": { vi: "Sởi đơn", en: "Measles only" },
  shingrix: { vi: "Zona", en: "Zoster / shingles" },
  rsv: { vi: "RSV", en: "RSV" },
  rabies: { vi: "Dại", en: "Rabies" },
  "tetanus-single": { vi: "Uốn ván", en: "Tetanus" },
};

function productOptionLabel(product: VaccineProduct, language: Language) {
  const target = productTargets[product.id]?.[language];
  const name = productDisplayName(product, language);
  return target ? `${name} - ${target}` : name;
}

type DiseaseCatalogItem = {
  id: string;
  label: Record<Language, string>;
  description: Record<Language, string>;
  products: Array<{
    name: string;
    displayName?: Record<Language, string>;
    coverage: Record<Language, string>;
    note: Record<Language, string>;
  }>;
};

const diseaseCatalog: DiseaseCatalogItem[] = [
  {
    id: "pneumococcal",
    label: { vi: "Phế cầu", en: "Pneumococcal disease" },
    description: {
      vi: "Nhóm vaccine phế cầu liên hợp. Các sản phẩm khác nhau ở số type huyết thanh bao phủ.",
      en: "Pneumococcal conjugate vaccines. Products differ by covered serotypes.",
    },
    products: [
      {
        name: "Synflorix",
        coverage: {
          vi: "PCV10: 1, 4, 5, 6B, 7F, 9V, 14, 18C, 19F, 23F",
          en: "PCV10: 1, 4, 5, 6B, 7F, 9V, 14, 18C, 19F, 23F",
        },
        note: {
          vi: "Cùng nhóm PCV nhưng không tự động tương đương với PCV13/20 trong mọi lịch.",
          en: "Same PCV group, but not automatically identical to PCV13/20 in every schedule.",
        },
      },
      {
        name: "Prevenar 13",
        coverage: {
          vi: "PCV13: 1, 3, 4, 5, 6A, 6B, 7F, 9V, 14, 18C, 19A, 19F, 23F",
          en: "PCV13: 1, 3, 4, 5, 6A, 6B, 7F, 9V, 14, 18C, 19A, 19F, 23F",
        },
        note: {
          vi: "Cần đối chiếu lịch quốc gia, tuổi và mũi PCV đã tiêm trước đó.",
          en: "Check national schedule, age, and prior PCV doses.",
        },
      },
      {
        name: "Prevenar 20",
        coverage: {
          vi: "PCV20: PCV13 + 8, 10A, 11A, 12F, 15B, 22F, 33F",
          en: "PCV20: PCV13 + 8, 10A, 11A, 12F, 15B, 22F, 33F",
        },
        note: {
          vi: "Chỉ định theo tuổi/quốc gia có thể khác PCV10/13.",
          en: "Age and country indications may differ from PCV10/13.",
        },
      },
    ],
  },
  {
    id: "hpv",
    label: { vi: "HPV", en: "HPV" },
    description: {
      vi: "Vaccine HPV khác nhau ở số type HPV bao phủ.",
      en: "HPV vaccines differ by covered HPV types.",
    },
    products: [
      {
        name: "Gardasil 4",
        coverage: { vi: "HPV type 6, 11, 16, 18", en: "HPV types 6, 11, 16, 18" },
        note: {
          vi: "Bao phủ type nguy cơ thấp 6/11 và nguy cơ cao 16/18.",
          en: "Covers low-risk 6/11 and high-risk 16/18.",
        },
      },
      {
        name: "Gardasil 9",
        coverage: {
          vi: "HPV type 6, 11, 16, 18, 31, 33, 45, 52, 58",
          en: "HPV types 6, 11, 16, 18, 31, 33, 45, 52, 58",
        },
        note: {
          vi: "Bao phủ rộng hơn Gardasil 4; lịch theo tuổi và khuyến cáo quốc gia.",
          en: "Broader coverage than Gardasil 4; schedule depends on age and national guidance.",
        },
      },
    ],
  },
  {
    id: "hepb",
    label: { vi: "Viêm gan B", en: "Hepatitis B" },
    description: {
      vi: "Có vaccine đơn và vaccine phối hợp chứa thành phần viêm gan B.",
      en: "Available as single-antigen vaccine or combination vaccines containing HepB.",
    },
    products: [
      {
        name: "Vaccine viêm gan B đơn",
        displayName: { vi: "Vaccine viêm gan B đơn", en: "Single-antigen hepatitis B vaccine" },
        coverage: { vi: "Kháng nguyên viêm gan B", en: "Hepatitis B antigen" },
        note: {
          vi: "Dùng cho liều sơ sinh hoặc các liều riêng tùy lịch.",
          en: "Used for birth dose or separate doses depending on schedule.",
        },
      },
      {
        name: "Hexaxim / Infanrix Hexa / Vaxelis",
        coverage: {
          vi: "6 trong 1: DTaP, IPV, Hib, viêm gan B",
          en: "6-in-1: DTaP, IPV, Hib, hepatitis B",
        },
        note: {
          vi: "Khi nhập lịch sử, hệ thống tính theo thành phần HepB trong vaccine phối hợp.",
          en: "History is counted by the HepB component inside the combination product.",
        },
      },
      {
        name: "5 trong 1 TCMR",
        displayName: { vi: "5 trong 1 TCMR", en: "EPI 5-in-1" },
        coverage: {
          vi: "DTP, Hib, viêm gan B tùy sản phẩm chương trình",
          en: "DTP, Hib, HepB depending on programme product",
        },
        note: {
          vi: "Cần đối chiếu sổ tiêm vì thành phần có thể thay đổi theo chương trình.",
          en: "Check the record because exact components may vary by programme.",
        },
      },
    ],
  },
  {
    id: "hepa",
    label: { vi: "Viêm gan A", en: "Hepatitis A" },
    description: {
      vi: "Vaccine viêm gan A có thể dùng theo lịch dịch vụ hoặc nhóm nguy cơ.",
      en: "Hepatitis A vaccine may be used in private/service schedules or risk groups.",
    },
    products: [
      {
        name: "Vaccine viêm gan A",
        displayName: { vi: "Vaccine viêm gan A", en: "Hepatitis A vaccine" },
        coverage: { vi: "Kháng nguyên viêm gan A", en: "Hepatitis A antigen" },
        note: {
          vi: "Lịch và số liều phụ thuộc sản phẩm, tuổi và quốc gia.",
          en: "Schedule and dose count depend on product, age, and country.",
        },
      },
    ],
  },
  {
    id: "combination",
    label: { vi: "Bạch hầu, uốn ván, ho gà, bại liệt, Hib", en: "Diphtheria, tetanus, pertussis, polio, Hib" },
    description: {
      vi: "Nhóm bệnh thường nằm trong vaccine phối hợp 5 trong 1 hoặc 6 trong 1.",
      en: "These diseases are commonly covered by 5-in-1 or 6-in-1 combination vaccines.",
    },
    products: [
      {
        name: "Pentaxim",
        coverage: { vi: "DTaP, IPV, Hib", en: "DTaP, IPV, Hib" },
        note: { vi: "Không chứa viêm gan B.", en: "Does not contain hepatitis B." },
      },
      {
        name: "Hexaxim / Infanrix Hexa / Vaxelis",
        coverage: { vi: "DTaP, IPV, Hib, viêm gan B", en: "DTaP, IPV, Hib, hepatitis B" },
        note: {
          vi: "Cùng nhóm 6 trong 1 nhưng cần đối chiếu tuổi, khoảng cách và quốc gia.",
          en: "Same 6-in-1 group, but check age, interval, and country.",
        },
      },
      {
        name: "5 trong 1 TCMR",
        displayName: { vi: "5 trong 1 TCMR", en: "EPI 5-in-1" },
        coverage: { vi: "DTP, Hib, viêm gan B tùy sản phẩm", en: "DTP, Hib, HepB depending on product" },
        note: { vi: "Cần đọc tên/thành phần trong sổ tiêm.", en: "Read the exact product/components in the record." },
      },
    ],
  },
  {
    id: "tetanus",
    label: { vi: "Uốn ván", en: "Tetanus" },
    description: {
      vi: "Có vaccine uốn ván đơn và vaccine phối hợp chứa thành phần uốn ván.",
      en: "Available as single-antigen tetanus vaccine and combination products containing tetanus.",
    },
    products: [
      {
        name: "Vaccine uốn ván đơn",
        displayName: { vi: "Vaccine uốn ván đơn", en: "Single-antigen tetanus vaccine" },
        coverage: { vi: "Giải độc tố uốn ván", en: "Tetanus toxoid" },
        note: {
          vi: "Thường dùng trong xử trí vết thương, thai kỳ hoặc mũi nhắc; cần bác sĩ đánh giá theo tiền sử tiêm.",
          en: "Often used for wound management, pregnancy, or boosters; clinician review depends on history.",
        },
      },
      {
        name: "Pentaxim / Hexaxim / Infanrix Hexa / Vaxelis / 5 trong 1 TCMR",
        displayName: {
          vi: "Pentaxim / Hexaxim / Infanrix Hexa / Vaxelis / 5 trong 1 TCMR",
          en: "Pentaxim / Hexaxim / Infanrix Hexa / Vaxelis / EPI 5-in-1",
        },
        coverage: { vi: "Có thành phần uốn ván trong vaccine phối hợp", en: "Contains tetanus component in combination vaccine" },
        note: { vi: "Không thay thế tự động mọi chỉ định uốn ván đơn.", en: "Does not automatically replace every single-antigen tetanus indication." },
      },
    ],
  },
  {
    id: "rotavirus",
    label: { vi: "Rota", en: "Rotavirus" },
    description: {
      vi: "Vaccine rota khác nhau về số liều và chủng/type trong sản phẩm.",
      en: "Rotavirus products differ in dose count and vaccine strains/types.",
    },
    products: [
      {
        name: "Rotarix",
        coverage: { vi: "Rota người chủng G1P[8]", en: "Human rotavirus strain G1P[8]" },
        note: { vi: "Thường là phác đồ 2 liều; có giới hạn tuổi bắt đầu/kết thúc.", en: "Commonly 2 doses; start/end age limits apply." },
      },
      {
        name: "RotaTeq",
        coverage: { vi: "G1, G2, G3, G4 và P[8]", en: "G1, G2, G3, G4, and P[8]" },
        note: { vi: "Thường là phác đồ 3 liều; đổi sản phẩm cần đánh giá.", en: "Commonly 3 doses; product switching needs review." },
      },
    ],
  },
  {
    id: "measles-mmr",
    label: { vi: "Sởi, quai bị, rubella", en: "Measles, mumps, rubella" },
    description: {
      vi: "Có vaccine sởi đơn và vaccine phối hợp MMR/MMRV.",
      en: "Available as measles-only and MMR/MMRV combination vaccines.",
    },
    products: [
      {
        name: "Vaccine sởi đơn",
        displayName: { vi: "Vaccine sởi đơn", en: "Measles-only vaccine" },
        coverage: { vi: "Sởi", en: "Measles" },
        note: { vi: "Không bao phủ quai bị/rubella.", en: "Does not cover mumps/rubella." },
      },
      {
        name: "MMR",
        coverage: { vi: "Sởi, quai bị, rubella", en: "Measles, mumps, rubella" },
        note: {
          vi: "Vaccine sống giảm độc lực; cần chú ý miễn dịch và khoảng cách vaccine sống.",
          en: "Live attenuated vaccine; consider immune status and live-vaccine spacing.",
        },
      },
      {
        name: "MMRV",
        coverage: { vi: "Sởi, quai bị, rubella, thủy đậu", en: "Measles, mumps, rubella, varicella" },
        note: { vi: "Có thêm thành phần thủy đậu.", en: "Adds varicella component." },
      },
    ],
  },
  {
    id: "varicella",
    label: { vi: "Thủy đậu", en: "Varicella" },
    description: {
      vi: "Có vaccine thủy đậu đơn và MMRV.",
      en: "Available as single varicella vaccine and MMRV.",
    },
    products: [
      {
        name: "Vaccine thủy đậu",
        displayName: { vi: "Vaccine thủy đậu", en: "Varicella vaccine" },
        coverage: { vi: "Varicella-zoster virus phòng thủy đậu", en: "Varicella-zoster virus for chickenpox prevention" },
        note: { vi: "Vaccine sống giảm độc lực; cần sàng lọc miễn dịch.", en: "Live attenuated vaccine; immune screening is needed." },
      },
      {
        name: "MMRV",
        coverage: { vi: "Sởi, quai bị, rubella, thủy đậu", en: "Measles, mumps, rubella, varicella" },
        note: { vi: "Dùng theo lịch/quốc gia và độ tuổi phù hợp.", en: "Use depends on schedule/country and age." },
      },
    ],
  },
  {
    id: "meningococcal",
    label: { vi: "Não mô cầu", en: "Meningococcal disease" },
    description: {
      vi: "MenB và MenACWY phòng các nhóm huyết thanh khác nhau, không thay thế nhau.",
      en: "MenB and MenACWY cover different serogroups and are not substitutes.",
    },
    products: [
      {
        name: "Bexsero",
        coverage: { vi: "Não mô cầu nhóm B", en: "Meningococcal group B" },
        note: { vi: "Không thay thế MenACWY.", en: "Does not replace MenACWY." },
      },
      {
        name: "MenACWY",
        coverage: { vi: "Não mô cầu nhóm A, C, W, Y", en: "Meningococcal groups A, C, W, Y" },
        note: { vi: "Không thay thế MenB.", en: "Does not replace MenB." },
      },
    ],
  },
  {
    id: "rabies",
    label: { vi: "Dại", en: "Rabies" },
    description: {
      vi: "Vaccine dại dùng theo phác đồ trước phơi nhiễm hoặc sau phơi nhiễm.",
      en: "Rabies vaccine is used in pre-exposure or post-exposure schedules.",
    },
    products: [
      {
        name: "Vaccine dại",
        displayName: { vi: "Vaccine dại", en: "Rabies vaccine" },
        coverage: { vi: "Virus dại", en: "Rabies virus" },
        note: {
          vi: "Sau phơi nhiễm cần đánh giá vết thương, lịch tiêm trước đó và huyết thanh kháng dại nếu có chỉ định.",
          en: "Post-exposure care requires wound assessment, prior vaccine history, and rabies immunoglobulin when indicated.",
        },
      },
    ],
  },
  {
    id: "influenza",
    label: { vi: "Cúm mùa", en: "Seasonal influenza" },
    description: {
      vi: "Thành phần vaccine cúm thay đổi theo mùa và bán cầu.",
      en: "Influenza vaccine composition changes by season and hemisphere.",
    },
    products: [
      {
        name: "Vaccine cúm mùa",
        displayName: { vi: "Vaccine cúm mùa", en: "Seasonal influenza vaccine" },
        coverage: {
          vi: "Thường gồm cúm A(H1N1), A(H3N2) và cúm B theo khuyến cáo mùa hiện hành",
          en: "Usually includes influenza A(H1N1), A(H3N2), and influenza B strains for the current season",
        },
        note: { vi: "Cần cập nhật theo mùa/năm và quốc gia.", en: "Needs season/year and country-specific update." },
      },
    ],
  },
  {
    id: "zoster",
    label: { vi: "Zona", en: "Zoster / shingles" },
    description: {
      vi: "Vaccine zona thường dành cho người lớn hoặc nhóm nguy cơ.",
      en: "Zoster vaccines are usually for adults or risk groups.",
    },
    products: [
      {
        name: "Shingrix",
        coverage: { vi: "Varicella-zoster virus glycoprotein E", en: "Varicella-zoster virus glycoprotein E" },
        note: { vi: "Không phải vaccine routine cho trẻ em.", en: "Not a routine childhood vaccine." },
      },
    ],
  },
  {
    id: "rsv",
    label: { vi: "RSV", en: "RSV" },
    description: {
      vi: "RSV có chỉ định theo tuổi, thai kỳ, mùa dịch và nguy cơ.",
      en: "RSV prevention depends on age, pregnancy status, season, and risk.",
    },
    products: [
      {
        name: "Vaccine RSV",
        displayName: { vi: "Vaccine RSV", en: "RSV vaccine" },
        coverage: {
          vi: "RSV protein F trước hợp nhất, bao phủ RSV A/B tùy sản phẩm",
          en: "Prefusion RSV F protein, RSV A/B coverage depending on product",
        },
        note: { vi: "Cần bác sĩ đánh giá chỉ định cụ thể.", en: "Clinician review is needed for specific indication." },
      },
    ],
  },
];

const mythCards: Record<Language, Array<{ title: string; body: string }>> = {
  vi: [
    {
      title: "Trễ lịch thường không có nghĩa là tiêm lại từ đầu",
      body: "Nếu mũi trước hợp lệ, bác sĩ thường tính tiếp từ mũi còn thiếu và kiểm tra khoảng cách tối thiểu.",
    },
    {
      title: "Đổi hãng không phải lúc nào cũng sai",
      body: "Điểm quan trọng là thành phần kháng nguyên, tuổi, khoảng cách mũi và sản phẩm có được dùng tại quốc gia đó không.",
    },
    {
      title: "Tiêm quá sớm có thể không được tính",
      body: "Một số lịch có khoảng linh động rất nhỏ, nhưng không nên chủ động hẹn sớm nếu chưa cần.",
    },
  ],
  en: [
    {
      title: "Being late usually does not mean restarting",
      body: "If previous doses count, clinicians usually continue from the missing dose and check minimum intervals.",
    },
    {
      title: "Changing brands is not always wrong",
      body: "The key checks are antigen components, age, dose spacing, and whether the product is used locally.",
    },
    {
      title: "Too early may not count",
      body: "Some schedules allow a tiny grace window, but early appointments should not be planned casually.",
    },
  ],
};

function compareNotes(from: CountryCode, to: CountryCode, language: Language) {
  const fromProfile = getCountryProfile(from);
  const toProfile = getCountryProfile(to);
  const sharedGroups = fromProfile.groups.filter((group) => toProfile.groups.some((item) => item.id === group.id));
  const toOnlyGroups = toProfile.groups.filter((group) => !fromProfile.groups.some((item) => item.id === group.id));

  return {
    title:
      language === "vi"
        ? `${fromProfile.name.vi} sang ${toProfile.name.vi}`
        : `${fromProfile.name.en} to ${toProfile.name.en}`,
    shared:
      sharedGroups.map((group) => group.name[language]).slice(0, 4).join(", ") ||
      (language === "vi" ? "Cần nhập thêm dữ liệu" : "Needs more data"),
    toOnly:
      toOnlyGroups.map((group) => group.name[language]).slice(0, 4).join(", ") ||
      (language === "vi" ? "Không có khác biệt lớn trong dữ liệu hiện tại" : "No major difference in the current data"),
    reminder:
      language === "vi"
        ? "Khi chuyển quốc gia, nên quy đổi theo kháng nguyên đã tiêm, không chỉ theo tên thương mại."
        : "When moving countries, compare by antigens received, not only by brand names.",
  };
}

function defaultDate(daysAgo: number) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return toInputDate(date);
}

export default function Home() {
  const [language, setLanguage] = useState<Language>("vi");
  const [tab, setTab] = useState<Tab>("checker");
  const [country, setCountry] = useState<CountryCode>("VN");
  const [birthDate, setBirthDate] = useState(defaultDate(135));
  const [checkDate, setCheckDate] = useState(() => toInputDate(new Date()));
  const [healthIds, setHealthIds] = useState<string[]>(["healthy"]);
  const [records, setRecords] = useState<VaccinationRecord[]>([
    { id: "sample-1", productId: "hexaxim", date: defaultDate(70) },
  ]);
  const [previousProduct, setPreviousProduct] = useState("hexaxim");
  const [candidateProduct, setCandidateProduct] = useState("infanrix-hexa");
  const [selectedDiseaseId, setSelectedDiseaseId] = useState("pneumococcal");
  const [compareFrom, setCompareFrom] = useState<CountryCode>("VN");
  const [compareTo, setCompareTo] = useState<CountryCode>("AU");

  const t = copy[language];
  const profile = getCountryProfile(country);
  const productsForCountry = useMemo(
    () => vaccineProducts.filter((product) => product.countries.includes(country)),
    [country],
  );

  const result = useMemo(
    () =>
      assessVaccines({
        country,
        birthDate,
        checkDate,
        language,
        records,
        healthConditionIds: healthIds,
      }),
    [birthDate, checkDate, country, healthIds, language, records],
  );

  const substitution = useMemo(
    () => checkSubstitution(previousProduct, candidateProduct, country, language),
    [candidateProduct, country, language, previousProduct],
  );

  const selectedDisease =
    diseaseCatalog.find((disease) => disease.id === selectedDiseaseId) ?? diseaseCatalog[0];
  const compare = compareNotes(compareFrom, compareTo, language);

  function toggleHealth(id: string) {
    setHealthIds((current) => {
      if (id === "healthy") return ["healthy"];
      const withoutHealthy = current.filter((item) => item !== "healthy");
      return current.includes(id) ? withoutHealthy.filter((item) => item !== id) : [...withoutHealthy, id];
    });
  }

  function updateRecord(id: string, patch: Partial<VaccinationRecord>) {
    setRecords((current) => current.map((record) => (record.id === id ? { ...record, ...patch } : record)));
  }

  function addRecord() {
    setRecords((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        productId: productsForCountry[0]?.id ?? vaccineProducts[0].id,
        date: checkDate || todayIso,
      },
    ]);
  }

  function removeRecord(id: string) {
    setRecords((current) => current.filter((record) => record.id !== id));
  }

  return (
    <main className="app-shell">
      <section className="top-band">
        <div className="brand-row">
          <div>
            <h1>{t.headline}</h1>
          </div>
          <div className="language-switch" aria-label={t.language}>
            <button className={language === "vi" ? "active" : ""} onClick={() => setLanguage("vi")} type="button">
              Tiếng Việt
            </button>
            <button className={language === "en" ? "active" : ""} onClick={() => setLanguage("en")} type="button">
              English
            </button>
          </div>
        </div>

        <div className="hero-grid">
          <div className="hero-copy">
            <p className="app-name">{t.appName}</p>
            <p className="app-tagline">{t.tagline}</p>
            <p className="hero-subhead">{t.subhead}</p>
            <div className="disclaimer">{t.disclaimer}</div>
          </div>
          <Image
            alt=""
            className="hero-image"
            height={1024}
            priority
            src="/vaccine-consultation.png"
            unoptimized
            width={1536}
          />
        </div>
      </section>

      <nav className="tabs" aria-label="Application views">
        <button className={tab === "checker" ? "active" : ""} onClick={() => setTab("checker")} type="button">
          {t.tabChecker}
        </button>
        <button className={tab === "switch" ? "active" : ""} onClick={() => setTab("switch")} type="button">
          {t.tabSwitch}
        </button>
        <button className={tab === "diseases" ? "active" : ""} onClick={() => setTab("diseases")} type="button">
          {t.tabDiseases}
        </button>
        <button className={tab === "sources" ? "active" : ""} onClick={() => setTab("sources")} type="button">
          {t.tabSources}
        </button>
      </nav>

      {tab === "checker" && (
        <section className="workspace-grid">
          <form className="tool-panel" onSubmit={(event) => event.preventDefault()}>
            <div className="field-row">
              <label>
                <span>{t.country}</span>
                <select value={country} onChange={(event) => setCountry(event.target.value as CountryCode)}>
                  {countryProfiles.map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.name[language]}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>{t.checkDate}</span>
                <input value={checkDate} onChange={(event) => setCheckDate(event.target.value)} type="date" />
              </label>
            </div>

            <label>
              <span>{t.birthDate}</span>
              <input value={birthDate} onChange={(event) => setBirthDate(event.target.value)} type="date" />
            </label>

            <div className="field-block">
              <span className="label-text">{t.health}</span>
              <div className="condition-grid">
                {healthConditions.map((condition) => (
                  <label className="check-tile" key={condition.id}>
                    <input
                      checked={healthIds.includes(condition.id)}
                      onChange={() => toggleHealth(condition.id)}
                      type="checkbox"
                    />
                    <span>{condition.label[language]}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="history-head">
              <span className="label-text">{t.history}</span>
              <button className="secondary-action" onClick={addRecord} type="button">
                + {t.addDose}
              </button>
            </div>

            <div className="history-list">
              {records.length === 0 && <p className="empty-note">{t.noHistory}</p>}
              {records.map((record) => (
                <div className="history-row" key={record.id}>
                  <label>
                    <span>{t.product}</span>
                    <select value={record.productId} onChange={(event) => updateRecord(record.id, { productId: event.target.value })}>
                      {productsForCountry.map((product) => (
                        <option key={product.id} value={product.id}>
                          {productOptionLabel(product, language)}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span>{t.doseDate}</span>
                    <input value={record.date} onChange={(event) => updateRecord(record.id, { date: event.target.value })} type="date" />
                  </label>
                  <button className="icon-action" onClick={() => removeRecord(record.id)} type="button" aria-label={t.remove}>
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className="mini-panel">
              <div>
                <span className="label-text">{t.compareTitle}</span>
                <p>{t.compareIntro}</p>
              </div>
              <div className="field-row">
                <label>
                  <span>{t.compareFrom}</span>
                  <select value={compareFrom} onChange={(event) => setCompareFrom(event.target.value as CountryCode)}>
                    {countryProfiles.map((item) => (
                      <option key={item.code} value={item.code}>
                        {item.name[language]}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>{t.compareTo}</span>
                  <select value={compareTo} onChange={(event) => setCompareTo(event.target.value as CountryCode)}>
                    {countryProfiles.map((item) => (
                      <option key={item.code} value={item.code}>
                        {item.name[language]}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="compare-note">
                <strong>{compare.title}</strong>
                <p>
                  {t.compareResult}: {compare.shared}
                </p>
                <p>{compare.reminder}</p>
              </div>
            </div>
          </form>

          <section className="result-panel">
            <div className="result-heading">
              <div>
                <p className="eyebrow">{t.result}</p>
                <h2>{result?.ageLabel ?? "--"}</h2>
              </div>
              <div className="profile-pill">{profile.name[language]}</div>
            </div>

            <div className="summary-grid">
              {(["due", "catch-up", "doctor-review", "upcoming", "not-eligible", "completed"] as DoseStatus[]).map((status) => (
                <div className="summary-cell" key={status}>
                  <strong>{result?.summary[status] ?? 0}</strong>
                  <span>{statusLabel(status, language)}</span>
                </div>
              ))}
            </div>

            <div className="schedule-meta">
              <span>{t.schedule}</span>
              <strong>{profile.scheduleName[language]}</strong>
            </div>

            {result && result.doctorWarnings.length > 0 && (
              <div className="warning-box">
                <strong>{t.warningTitle}</strong>
                {result.doctorWarnings.map((warning) => (
                  <p key={warning}>{warning}</p>
                ))}
              </div>
            )}

            <div className="assessment-list">
              {result?.items.map((item) => (
                <article className="assessment-item" key={`${item.groupId}-${item.doseLabel}`}>
                  <div className="assessment-title">
                    <div>
                      <span className={statusClass[item.status]}>{statusLabel(item.status, language)}</span>
                      <h3>{item.groupName}</h3>
                    </div>
                    <span className="category-tag">{categoryLabel(item.category, language)}</span>
                  </div>
                  <p className="dose-line">{item.doseLabel}</p>
                  <p>{item.reason}</p>
                  <dl>
                    {item.recommendedDate && (
                      <>
                        <dt>{t.recommended}</dt>
                        <dd>{item.recommendedDate}</dd>
                      </>
                    )}
                    {item.earliestDate && (
                      <>
                        <dt>{t.earliest}</dt>
                        <dd>{item.earliestDate}</dd>
                      </>
                    )}
                    <dt>{t.validDoses}</dt>
                    <dd>{item.validDoseCount}</dd>
                    <dt>{t.invalidDoses}</dt>
                    <dd>{item.invalidDoseCount}</dd>
                  </dl>
                  <p className="note">{item.note}</p>
                </article>
              ))}
            </div>
          </section>
        </section>
      )}

      {tab === "switch" && (
        <section className="switch-layout">
          <div className="tool-panel">
            <p className="eyebrow">{t.tabSwitch}</p>
            <h2>{t.switchTitle}</h2>
            <label>
              <span>{t.country}</span>
              <select value={country} onChange={(event) => setCountry(event.target.value as CountryCode)}>
                {countryProfiles.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.name[language]}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>{t.previousProduct}</span>
              <select value={previousProduct} onChange={(event) => setPreviousProduct(event.target.value)}>
                {vaccineProducts.map((product) => (
                  <option key={product.id} value={product.id}>
                    {productOptionLabel(product, language)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>{t.candidateProduct}</span>
              <select value={candidateProduct} onChange={(event) => setCandidateProduct(event.target.value)}>
                {vaccineProducts.map((product) => (
                  <option key={product.id} value={product.id}>
                    {productOptionLabel(product, language)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <article className="switch-result">
            <span className={`switch-badge switch-${substitution.status}`}>{substitution.status}</span>
            <h2>{substitution.title}</h2>
            <p>{substitution.explanation}</p>
            <div className="component-grid">
              <div>
                <span>{t.shared}</span>
                <strong>{substitution.sharedAntigens.join(", ") || "—"}</strong>
              </div>
              <div>
                <span>{t.missing}</span>
                <strong>{substitution.missingInCandidate.join(", ") || "—"}</strong>
              </div>
              <div>
                <span>{t.added}</span>
                <strong>{substitution.addedInCandidate.join(", ") || "—"}</strong>
              </div>
            </div>
            <div className="myth-grid">
              {mythCards[language].map((myth) => (
                <div className="myth-card" key={myth.title}>
                  <strong>{myth.title}</strong>
                  <p>{myth.body}</p>
                </div>
              ))}
            </div>
            <p className="note">{t.disclaimer}</p>
          </article>
        </section>
      )}

      {tab === "diseases" && (
        <section className="disease-layout">
          <aside className="disease-list" aria-label={t.diseaseTitle}>
            {diseaseCatalog.map((disease) => (
              <button
                className={selectedDisease.id === disease.id ? "disease-button active" : "disease-button"}
                key={disease.id}
                onClick={() => setSelectedDiseaseId(disease.id)}
                type="button"
              >
                {disease.label[language]}
              </button>
            ))}
          </aside>

          <section className="disease-detail">
            <p className="eyebrow">{t.tabDiseases}</p>
            <h2>{t.diseaseTitle}</h2>
            <p className="disease-intro">{t.diseaseIntro}</p>

            <div className="selected-disease-head">
              <div>
                <span>{t.diseaseProducts}</span>
                <h3>{selectedDisease.label[language]}</h3>
              </div>
              <span className="profile-pill">{selectedDisease.products.length} vaccine</span>
            </div>

            <p className="disease-description">{selectedDisease.description[language]}</p>

            <div className="disease-product-grid">
              {selectedDisease.products.map((product) => (
                <article className="disease-product" key={`${selectedDisease.id}-${product.name}`}>
                  <h3>{product.displayName?.[language] ?? product.name}</h3>
                  <dl>
                    <dt>{t.diseaseCoverage}</dt>
                    <dd>{product.coverage[language]}</dd>
                    <dt>{t.diseaseNote}</dt>
                    <dd>{product.note[language]}</dd>
                  </dl>
                </article>
              ))}
            </div>
          </section>
        </section>
      )}

      {tab === "sources" && (
        <section className="sources-layout">
          <div>
            <p className="eyebrow">{t.tabSources}</p>
            <h2>{t.sourceTitle}</h2>
          </div>
          <div className="source-grid">
            {countryProfiles.map((item) => (
              <article className="source-card" key={item.code}>
                <h3>{item.name[language]}</h3>
                <p>{item.scheduleName[language]}</p>
                {item.sources.map((source) => (
                  <a href={source.url} key={source.url} rel="noreferrer" target="_blank">
                    <strong>{source.title}</strong>
                    <span>
                      {t.effective}: {source.effective}
                    </span>
                    <span>
                      {t.reviewed}: {source.reviewed}
                    </span>
                  </a>
                ))}
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

