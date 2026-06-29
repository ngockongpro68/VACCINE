import {
  countryProfiles,
  healthConditions,
  type CountryCode,
  type CountryProfile,
  type Language,
  type ScheduleDose,
  type ScheduleGroup,
  type VaccineProduct,
  vaccineProducts,
} from "../data/vaccineData";

export type VaccinationRecord = {
  id: string;
  productId: string;
  date: string;
};

export type AssessmentInput = {
  country: CountryCode;
  birthDate: string;
  checkDate: string;
  language: Language;
  records: VaccinationRecord[];
  healthConditionIds: string[];
};

export type DoseStatus =
  | "due"
  | "catch-up"
  | "upcoming"
  | "not-eligible"
  | "completed"
  | "doctor-review";

export type DoseAssessment = {
  groupId: string;
  groupName: string;
  doseLabel: string;
  status: DoseStatus;
  category: "routine" | "service" | "special";
  reason: string;
  recommendedDate?: string;
  earliestDate?: string;
  validDoseCount: number;
  invalidDoseCount: number;
  note: string;
};

type ValidatedDose = {
  record: VaccinationRecord;
  product: VaccineProduct;
  date: Date;
};

export type AssessmentResult = {
  ageLabel: string;
  ageDays: number;
  profile: CountryProfile;
  items: DoseAssessment[];
  doctorWarnings: string[];
  summary: Record<DoseStatus, number>;
};

const oneDay = 24 * 60 * 60 * 1000;
const days = (value: number) => Math.round(value);
const weeks = (value: number) => days(value * 7);
const months = (value: number) => Math.round(value * 30.4375);
const years = (value: number) => Math.round(value * 365.25);

const dictionary = {
  vi: {
    invalidBirth: "Vui lòng nhập ngày sinh hợp lệ.",
    completed: "Đã ghi nhận đủ số liều trong dữ liệu hiện tại.",
    due: "Đã đến mốc khuyến cáo hoặc nằm trong cửa sổ có thể xem xét hôm nay.",
    catchUp: "Đã qua mốc khuyến cáo; thường tiếp tục mũi còn thiếu thay vì tiêm lại từ đầu.",
    upcoming: "Chưa tới mốc khuyến cáo.",
    notEligible: "Chưa đủ tuổi hoặc chưa đủ khoảng cách tối thiểu.",
    maxAge: "Có giới hạn tuổi tối đa; cần bác sĩ đánh giá trước khi quyết định.",
    doctorHealth: "Tình trạng hiện tại cần nhân viên y tế sàng lọc trước khi tiêm.",
    mildHealth: "Triệu chứng nhẹ vẫn nên được sàng lọc trước tiêm theo quy trình địa phương.",
    years: "tuổi",
    months: "tháng",
    days: "ngày",
    today: "hôm nay",
  },
  en: {
    invalidBirth: "Please enter a valid date of birth.",
    completed: "Enough doses are recorded in the current data.",
    due: "The recommended milestone is due or can be considered today.",
    catchUp: "The recommended milestone has passed; series usually continues rather than restarting.",
    upcoming: "The recommended milestone has not arrived yet.",
    notEligible: "Minimum age or minimum interval has not been met.",
    maxAge: "A maximum-age limit may apply; clinician review is needed.",
    doctorHealth: "Current health status needs clinical screening before vaccination.",
    mildHealth: "Mild symptoms should still be screened under local procedure.",
    years: "years",
    months: "months",
    days: "days",
    today: "today",
  },
};

export function getCountryProfile(country: CountryCode): CountryProfile {
  return countryProfiles.find((profile) => profile.code === country) ?? countryProfiles[0];
}

export function getVaccineProduct(productId: string): VaccineProduct | undefined {
  return vaccineProducts.find((product) => product.id === productId);
}

export function productDisplayName(product: VaccineProduct, language: Language): string {
  return product.displayName?.[language] ?? product.name;
}

export function parseLocalDate(value: string): Date | null {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }
  return date;
}

