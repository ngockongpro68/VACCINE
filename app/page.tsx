"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
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
  parseLocalDate,
  productDisplayName,
  toInputDate,
  type AssessmentInput,
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
    checkNow: "Kiểm tra",
    remove: "Xóa",
    noHistory: "Chưa nhập lịch sử tiêm. Kết quả sẽ xem như chưa có mũi nào được ghi nhận.",
    resultWaiting: "Nhập thông tin rồi bấm Kiểm tra để xem kết quả.",
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
    todayVaccinesTitle: "Hôm nay bé có thể tiêm",
    todayVaccinesHint: "Tách theo lịch TCMR và vaccine dịch vụ để người nhà dễ trao đổi tại điểm tiêm.",
    todayVaccinesServiceHint: "Vaccine dịch vụ còn phụ thuộc sản phẩm, tuổi bắt đầu, số mũi đã tiêm và sàng lọc tại điểm tiêm.",
    todayVaccinesRoutine: "Theo TCMR / routine",
    todayVaccinesService: "Dịch vụ / ngoài TCMR",
    todayVaccinesReview: "Cần hỏi thêm tại điểm tiêm",
    todayVaccinesEmpty: "Hiện chưa thấy mũi nào đến lịch tiêm ngay hôm nay trong dữ liệu đã nhập.",
    visitQuestionsTitle: "Câu hỏi nên hỏi ngay tại điểm tiêm",
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
    checkNow: "Check",
    remove: "Remove",
    noHistory: "No vaccination history entered. Results assume no recorded valid doses.",
    resultWaiting: "Enter the details, then click Check to see the result.",
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
    todayVaccinesTitle: "Vaccines that may be given today",
    todayVaccinesHint: "Separated into routine and service vaccines so the family can discuss it clearly at the clinic.",
    todayVaccinesServiceHint: "Service vaccines still depend on product, starting age, prior doses, and clinic screening.",
    todayVaccinesRoutine: "Routine schedule",
    todayVaccinesService: "Service / non-routine",
    todayVaccinesReview: "Ask at the clinic first",
    todayVaccinesEmpty: "No vaccine appears due for today from the information entered so far.",
    visitQuestionsTitle: "Questions to ask before leaving the clinic",
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
  quinvaxem: {
    vi: "5 trong 1: bạch hầu, uốn ván, ho gà, Hib, viêm gan B",
    en: "5-in-1: diphtheria, tetanus, pertussis, Hib, hepatitis B",
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
  "hepb-birth-dose": { vi: "Viêm gan B sơ sinh", en: "Hepatitis B birth dose" },
  "hepa-mono": { vi: "Viêm gan A", en: "Hepatitis A" },
  varicella: { vi: "Thủy đậu", en: "Varicella" },
  "measles-single": { vi: "Sởi đơn", en: "Measles only" },
  shingrix: { vi: "Zona", en: "Zoster / shingles" },
  rsv: { vi: "RSV", en: "RSV" },
  rabies: { vi: "Dại", en: "Rabies" },
  "tetanus-single": { vi: "Uốn ván", en: "Tetanus" },
  "ivac-bcg": { vi: "Lao (BCG)", en: "Tuberculosis (BCG)" },
  "bopv-polyvac": { vi: "Bại liệt uống", en: "Oral polio" },
  "imovax-polio": { vi: "Bại liệt chích", en: "Inactivated polio" },
  vaxneuvance: { vi: "Phế cầu", en: "Pneumococcal disease" },
  "pneumovax-23": { vi: "Phế cầu", en: "Pneumococcal disease" },
  "rotavin-m1": { vi: "Rota", en: "Rotavirus" },
  "vamengoc-bc": { vi: "Não mô cầu BC", en: "Meningococcal B/C" },
  menactra: { vi: "Não mô cầu ACWY", en: "Meningococcal ACWY" },
  menquadfi: { vi: "Não mô cầu ACWY", en: "Meningococcal ACWY" },
  nimenrix: { vi: "Não mô cầu ACWY", en: "Meningococcal ACWY" },
  "vaxigrip-tetra": { vi: "Cúm mùa", en: "Seasonal influenza" },
  "influvac-tetra": { vi: "Cúm mùa", en: "Seasonal influenza" },
  "ivacflu-s": { vi: "Cúm mùa", en: "Seasonal influenza" },
  "gcflu-quadrivalent": { vi: "Cúm mùa", en: "Seasonal influenza" },
  mvvac: { vi: "Sởi đơn", en: "Measles only" },
  mrvac: { vi: "Sởi, rubella", en: "Measles, rubella" },
  priorix: { vi: "Sởi, quai bị, rubella", en: "Measles, mumps, rubella" },
  "mmr-ii": { vi: "Sởi, quai bị, rubella", en: "Measles, mumps, rubella" },
  "serum-mmr-india": { vi: "Sởi, quai bị, rubella", en: "Measles, mumps, rubella" },
  "sii-mmr": { vi: "Sởi, quai bị, rubella", en: "Measles, mumps, rubella" },
  varilrix: { vi: "Thủy đậu", en: "Varicella" },
  varivax: { vi: "Thủy đậu", en: "Varicella" },
  barycella: { vi: "Thủy đậu", en: "Varicella" },
  proquad: { vi: "Sởi, quai bị, rubella, thủy đậu", en: "Measles, mumps, rubella, varicella" },
  imojev: { vi: "Viêm não Nhật Bản", en: "Japanese encephalitis" },
  jevax: { vi: "Viêm não Nhật Bản", en: "Japanese encephalitis" },
  jeev: { vi: "Viêm não Nhật Bản", en: "Japanese encephalitis" },
  avaxim: { vi: "Viêm gan A", en: "Hepatitis A" },
  havax: { vi: "Viêm gan A", en: "Hepatitis A" },
  twinrix: { vi: "Viêm gan A, B", en: "Hepatitis A and B" },
  "engerix-b": { vi: "Viêm gan B", en: "Hepatitis B" },
  "euvax-b": { vi: "Viêm gan B", en: "Hepatitis B" },
  "heberbiovac-hb": { vi: "Viêm gan B", en: "Hepatitis B" },
  "gene-hbvax": { vi: "Viêm gan B", en: "Hepatitis B" },
  "typhim-vi": { vi: "Thương hàn", en: "Typhoid" },
  "typhoid-vn": { vi: "Thương hàn", en: "Typhoid" },
  morcvax: { vi: "Tả", en: "Cholera" },
  abrysvo: { vi: "RSV", en: "RSV" },
  arexvy: { vi: "RSV", en: "RSV" },
  tetraxim: { vi: "4 trong 1: bạch hầu, ho gà, uốn ván, bại liệt", en: "4-in-1: diphtheria, pertussis, tetanus, polio" },
  adacel: { vi: "3 trong 1: bạch hầu, ho gà, uốn ván", en: "3-in-1: diphtheria, pertussis, tetanus" },
  boostrix: { vi: "3 trong 1: bạch hầu, ho gà, uốn ván", en: "3-in-1: diphtheria, pertussis, tetanus" },
  "td-vn": { vi: "Bạch hầu, uốn ván", en: "Diphtheria, tetanus" },
  "tt-vn": { vi: "Uốn ván", en: "Tetanus" },
  verorab: { vi: "Dại", en: "Rabies" },
  abhayrab: { vi: "Dại", en: "Rabies" },
  indirab: { vi: "Dại", en: "Rabies" },
  qdenga: { vi: "Sốt xuất huyết", en: "Dengue" },
  cervarix: { vi: "HPV", en: "HPV" },
  "quimi-hib": { vi: "Hib", en: "Hib" },
};

