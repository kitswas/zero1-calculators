(function () {
    const MONTHS_IN_FIRST_THREE_YEARS = 36;
    const YEARS_OF_EARLY_INFLATION = 3;
    const YEARS_OF_EDUCATION_INFLATION = 15;
    const YEARS_OF_COACHING_INFLATION = 10;
    const YEARS_OF_HEALTHCARE_INFLATION = 6;
    const DEFAULT_INFLATION_RATES = { general: 0.06, education: 0.10, healthcare: 0.08 };
    const DEFAULT_INFLATION_FACTORS = { early: 1.18, education: 2.16, coaching: 1.8, healthcare: 1.6 };
    const EDUCATION_STAGES = [
        { name: 'Pre-Primary (Age 3-5)', years: 2, feeRow: 0 },
        { name: 'Primary (Class 1-5)', years: 5, feeRow: 1 },
        { name: 'Middle School (Class 6-8)', years: 3, feeRow: 2 },
        { name: 'Secondary (Class 9-10)', years: 2, feeRow: 3 },
        { name: 'Higher Secondary (Class 11-12)', years: 2, feeRow: 4 }
    ];
    const SCHOOL_COLUMNS = [
        { name: 'Government', key: 'govt' },
        { name: 'Private Mid-Range', key: 'mid' },
        { name: 'Private Premium', key: 'prem' }
    ];
    const EDUCATION_ITEMS = [
        { name: 'Pre-Primary (Age 3-5) — Nursery/KG', values: [3000, 50000, 150000], notes: '2 years — playschool + KG' },
        { name: 'Primary (Class 1-5)', values: [5000, 80000, 200000], notes: 'CMS 2025: govt avg ₹2,863/yr' },
        { name: 'Middle School (Class 6-8)', values: [6000, 100000, 250000], notes: 'Fees rise with class level' },
        { name: 'Secondary (Class 9-10)', values: [8000, 120000, 300000], notes: 'Board exam year — extra pressure' },
        { name: 'Higher Secondary (Class 11-12)', values: [10000, 140000, 350000], notes: 'Stream choice adds cost (Science > Arts)' },
        { name: 'Books & Stationery', values: [2000, 5000, 10000], notes: 'CMS 2025 avg: ₹2,002' },
        { name: 'Uniform (2 sets/year)', values: [2000, 5000, 8000], notes: 'Branded uniforms cost more' },
        { name: 'School Transport', values: [0, 20000, 36000], notes: 'CMS 2025 avg: ₹1,842. School bus/van' },
        { name: 'Activities & Sports Fees', values: [0, 15000, 30000], notes: 'Swimming, music, art, robotics' },
        { name: 'School Trips & Events', values: [500, 5000, 15000], notes: 'Excursions, annual day, sports day' },
        { name: 'Devices — Tablet/Laptop (amortized)', values: [0, 5000, 10000], notes: 'One device every 3-4 years' },
        { name: 'Projects, Competitions, Exams', values: [500, 4000, 8000], notes: 'Science fairs, olympiads, registration' }
    ];
    const BIRTH_ITEMS = [
        ['Fertility tests / pre-conception checkups', 5000, '3,000 – 15,000', 'Optional but common in metro cities'],
        ['Prenatal vitamins & supplements (9 months)', 9000, '5,000 – 15,000', 'Folic acid, iron, calcium, DHA'],
        ['OB-GYN consultation visits (10-12 visits)', 15000, '5,000 – 30,000', '₹500-2,500 per visit private'],
        ['Ultrasound scans (3-5 scans)', 8000, '3,000 – 15,000', 'NT scan, anomaly scan, growth scans'],
        ['Blood tests & lab work', 8000, '4,000 – 15,000', 'CBC, thyroid, glucose, infections'],
        ['Medicines during pregnancy', 5000, '2,000 – 10,000', 'Supplements + any prescribed meds'],
        ['Maternity clothing', 8000, '3,000 – 15,000', 'Comfortable wear for 6+ months'],
        ['Prenatal classes (optional)', 5000, '0 – 10,000', 'Lamaze, birthing workshops'],
        ["Mother's nutrition — extra food cost (9 months)", 27000, '15,000 – 40,000', '~₹3,000/month extra nutrition'],
        ['Travel to hospital / clinic', 5000, '2,000 – 10,000', 'Cab rides for checkups'],
        ['Normal delivery — hospital charges', 60000, '2,299 – 80,000', 'NSO avg: ₹2,299 public / ₹37,630 private'],
        ['C-section delivery (if needed)', 80000, '20,000 – 2,00,000', 'Emergency C-section adds significant cost'],
        ['Hospital room charges (2-4 days)', 30000, '0 – 50,000', 'Semi-private to private room'],
        ['Anesthesia & OT charges', 10000, '5,000 – 25,000', 'Included in some packages'],
        ['Newborn screening tests', 4500, '1,500 – 8,000', 'Hearing, metabolic screening'],
        ["Mother's recovery & postpartum care", 10000, '5,000 – 20,000', 'Follow-up visits, medicines'],
        ["Baby's first pediatrician visits (first month)", 3000, '1,500 – 5,000', '2-3 visits in first month'],
        ['Baby essentials — initial setup', 25000, '10,000 – 60,000', 'Crib, car seat, stroller, clothes, bottles']
    ].map(([name, value, range, note]) => ({ name, value, range, note }));
    const EARLY_ITEMS = [
        ['Baby formula / supplementary food', 3000, '1,500 – 6,000', 'Breastfeeding reduces this significantly'],
        ['Baby cereal, purees, snacks (6+ months)', 2000, '1,000 – 4,000', 'Homemade vs store-bought matters'],
        ['Diapers (5-6/day average)', 3000, '2,000 – 5,000', '~₹35,000-70,000 over 2.5 years'],
        ['Wipes, rash cream, baby soap, oil', 1500, '800 – 3,000', 'Monthly consumables'],
        ['Pediatrician visits (1-2/month)', 2000, '1,000 – 4,000', 'Regular checkups + sick visits'],
        ['Vaccines (private — monthly average)', 1500, '500 – 3,000', 'IAP schedule: ₹20,000-50,000 total over 2 yrs'],
        ['Medicines (fever, cough, stomach)', 1000, '500 – 2,000', 'Common illnesses are frequent'],
        ['Daycare / creche', 8000, '5,000 – 20,000', 'Metro daycare: ₹8K-20K/month'],
        ['Nanny / domestic help (baby-dedicated)', 10000, '5,000 – 18,000', 'Full-time nanny in metros: ₹10K-18K'],
        ['Baby clothes (they outgrow fast)', 2000, '1,000 – 4,000', 'New sizes every 2-3 months'],
        ['Toys, books, learning aids', 1000, '500 – 3,000', 'Stimulation matters for development'],
        ['Baby gear maintenance / replacement', 500, '200 – 1,500', 'Stroller repairs, new bottles, etc.']
    ].map(([name, value, range, note]) => ({ name, value, range, note }));
    const COACHING_ITEMS = [
        ['Secondary (Class 9-10) — Board prep', 48000, 2, 'CMS avg: ₹4,183/yr. Board coaching: ₹3K-5K/month'],
        ['Higher Sec (11-12) — Stream coaching', 72000, 2, 'CMS avg: ₹6,384/yr. Science stream: ₹5K-8K/month'],
        ['Competitive Exam Prep (JEE/NEET/CLAT)', 150000, 2, 'Kota-style coaching: ₹1-2.5L/year'],
        ['Hobby/Skill Classes (coding, music, sports)', 40000, 10, '₹2,000/month average across years']
    ].map(([name, annual, years, note]) => ({ name, annual, years, note }));
    const HEALTHCARE_ITEMS = [
        ['Government UIP vaccines (free)', 0, 'BCG, OPV, Pentavalent, MR — free at govt centres'],
        ['Private vaccination (IAP full schedule)', 40000, '₹20,000-50,000 total. Painless options cost more'],
        ['Optional vaccines (Varicella, Hep A, HPV)', 15000, 'Not in UIP but recommended by pediatricians'],
        ['Pediatrician visits — year 1 (12 visits)', 18000, '₹1,000-2,500 per visit'],
        ['Pediatrician visits — year 2-5 (6/year × 4 yrs)', 36000, 'Reducing frequency as child grows'],
        ['Doctor visits — age 6-18 (3/year × 13 yrs)', 58500, '₹1,500/visit average'],
        ['Medicines & OTC supplies (18 years)', 108000, '~₹500/month average over 18 years'],
        ['Dental care (age 5-18)', 50000, 'Braces alone: ₹30,000-80,000'],
        ['Eye care / spectacles', 20000, 'Screen time = early specs for many kids'],
        ['Health insurance premium — child add-on (18 yrs)', 180000, '~₹10,000/year additional premium'],
        ['Emergency medical fund (contingency)', 100000, 'NICU, accidents, surgeries — hope you don’t need it'],
        ['Hospitalization (1-2 episodes in 18 yrs)', 50000, 'Dengue, fractures, infections — common']
    ].map(([name, value, note]) => ({ name, value, note }));

    let emergencyBuffer = 1075500;
    const money = value => '₹' + Math.round(value).toLocaleString('en-IN');
    const valueInput = (value, label, attrs = '', id = '') =>
        `<input id="${id}" type="number" step="any" min="0" value="${value}" aria-label="${label}" data-cost-input ${attrs} class="w-32 min-w-24 px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800">`;
    const row = (name, input, notes, extra = '') =>
        `<tr><td class="py-3 px-4 font-medium">${name}</td><td class="py-3 px-4">${input}</td>${extra}<td class="py-3 px-4 text-xs text-slate-500">${notes}</td></tr>`;
    function annualIncome() {
        const income = Number(document.getElementById('child-income').value) || 0;
        const partnerIncome = Number(document.getElementById('child-partner-income').value) || 0;
        return (income + partnerIncome) * 12;
    }

    function renderTables() {
        document.getElementById('child-birth-costs').innerHTML = BIRTH_ITEMS.map((item, index) =>
            row(item.name, valueInput(item.value, item.name, `data-group="birth" data-index="${index}"`, `child-birth-${index}`), item.note,
                `<td class="py-3 px-4 text-slate-500">${item.range}</td>`)).join('');
        document.getElementById('child-early-costs').innerHTML = EARLY_ITEMS.map((item, index) =>
            row(item.name, valueInput(item.value, item.name, `data-group="early" data-index="${index}"`, `child-early-${index}`), item.note,
                `<td class="py-3 px-4 text-slate-500">${item.range}</td>`)).join('');
        document.getElementById('child-education-costs').innerHTML = EDUCATION_ITEMS.map((item, index) =>
            `<tr><td class="py-3 px-4 font-medium">${item.name}</td>${item.values.map((value, column) =>
                `<td class="py-3 px-4">${valueInput(value, `${item.name}, ${SCHOOL_COLUMNS[column].name}`, `data-group="education" data-index="${index}" data-column="${column}"`, `child-education-${index}-${column}`)}</td>`
            ).join('')}<td class="py-3 px-4 text-xs text-slate-500">${item.notes}</td></tr>`).join('') +
            `<tr class="bg-slate-50 font-semibold"><td class="py-3 px-4">One-time Admission / Registration Fees</td>${[5000, 50000, 200000].map((value, column) =>
                `<td class="py-3 px-4">${valueInput(value, `Admission fees, ${SCHOOL_COLUMNS[column].name}`, `data-group="admission" data-column="${column}"`, `child-admission-${column}`)}</td>`
            ).join('')}<td class="py-3 px-4 text-xs text-slate-500">One-time cost</td></tr>`;
        document.getElementById('child-coaching-costs').innerHTML = COACHING_ITEMS.map((item, index) =>
            `<tr><td class="py-3 px-4 font-medium">${item.name}</td><td class="py-3 px-4">${valueInput(item.annual, item.name, `data-group="coaching" data-index="${index}"`, `child-coaching-${index}`)}</td><td class="py-3 px-4">${valueInput(item.years, `${item.name} years`, `data-group="coaching-years" data-index="${index}"`, `child-coaching-years-${index}`)}</td><td class="py-3 px-4 text-xs text-slate-500">${item.note}</td></tr>`).join('');
        document.getElementById('child-healthcare-costs').innerHTML = HEALTHCARE_ITEMS.map((item, index) =>
            `<tr><td class="py-3 px-4 font-medium">${item.name}</td><td class="py-3 px-4">${valueInput(item.value, item.name, `data-group="healthcare" data-index="${index}"`, `child-healthcare-${index}`)}</td><td class="py-3 px-4 text-xs text-slate-500">${item.note}</td></tr>`).join('');
    }

    function currentValue(input) {
        return Math.max(0, Number(input.value) || 0);
    }

    function stageTotals(admissions) {
        const fees = EDUCATION_ITEMS.slice(0, 5);
        const annualItems = EDUCATION_ITEMS;
        return SCHOOL_COLUMNS.map((school, column) => {
            const stages = EDUCATION_STAGES.map(stage => {
                const stageBase = fees[stage.feeRow].values[column];
                const addOns = annualItems.slice(5).reduce((sum, item) => sum + item.values[column], 0);
                const annual = stageBase + addOns;
                return annual * stage.years;
            });
            const admission = admissions[column];
            return { school, stages, total: stages.reduce((sum, value) => sum + value, 0) + admission };
        });
    }

    function readEducation() {
        const table = document.getElementById('child-education-costs');
        const inputs = [...table.querySelectorAll('[data-cost-input]')];
        EDUCATION_ITEMS.forEach((item, index) => item.values = inputs
            .filter(input => input.dataset.group === 'education' && Number(input.dataset.index) === index)
            .map(currentValue));
        const admissionInputs = inputs.filter(input => input.dataset.group === 'admission');
        const admissions = admissionInputs.map(currentValue);
        return { stages: stageTotals(admissions) };
    }

    function updateSummary() {
        const birth = [...document.querySelectorAll('[data-group="birth"]')].reduce((sum, input) => sum + currentValue(input), 0);
        const earlyMonthly = [...document.querySelectorAll('[data-group="early"]')].reduce((sum, input) => sum + currentValue(input), 0);
        const earlyTotal = earlyMonthly * MONTHS_IN_FIRST_THREE_YEARS;
        const coaching = [...document.querySelectorAll('[data-group="coaching"]')].reduce((sum, input, index) =>
            sum + currentValue(input) * currentValue(document.querySelector(`[data-group="coaching-years"][data-index="${index}"]`)), 0);
        const healthcare = [...document.querySelectorAll('[data-group="healthcare"]')].reduce((sum, input) => sum + currentValue(input), 0);
        const { stages } = readEducation();
        const bufferInput = document.getElementById('child-emergency-buffer');
        emergencyBuffer = currentValue(bufferInput);
        const generalInflation = (Number(document.getElementById('child-general-inflation').value) || 0) / 100;
        const educationInflation = (Number(document.getElementById('child-education-inflation').value) || 0) / 100;
        const healthcareInflation = (Number(document.getElementById('child-health-inflation').value) || 0) / 100;
        const earlyInflationFactor = DEFAULT_INFLATION_FACTORS.early *
            (1 + YEARS_OF_EARLY_INFLATION * generalInflation) / (1 + YEARS_OF_EARLY_INFLATION * DEFAULT_INFLATION_RATES.general);
        const schoolInflationFactor = DEFAULT_INFLATION_FACTORS.education *
            Math.pow((1 + educationInflation) / (1 + DEFAULT_INFLATION_RATES.education), YEARS_OF_EDUCATION_INFLATION);
        const coachingInflationFactor = DEFAULT_INFLATION_FACTORS.coaching *
            Math.pow((1 + generalInflation) / (1 + DEFAULT_INFLATION_RATES.general), YEARS_OF_COACHING_INFLATION);
        const healthcareInflationFactor = DEFAULT_INFLATION_FACTORS.healthcare *
            Math.pow((1 + healthcareInflation) / (1 + DEFAULT_INFLATION_RATES.healthcare), YEARS_OF_HEALTHCARE_INFLATION);
        const baseCosts = stages.map(stage => {
            const school = stage.total;
            const today = birth + earlyTotal + school + coaching + healthcare + emergencyBuffer;
            const inflated = birth + earlyTotal * earlyInflationFactor + school * schoolInflationFactor +
                coaching * coachingInflationFactor + healthcare * healthcareInflationFactor + emergencyBuffer * healthcareInflationFactor;
            return { today, inflated };
        });

        document.getElementById('child-annual-income').textContent = money(annualIncome());
        document.getElementById('child-birth-total').textContent = money(birth);
        document.getElementById('child-early-monthly').textContent = money(earlyMonthly);
        document.getElementById('child-early-total').textContent = money(earlyTotal);
        document.getElementById('child-healthcare-total').textContent = money(healthcare);
        document.getElementById('child-coaching-total').textContent = money(coaching);

        const stageBody = document.getElementById('child-education-stages');
        stageBody.innerHTML = EDUCATION_STAGES.map((stage, stageIndex) =>
            `<tr><td class="py-3 px-4 font-medium">${stage.name}</td><td class="py-3 px-4">${stage.years}</td>${stages.map(total =>
                `<td class="py-3 px-4">${money(total.stages[stageIndex])}</td>`).join('')}</tr>`).join('');
        document.getElementById('child-education-totals').innerHTML =
            `<tr><td class="py-3 px-4">Total including admission fees</td><td></td>${stages.map(total =>
                `<td class="py-3 px-4">${money(total.total)}</td>`).join('')}</tr>`;

        document.getElementById('child-summary-paths').innerHTML = stages.map((stage, index) =>
            `<tr><td class="py-3 px-4 font-medium">${stage.school.label}</td><td class="py-3 px-4">${money(stage.total)}</td><td class="py-3 px-4">${money(baseCosts[index].today)}</td><td class="py-3 px-4 font-bold">${money(baseCosts[index].inflated)}</td></tr>`).join('');
        const selectedStage = stages.find(stage => stage.school.key === document.getElementById('child-school-type').value);
        document.getElementById('summary-school-cost').textContent = money(selectedStage ? selectedStage.total : stages[1].total);
        const chosen = stages.findIndex(stage => stage.school.key === document.getElementById('child-school-type').value);
        const summaryIndex = chosen < 0 ? 1 : chosen;
        document.getElementById('summary-total-today').textContent = money(baseCosts[summaryIndex].today);
        document.getElementById('summary-total-inflated').textContent = money(baseCosts[summaryIndex].inflated);
    }

    function setProfileDefaults() {
        const hospital = document.getElementById('child-hospital-type');
        hospital.addEventListener('change', () => {
            const delivery = document.querySelector('[data-group="birth"][data-index="10"]');
            delivery.value = hospital.value === 'public' ? 2299 : 60000;
            updateSummary();
        });
        const support = document.getElementById('childcare-support');
        support.addEventListener('change', () => {
            const daycare = document.querySelector('[data-group="early"][data-index="7"]');
            const nanny = document.querySelector('[data-group="early"][data-index="8"]');
            daycare.value = support.value === 'Grandparents' || support.value === 'Nanny Only' ? 0 : 8000;
            nanny.value = support.value === 'Grandparents' || support.value === 'Daycare Only' ? 0 : 10000;
            updateSummary();
        });
    }

    window.initializeChildCalculator = function () {
        renderTables();
        document.getElementById('child-emergency-buffer').value = emergencyBuffer;
        setProfileDefaults();
        document.getElementById('route-child').addEventListener('input', updateSummary);
        document.getElementById('route-child').addEventListener('change', updateSummary);
        updateSummary();
    };
    window.updateChildSummary = updateSummary;
})();