export function formatDate(date: Date, language: Language): string {
  return new Intl.DateTimeFormat(language === "vi" ? "vi-VN" : "en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function toInputDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function addDays(base: Date, days: number): Date {
  const next = new Date(base);
  next.setDate(base.getDate() + Math.round(days));
  return next;
}

function addScheduleDays(base: Date, scheduleDays: number): Date {
  const yearCount = Math.round(scheduleDays / 365.25);
  if (yearCount > 0 && years(yearCount) === scheduleDays) {
    const next = new Date(base);
    next.setFullYear(base.getFullYear() + yearCount);
    return next;
  }

  const monthCount = Math.round(scheduleDays / 30.4375);
  if (monthCount > 0 && months(monthCount) === scheduleDays) {
    const next = new Date(base);
    next.setMonth(base.getMonth() + monthCount);
    return next;
  }

  return addDays(base, scheduleDays);
}

export function differenceInDays(later: Date, earlier: Date): number {
  return Math.floor((startOfDay(later).getTime() - startOfDay(earlier).getTime()) / oneDay);
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function ageLabel(birthDate: Date, checkDate: Date, language: Language): string {
  const text = dictionary[language];
  let yearsOld = checkDate.getFullYear() - birthDate.getFullYear();
  let monthsOld = checkDate.getMonth() - birthDate.getMonth();
  let daysOld = checkDate.getDate() - birthDate.getDate();

  if (daysOld < 0) {
    daysOld += new Date(checkDate.getFullYear(), checkDate.getMonth(), 0).getDate();
    monthsOld -= 1;
  }

  if (monthsOld < 0) {
    monthsOld += 12;
    yearsOld -= 1;
  }

  if (yearsOld <= 0 && monthsOld < 2) {
    const ageDays = differenceInDays(checkDate, birthDate);
    if (monthsOld <= 0) return `${ageDays} ${text.days}`;
  }

  if (yearsOld < 2) {
    return `${monthsOld + yearsOld * 12} ${text.months}${daysOld ? ` ${daysOld} ${text.days}` : ""}`;
  }

  return `${yearsOld} ${text.years}${monthsOld ? ` ${monthsOld} ${text.months}` : ""}`;
}

function productCoversGroup(product: VaccineProduct, group: ScheduleGroup): boolean {
  return group.requiredAntigens.every((antigen) => product.antigens.includes(antigen));
}

function recordsForGroup(records: VaccinationRecord[], group: ScheduleGroup) {
  if (group.id === "hepbBirth") {
    return records
      .map((record) => ({ record, product: getVaccineProduct(record.productId), date: parseLocalDate(record.date) }))
      .filter(
        (entry) =>
          entry.product &&
          entry.date &&
          entry.product.groupIds.includes(group.id as VaccineProduct["groupIds"][number]),
      )
      .sort((a, b) => Number(a.date) - Number(b.date)) as Array<{
      record: VaccinationRecord;
      product: VaccineProduct;
      date: Date;
    }>;
  }

  if (group.id === "polio") {
    const entries = records
      .map((record) => ({ record, product: getVaccineProduct(record.productId), date: parseLocalDate(record.date) }))
      .filter(
        (entry) =>
          entry.product &&
          entry.date &&
          (entry.product.antigens.includes("OPV") || entry.product.antigens.includes("IPV")),
      ) as Array<{
      record: VaccinationRecord;
      product: VaccineProduct;
      date: Date;
    }>;

    const uniqueByDay = new Map<number, (typeof entries)[number]>();

    entries
      .sort((a, b) => Number(a.date) - Number(b.date))
      .forEach((entry) => {
        const key = startOfDay(entry.date).getTime();
        const previous = uniqueByDay.get(key);
        if (!previous) {
          uniqueByDay.set(key, entry);
          return;
        }

        const entryIsStandalonePolio = entry.product.groupIds.includes("polio");
        const previousIsStandalonePolio = previous.product.groupIds.includes("polio");
        if (entryIsStandalonePolio && !previousIsStandalonePolio) {
          uniqueByDay.set(key, entry);
        }
      });

    return Array.from(uniqueByDay.values()).sort((a, b) => Number(a.date) - Number(b.date)) as Array<{
      record: VaccinationRecord;
      product: VaccineProduct;
      date: Date;
    }>;
  }

  return records
    .map((record) => ({ record, product: getVaccineProduct(record.productId), date: parseLocalDate(record.date) }))
    .filter((entry) => entry.product && entry.date && productCoversGroup(entry.product, group))
    .sort((a, b) => Number(a.date) - Number(b.date)) as Array<{
    record: VaccinationRecord;
    product: VaccineProduct;
    date: Date;
  }>;
}

function hasMixedRotavirusProducts(valid: ValidatedDose[]) {
  const productIds = new Set(valid.map((entry) => entry.product.id));
  return productIds.size > 1;
}

function recordsForGroupId(records: VaccinationRecord[], groupId: string) {
  return records
    .map((record) => ({ record, product: getVaccineProduct(record.productId), date: parseLocalDate(record.date) }))
    .filter((entry) => entry.product && entry.date && entry.product.groupIds.includes(groupId as VaccineProduct["groupIds"][number]))
    .sort((a, b) => Number(a.date) - Number(b.date)) as ValidatedDose[];
}

function customDose(
  dose: number,
  recommendedDays: number,
  minAgeDays: number,
  label: ScheduleDose["label"],
  extras: Partial<Pick<ScheduleDose, "minIntervalDays" | "maxAgeDays">> = {},
): ScheduleDose {
  return {
    dose,
    recommendedDays,
    minAgeDays,
    label,
    ...extras,
  };
}

function customDoses(
  group: ScheduleGroup,
  records: VaccinationRecord[],
  birthDate: Date,
  checkDate: Date,
): ScheduleDose[] {
  if (group.id === "rotavirus") {

  const rotaRecords = recordsForGroupId(records, "rotavirus");

  const firstProductId = rotaRecords[0]?.product.id;
  if (firstProductId === "rotateq") {
    return [
      {
        dose: 1,
        recommendedDays: group.doses[0]?.recommendedDays ?? 0,
        minAgeDays: weeks(6),
        maxAgeDays: weeks(12),
        label: { vi: "Rota mũi 1", en: "Rotavirus dose 1" },
      },
      {
        dose: 2,
        recommendedDays: months(3),
        minAgeDays: weeks(10),
        minIntervalDays: weeks(4),
        label: { vi: "Rota mũi 2", en: "Rotavirus dose 2" },
      },
      {
        dose: 3,
        recommendedDays: months(4),
        minAgeDays: weeks(14),
        minIntervalDays: weeks(4),
        maxAgeDays: weeks(32),
        label: { vi: "Rota mũi 3", en: "Rotavirus dose 3" },
      },
    ];
  }

  if (firstProductId === "rotarix") {
    return [
      {
        dose: 1,
        recommendedDays: group.doses[0]?.recommendedDays ?? 0,
        minAgeDays: weeks(6),
        maxAgeDays: weeks(24),
        label: { vi: "Rota mũi 1", en: "Rotavirus dose 1" },
      },
      {
        dose: 2,
        recommendedDays: months(3),
        minAgeDays: weeks(10),
        minIntervalDays: weeks(4),
        maxAgeDays: weeks(24),
        label: { vi: "Rota mũi 2", en: "Rotavirus dose 2" },
      },
    ];
  }

  if (firstProductId === "rotavin-m1") {
    return [
      {
        dose: 1,
        recommendedDays: group.doses[0]?.recommendedDays ?? 0,
        minAgeDays: weeks(6),
        maxAgeDays: days(30 * 6 - 1),
        label: { vi: "Rota mũi 1", en: "Rotavirus dose 1" },
      },
      {
        dose: 2,
        recommendedDays: months(3),
        minAgeDays: weeks(10),
        minIntervalDays: weeks(4),
        maxAgeDays: days(30 * 6 - 1),
        label: { vi: "Rota mũi 2", en: "Rotavirus dose 2" },
      },
    ];
  }

    return group.doses;
  }

  if (group.id === "menB") {
    const menBRecords = recordsForGroupId(records, "menB");
    const seriesStart = menBRecords[0]?.date ?? checkDate;
    const startAgeDays = differenceInDays(seriesStart, birthDate);

    if (startAgeDays < months(6)) {
      return [
        customDose(1, startAgeDays, months(2), { vi: "Bexsero mũi 1", en: "Bexsero dose 1" }, { maxAgeDays: years(50) }),
        customDose(2, startAgeDays + months(2), months(4), { vi: "Bexsero mũi 2", en: "Bexsero dose 2" }, { minIntervalDays: months(2), maxAgeDays: years(50) }),
        customDose(3, startAgeDays + months(10), months(12), { vi: "Bexsero mũi nhắc", en: "Bexsero booster" }, { minIntervalDays: months(8), maxAgeDays: years(50) }),
      ];
    }

    if (startAgeDays < months(12)) {
      return [
        customDose(1, startAgeDays, months(6), { vi: "Bexsero mũi 1", en: "Bexsero dose 1" }, { maxAgeDays: years(50) }),
        customDose(2, startAgeDays + months(2), months(8), { vi: "Bexsero mũi 2", en: "Bexsero dose 2" }, { minIntervalDays: months(2), maxAgeDays: years(50) }),
        customDose(3, startAgeDays + months(6), months(12), { vi: "Bexsero mũi 3", en: "Bexsero dose 3" }, { minIntervalDays: months(4), maxAgeDays: years(50) }),
      ];
    }

    if (startAgeDays < months(24)) {
      return [
        customDose(1, startAgeDays, months(12), { vi: "Bexsero mũi 1", en: "Bexsero dose 1" }, { maxAgeDays: years(50) }),
        customDose(2, startAgeDays + months(2), months(14), { vi: "Bexsero mũi 2", en: "Bexsero dose 2" }, { minIntervalDays: months(2), maxAgeDays: years(50) }),
        customDose(3, startAgeDays + months(14), months(24), { vi: "Bexsero mũi nhắc", en: "Bexsero booster" }, { minIntervalDays: months(12), maxAgeDays: years(50) }),
      ];
    }

    return [
      customDose(1, startAgeDays, startAgeDays, { vi: "Bexsero mũi 1", en: "Bexsero dose 1" }, { maxAgeDays: years(50) }),
      customDose(2, startAgeDays + months(1), startAgeDays, { vi: "Bexsero mũi 2", en: "Bexsero dose 2" }, { minIntervalDays: weeks(4), maxAgeDays: years(50) }),
    ];
  }

  if (group.id === "menBC") {
    const menBCRecords = recordsForGroupId(records, "menBC");
    const seriesStart = menBCRecords[0]?.date ?? checkDate;
    const startAgeDays = differenceInDays(seriesStart, birthDate);
    return [
      customDose(1, startAgeDays, months(6), { vi: "Mengoc BC mũi 1", en: "Mengoc BC dose 1" }, { maxAgeDays: years(46) - 1 }),
      customDose(2, startAgeDays + months(2), months(8), { vi: "Mengoc BC mũi 2", en: "Mengoc BC dose 2" }, { minIntervalDays: weeks(6), maxAgeDays: years(46) - 1 }),
    ];
  }

  if (group.id === "menACWY") {
    const menAcwyRecords = recordsForGroupId(records, "menACWY");
    const firstProductId = menAcwyRecords[0]?.product.id;
    const seriesStart = menAcwyRecords[0]?.date ?? checkDate;
    const startAgeDays = differenceInDays(seriesStart, birthDate);

    if (firstProductId === "menquadfi") {
      if (startAgeDays < months(6)) {
        return [
          customDose(1, startAgeDays, weeks(6), { vi: "MenQuadfi mũi 1", en: "MenQuadfi dose 1" }),
          customDose(2, startAgeDays + months(2), months(3), { vi: "MenQuadfi mũi 2", en: "MenQuadfi dose 2" }, { minIntervalDays: months(2) }),
          customDose(3, startAgeDays + months(4), months(5), { vi: "MenQuadfi mũi 3", en: "MenQuadfi dose 3" }, { minIntervalDays: months(2) }),
          customDose(4, Math.max(months(12), startAgeDays + months(6)), months(12), { vi: "MenQuadfi mũi 4", en: "MenQuadfi dose 4" }, { minIntervalDays: months(2) }),
        ];
      }

      if (startAgeDays < months(12)) {
        return [
          customDose(1, startAgeDays, months(6), { vi: "MenQuadfi mũi 1", en: "MenQuadfi dose 1" }),
          customDose(2, Math.max(months(12), startAgeDays + months(2)), months(12), { vi: "MenQuadfi mũi 2", en: "MenQuadfi dose 2" }, { minIntervalDays: months(2) }),
        ];
      }

      return [customDose(1, startAgeDays, months(12), { vi: "MenQuadfi một mũi", en: "MenQuadfi single dose" })];
    }

    if (firstProductId === "nimenrix") {
      if (startAgeDays < months(6)) {
        return [
          customDose(1, startAgeDays, weeks(6), { vi: "Nimenrix mũi 1", en: "Nimenrix dose 1" }),
          customDose(2, startAgeDays + months(2), months(3), { vi: "Nimenrix mũi 2", en: "Nimenrix dose 2" }, { minIntervalDays: months(2) }),
          customDose(3, Math.max(months(12), startAgeDays + months(4)), months(12), { vi: "Nimenrix mũi 3", en: "Nimenrix dose 3" }, { minIntervalDays: months(2) }),
        ];
      }

      if (startAgeDays < months(12)) {
        return [
          customDose(1, startAgeDays, months(6), { vi: "Nimenrix mũi 1", en: "Nimenrix dose 1" }),
          customDose(2, Math.max(months(12), startAgeDays + months(2)), months(12), { vi: "Nimenrix mũi 2", en: "Nimenrix dose 2" }, { minIntervalDays: months(2) }),
        ];
      }

      return [customDose(1, startAgeDays, months(12), { vi: "Nimenrix một mũi", en: "Nimenrix single dose" })];
    }
  }

  return group.doses;
}

function validateDoses(
  records: VaccinationRecord[],
  group: ScheduleGroup,
  birthDate: Date,
  checkDate: Date,
  gracePeriodDays: number,
) {
  const plannedDoses = customDoses(group, records, birthDate, checkDate);
  const matched = recordsForGroup(records, group).filter((entry) => {
    const isVietnamBirthDoseZero = group.id === "hepbBirth" && plannedDoses.length === 1 && plannedDoses[0]?.dose === 0;
    if (!isVietnamBirthDoseZero) return true;
    return differenceInDays(entry.date, birthDate) <= (plannedDoses[0]?.maxAgeDays ?? days(28));
  });
  const valid: ValidatedDose[] = [];
  const invalid: Array<ValidatedDose & { reason: string }> = [];

  for (const entry of matched) {
    const expectedDose = plannedDoses[Math.min(valid.length, plannedDoses.length - 1)];
    const previousValid = valid.at(-1);
    const allowedEarly = gracePeriodDays;
    const minAgeDate = expectedDose ? addScheduleDays(birthDate, expectedDose.minAgeDays) : birthDate;
    const earliestAgeDate = addDays(minAgeDate, -allowedEarly);

    if (entry.date < earliestAgeDate) {
      invalid.push({ ...entry, reason: "minimum-age" });
      continue;
    }

    if (previousValid && expectedDose?.minIntervalDays) {
      const minIntervalDate = addScheduleDays(previousValid.date, expectedDose.minIntervalDays);
      const earliestIntervalDate = addDays(minIntervalDate, -allowedEarly);
      if (entry.date < earliestIntervalDate) {
        invalid.push({ ...entry, reason: "minimum-interval" });
        continue;
      }
    }

    if (expectedDose?.maxAgeDays && entry.date > addScheduleDays(birthDate, expectedDose.maxAgeDays)) {
      invalid.push({ ...entry, reason: "maximum-age" });
      continue;
    }

    valid.push(entry);
  }

  return { valid, invalid, plannedDoses };
}

function nextDoseWindow(
  birthDate: Date,
  checkDate: Date,
  dose: ScheduleDose,
  previousDoseDate: Date | undefined,
) {
  const recommendedDate = addScheduleDays(birthDate, dose.recommendedDays);
  const minAgeDate = addScheduleDays(birthDate, dose.minAgeDays);
  const minIntervalDate =
    previousDoseDate && dose.minIntervalDays ? addScheduleDays(previousDoseDate, dose.minIntervalDays) : minAgeDate;
  const earliestDate = minAgeDate > minIntervalDate ? minAgeDate : minIntervalDate;
  const maximumReached = dose.maxAgeDays ? checkDate > addScheduleDays(birthDate, dose.maxAgeDays) : false;

  return { recommendedDate, earliestDate, maximumReached };
}

export function assessVaccines(input: AssessmentInput): AssessmentResult | null {
  const language = input.language;
  const birth = parseLocalDate(input.birthDate);
  const check = parseLocalDate(input.checkDate);
  if (!birth || !check || check < birth) return null;

  const profile = getCountryProfile(input.country);
  const text = dictionary[language];
  const ageDays = differenceInDays(check, birth);
  const doctorConditions = healthConditions.filter(
    (condition) => input.healthConditionIds.includes(condition.id) && condition.severity === "doctor",
  );
  const cautionConditions = healthConditions.filter(
    (condition) => input.healthConditionIds.includes(condition.id) && condition.severity === "caution",
  );

  const doctorWarnings = [
    ...doctorConditions.map((condition) => `${condition.label[language]}: ${text.doctorHealth}`),
    ...cautionConditions.map((condition) => `${condition.label[language]}: ${text.mildHealth}`),
  ];

  const items = profile.groups.map((group): DoseAssessment => {
    const { valid, invalid, plannedDoses } = validateDoses(input.records, group, birth, check, profile.gracePeriodDays);
    const nextDose = plannedDoses[valid.length];
    const mixedRotavirus = group.id === "rotavirus" && hasMixedRotavirusProducts(valid);

    if (!nextDose) {
      return {
        groupId: group.id,
        groupName: group.name[language],
        doseLabel: plannedDoses.at(-1)?.label[language] ?? group.name[language],
        status: doctorWarnings.length || mixedRotavirus ? "doctor-review" : "completed",
        category: group.category,
        reason: doctorWarnings.length
          ? text.doctorHealth
          : mixedRotavirus
            ? language === "vi"
              ? "Đã có đổi sản phẩm rota trong liệu trình, cần bác sĩ rà lại số liều hợp lệ."
              : "Rotavirus products were mixed in the series, so a clinician should review which doses count."
            : text.completed,
        validDoseCount: valid.length,
        invalidDoseCount: invalid.length,
        note: group.note[language],
      };
    }

    const previousDoseDate = valid.at(-1)?.date;
    const { recommendedDate, earliestDate, maximumReached } = nextDoseWindow(birth, check, nextDose, previousDoseDate);
    const earliestWithGrace = addDays(earliestDate, -profile.gracePeriodDays);
    const daysFromRecommended = differenceInDays(check, recommendedDate);
    const canCountToday = check >= earliestWithGrace;

    if (doctorWarnings.length || maximumReached || mixedRotavirus) {
      return {
        groupId: group.id,
        groupName: group.name[language],
        doseLabel: nextDose.label[language],
        status: "doctor-review",
        category: group.category,
        reason: mixedRotavirus
          ? language === "vi"
            ? "Đã có đổi sản phẩm rota trong liệu trình, cần bác sĩ rà lại số liều và tuổi tối đa."
            : "Rotavirus products were mixed in the series, so a clinician should review the counted doses and age limits."
          : maximumReached
            ? text.maxAge
            : text.doctorHealth,
        recommendedDate: formatDate(recommendedDate, language),
        earliestDate: formatDate(earliestDate, language),
        validDoseCount: valid.length,
        invalidDoseCount: invalid.length,
        note: group.note[language],
      };
    }

    if (!canCountToday) {
      return {
        groupId: group.id,
        groupName: group.name[language],
        doseLabel: nextDose.label[language],
        status: "not-eligible",
        category: group.category,
        reason: text.notEligible,
        recommendedDate: formatDate(recommendedDate, language),
        earliestDate: formatDate(earliestDate, language),
        validDoseCount: valid.length,
        invalidDoseCount: invalid.length,
        note: group.note[language],
      };
    }

    if (check < recommendedDate) {
      return {
        groupId: group.id,
        groupName: group.name[language],
        doseLabel: nextDose.label[language],
        status: "upcoming",
        category: group.category,
        reason: profile.gracePeriodDays ? `${text.upcoming} Grace period: ${profile.gracePeriodDays} days.` : text.upcoming,
        recommendedDate: formatDate(recommendedDate, language),
        earliestDate: formatDate(earliestDate, language),
        validDoseCount: valid.length,
        invalidDoseCount: invalid.length,
        note: group.note[language],
      };
    }

    if (daysFromRecommended > 35) {
      return {
        groupId: group.id,
        groupName: group.name[language],
        doseLabel: nextDose.label[language],
        status: "catch-up",
        category: group.category,
        reason: text.catchUp,
        recommendedDate: formatDate(recommendedDate, language),
        earliestDate: formatDate(earliestDate, language),
        validDoseCount: valid.length,
        invalidDoseCount: invalid.length,
        note: group.note[language],
      };
    }

    return {
      groupId: group.id,
      groupName: group.name[language],
      doseLabel: nextDose.label[language],
      status: "due",
      category: group.category,
      reason: text.due,
      recommendedDate: formatDate(recommendedDate, language),
      earliestDate: formatDate(earliestDate, language),
      validDoseCount: valid.length,
      invalidDoseCount: invalid.length,
      note: group.note[language],
    };
  });

  const summary = items.reduce(
    (acc, item) => {
      acc[item.status] += 1;
      return acc;
    },
    {
      due: 0,
      "catch-up": 0,
      upcoming: 0,
      "not-eligible": 0,
      completed: 0,
      "doctor-review": 0,
    } as Record<DoseStatus, number>,
  );

  return {
    ageLabel: ageLabel(birth, check, language),
    ageDays,
    profile,
    items,
    doctorWarnings,
    summary,
  };
}

export type SubstitutionResult = {
  status: "equivalent" | "partial" | "country-specific" | "doctor-review" | "same" | "unknown";
  title: string;
  explanation: string;
  sharedAntigens: string[];
  missingInCandidate: string[];
  addedInCandidate: string[];
};

export function checkSubstitution(
  previousProductId: string,
  candidateProductId: string,
  country: CountryCode,
  language: Language,
): SubstitutionResult {
  const previous = getVaccineProduct(previousProductId);
  const candidate = getVaccineProduct(candidateProductId);

  if (!previous || !candidate) {
    return {
      status: "unknown",
      title: language === "vi" ? "Chưa đủ dữ liệu sản phẩm" : "Not enough product data",
      explanation:
        language === "vi"
          ? "Cần nhập rõ tên vaccine hoặc thêm sản phẩm vào bảng ánh xạ kháng nguyên."
          : "Enter a known product or add it to the antigen mapping table.",
      sharedAntigens: [],
      missingInCandidate: [],
      addedInCandidate: [],
    };
  }

  const previousAntigens = new Set(previous.antigens);
  const candidateAntigens = new Set(candidate.antigens);
  const previousName = productDisplayName(previous, language);
  const candidateName = productDisplayName(candidate, language);
  const sharedAntigens = candidate.antigens.filter((antigen) => previousAntigens.has(antigen));
  const missingInCandidate = previous.antigens.filter((antigen) => !candidateAntigens.has(antigen));
  const addedInCandidate = candidate.antigens.filter((antigen) => !previousAntigens.has(antigen));
  const sameCountry = candidate.countries.includes(country);

  if (previous.id === candidate.id) {
    return {
      status: "same",
      title: language === "vi" ? "Cùng một sản phẩm" : "Same product",
      explanation:
        language === "vi"
          ? "Vẫn cần kiểm tra tuổi, khoảng cách tối thiểu và sàng lọc trước tiêm."
          : "Age, minimum interval, and pre-vaccination screening still need to be checked.",
      sharedAntigens,
      missingInCandidate,
      addedInCandidate,
    };
  }

  const sameAntigens =
    previous.antigens.length === candidate.antigens.length && previous.antigens.every((antigen) => candidateAntigens.has(antigen));
  const bothPcv = previous.groupIds.includes("pcv") && candidate.groupIds.includes("pcv");
  const bothRota = previous.groupIds.includes("rotavirus") && candidate.groupIds.includes("rotavirus");
  const bothMeningococcal = previous.groupIds.includes("meningococcal") && candidate.groupIds.includes("meningococcal");
  const bothHpv = previous.groupIds.includes("hpv") && candidate.groupIds.includes("hpv");

  if (!sameCountry) {
    return {
      status: "doctor-review",
      title: language === "vi" ? "Cần kiểm tra giấy phép/quốc gia" : "Check country authorization",
      explanation:
        language === "vi"
          ? `${candidateName} chưa được đánh dấu là sản phẩm sẵn có trong profile quốc gia đang chọn. Cần nhân viên y tế đối chiếu nguồn địa phương.`
          : `${candidateName} is not marked as available in the selected country profile. A clinician should check local guidance.`,
      sharedAntigens,
      missingInCandidate,
      addedInCandidate,
    };
  }

  if (sameAntigens && previous.groupIds.some((group) => candidate.groupIds.includes(group))) {
    return {
      status: "equivalent",
      title: language === "vi" ? "Có thể xem xét thay thế tương đương" : "Potentially equivalent substitution",
      explanation:
        language === "vi"
          ? "Hai sản phẩm có cùng nhóm kháng nguyên chính. Có thể dùng để tiếp tục lịch nếu đủ tuổi, đủ khoảng cách và không có chống chỉ định."
          : "The products share the same main antigen group. They may continue the series if age, interval, and contraindication checks pass.",
      sharedAntigens,
      missingInCandidate,
      addedInCandidate,
    };
  }

  if (missingInCandidate.length > 0 && sharedAntigens.length > 0) {
    return {
      status: "partial",
      title: language === "vi" ? "Thay thế một phần" : "Partial substitution",
      explanation:
        language === "vi"
          ? `${candidateName} thiếu một số thành phần so với ${previousName}. Cần kiểm tra riêng các kháng nguyên còn thiếu để tránh bỏ sót liều.`
          : `${candidateName} lacks some components from ${previousName}. Review missing antigens separately to avoid under-dosing.`,
      sharedAntigens,
      missingInCandidate,
      addedInCandidate,
    };
  }

  if (bothPcv || bothHpv) {
    return {
      status: "country-specific",
      title: language === "vi" ? "Cùng nhóm nhưng phụ thuộc sản phẩm/quốc gia" : "Same broad group, product/country-specific",
      explanation:
        language === "vi"
          ? "Hai vaccine cùng nhóm phòng bệnh nhưng khác type bao phủ hoặc chỉ định. Không nên tự động quy đổi như nhau."
          : "The products target the same broad disease group but differ in coverage or indications. Do not auto-convert them as identical.",
      sharedAntigens,
      missingInCandidate,
      addedInCandidate,
    };
  }

  if (bothRota || bothMeningococcal || previous.caution === "doctor-review" || candidate.caution === "doctor-review") {
    return {
      status: "doctor-review",
      title: language === "vi" ? "Cần bác sĩ đánh giá trước" : "Clinician review needed",
      explanation:
        language === "vi"
          ? "Nhóm vaccine này có quy tắc riêng về sản phẩm, tuổi, số liều hoặc type kháng nguyên. Không nên tự kết luận thay thế."
          : "This vaccine group has product, age, dose-count, or antigen-type rules. Do not decide interchangeability automatically.",
      sharedAntigens,
      missingInCandidate,
      addedInCandidate,
    };
  }

  return {
    status: "unknown",
    title: language === "vi" ? "Không thấy tương đương rõ ràng" : "No clear equivalence found",
    explanation:
      language === "vi"
        ? "Cần đối chiếu thành phần, lịch quốc gia và sổ tiêm với nhân viên y tế."
        : "Review components, national schedule, and vaccination record with a qualified professional.",
    sharedAntigens,
    missingInCandidate,
    addedInCandidate,
  };
}