function productOptionLabel(product: VaccineProduct, language: Language) {
  const target = productTargets[product.id]?.[language];
  const name = productDisplayName(product, language);
  return target ? `${name} - ${target}` : name;
}

function toDisplayDate(value: string) {
  const date = parseLocalDate(value);
  if (!date) return value;
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}/${date.getFullYear()}`;
}

function fromDisplayDate(value: string) {
  const trimmed = value.trim();
  const match = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) return trimmed;
  const [, day, month, year] = match;
  const iso = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  return parseLocalDate(iso) ? iso : trimmed;
}

type DateFieldProps = {
  value: string;
  onChange: (nextValue: string) => void;
};

function DateField({ value, onChange }: DateFieldProps) {
  const pickerRef = useRef<HTMLInputElement>(null);
  const pickerValue = parseLocalDate(value) ? value : "";

  return (
    <div className="date-field">
      <input
        inputMode="numeric"
        onChange={(event) => onChange(fromDisplayDate(event.target.value))}
        placeholder="dd/mm/yyyy"
        value={toDisplayDate(value)}
      />
      <button
        aria-label="Chọn ngày"
        className="date-picker-toggle"
        onClick={() => pickerRef.current?.showPicker?.()}
        type="button"
      >
        ▾
      </button>
      <input
        aria-hidden="true"
        className="date-native-picker"
        onChange={(event) => onChange(event.target.value)}
        ref={pickerRef}
        tabIndex={-1}
        type="date"
        value={pickerValue}
      />
    </div>
  );
}

type ProductOption = {
  id: string;
  label: string;
};

type VaccineSearchFieldProps = {
  listId: string;
  options: ProductOption[];
  value: string;
  onChange: (nextValue: string) => void;
};

function VaccineSearchField({ listId, options, value, onChange }: VaccineSearchFieldProps) {
  const selectedLabel = options.find((option) => option.id === value)?.label ?? "";
  const [query, setQuery] = useState(selectedLabel);
  const [open, setOpen] = useState(false);
  const filteredOptions = query
    ? options.filter((option) => option.label.toLowerCase().includes(query.toLowerCase()))
    : options;

  return (
    <div className="vaccine-combobox">
      <input
        aria-haspopup="listbox"
        onChange={(event) => {
          const nextLabel = event.target.value;
          setQuery(nextLabel);
          setOpen(true);
          const matched = options.find((option) => option.label === nextLabel);
          if (matched) onChange(matched.id);
        }}
        onFocus={() => setOpen(false)}
        placeholder="Gõ để tìm vaccine"
        value={query}
      />
      <button
        aria-controls={listId}
        aria-expanded={open}
        className="combo-toggle"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        ▼
      </button>
      {open && (
        <div className="combo-menu" id={listId} role="listbox">
          {filteredOptions.map((option) => (
            <button
              className={option.id === value ? "combo-option active" : "combo-option"}
              key={option.id}
              onClick={() => {
                setQuery(option.label);
                onChange(option.id);
                setOpen(false);
              }}
              type="button"
            >
              {option.label}
            </button>
          ))}
          {filteredOptions.length === 0 && (
            <div className="combo-empty">Không thấy vaccine phù hợp</div>
          )}
        </div>
      )}
    </div>
  );
}

const hiddenProductIds = new Set([
  "rabies",
  "varicella",
  "hepb-mono",
  "hepa-mono",
  "epi-5in1",
  "measles-single",
  "menacwy",
]);

function isVisibleProduct(product: VaccineProduct) {
  return !hiddenProductIds.has(product.id);
}

function isBirthDoseOnlyProduct(product: VaccineProduct) {
  return product.antigens.length === 1 && product.antigens[0] === "HepB";
}

function productsForAssessmentItem(
  item: DoseAssessment,
  country: CountryCode,
  language: Language,
) {
  return vaccineProducts
    .filter(
      (product) =>
        product.countries.includes(country) &&
        product.groupIds.includes(item.groupId as VaccineProduct["groupIds"][number]) &&
        isVisibleProduct(product),
    )
    .filter((product) => {
      if (item.groupId !== "hepbBirth") return true;
      return isBirthDoseOnlyProduct(product);
    })
    .map((product) => ({
      id: product.id,
      label: productOptionLabel(product, language),
      category: item.category,
    }));
}

function visitQuestions(language: Language) {
  if (language === "vi") {
    return [
      "Sau tiêm cần ở lại theo dõi bao lâu, và dấu hiệu nào phải báo nhân viên y tế ngay?",
      "Nếu bé sốt, quấy khóc hoặc sưng đau chỗ tiêm thì theo dõi thế nào, khi nào cần đưa đi khám?",
      "Các dấu hiệu nguy hiểm cần đi cấp cứu là gì: khó thở, tím tái, lừ đừ, co giật, sưng môi/mặt, phát ban toàn thân?",
      "Có chuyện gì cần báo riêng không: chó/mèo cắn, vết thương bẩn, đang mang thai, dùng thuốc ức chế miễn dịch hoặc từng phản ứng nặng sau tiêm?",
      "Mũi tiếp theo hẹn ngày nào, có mốc tối thiểu nào không được tiêm sớm hơn không?",
    ];
  }

  return [
    "How long should we stay for observation, and what symptoms should be reported immediately?",
    "If fever, fussiness, or injection-site swelling happens, what should we watch and when should we seek care?",
    "Which danger signs need urgent care: trouble breathing, bluish color, unusual sleepiness, seizure, face/lip swelling, or widespread rash?",
    "Is there anything special to mention: animal bite, dirty wound, pregnancy, immune-suppressing medicine, or prior severe vaccine reaction?",
    "When is the next dose due, and is there a minimum interval that must not be shortened?",
  ];
}

function assessmentNote(item: DoseAssessment, country: CountryCode, language: Language) {
  if (item.groupId !== "hepbBirth") return item.note;

  if (language === "vi") {
    return country === "US"
      ? "Liều sơ sinh nên dùng vaccine viêm gan B đơn giá. Nếu mẹ dương tính HBsAg hoặc chưa rõ tình trạng, bé cần được tiêm rất sớm và có thể phải phối hợp HBIG theo hướng dẫn CDC."
      : "Liều sơ sinh nên dùng vaccine viêm gan B đơn giá, ưu tiên trong 24 giờ đầu sau sinh. Nếu mẹ dương tính HBsAg hoặc chưa rõ tình trạng, bé cần được bác sĩ xử trí sớm và có thể phải phối hợp HBIG.";
  }

  return country === "US"
    ? "The birth dose should use monovalent hepatitis B vaccine. If the mother is HBsAg-positive or status is unknown, the newborn needs urgent management and may also need HBIG under CDC guidance."
    : "The birth dose should use monovalent hepatitis B vaccine, ideally within the first 24 hours after birth. If the mother is HBsAg-positive or status is unknown, urgent clinician-directed management and HBIG may be needed.";
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
      {
        name: "Vaxneuvance",
        coverage: {
          vi: "PCV15: PCV13 + 22F, 33F",
          en: "PCV15: PCV13 + 22F, 33F",
        },
        note: {
          vi: "PCV15; cần đối chiếu với lịch dùng PCV10/13/20.",
          en: "PCV15; compare carefully with PCV10/13/20 schedules.",
        },
      },
      {
        name: "Pneumovax 23",
        coverage: {
          vi: "PPSV23: 23 type phế cầu, bao gồm 1, 2, 3, 4, 5, 6B, 7F, 8, 9N, 9V, 10A, 11A, 12F, 14, 15B, 17F, 18C, 19A, 19F, 20, 22F, 23F, 33F",
          en: "PPSV23: 23 pneumococcal serotypes including 1, 2, 3, 4, 5, 6B, 7F, 8, 9N, 9V, 10A, 11A, 12F, 14, 15B, 17F, 18C, 19A, 19F, 20, 22F, 23F, 33F",
        },
        note: {
          vi: "Thường dùng cho chỉ định tuổi/nguy cơ riêng hơn là routine PCV ở nhũ nhi.",
          en: "Usually used for age- or risk-based indications rather than routine infant PCV schedules.",
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
      {
        name: "Cervarix",
        coverage: {
          vi: "HPV type 16, 18",
          en: "HPV types 16, 18",
        },
        note: {
          vi: "Bao phủ 2 type nguy cơ cao 16/18; khác phạm vi với Gardasil 4/9.",
          en: "Covers high-risk HPV 16/18 only; different scope from Gardasil 4/9.",
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
        name: "Engerix B / Euvax B / Heberbiovac HB / Gene-HBVax",
        coverage: { vi: "Kháng nguyên viêm gan B", en: "Hepatitis B antigen" },
        note: {
          vi: "Các vaccine viêm gan B đơn thường được tính theo lịch HepB sơ sinh hoặc các mũi bổ sung.",
          en: "These single-antigen hepatitis B vaccines are generally counted under the birth-dose and follow-up HepB schedule.",
        },
      },
      {
        name: "Twinrix",
        coverage: { vi: "Kháng nguyên viêm gan A + B", en: "Hepatitis A and B antigens" },
        note: {
          vi: "Khi nhập lịch sử cần tính cả thành phần HepA và HepB trong vaccine phối hợp.",
          en: "When recording history, count both the HepA and HepB components.",
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
      {
        name: "Avaxim / Havax",
        coverage: { vi: "Kháng nguyên viêm gan A", en: "Hepatitis A antigen" },
        note: {
          vi: "Các vaccine đơn viêm gan A cần đối chiếu số liều và mũi nhắc.",
          en: "Single-antigen hepatitis A products should be reviewed for primary and booster dosing.",
        },
      },
      {
        name: "Twinrix",
        coverage: { vi: "Kháng nguyên viêm gan A + B", en: "Hepatitis A and B antigens" },
        note: {
          vi: "Là vaccine phối hợp HepA/HepB, không nên ghi như vaccine HepA đơn.",
          en: "This is a combined HepA/HepB vaccine and should not be recorded as HepA-only.",
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
      {
        name: "Td / TT / Adacel / Boostrix / Tetraxim",
        coverage: { vi: "Giải độc tố uốn ván, có thể kèm bạch hầu/ho gà/bại liệt tùy sản phẩm", en: "Tetanus toxoid, sometimes combined with diphtheria/pertussis/polio depending on product" },
        note: {
          vi: "Td và TT khác với Tdap hoặc 4 trong 1; cần nhập đúng tên sản phẩm để tránh tính sai.",
          en: "Td and TT are different from Tdap or 4-in-1 products; use the exact product name to avoid misclassification.",
        },
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
      {
        name: "Rotavin-M1",
        coverage: { vi: "Rota người chủng G1P[8]", en: "Human rotavirus strain G1P[8]" },
        note: { vi: "Vaccine rota đường uống dùng tại Việt Nam; vẫn cần tuân thủ giới hạn tuổi.", en: "An oral rotavirus vaccine used in Vietnam; age limits still apply." },
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
      {
        name: "MVVAC / MRVAC / Priorix / MMR II / MMR (India)",
        coverage: { vi: "Từ sởi đơn đến MR hoặc MMR tùy sản phẩm", en: "Ranges from measles-only to MR or full MMR depending on the product" },
        note: {
          vi: "Cần ghi đúng tên vì không phải tất cả đều bao phủ cùng số thành phần.",
          en: "Record the exact product because not all of them cover the same components.",
        },
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
      {
        name: "Varilrix / Varivax / Barycella / ProQuad",
        coverage: { vi: "Virus varicella-zoster phòng thủy đậu, có thể kèm MMR ở ProQuad", en: "Varicella-zoster virus for chickenpox prevention, with added MMR components in ProQuad" },
        note: {
          vi: "ProQuad là MMRV, không phải vaccine thủy đậu đơn.",
          en: "ProQuad is MMRV and not a single-antigen varicella-only product.",
        },
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
      {
        name: "Mengoc BC / Menactra / MenQuadfi / Nimenrix",
        coverage: { vi: "Nhóm B/C hoặc A,C,W,Y tùy sản phẩm", en: "Serogroups B/C or A,C,W,Y depending on the product" },
        note: {
          vi: "Các vaccine não mô cầu này không đồng nhất; cần nhập đúng tên sản phẩm để xác định nhóm huyết thanh.",
          en: "These meningococcal vaccines are not identical; use the exact product name to identify the covered serogroups.",
        },
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
      {
        name: "Abhayrab / Verorab / Indirab",
        coverage: { vi: "Virus dại", en: "Rabies virus" },
        note: {
          vi: "Các vaccine dại này cần được đọc cùng phác đồ trước phơi nhiễm hoặc sau phơi nhiễm cụ thể.",
          en: "These rabies vaccines should always be interpreted together with the specific pre- or post-exposure schedule.",
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
      {
        name: "Vaxigrip Tetra / Influvac Tetra / Ivacflu-S / GC Flu Quadrivalent",
        coverage: { vi: "Cúm A(H1N1), A(H3N2) và cúm B theo công thức mùa", en: "Influenza A(H1N1), A(H3N2), and influenza B by seasonal formulation" },
        note: {
          vi: "Tên hãng khác nhau nhưng thành phần mùa cúm vẫn cần đối chiếu theo năm lưu hành.",
          en: "Brand names differ, but the actual influenza formulation still needs to match the current season.",
        },
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
      {
        name: "Abrysvo / Arexvy",
        coverage: { vi: "RSV A/B tùy công nghệ vaccine", en: "RSV A/B depending on the vaccine platform" },
        note: {
          vi: "Chỉ định thiên về thai kỳ, người lớn hoặc nhóm nguy cơ hơn là routine trẻ em.",
          en: "These are more often used for pregnancy, adults, or risk groups than routine childhood schedules.",
        },
      },
    ],
  },
  {
    id: "bcg",
    label: { vi: "Lao", en: "Tuberculosis" },
    description: {
      vi: "BCG giúp phòng các thể lao nặng ở trẻ nhỏ.",
      en: "BCG helps prevent severe forms of tuberculosis in infants and young children.",
    },
    products: [
      {
        name: "Ivactuber (BCG)",
        coverage: { vi: "BCG phòng lao nặng", en: "BCG against severe tuberculosis" },
        note: { vi: "Thường dùng sớm sau sinh theo chương trình.", en: "Usually given soon after birth under programme guidance." },
      },
    ],
  },
  {
    id: "polio",
    label: { vi: "Bại liệt", en: "Polio" },
    description: {
      vi: "Có vaccine bại liệt uống và vaccine bại liệt chích.",
      en: "Polio prevention may use oral and injectable vaccines.",
    },
    products: [
      {
        name: "bOPV - Polyvac",
        coverage: { vi: "Bại liệt uống nhị giá", en: "Bivalent oral polio vaccine" },
        note: { vi: "Không tự động xem là tương đương hoàn toàn với IPV.", en: "Do not automatically treat it as fully interchangeable with IPV." },
      },
      {
        name: "IPV - IMOVAX POLIO",
        coverage: { vi: "Bại liệt chích bất hoạt", en: "Inactivated injectable polio vaccine" },
        note: { vi: "Cần đối chiếu khi quy đổi lịch giữa OPV và IPV.", en: "Review carefully when converting records between OPV and IPV." },
      },
      {
        name: "Tetraxim / Pentaxim / Hexaxim / Infanrix Hexa / Vaxelis",
        coverage: { vi: "Có thành phần bại liệt trong vaccine phối hợp", en: "Contain polio components inside combination vaccines" },
        note: { vi: "Cần đọc đúng tên sản phẩm để biết có thêm Hib/HepB hay không.", en: "Use the exact product name to know whether Hib/HepB are also included." },
      },
    ],
  },
  {
    id: "je",
    label: { vi: "Viêm não Nhật Bản", en: "Japanese encephalitis" },
    description: {
      vi: "Vaccine viêm não Nhật Bản dùng theo tuổi, vùng lưu hành và nguy cơ phơi nhiễm.",
      en: "Japanese encephalitis vaccines depend on age, endemic area, and exposure risk.",
    },
    products: [
      {
        name: "Imojev / Jevax / JEEV",
        coverage: { vi: "Virus viêm não Nhật Bản", en: "Japanese encephalitis virus" },
        note: { vi: "Cần đối chiếu từng lịch sản phẩm và mũi nhắc.", en: "Compare the exact product schedule and booster requirements." },
      },
    ],
  },
  {
    id: "hepab",
    label: { vi: "Viêm gan A và B", en: "Hepatitis A and B" },
    description: {
      vi: "Vaccine phối hợp giúp tính đồng thời thành phần viêm gan A và B.",
      en: "Combined vaccines should be counted for both hepatitis A and hepatitis B components.",
    },
    products: [
      {
        name: "Twinrix",
        coverage: { vi: "Kháng nguyên viêm gan A + B", en: "Hepatitis A and B antigens" },
        note: { vi: "Không nên nhập như vaccine HepA đơn hoặc HepB đơn.", en: "Do not record it as HepA-only or HepB-only." },
      },
    ],
  },
  {
    id: "typhoid",
    label: { vi: "Thương hàn", en: "Typhoid" },
    description: {
      vi: "Vaccine thương hàn thường dùng theo nguy cơ hoặc du lịch.",
      en: "Typhoid vaccines are usually used for risk-based or travel indications.",
    },
    products: [
      {
        name: "Typhim Vi / Typhoid (Việt Nam)",
        coverage: { vi: "Salmonella Typhi", en: "Salmonella Typhi" },
        note: { vi: "Cần đối chiếu tuổi và mũi nhắc theo từng sản phẩm.", en: "Check age use and booster timing for the exact product." },
      },
    ],
  },
  {
    id: "cholera",
    label: { vi: "Tả", en: "Cholera" },
    description: {
      vi: "Vaccine tả thường dùng theo vùng dịch hoặc nguy cơ đặc thù.",
      en: "Cholera vaccines are typically used for outbreak or specific risk settings.",
    },
    products: [
      {
        name: "mORCVAX",
        coverage: { vi: "Vibrio cholerae", en: "Vibrio cholerae" },
        note: { vi: "Không phải vaccine routine trẻ em phổ biến.", en: "Not a common routine childhood vaccine." },
      },
    ],
  },
  {
    id: "dengue",
    label: { vi: "Sốt xuất huyết", en: "Dengue" },
    description: {
      vi: "Vaccine sốt xuất huyết cần đối chiếu độ tuổi và chỉ định theo quốc gia.",
      en: "Dengue vaccine use depends on age and country-specific indication.",
    },
    products: [
      {
        name: "Qdenga",
        coverage: { vi: "Dengue type 1, 2, 3, 4", en: "Dengue serotypes 1, 2, 3, 4" },
        note: { vi: "Cần đọc đúng chỉ định theo lứa tuổi/quốc gia.", en: "Check the exact age and country indication before use." },
      },
    ],
  },
  {
    id: "hib",
    label: { vi: "Hib", en: "Hib" },
    description: {
      vi: "Hib có thể nằm trong vaccine đơn hoặc vaccine phối hợp.",
      en: "Hib may be given as a single-antigen vaccine or within combination products.",
    },
    products: [
      {
        name: "Quimi-Hib",
        coverage: { vi: "Haemophilus influenzae type b", en: "Haemophilus influenzae type b" },
        note: { vi: "Là vaccine Hib đơn.", en: "A single-antigen Hib vaccine." },
      },
      {
        name: "Pentaxim / Hexaxim / Infanrix Hexa / Vaxelis / 5 trong 1 TCMR",
        displayName: {
          vi: "Pentaxim / Hexaxim / Infanrix Hexa / Vaxelis / 5 trong 1 TCMR",
          en: "Pentaxim / Hexaxim / Infanrix Hexa / Vaxelis / EPI 5-in-1",
        },
        coverage: { vi: "Hib trong vaccine phối hợp", en: "Hib inside combination vaccines" },
        note: { vi: "Cần nhập đúng tên để biết có thêm HepB/IPV hay không.", en: "Use the exact product name to know whether HepB/IPV are also included." },
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
  const [records, setRecords] = useState<VaccinationRecord[]>([]);
  const [submittedInput, setSubmittedInput] = useState<AssessmentInput | null>(null);
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
  const visibleProductsForCountry = useMemo(
    () => productsForCountry.filter(isVisibleProduct),
    [productsForCountry],
  );
  const visibleProducts = useMemo(
    () => vaccineProducts.filter(isVisibleProduct),
    [],
  );
  const visibleProductOptionsForCountry = useMemo(
    () =>
      visibleProductsForCountry.map((product) => ({
        id: product.id,
        label: productOptionLabel(product, language),
      })),
    [language, visibleProductsForCountry],
  );
  const visibleProductOptions = useMemo(
    () =>
      visibleProducts.map((product) => ({
        id: product.id,
        label: productOptionLabel(product, language),
      })),
    [language, visibleProducts],
  );

  const currentAssessmentInput = useMemo(
    (): AssessmentInput => ({
      country,
      birthDate,
      checkDate,
      language,
      records,
      healthConditionIds: healthIds,
    }),
    [birthDate, checkDate, country, healthIds, language, records],
  );

  const result = useMemo(
    () => (submittedInput ? assessVaccines(submittedInput) : null),
    [submittedInput],
  );

  const substitution = useMemo(
    () => checkSubstitution(previousProduct, candidateProduct, country, language),
    [candidateProduct, country, language, previousProduct],
  );

  const selectedDisease =
    diseaseCatalog.find((disease) => disease.id === selectedDiseaseId) ?? diseaseCatalog[0];
  const compare = compareNotes(compareFrom, compareTo, language);
  const todayProducts = useMemo(() => {
    type TodayProduct = { id: string; label: string; category: DoseAssessment["category"] };
    if (!result) {
      return {
        routine: [] as TodayProduct[],
        service: [] as TodayProduct[],
        review: [] as TodayProduct[],
      };
    }

    const routineMap = new Map<string, TodayProduct>();
    const serviceMap = new Map<string, TodayProduct>();
    const reviewMap = new Map<string, TodayProduct>();

    result.items.forEach((item) => {
      const matchedProducts = productsForAssessmentItem(item, result.profile.code, language);
      if (item.status === "due" || item.status === "catch-up") {
        matchedProducts.forEach((product) => {
          if (product.category === "routine") {
            routineMap.set(product.id, product);
          } else if (product.category === "special") {
            reviewMap.set(product.id, product);
          } else {
            serviceMap.set(product.id, product);
          }
        });
      }
      if (item.status === "doctor-review") {
        matchedProducts.forEach((product) => reviewMap.set(product.id, product));
      }
    });

    return {
      routine: Array.from(routineMap.values()),
      service: Array.from(serviceMap.values()),
      review: Array.from(reviewMap.values()),
    };
  }, [language, result]);

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
        productId: "",
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
          <form
            className="tool-panel"
            onSubmit={(event) => {
              event.preventDefault();
              setSubmittedInput(currentAssessmentInput);
            }}
          >
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
                <DateField value={checkDate} onChange={setCheckDate} />
              </label>
            </div>

            <label>
              <span>{t.birthDate}</span>
              <DateField value={birthDate} onChange={setBirthDate} />
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
            </div>

            <div className="history-list">
              {records.length === 0 && <p className="empty-note">{t.noHistory}</p>}
              {records.map((record) => (
                <div className="history-row" key={record.id}>
                  <label>
                    <span>{t.product}</span>
                    <VaccineSearchField
                      key={`${record.id}-${language}-${country}-${record.productId}`}
                      listId={`history-products-${record.id}`}
                      onChange={(productId) => updateRecord(record.id, { productId })}
                      options={visibleProductOptionsForCountry}
                      value={record.productId}
                    />
                  </label>
                  <label>
                    <span>{t.doseDate}</span>
                    <DateField value={record.date} onChange={(date) => updateRecord(record.id, { date })} />
                  </label>
                  <button className="icon-action" onClick={() => removeRecord(record.id)} type="button" aria-label={t.remove}>
                    ×
                  </button>
                </div>
              ))}
            </div>

            <button className="secondary-action add-dose-action" onClick={addRecord} type="button">
              + {t.addDose}
            </button>

            <button className="primary-action check-action" type="submit">
              {t.checkNow}
            </button>

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
              <div className="profile-pill">{(result?.profile ?? profile).name[language]}</div>
            </div>

            {!result && <p className="result-waiting">{t.resultWaiting}</p>}

            {result && (
              <div className="summary-grid">
                {(["due", "catch-up", "doctor-review", "upcoming", "not-eligible", "completed"] as DoseStatus[]).map((status) => (
                  <div className="summary-cell" key={status}>
                    <strong>{result.summary[status]}</strong>
                    <span>{statusLabel(status, language)}</span>
                  </div>
                ))}
              </div>
            )}

            {result && (
              <div className="schedule-meta">
                <span>{t.schedule}</span>
                <strong>{result.profile.scheduleName[language]}</strong>
              </div>
            )}

            {result && result.doctorWarnings.length > 0 && (
              <div className="warning-box">
                <strong>{t.warningTitle}</strong>
                {result.doctorWarnings.map((warning) => (
                  <p key={warning}>{warning}</p>
                ))}
              </div>
            )}

            {result && (
              <div className="today-products">
                <div className="today-products-head">
                  <div>
                    <span>{t.todayVaccinesTitle}</span>
                    <strong>{todayProducts.routine.length + todayProducts.service.length}</strong>
                  </div>
                  <p>{t.todayVaccinesHint}</p>
                </div>

                {todayProducts.routine.length + todayProducts.service.length > 0 ? (
                  <>
                    {todayProducts.routine.length > 0 && (
                      <div className="today-vaccine-section">
                        <span>{t.todayVaccinesRoutine}</span>
                        <div className="today-vaccine-list">
                          {todayProducts.routine.map((product) => (
                            <div className="today-vaccine-item" key={product.id}>
                              {product.label}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {todayProducts.service.length > 0 && (
                      <div className="today-vaccine-section">
                        <span>{t.todayVaccinesService}</span>
                        <p className="today-service-hint">{t.todayVaccinesServiceHint}</p>
                        <div className="today-vaccine-list">
                          {todayProducts.service.map((product) => (
                            <div className="today-vaccine-item service" key={product.id}>
                              {product.label}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="note">{t.todayVaccinesEmpty}</p>
                )}

              </div>
            )}

            {result && (
              <div className="visit-questions">
                <span>{t.visitQuestionsTitle}</span>
                <ul>
                  {visitQuestions(language).map((question) => (
                    <li key={question}>{question}</li>
                  ))}
                </ul>
              </div>
            )}

            {result && (
              <div className="assessment-list">
                {result.items.map((item) => (
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
                  <p className="note">{assessmentNote(item, country, language)}</p>
                </article>
                ))}
              </div>
            )}
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
              <VaccineSearchField
                key={`previous-${language}-${previousProduct}`}
                listId="previous-product-options"
                onChange={setPreviousProduct}
                options={visibleProductOptions}
                value={previousProduct}
              />
            </label>
            <label>
              <span>{t.candidateProduct}</span>
              <VaccineSearchField
                key={`candidate-${language}-${candidateProduct}`}
                listId="candidate-product-options"
                onChange={setCandidateProduct}
                options={visibleProductOptions}
                value={candidateProduct}
              />
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

