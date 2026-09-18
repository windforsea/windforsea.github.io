# 🚀 프로젝트 상세 명세서 (Projects & Engineering Works)

Skalen Seo(@windforsea)가 AI 협업, 데이터 거버넌스, 브라우저 그래픽스 최적화, 그리고 현장 품질 제어 감각을 접목하여 구축한 7대 프로젝트의 기술 명세서입니다.

---

## 📑 프로젝트 목차

1. [🛡️ AI-to-SQL 지능형 DB 관리 & 안전 거버넌스](#1-ai-to-sql-지능형-db-관리--안전-거버넌스)
2. [📰 IT/과학 뉴스 수집 및 AI 브리핑 시스템](#2-it과학-뉴스-수집-및-ai-브리핑-시스템)
3. [📊 울산 거주자우선주차 공공데이터 분석 & ROI 모델링](#3-울산-거주자우선주차-공공데이터-분석--roi-모델링)
4. [🌤️ 기상청 스마트 예보 지원 시스템 & 대시보드](#4-기상청-스마트-예보-지원-시스템--대시보드)
5. [🤝 Team Collaboration & Agile Workflow](#5-team-collaboration--agile-workflow)
6. [🌌 Nebula Ocean 3D 인터랙티브 웹 쇼케이스](#6-nebula-ocean-3d-인터랙티브-웹-쇼케이스)
7. [⚔️ Anti Survivors (웹 서바이벌라이크 게임 엔진)](#7-anti-survivors-웹-서바이벌라이크-게임-엔진)

---

### 1. 🛡️ AI-to-SQL 지능형 DB 관리 & 안전 거버넌스

- **카테고리**: AI & Intelligence Systems
- **기술 스택**: Python 3.12, SQLite / PostgreSQL, Text-to-SQL, AI Guardrails, HITL (Human-In-The-Loop)
- **저장소**: [github.com/windforsea/AI-to-SQL-DB-Management](https://github.com/windforsea/AI-to-SQL-DB-Management)
- **핵심 문제 정의 및 해결**:
  - **문제**: LLM이 생성한 SQL 쿼리가 데이터베이스를 파괴하거나 비인가 데이터를 유출할 위험.
  - **해결**: 조회와 변경의 이원화 파이프라인 구축.
    - **조회(Read)**: Text-to-SQL + 가드레일 배달원 함수를 통한 안전한 읽기 전용 실행.
    - **변경(Write)**: Function Calling + 사전 검증 CRUD 모듈 적용. 대용량 DB 전체 복제 비효율을 극복하기 위해 가상 트랜잭션 격리(Copy-on-Write) 및 변경 SQL 큐(`migration_queue.py`)를 개발하여 관리자가 최종 승인 또는 롤백할 수 있는 엔터프라이즈급 거버넌스 완결.

---

### 2. 📰 IT/과학 뉴스 수집 및 AI 브리핑 시스템

- **카테고리**: AI & Intelligence Systems
- **기술 스택**: Python 3.12, pywebview, SQLite, LLM API (gpt-5.6-luna / Gemini)
- **저장소**: [github.com/windforsea/naver_AI_news_scraper](https://github.com/windforsea/naver_AI_news_scraper)
- **핵심 문제 정의 및 해결**:
  - **문제**: 실시간 IT 뉴스의 방대한 분량으로 인한 피로감과 중복 크롤링 비용 발생.
  - **해결**: 네이버 IT/과학 뉴스를 **Early Break 역순 탐색 알고리즘**으로 크롤링하여 네트워크 부하 90% 감축.
    - **DB-First 캐싱**: SQLite RDBMS 기반으로 이미 수집된 기사는 즉시 건너뛰어 중복 방지.
    - **AI 브리핑**: 수집된 기사 본문을 LLM과 연동하여 실시간 요약·카테고리 분류 및 과거 보고서 이력 추적(History Tracking) 기능 완결.
    - **데스크톱 UI**: `pywebview`를 활용하여 웹 기술 스택(HTML/CSS/JS) 기반의 경량 크로스플랫폼 GUI 구현.

---

### 3. 📊 울산 거주자우선주차 공공데이터 분석 & ROI 모델링

- **카테고리**: Public Data & Analytics
- **기술 스택**: Python, Pandas, Folium, 공공데이터 통계 분석, 경제성(ROI) 모델링
- **산출물**: [종합 분석 보고서 열람](https://windforsea.github.io/ulsan_report.html) | [인터랙티브 지도 시각화](https://windforsea.github.io/ulsan_parking_map.html)
- **핵심 문제 정의 및 해결**:
  - **문제**: 울산 남구 도심지의 주차난과 거주자우선주차 구획의 낮 시간대 유휴 공간 낭비.
  - **해결**: 공공데이터 전처리 및 행정동별 주차면 수·수급률 통계 분석.
    - **ROI 모델링**: IoT 센서 및 모바일 공유주차제 도입 시의 비용 편익(Cost-Benefit)과 회수 기간을 시뮬레이션 모델로 산출.
    - **지리정보 시각화**: `Folium`을 사용하여 동별 주차 밀집도와 공유 전환 우선순위 구역을 인터랙티브 웹 지도로 시각화.

---

### 4. 🌤️ 기상청 스마트 예보 지원 시스템 & 대시보드

- **카테고리**: Public Data & Analytics (Desktop App)
- **기술 스택**: Python, pywebview, 기상청 단기예보 Open API, LLM Agent
- **저장소**: [github.com/windforsea/desktop-app](https://github.com/windforsea/desktop-app)
- **핵심 문제 정의 및 해결**:
  - **문제**: 기상청 단기예보 데이터의 복잡한 원시 코드(TMP, REH, SKY, PTY 등)를 실무자가 즉시 판독하기 어려움.
  - **해결**: 기상청 Open API의 격자 좌표(NX, NY) 변환 파이프라인 및 타임라인 대시보드 구축.
    - **데이터 시각화**: 시간대별 기온·강수확률 그래프 및 원시 CSV 테이블 뷰어 탑재.
    - **AI 에이전트 연동**: 현업 기상 통보관 스타일의 공식 기상 통보서(`.txt`)를 원클릭으로 자동 작성하는 프롬프트 체인 완결.

---

### 5. 🤝 Team Collaboration & Agile Workflow

- **카테고리**: Collaboration & Engineering
- **기술 스택**: Git Flow, Pull Request(PR) Code Review, Issue Tracking, Agile Sprint
- **저장소**: [github.com/windforsea/wepscraping-git](https://github.com/windforsea/wepscraping-git)
- **핵심 역량 및 프로세스**:
  - **브랜칭 전략**: `main`, `develop`, `feature/*`, `hotfix/*`로 이어지는 체계적인 Git Flow 수립.
  - **코드 리뷰 & 충돌(Conflict) 해결**: 3인 이상 협업 환경에서 PR 템플릿과 브랜치 보호 규칙(Branch Protection)을 적용하고, 병합 충돌을 안전하게 해소.
  - **품질 관리(QA) 파이프라인**: 위메이드 QA 경험을 바탕으로 이슈 등록 시 재현 경로, 기대 결과, 환경 스펙을 표준화하여 협업 효율 극대화.

---

### 6. 🌌 Nebula Ocean 3D 인터랙티브 웹 쇼케이스

- **카테고리**: Collaboration & Web Experience
- **기술 스택**: HTML5 Canvas 2D, Pure JavaScript (ES6+), 3D Perspective Physics, 60 FPS 최적화
- **체험 링크**: [스펙터클 체험하기](https://windforsea.github.io/galaxy.html)
- **핵심 기술 및 특징**:
  - **Zero-Dependency (0MB)**: Three.js나 외부 라이브러리 없이 순수 Canvas 2D 컨텍스트만으로 3D 공간감과 원근 투영(Perspective Projection) 수학 공식 구현.
  - **실시간 물리 시뮬레이션**: 중심 인력(Gravity), 나선형 소용돌이(Vortex), 마우스 충격파(Shockwave) 등 500개 이상의 파티클을 60 FPS로 연산.

---

### 7. ⚔️ Anti Survivors (웹 서바이벌라이크 게임 엔진)

- **카테고리**: Interactive Systems & Game Engine (Featured)
- **기술 스택**: HTML5 Canvas 2D, Pure JavaScript (ES6+), Web Audio API, Zero-Dependency (0MB), FNV-1a Hash, Node.js
- **라이브 서비스**: [🎮 anti-survivor.vercel.app](https://anti-survivor.vercel.app)
- **공식 저장소**: [github.com/windforsea/anti_survivor](https://github.com/windforsea/anti_survivor)
- **프로젝트 개요**:
  외부 라이브러리나 게임 엔진 프레임워크(Phaser, PixiJS 등) 없이 **순수 브라우저 표준 API(Vanilla JS + Canvas 2D + Web Audio API)만으로 개발한 풀스택 60 FPS 탑다운 뱀파이어 서바이벌라이크 게임**입니다. Vercel 클라우드에 24시간 라이브 배포 중이며 모바일과 PC 전 기기에서 즉시 실행 가능합니다.

#### 🔧 핵심 아키텍처 및 엔지니어링 하이라이트

1. **11개 독립 모듈형 아키텍처 (Clean Separation of Concerns)**:
   - `main.js` (게임 루프 및 상태 머신), `player.js` (영웅 스탯 및 피격), `weapons.js` (투사체 및 진화 판정), `enemies.js` (몬스터 AI 및 보스 기믹), `waveManager.js` (20단계 웨이브 스케줄러), `obstacles.js` (무한 청크 지형), `cards.js` (레벨업 카드 풀), `ui.js` (반응형 HUD 및 조이스틱), `audio.js` (사운드 신디사이저), `assets.js` (스프라이트 매니저), `saveManager.js` (보안 세이브).

2. **60 FPS 무한 청크 지형 & 안전 스폰 충돌 최적화**:
   - 화면 밖 오브젝트는 연산 및 렌더링에서 제외하는 뷰포트 컬링(Viewport Culling) 기법 적용.
   - 플레이어 주변 안전 반경 보장 및 무한 격자 청크 시스템으로 수백 개의 몬스터와 투사체가 동시 충돌해도 안정적인 60 FPS 프레임레이트 유지.

3. **Web Audio API 기반 8비트 레트로 사운드 신디사이저**:
   - 외부 MP3/WAV 오디오 에셋 다운로드 0MB 달성.
   - 브라우저의 `AudioContext`, `OscillatorNode`, `GainNode`를 활용하여 공격음, 피격음, 폭발음, BGM 펄스를 실시간 주파수 변조(FM Synthesis)로 즉석 생성.

4. **FNV-1a 해시 체크섬 세이브 무결성 검증 & 보안**:
   - `localStorage` 변조 방지를 위해 로컬 세이브 데이터에 FNV-1a 32-bit 해시 체크섬을 부착.
   - 게임 실행 시 세이브 데이터의 해시를 재검증하여 불법 치트 및 데이터 조작을 차단하고, 스키마 버전 마이그레이션 파이프라인 내장.
   - 챔피언 닉네임 입력 및 렌더링 시 브라우저 내장 XSS 살균(Sanitizer) 로직 탑재.

5. **심도 있는 게임 밸런싱 & 복합 보스 AI 상태 머신 (QA 역량 결합)**:
   - **영웅 & 성장**: 3종 영웅(기사, 마도사, 암살자), 14종 인게임 패시브, 9종 로비 영구 강화 체계.
   - **무기 & 진화**: 12종 기본 무기 + 6종 특수 진화 무기(베놈 블리자드, 보이드 레이저 등 조건부 진화 트리).
   - **몬스터 & 보스**: 15종 일반 몬스터와 9종의 고유 보스 AI(사신 순간이동, 공허의 지네 세그먼트 추적, 혼돈의 절대신 탄막 패턴).

6. **순수 Node.js 픽셀 아트 에셋 빌더 (`generate_assets.js`)**:
   - 그래픽 툴 없이 순수 Node.js 스크립트로 79종의 다크 판타지 도트 스프라이트 PNG를 자동 생성하는 파이프라인 구축.
