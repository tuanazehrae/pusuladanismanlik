let myModal = null;

function panelModaliAc() {
    if (!myModal) {
        myModal = new bootstrap.Modal(document.getElementById('loginModal'));
    }
    
    const modalBody = document.getElementById('modalBody');
    const aktifGiris = localStorage.getItem('aktifDanisanPhone');
    
    if (aktifGiris) {
        panelIceriginiGoster(aktifGiris);
    } else {
        modalBody.innerHTML = `
            <div id="loginFormArea">
                <p class="text-muted small">Seans geçmişinizi kaydetmek ve görüntülemek için telefon numaranızla giriş yapın.</p>
                <div class="mb-3">
                    <label class="form-label fw-semibold">Telefon Numaranız</label>
                    <input type="tel" class="form-control" id="loginPhone" placeholder="05xx xxx xx xx" required>
                </div>
                <button type="button" class="btn btn-primary w-100 fw-bold" onclick="danisanGirisYap()">Giriş Yap / Hesap Oluştur</button>
            </div>
        `;
    }
    myModal.show();
}

function panelModaliKapat() {
    if (myModal) myModal.hide();
}

function danisanGirisYap() {
    const phoneInput = document.getElementById('loginPhone').value.trim();
    if (!phoneInput) {
        alert("Lütfen telefon numaranızı giriniz.");
        return;
    }
    // Kullanıcı yoksa bile otomatik oluşturup giriş yaptırıyoruz
    localStorage.setItem('aktifDanisanPhone', phoneInput);
    panelIceriginiGoster(phoneInput);
}

function panelIceriginiGoster(phone) {
    const seanslar = JSON.parse(localStorage.getItem('pusula_seanslar')) || [];
    const kullanıcıSeanslari = seanslar.filter(s => s.telefon === phone);

    const modalBody = document.getElementById('modalBody');
    let seansListesiHTML = "";
    
    if(kullanıcıSeanslari.length === 0) {
        seansListesiHTML = `<p class="text-muted small text-center my-3">Henüz kaydedilmiş geçmiş seansınız bulunmuyor.</p>`;
    } else {
        kullanıcıSeanslari.forEach(s => {
            seansListesiHTML += `
                <div class="card mb-2 border-start border-success border-3 shadow-sm">
                    <div class="card-body p-2 d-flex justify-content-between align-items-center">
                        <span class="fw-bold text-secondary small">🗓️ ${s.tarih} - 🕒 ${s.saat}</span>
                        <span class="badge bg-success font-monospace">Tamamlandı ✓</span>
                    </div>
                </div>
            `;
        });
    }

    modalBody.innerHTML = `
        <div id="userPanelArea">
            <h6 class="fw-bold mb-3">Danışan Paneli: <span class="text-primary">${phone}</span></h6>
            
            <!-- Geçmiş Seans Ekleme Formu -->
            <div class="bg-light p-2 rounded mb-3 border">
                <p class="fw-semibold small mb-1 text-dark">➕ Yeni Seans Geçmişi Ekle</p>
                <div class="row g-1">
                    <div class="col-6"><input type="date" class="form-control form-control-sm" id="histDate"></div>
                    <div class="col-4"><input type="time" class="form-control form-control-sm" id="histTime"></div>
                    <div class="col-2"><button class="btn btn-primary btn-sm w-100" onclick="gecmisSeansEkle('${phone}')">Ekle</button></div>
                </div>
            </div>

            <p class="small text-muted mb-2 fw-semibold">Gittiğim Geçmiş Seanslar:</p>
            <div class="max-height-200 overflow-y-auto mb-3" style="max-height: 200px; overflow-y: auto;">
                ${seansListesiHTML}
            </div>
            <button type="button" class="btn btn-outline-danger btn-sm w-100" onclick="cikisYap()">Oturumu Kapat</button>
        </div>
    `;
}

function gecmisSeansEkle(phone) {
    const t = document.getElementById('histDate').value;
    const s = document.getElementById('histTime').value;
    
    if(!t || !s) {
        alert("Lütfen tarih ve saat seçiniz.");
        return;
    }

    const yeniSeans = { telefon: phone, tarih: t, saat: s };
    let seanslar = JSON.parse(localStorage.getItem('pusula_seanslar')) || [];
    seanslar.push(yeniSeans);
    localStorage.setItem('pusula_seanslar', JSON.stringify(seanslar));
    
    panelIceriginiGoster(phone);
}

function cikisYap() {
    localStorage.removeItem('aktifDanisanPhone');
    alert("Oturum kapatıldı.");
    panelModaliKapat();
}