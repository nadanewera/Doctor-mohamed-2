const apiKey = "688fbe0d34a1869ccb290ae7";
let prescriptions = JSON.parse(localStorage.getItem('prescriptions')) || [];

const form = document.getElementById('prescription-form');
const prescriptionsList = document.getElementById('prescriptions-list');
const loader = document.getElementById('load');

loader.style.display = 'none';

renderPrescriptions();

form.addEventListener('submit', function(event) {
    event.preventDefault();

    showLoader();

    const isEdit = form.getAttribute('data-edit-id');
    const prescription = {
        id: isEdit ? parseInt(isEdit) : Date.now(),
        apiKey: apiKey,
        name: document.getElementById('name').value,
        count: document.getElementById('count').value,
        age: document.getElementById('age').value,
        feed: document.getElementById('feed').value,
        diagnosis: document.getElementById('diagnosis').value,
        weight: document.getElementById('weight').value,
        date: document.getElementById('date').value,
        notes: document.getElementById('notes').value
    };

    if (isEdit) {
        const index = prescriptions.findIndex(p => p.id === parseInt(isEdit));
        prescriptions[index] = prescription;
        form.removeAttribute('data-edit-id');
    } else {
        prescriptions.push(prescription);
    }

    saveToLocalStorage();
    form.reset();
    renderPrescriptions();
});

function renderPrescriptions() {
    showLoader();

    setTimeout(() => {
        prescriptionsList.innerHTML = '';

        if (prescriptions.length === 0) {
            prescriptionsList.innerHTML = '<p class="text-center text-muted">لا توجد روشتات.</p>';
        } else {
            prescriptions.forEach(p => {
                const card = document.createElement('div');
                card.className = 'card mb-3';
                card.innerHTML = `
                    <div class="card-body">
                        <h5 class="card-title text-danger">${p.name}</h5>
                        <p class="card-text mb-1"><strong>العدد:</strong> ${p.count}</p>
                        <p class="card-text mb-1"><strong>العمر:</strong> ${p.age}</p>
                        <p class="card-text mb-1"><strong>العلف:</strong> ${p.feed}</p>
                        <p class="card-text mb-1"><strong>التشخيص:</strong> ${p.diagnosis}</p>
                        <p class="card-text mb-1"><strong>الوزن:</strong> ${p.weight}</p>
                        <p class="card-text mb-1"><strong>التاريخ:</strong> ${p.date}</p>
                        <p class="card-text mb-1"><strong>ملاحظات:</strong> ${p.notes || '-'}</p>
                        <div class="d-flex justify-content-end">
                            <i class="fa-solid fa-pen-to-square text-primary mx-2" style="cursor:pointer;" onclick="editPrescription(${p.id})"></i>
                            <i class="fa-solid fa-trash text-danger mx-2" style="cursor:pointer;" onclick="deletePrescription(${p.id})"></i>
                        </div>
                    </div>
                `;
                prescriptionsList.appendChild(card);
            });
        }

        hideLoader();
    }, 500);
}

function editPrescription(id) {
    const prescription = prescriptions.find(p => p.id === id);
    if (prescription) {
        document.getElementById('name').value = prescription.name;
        document.getElementById('count').value = prescription.count;
        document.getElementById('age').value = prescription.age;
        document.getElementById('feed').value = prescription.feed;
        document.getElementById('diagnosis').value = prescription.diagnosis;
        document.getElementById('weight').value = prescription.weight;
        document.getElementById('date').value = prescription.date;
        document.getElementById('notes').value = prescription.notes || '';
        form.setAttribute('data-edit-id', id);
    }
}

function deletePrescription(id) {
    showLoader();
    setTimeout(() => {
        prescriptions = prescriptions.filter(p => p.id !== id);
        saveToLocalStorage();
        renderPrescriptions();
    }, 300);
}

function saveToLocalStorage() {
    localStorage.setItem('prescriptions', JSON.stringify(prescriptions));
}

function showLoader() {
    loader.style.display = 'block';
    prescriptionsList.style.display = 'none';
}

function hideLoader() {
    loader.style.display = 'none';
    prescriptionsList.style.display = 'block';
}
