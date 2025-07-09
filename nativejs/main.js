document.addEventListener('DOMContentLoaded', function () {
    const periodInput = document.getElementById('period');
    const frequencySelect = document.getElementById('frequency');
    const totalCountSpan = document.getElementById('totalCount');

    function updateTotal() {
        const freq = parseInt(frequencySelect.value);
        const period = parseInt(periodInput.value);
        if (!isNaN(freq) && !isNaN(period)) {
            const total = freq * period;
            totalCountSpan.textContent = total;
        } else {
            totalCountSpan.textContent = '';
        }
    }

    frequencySelect.addEventListener('change', updateTotal);
    periodInput.addEventListener('input', updateTotal);

    document.getElementById('form').addEventListener('submit', function (e) {
        e.preventDefault();
        alert('Изменения сохранены!');
        // Здесь можно добавить отправку формы через fetch/AJAX
    });
});
