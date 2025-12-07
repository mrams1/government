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
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR8q41TnlUZCNPZ8F040AjqaH7P49Plnd9oOQLNXlaJnladzGv13Npckh9UGQQ-krzhD6TdtqLvO0Rq/pub?output=csv'; 
const container = document.getElementById('priceListContainer');
document.addEventListener('DOMContentLoaded', fetchDataAndRender);


/**
 * Mengambil data dari Google Sheets dan memulai rendering
 */
async function fetchDataAndRender() {
    // Tampilkan pesan loading sementara
    container.innerHTML = '<div class="loading-message">Memuat data harga terbaru...</div>';

    try {
        const response = await fetch(SHEET_URL);
        
        // Periksa apakah respons HTTP berhasil
        if (!response.ok) {
            throw new Error(`Gagal mengambil data: ${response.statusText}`);
        }

        // Ambil data dalam bentuk teks (format CSV)
        const csvText = await response.text();
        
        // Konversi CSV ke array objek JavaScript
        const data = parseCSV(csvText);
        
        // Render data ke HTML
        renderPriceList(data);

    } catch (error) {
        console.error("Kesalahan saat fetching atau parsing data:", error);
        container.innerHTML = `<div class="error-message">
            Gagal memuat data harga. Pastikan URL Sheets sudah benar dan data sudah dipublikasikan ke web.
            <br>Detail Error: ${error.message}
        </div>`;
    }
}


/**
 * Mengkonversi teks format CSV menjadi Array of Objects.
 * Diasumsikan baris pertama adalah header/nama kolom.
 */
function parseCSV(csv) {
    // Memisahkan baris
    const lines = csv.split('\n').filter(line => line.trim() !== '');
    if (lines.length === 0) return [];

    // Mengambil header (baris pertama) dan membersihkan spasi/carriage return
    const headers = lines[0].split(',').map(header => header.trim().replace(/\r/g, ''));

    const result = [];
    // Loop dari baris kedua (data)
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(value => value.trim().replace(/\r/g, ''));
        const obj = {};
        
        // Membuat objek menggunakan header sebagai kunci
        headers.forEach((header, index) => {
            if (header) { // Pastikan header tidak kosong
                obj[header] = values[index] || '';
            }
        });
        
        // Hanya tambahkan objek jika memiliki data yang relevan (misal, Nama Item tidak kosong)
        if (obj[headers[0]]) { 
             result.push(obj);
        }
    }
    return result;
}


/**
 * Mengambil array data dan merender HTML
 * Data diasumsikan memiliki kolom 'Kategori', 'Nama Item', dan 'Harga Jual'
 */
function renderPriceList(data) {
    container.innerHTML = ''; // Kosongkan container

    // Mengelompokkan item berdasarkan Kategori
    const groupedData = data.reduce((acc, item) => {
        const category = item.Kategori || 'Lain-lain';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(item);
        return acc;
    }, {});

    // Membuat HTML untuk setiap Kategori
    for (const category in groupedData) {
        const card = document.createElement('div');
        card.className = 'card';

        // Header Kategori
        const header = document.createElement('h2');
        header.textContent = category;
        card.appendChild(header);

        const list = document.createElement('div');
        list.className = 'price-list';

        // Item di dalam Kategori
        groupedData[category].forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'item';

            const nameSpan = document.createElement('span');
            nameSpan.className = 'item-name';
            // Asumsikan data sheets Anda memiliki kolom 'Nama Item'
            nameSpan.textContent = item['Nama Item'] || 'Nama Item Kosong'; 
            itemDiv.appendChild(nameSpan);

            const priceSpan = document.createElement('span');
            // Asumsikan data sheets Anda memiliki kolom 'Harga Jual'
            priceSpan.textContent = item['Harga Jual'] || '-'; 
            
            // Beri kelas khusus jika harganya sangat tinggi (opsional)
            const priceValue = parseFloat(String(item['Harga Jual']).replace(/[^0-9,-]+/g,"").replace(",","."));
            if (priceValue > 100000) {
                priceSpan.className = 'item-price high-value';
            } else {
                priceSpan.className = 'item-price';
            }
            
            itemDiv.appendChild(priceSpan);
            list.appendChild(itemDiv);
        });

        card.appendChild(list);
        container.appendChild(card);
    }
}


/**
 * Fungsi Pencarian/Filter (dipertahankan)
 */
function filterPrices() {
    let input = document.getElementById('searchInput');
    let filter = input.value.toUpperCase();
    let items = document.querySelectorAll('.price-list .item');

    items.forEach(function(item) {
        let itemName = item.querySelector('.item-name');
        
        if (itemName) {
            let textValue = itemName.textContent || itemName.innerText;
            
            if (textValue.toUpperCase().indexOf(filter) > -1) {
                item.style.display = "flex";
            } else {
                item.style.display = "none";
            }
        }
    });
}


