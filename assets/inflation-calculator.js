(function () {
    const STANDARD_INFLATION_RATE = 0.06;
    const GOAL_INFLATION_RATE = 0.10;
    const PROJECTION_YEARS = 30;
    const CHART_INTERVAL_YEARS = 5;
    const RUPEES_PER_LAKH = 100000;
    const PERCENTAGE_MULTIPLIER = 100;

    function calculateInflation(categories) {
        const rates = categories.map(cat => {
            if (cat.now > 0 && cat.before > 0 && cat.years > 0) {
                return Math.pow(cat.now / cat.before, 1 / cat.years) - 1;
            }
            return cat.now === 0 ? 0 : cat.stdVal;
        });
        const totalNow = categories.reduce((total, cat) => total + cat.now, 0);
        const weightedRateSum = categories.reduce((total, cat, index) => total + cat.now * rates[index], 0);
        const personalRate = totalNow > 0 ? weightedRateSum / totalNow : STANDARD_INFLATION_RATE;
        const projections = [];
        let currentValues = categories.map(cat => cat.now);
        let standardValues = categories.map(cat => cat.now);

        for (let year = 0; year <= PROJECTION_YEARS; year++) {
            projections.push({
                year,
                currentValues,
                total: currentValues.reduce((total, value) => total + value, 0),
                standardTotal: standardValues.reduce((total, value) => total + value, 0)
            });
            currentValues = currentValues.map((value, index) => value * (1 + rates[index]));
            standardValues = standardValues.map(value => value * (1 + STANDARD_INFLATION_RATE));
        }

        return { rates, totalNow, personalRate, projections };
    }

    function calculateGoal(costToday, years) {
        const standardCost = costToday * Math.pow(1 + STANDARD_INFLATION_RATE, years);
        const realCost = costToday * Math.pow(1 + GOAL_INFLATION_RATE, years);
        return { standardCost, realCost, shortfall: realCost - standardCost };
    }

    function createInflationCalculator(root, categories) {
        let chartInstance = null;
        const formatCurrency = value => '₹' + Math.round(value).toLocaleString('en-IN');
        const get = selector => root.querySelector(selector);

        function updateProjections(result) {
            const canvas = get('#projectionChart');
            if (!canvas) return;
            const tbody = get('#projection-table tbody');
            tbody.innerHTML = '';

            const chartRows = result.projections.filter(({ year }) => year % CHART_INTERVAL_YEARS === 0 || year <= CHART_INTERVAL_YEARS);
            result.projections.forEach(({ year, currentValues, total, standardTotal }) => {
                const tr = document.createElement('tr');
                tr.className = year % CHART_INTERVAL_YEARS === 0 ? "bg-zero1-50/50 font-semibold" : "hover:bg-slate-50";
                tr.innerHTML = `
                    <td class="py-2.5 px-4 text-slate-700">Year ${year}</td>
                    <td class="py-2.5 px-4 text-xs text-slate-600">${formatCurrency(currentValues[0])}</td>
                    <td class="py-2.5 px-4 text-xs text-slate-600">${formatCurrency(currentValues[1])}</td>
                    <td class="py-2.5 px-4 text-xs text-slate-600">${formatCurrency(currentValues[2])}</td>
                    <td class="py-2.5 px-4 text-xs text-slate-600">${formatCurrency(currentValues[3])}</td>
                    <td class="py-2.5 px-4 text-xs text-slate-600">${formatCurrency(currentValues[4])}</td>
                    <td class="py-2.5 px-4 text-xs text-slate-600">${formatCurrency(currentValues[5])}</td>
                    <td class="py-2.5 px-4 font-bold text-zero1-600">${formatCurrency(total)}</td>
                    <td class="py-2.5 px-4 text-slate-500">${formatCurrency(standardTotal)}</td>
                `;
                tbody.appendChild(tr);
            });

            if (chartInstance) chartInstance.destroy();
            chartInstance = new Chart(canvas.getContext('2d'), {
                type: 'line',
                data: {
                    labels: chartRows.map(({ year }) => 'Year ' + year),
                    datasets: [
                        { label: 'TOTAL (Your Real Rate)', data: chartRows.map(row => row.total), borderColor: '#ff5722', backgroundColor: 'rgba(255, 87, 34, 0.08)', borderWidth: 3, fill: true, tension: 0.2 },
                        { label: `If it were ${STANDARD_INFLATION_RATE * PERCENTAGE_MULTIPLIER}% (Standard)`, data: chartRows.map(row => row.standardTotal), borderColor: '#94a3b8', borderWidth: 2, borderDash: [5, 5], fill: false, tension: 0.2 }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { labels: { color: '#334155' }, position: 'bottom' } },
                    scales: {
                        x: { ticks: { color: '#64748b' }, grid: { color: '#e2e8f0' } },
                        y: { ticks: { color: '#64748b', callback: value => '₹' + (value >= RUPEES_PER_LAKH ? (value / RUPEES_PER_LAKH).toFixed(1) + ' Lakhs' : value) }, grid: { color: '#e2e8f0' } }
                    }
                }
            });
        }

        function updateGoal() {
            const costToday = parseFloat(get('#goal-cost').value) || 0;
            const years = parseFloat(get('#goal-years').value) || 0;
            const result = calculateGoal(costToday, years);
            get('#goal-wrong-cost').innerText = formatCurrency(result.standardCost);
            get('#goal-real-cost').innerText = formatCurrency(result.realCost);
            get('#goal-shortfall').innerText = formatCurrency(result.shortfall);
        }

        function calculate() {
            const tableBody = get('#inflation-table tbody');
            if (!tableBody) return;
            const result = calculateInflation(categories);
            tableBody.innerHTML = '';
            categories.forEach((category, index) => {
                const tr = document.createElement('tr');
                tr.className = "hover:bg-slate-50 transition-colors border-b border-slate-100";
                tr.innerHTML = `
                    <td class="py-3 px-4 font-medium text-slate-800">${category.name}</td>
                    <td class="py-3 px-4"><input type="number" value="${category.now}" data-index="${index}" data-field="now" class="w-28 px-2.5 py-1.5 bg-white border border-slate-300 text-slate-800 rounded-lg text-sm focus:ring-2 focus:ring-zero1-500 focus:outline-none"></td>
                    <td class="py-3 px-4"><input type="number" value="${category.before}" data-index="${index}" data-field="before" class="w-28 px-2.5 py-1.5 bg-white border border-slate-300 text-slate-800 rounded-lg text-sm focus:ring-2 focus:ring-zero1-500 focus:outline-none"></td>
                    <td class="py-3 px-4"><input type="number" value="${category.years}" data-index="${index}" data-field="years" class="w-16 px-2.5 py-1.5 bg-white border border-slate-300 text-slate-800 rounded-lg text-sm focus:ring-2 focus:ring-zero1-500 focus:outline-none"></td>
                    <td class="py-3 px-4 text-slate-500 text-xs">${category.stdRate}</td>
                    <td class="py-3 px-4 font-bold text-zero1-600">${(result.rates[index] * PERCENTAGE_MULTIPLIER).toFixed(1)}%</td>
                `;
                tableBody.appendChild(tr);
            });

            get('#total-spend').innerText = formatCurrency(result.totalNow);
            get('#summary-personal-rate').innerText = (result.personalRate * PERCENTAGE_MULTIPLIER).toFixed(1) + '%';
            const diff = result.personalRate * PERCENTAGE_MULTIPLIER - STANDARD_INFLATION_RATE * PERCENTAGE_MULTIPLIER;
            const diffElement = get('#price-diff');
            diffElement.innerText = (diff >= 0 ? '+' : '') + diff.toFixed(1) + '%';
            diffElement.className = diff >= 0 ? "text-2xl font-bold text-zero1-600" : "text-2xl font-bold text-emerald-600";

            updateProjections(result);
            updateGoal();
        }

        root.addEventListener('input', event => {
            const target = event.target;
            if (target.dataset && target.dataset.index !== undefined) {
                const index = parseInt(target.dataset.index, 10);
                categories[index][target.dataset.field] = parseFloat(target.value) || 0;
                calculate();
            } else if (target.id === 'goal-cost' || target.id === 'goal-years') {
                updateGoal();
            }
        });

        return { calculate };
    }

    window.ZERO1.inflation = { calculate: calculateInflation, calculateGoal };
    window.ZERO1.createInflationCalculator = createInflationCalculator;
})();
