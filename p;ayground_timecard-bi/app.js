// 関数群

let masterData = [];

function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines[0].split(',');

  return lines.slice(1).map(line => {
    const values = line.split(',');
    const obj = {};
    headers.forEach((h, i) => {
      obj[h.trim()] = values[i]?.trim();
    });
    return obj;
  });
}

function calcWorkMinutes(row) {
  if (!row.start || !row.end) return 0;

  const [sh, sm] = row.start.split(':').map(Number);
  const [eh, em] = row.end.split(':').map(Number);

  const start = sh * 60 + sm;
  const end = eh * 60 + em;

  const breakMin = Number(row.break) || 0;

  return end - start - breakMin;
}

function filterByMonth(data, month) {
  if (month === 'all') return data;
  return data.filter(row => row.date.startsWith(month));
}

function getMonths(data) {
  const months = data
    .map(row => row.date.slice(0, 7))
    .filter(month => month);

  return [...new Set(months)];
}

function formatMinutes(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return `${hours}時間${mins}分`;
}

// 明細テーブルの作成
function renderDetailTable(data) {
  const tbody = document.getElementById('detailTableBody');
  if (!tbody) return;

  tbody.innerHTML = '';

  data.forEach(row => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${row.date || ''}</td>
      <td>${row.start || ''}</td>
      <td>${row.end || ''}</td>
      <td>${row.break || '0'}分</td>
      <td>${formatMinutes(row.workMinutes || 0)}</td>
    `;

    tbody.appendChild(tr);
  });
}

function updateSummary(data) {
  const total = data.reduce((sum, row) => {
    return sum + row.workMinutes;
  }, 0);

  document.getElementById('totalTime').textContent = formatMinutes(total);

  // 明細テーブルの描画
  renderDetailTable(data);
}

function buildMonthOptions(months) {
  const select = document.getElementById('monthFilter');

  select.innerHTML = '';

  const allOption = document.createElement('option');
  allOption.value = 'all';
  allOption.textContent = '全体　　▼';
  select.appendChild(allOption);

  months.forEach(month => {
    const option = document.createElement('option');
    option.value = month;
    // option.textContent = month;
    option.textContent = `${month} ▼`;
    select.appendChild(option);
  });
}

// メイン処理
fetch('sample.csv')
  .then(res => res.text())
  .then(text => {
    const data = parseCSV(text);

    const result = data.map(row => {
      return {
        ...row,
        workMinutes: calcWorkMinutes(row)
      };
    });

    masterData = result;
    buildMonthOptions(getMonths(masterData));
    
    document.getElementById('monthFilter').value = 'all';

    // データ整形
    const labels = result.map(row => row.date.slice(5));
    const values = result.map(row => row.workMinutes);

    // グラフ描画
    const chart = new Chart(document.getElementById('myChart'), {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: '労働時間（分）',
          data: values
        }]
      }
    });

    updateSummary(masterData);

    // フィルタイベント    
    document.getElementById('monthFilter').addEventListener('change', (e) => {
      const month = e.target.value;

      const filtered = filterByMonth(masterData, month);

      const labels = filtered.map(r => r.date.slice(5));
      const values = filtered.map(r => r.workMinutes);

      chart.data.labels = labels;
      chart.data.datasets[0].data = values;
      chart.update();

      updateSummary(filtered);
    });

    // ファイル読み込み
    document.getElementById('fileInput').addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();

      reader.onload = (event) => {
        const text = event.target.result;

        const data = parseCSV(text);

        const result = data.map(row => ({
          ...row,
          workMinutes: calcWorkMinutes(row)
        }));

        masterData = result;
        buildMonthOptions(getMonths(masterData));
        document.getElementById('monthFilter').value = 'all';

        // グラフ更新
        const labels = masterData.map(r => r.date.slice(5));
        const values = masterData.map(r => r.workMinutes);

        chart.data.labels = labels;
        chart.data.datasets[0].data = values;
        chart.update();

        updateSummary(masterData);
      };

      reader.readAsText(file);
    });
  });

