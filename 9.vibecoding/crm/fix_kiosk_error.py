import os

PROJECT_DIR = "crm-v2-styled"

def update_file(path, content):
    filepath = f"{PROJECT_DIR}/{path}"
    if not os.path.exists(os.path.dirname(filepath)):
        print(f"❌ Error: Cannot find directory for {filepath}")
        return
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content.strip())
    print(f"✅ Fixed: {path}")

# 1. API 서비스 수정 (undefined 방어 로직 추가)
js_services_api_js = """
const BASE_URL = '/api';

export const fetchList = async (table, params = '') => {
    let queryString = params;
    
    // 만약 params가 안 넘어오면 빈 문자열로 처리 (에러 방지)
    if (!queryString) {
        queryString = '';
    }
    // 만약 params가 숫자(페이지 번호)라면 예전 방식 호환성 유지
    else if (typeof params === 'number') {
        queryString = `?page=${params}&limit=15`;
    }

    // URL 생성 (예: /api/data/stores?limit=100)
    const res = await fetch(`${BASE_URL}/data/${table}${queryString}`);
    
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'API Request Failed');
    }
    return res.json();
};

export const fetchDetail = async (table, id) => {
    const res = await fetch(`${BASE_URL}/data/${table}/${id}`);
    if (!res.ok) throw new Error('Failed to fetch detail');
    return res.json();
};

export const fetchCrmStats = async (type, id) => {
    const res = await fetch(`${BASE_URL}/crm/${type}/${id}`);
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
};
"""

# 2. 키오스크 로직 수정 (데이터를 많이 가져오도록 ?limit=100 추가)
public_js_kiosk_js = """
import { fetchList } from './services/api.js';

let cart = [];
let currentUser = null;
let currentStoreId = null; 

document.addEventListener('DOMContentLoaded', async () => {
    await initKiosk();
});

async function initKiosk() {
    try {
        // 1. 매장 정보 로드 (상점 데이터가 잘리는 걸 방지하기 위해 넉넉히 호출)
        const stores = await fetchList('stores', '?limit=100');
        
        if(!stores.rows || stores.rows.length === 0) { 
            alert("No stores found in DB. Please run the seed_initial_data script."); 
            return; 
        }
        // 첫번째 매장 자동 선택
        currentStoreId = stores.rows[0].id;
        console.log("Kiosk initialized for store:", currentStoreId);

        // 2. 유저 정보 로드
        const users = await fetchList('users', '?limit=100');
        renderUserModal(users.rows);
        
        // 3. 상품 정보 로드
        const items = await fetchList('items', '?limit=100');
        renderItems(items.rows);

        // 이벤트 바인딩
        document.getElementById('btn-checkout').addEventListener('click', processCheckout);
        
        // 유저 모달 표시
        const modal = document.getElementById('user-modal');
        if(modal) modal.style.display = 'flex';

    } catch (e) { 
        console.error("Kiosk Error:", e);
        alert("Failed to load kiosk data. Check console for details.");
    }
}

// 유저 선택
function renderUserModal(users) {
    const list = document.getElementById('user-list');
    list.innerHTML = users.map(u => `
        <button class="w-full text-left p-4 rounded-lg bg-gray-700 hover:bg-orange-600 border border-gray-600 transition group" onclick="selectUser('${u.id}', '${u.name}')">
            <div class="font-bold text-white">${u.name}</div>
            <div class="text-xs text-gray-400 group-hover:text-orange-100">${u.id}</div>
        </button>
    `).join('');
}

window.selectUser = (id, name) => {
    currentUser = { id, name };
    document.getElementById('current-user').innerText = name;
    document.getElementById('user-modal').style.display = 'none';
};

// 상품 렌더링
function renderItems(items) {
    const grid = document.getElementById('item-grid');
    grid.innerHTML = items.map(item => `
        <div class="bg-gray-800 rounded-xl p-4 hover:ring-2 hover:ring-orange-500 transition shadow-lg flex flex-col cursor-pointer transform hover:-translate-y-1" onclick="addToCart('${item.id}', '${item.name}', ${item.price})">
            <div class="h-28 bg-gray-700 rounded-lg mb-3 flex items-center justify-center text-4xl">🍔</div>
            <h3 class="font-bold text-lg leading-tight text-gray-100">${item.name}</h3>
            <p class="text-orange-400 font-bold mt-auto">${Number(item.price).toLocaleString()} KRW</p>
        </div>
    `).join('');
}

// 장바구니
window.addToCart = (id, name, price) => {
    const existing = cart.find(i => i.id === id);
    if(existing) existing.quantity++;
    else cart.push({ id, name, price, quantity: 1 });
    updateCart();
};

window.removeFromCart = (id) => {
    const idx = cart.findIndex(i => i.id === id);
    if(idx > -1) cart.splice(idx, 1);
    updateCart();
}

function updateCart() {
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('total-price');
    const countBadge = document.getElementById('cart-count');
    
    // 뱃지 업데이트
    const totalCount = cart.reduce((a,c)=>a+c.quantity,0);
    countBadge.innerText = totalCount;

    if(cart.length===0) container.innerHTML = '<div class="text-center text-gray-500 mt-10">Your cart is empty</div>';
    else {
        container.innerHTML = cart.map(i => `
            <div class="bg-gray-700 p-3 rounded-lg flex justify-between items-center border border-gray-600 animate-fade-in mb-2">
                <div>
                    <div class="font-bold text-white">${i.name}</div>
                    <div class="text-xs text-orange-400">${i.price.toLocaleString()} x ${i.quantity}</div>
                </div>
                <button onclick="removeFromCart('${i.id}')" class="text-gray-400 hover:text-white px-2 font-bold">✕</button>
            </div>
        `).join('');
    }
    
    // 총액 업데이트
    const totalPrice = cart.reduce((a,c)=>a+(c.price*c.quantity),0);
    totalEl.innerText = totalPrice.toLocaleString() + " KRW";
}

// 주문 전송
async function processCheckout() {
    if(!currentUser) { alert("Please select a user first!"); return; }
    if(cart.length === 0) { alert("Cart is empty!"); return; }
    
    if(!confirm(`Total ${document.getElementById('total-price').innerText}. Order now?`)) return;

    try {
        const res = await fetch('/api/orders', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                storeId: currentStoreId,
                userId: currentUser.id,
                items: cart
            })
        });
        const result = await res.json();
        if(result.success) {
            alert(`✅ Order Success!\\nOrder ID: ${result.orderId}`);
            cart = []; updateCart();
        } else {
            alert("❌ Error: " + result.error);
        }
    } catch(e) { 
        console.error(e); 
        alert("Network Error: Could not place order."); 
    }
}
"""

def main():
    if not os.path.exists(PROJECT_DIR):
        print(f"❌ Error: Cannot find '{PROJECT_DIR}'")
        return

    update_file("public/js/services/api.js", js_services_api_js)
    update_file("public/js/kiosk.js", public_js_kiosk_js)

    print("\n✅ Fix applied successfully!")
    print("👉 Please refresh your Kiosk page.")

if __name__ == "__main__":
    main()