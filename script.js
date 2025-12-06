// Simpan sebagai script.js

function filterPrices() {
    // 1. Ambil input dari pengguna dan ubah ke huruf kecil
    let input = document.getElementById('searchInput');
    let filter = input.value.toUpperCase();

    // 2. Ambil semua elemen daftar item (semua elemen dengan class 'item')
    let items = document.querySelectorAll('.price-list .item');

    // 3. Iterasi (Loop) melalui setiap item
    items.forEach(function(item) {
        // Ambil elemen nama item (span dengan class 'item-name')
        let itemName = item.querySelector('.item-name');
        
        if (itemName) {
            // Ambil teks nama item
            let textValue = itemName.textContent || itemName.innerText;
            
            // Periksa apakah teks nama item mengandung filter yang dimasukkan
            if (textValue.toUpperCase().indexOf(filter) > -1) {
                // Jika cocok, tampilkan item tersebut
                item.style.display = "flex"; // Gunakan 'flex' karena di CSS kita pakai display: flex
            } else {
                // Jika tidak cocok, sembunyikan item tersebut
                item.style.display = "none";
            }
        }
    });
}