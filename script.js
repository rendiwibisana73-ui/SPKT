(function(){
    "use strict";

    // DOM elements
    const page1 = document.getElementById('page1');
    const page2 = document.getElementById('page2');
    const nextBtn = document.getElementById('nextToPage2');
    const backBtn = document.getElementById('backToPage1');
    const hpCountInput = document.getElementById('hpCount');
    const hpFormsContainer = document.getElementById('hpFormsContainer');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultSection = document.getElementById('resultSection');
    const rankingList = document.getElementById('rankingList');
    const detailMatrix = document.getElementById('detailMatrix');
    const page1Error = document.getElementById('page1Error');
    const page2Error = document.getElementById('page2Error');

    // Sliders
    const ramSlider = document.getElementById('ramWeight');
    const storageSlider = document.getElementById('storageWeight');
    const priceSlider = document.getElementById('priceWeight');
    const batterySlider = document.getElementById('batteryWeight');
    const ramVal = document.getElementById('ramWeightVal');
    const storageVal = document.getElementById('storageWeightVal');
    const priceVal = document.getElementById('priceWeightVal');
    const batteryVal = document.getElementById('batteryWeightVal');
    const totalSpan = document.getElementById('totalWeightDisplay');

    // Normalisasi sliders
    function normalizeSliders() {
        let wRam = parseFloat(ramSlider.value) || 0;
        let wSto = parseFloat(storageSlider.value) || 0;
        let wPri = parseFloat(priceSlider.value) || 0;
        let wBat = parseFloat(batterySlider.value) || 0;
        
        let total = wRam + wSto + wPri + wBat;
        if (total === 0) {
            ramSlider.value = 0.25;
            storageSlider.value = 0.25;
            priceSlider.value = 0.25;
            batterySlider.value = 0.25;
            wRam = wSto = wPri = wBat = 0.25;
            total = 1.0;
        } else {
            if (Math.abs(total - 1.0) > 0.001) {
                wRam = wRam / total;
                wSto = wSto / total;
                wPri = wPri / total;
                wBat = wBat / total;
                ramSlider.value = wRam;
                storageSlider.value = wSto;
                priceSlider.value = wPri;
                batterySlider.value = wBat;
            }
        }
        updateWeightLabels();
    }

    function updateWeightLabels() {
        const ram = parseFloat(ramSlider.value).toFixed(2);
        const sto = parseFloat(storageSlider.value).toFixed(2);
        const pri = parseFloat(priceSlider.value).toFixed(2);
        const bat = parseFloat(batterySlider.value).toFixed(2);
        ramVal.textContent = ram;
        storageVal.textContent = sto;
        priceVal.textContent = pri;
        batteryVal.textContent = bat;
        const total = (parseFloat(ram) + parseFloat(sto) + parseFloat(pri) + parseFloat(bat)).toFixed(2);
        totalSpan.textContent = total;
    }

    [ramSlider, storageSlider, priceSlider, batterySlider].forEach(s => {
        s.addEventListener('input', normalizeSliders);
    });

    // Init
    normalizeSliders();

    // Navigasi Page 1 -> Page 2
    nextBtn.addEventListener('click', function() {
        page1Error.textContent = '';
        const count = parseInt(hpCountInput.value, 10);
        if (isNaN(count) || count < 2 || count > 8) {
            page1Error.textContent = 'Jumlah HP harus antara 2 sampai 8.';
            return;
        }
        generateHPForms(count);
        page1.classList.add('hidden');
        page2.classList.remove('hidden');
        resultSection.classList.add('hidden');
    });

    backBtn.addEventListener('click', function() {
        page2.classList.add('hidden');
        page1.classList.remove('hidden');
        resultSection.classList.add('hidden');
    });

    function generateHPForms(n) {
        let html = '';
        for (let i = 1; i <= n; i++) {
            html += `
                <div class="hp-entry" data-hp-index="${i}">
                    <div class="hp-title">📱 HP ${i}</div>
                    <div class="two-cols">
                        <div class="hp-input-group">
                            <label>🚀 RAM (GB)</label>
                            <input type="number" class="hp-ram" placeholder="misal 8" min="0.1" step="0.1" value="${i===1?8: (i===2?6:4)}">
                        </div>
                        <div class="hp-input-group">
                            <label>💾 Storage (GB)</label>
                            <input type="number" class="hp-storage" placeholder="128" min="1" step="1" value="${i===1?256: (i===2?128:64)}">
                        </div>
                        <div class="hp-input-group">
                            <label>💰 Harga (Rp)</label>
                            <input type="number" class="hp-price" placeholder="5000000" min="0" step="10000" value="${i===1?4500000: (i===2?3800000:5500000)}">
                        </div>
                        <div class="hp-input-group">
                            <label>🔋 Baterai (mAh)</label>
                            <input type="number" class="hp-battery" placeholder="5000" min="100" step="50" value="${i===1?5000: (i===2?4500:6000)}">
                        </div>
                    </div>
                </div>
            `;
        }
        hpFormsContainer.innerHTML = html;
    }

    // Kalkulasi & Ranking
    calculateBtn.addEventListener('click', function() {
        page2Error.textContent = '';
        const hpEntries = document.querySelectorAll('.hp-entry');
        if (hpEntries.length === 0) {
            page2Error.textContent = 'Form HP belum tersedia.';
            return;
        }

        const wRam = parseFloat(ramSlider.value);
        const wSto = parseFloat(storageSlider.value);
        const wPri = parseFloat(priceSlider.value);
        const wBat = parseFloat(batterySlider.value);

        const hpData = [];
        let valid = true;
        
        for (let entry of hpEntries) {
            const ramInput = entry.querySelector('.hp-ram');
            const stoInput = entry.querySelector('.hp-storage');
            const priceInput = entry.querySelector('.hp-price');
            const batInput = entry.querySelector('.hp-battery');
            
            const ram = parseFloat(ramInput.value);
            const storage = parseFloat(stoInput.value);
            const price = parseFloat(priceInput.value);
            const battery = parseFloat(batInput.value);
            
            if (isNaN(ram) || isNaN(storage) || isNaN(price) || isNaN(battery) || ram<=0 || storage<=0 || price<=0 || battery<=0) {
                page2Error.textContent = 'Semua nilai harus diisi dengan angka > 0.';
                valid = false;
                break;
            }
            hpData.push({
                index: hpData.length + 1,
                ram, storage, price, battery
            });
        }
        if (!valid) return;

        const maxRam = Math.max(...hpData.map(h => h.ram));
        const maxStorage = Math.max(...hpData.map(h => h.storage));
        const maxBattery = Math.max(...hpData.map(h => h.battery));
        const minPrice = Math.min(...hpData.map(h => h.price));

        const results = hpData.map(hp => {
            const normRam = hp.ram / maxRam;
            const normStorage = hp.storage / maxStorage;
            const normBattery = hp.battery / maxBattery;
            const normPrice = minPrice / hp.price;
            
            const score = (normRam * wRam) + (normStorage * wSto) + (normPrice * wPri) + (normBattery * wBat);
            return {
                ...hp,
                normRam, normStorage, normBattery, normPrice,
                score,
                maxRam, maxStorage, maxBattery, minPrice
            };
        });

        results.sort((a,b) => b.score - a.score);
        displayResults(results, wRam, wSto, wPri, wBat);
    });

    function displayResults(sortedResults, wRam, wSto, wPri, wBat) {
        let rankHtml = '';
        sortedResults.forEach((res, idx) => {
            const medal = idx === 0 ? '🥇' : (idx === 1 ? '🥈' : (idx === 2 ? '🥉' : `${idx+1}.`));
            rankHtml += `
                <div class="rank-item">
                    <span>${medal} HP ${res.index}  <span style="opacity:0.7; font-size:0.9rem;">(${res.ram}GB/${res.storage}GB, Rp${res.price.toLocaleString()}, ${res.battery}mAh)</span></span>
                    <span class="score-badge">${res.score.toFixed(4)}</span>
                </div>
            `;
        });
        rankingList.innerHTML = rankHtml;

        const first = sortedResults[0];
        let matrixHtml = `<strong>📐 Normalisasi (RAM/Storage/Baterai dibagi max, Harga: min/harga)</strong><br>`;
        matrixHtml += `Max RAM: ${first.maxRam} GB | Max Storage: ${first.maxStorage} GB | Max Baterai: ${first.maxBattery} mAh | Harga termurah: Rp${first.minPrice.toLocaleString()}<br>`;
        matrixHtml += `Bobot: RAM ${wRam.toFixed(2)}, Storage ${wSto.toFixed(2)}, Harga ${wPri.toFixed(2)}, Baterai ${wBat.toFixed(2)}<br>`;
        matrixHtml += `<div style="margin-top:8px;">`;
        sortedResults.forEach(r => {
            matrixHtml += `HP${r.index}: RAM norm ${r.normRam.toFixed(3)}, Storage norm ${r.normStorage.toFixed(3)}, Harga norm ${r.normPrice.toFixed(3)}, Baterai norm ${r.normBattery.toFixed(3)} → skor ${r.score.toFixed(4)}<br>`;
        });
        matrixHtml += `</div>`;
        detailMatrix.innerHTML = matrixHtml;
        
        resultSection.classList.remove('hidden');
    }

    // Generate default form 3 HP
    generateHPForms(3);
})();