/**
 * Supabase Client Configuration & Guestbook API
 * GitHub Pages 정적 환경을 위한 공개 키(Anon/Publishable) 연동 및 보안 RPC 모듈
 */

const SUPABASE_CONFIG = {
  url: 'https://tphvxttodktmbqlaufyy.supabase.co',
  anonKey: 'sb_publishable_X9OV3KOaj_T9YC6dHx5Zhg_MeOyxz8I'
};

// Supabase 클라이언트 초기화 (CDN 라이브러리 연동)
let supabaseClient = null;

function getSupabase() {
  if (!supabaseClient && window.supabase) {
    supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
  }
  return supabaseClient;
}

/**
 * 방명록 목록 불러오기 (비밀번호 컬럼이 원천 배제된 공개 VIEW 조회)
 */
async function apiFetchGuestbook() {
  const client = getSupabase();
  if (!client) {
    throw new Error('Supabase 클라이언트가 초기화되지 않았습니다.');
  }

  const { data, error } = await client
    .from('guestbook_public')
    .select('id, name, content, created_at')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('방명록 조회 실패:', error);
    throw error;
  }
  return data || [];
}

/**
 * 방명록 새 글 등록 (DB 내부에서 bcrypt 단방향 해싱 후 저장)
 */
async function apiAddGuestbookEntry(name, password, content) {
  const client = getSupabase();
  if (!client) {
    throw new Error('Supabase 클라이언트가 초기화되지 않았습니다.');
  }

  const { data, error } = await client.rpc('add_guestbook_entry', {
    p_name: name,
    p_password: password,
    p_content: content
  });

  if (error) {
    console.error('방명록 등록 오류:', error);
    throw error;
  }
  return data;
}

/**
 * 방명록 안전 삭제 (DB 내부에서 bcrypt 비밀번호 검증 후 일치 시 삭제)
 */
async function apiDeleteGuestbookEntry(id, password) {
  const client = getSupabase();
  if (!client) {
    throw new Error('Supabase 클라이언트가 초기화되지 않았습니다.');
  }

  const { data, error } = await client.rpc('delete_guestbook_entry', {
    p_id: id,
    p_password: password
  });

  if (error) {
    console.error('방명록 삭제 오류:', error);
    throw error;
  }
  return data;
}

// 전역 공개
window.GuestbookAPI = {
  fetch: apiFetchGuestbook,
  add: apiAddGuestbookEntry,
  delete: apiDeleteGuestbookEntry
};
