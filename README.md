# 📖 windforsea | Portfolio Journal

> **AI 기반 협업과 현장 정밀 감각을 소프트웨어 엔지니어링에 접목한 실용주의 시스템 빌더, 서동환(Skalen Seo)의 공식 포트폴리오 저장소입니다.**

3D 양장본 책자(Booklet) 인터랙션과 글래스모피즘(Glassmorphism) 듀얼 뷰를 제공하며, 외부 프레임워크 없는 순수 바닐라 기술(Zero-Dependency)과 Supabase 실시간 BaaS를 결합하여 구현되었습니다.

---

## 🚀 사이트 접속 및 바로가기 (Live Services)

- **공식 포트폴리오 사이트**: [https://windforsea.github.io](https://windforsea.github.io)
- **대표 프로젝트 라이브 서비스**:
  - 🎮 **Anti Survivors (웹 서바이벌라이크 게임)**: [https://anti-survivor.vercel.app](https://anti-survivor.vercel.app)
  - 🌌 **Nebula Ocean 3D 물리 쇼케이스**: [https://windforsea.github.io/galaxy.html](https://windforsea.github.io/galaxy.html)
  - 📊 **울산 거주자우선주차 공공데이터 분석 보고서**: [https://windforsea.github.io/ulsan_report.html](https://windforsea.github.io/ulsan_report.html)
- **공식 GitHub 프로필**: [https://github.com/windforsea](https://github.com/windforsea)

---

## 📑 프로젝트 문서 가이드 허브 (Documentation Index)

체계적인 정보 탐색과 깊이 있는 엔지니어링 역량 확인을 위해 도메인별 세부 명세서로 분할 관리되고 있습니다.  
세부 정보를 확인하려면 아래 링크를 참조하세요.

| 문서명 | 주요 내용 | 링크 |
| :--- | :--- | :---: |
| 👤 **엔지니어 프로필 및 역량 명세서** | • Skalen Seo 엔지니어 아이덴티티 및 개발 철학<br>• 5대 현장 도메인(위메이드 게임 QA, 현대차, 원자력, 스타트업 창업)<br>• 핵심 기술 스택 및 커뮤니케이션 채널 | [상세보기](docs/profile.md) |
| 🚀 **프로젝트 상세 명세서** | • 7대 프로젝트 상세 스펙(문제 정의, 기술적 해결책, 아키텍처)<br>• **Anti Survivors** 순수 캔버스 게임 엔진(11개 모듈, 8비트 사운드, FNV-1a 보안)<br>• AI-to-SQL 거버넌스, 뉴스 브리핑, 기상청 앱, Git 협업 | [상세보기](docs/projects.md) |
| ⚙️ **포트폴리오 웹 아키텍처 명세서** | • 3D 북클릿(Booklet) 뷰 & 3D Perspective 인터랙션 엔진<br>• 모바일 스와이프 및 키보드 제어 상태 머신(`active`/`passed`)<br>• Supabase 실시간 방명록 CRUD & 안전 삭제 BaaS 아키텍처 | [상세보기](docs/architecture.md) |

---

## 📁 디렉토리 및 파일 구조

```text
windforsea.github.io/
├── 📄 index.html              # 포트폴리오 메인 엔트리: 3D 책자 저널 (Cover, About, Projects 1~4, Guestbook)
├── 📄 book.html               # 3D 책자 저널 전용 페이지 (index.html과 미러링)
├── 📄 book.css                # 3D 원근 투영, 페이지 넘김 애니메이션, 책갈피 리본 스타일시트
├── 📄 book.js                 # 책장 넘김 상태 제어, 모바일 터치 스와이프, 키보드 이벤트 리스너
├── 📄 supabase-config.js      # Supabase JavaScript SDK 연동 및 실시간 방명록 API
│
├── 📄 about.html              # 간략보기(Clean View): 프로필 & 현장 도메인 이력
├── 📄 projects.html           # 간략보기(Clean View): 7대 프로젝트 글래스 카드 그리드
├── 📄 style.css               # 간략보기 에디션용 글래스모피즘 & 반응형 CSS
├── 📄 script.js               # 간략보기 에디션 인터랙션 스크립트
│
├── 📄 galaxy.html / js / css  # Nebula Ocean 3D 물리 시뮬레이션 인터랙티브 쇼케이스
├── 📄 ulsan_report.html       # 울산 거주자우선주차 공공데이터 종합 분석 보고서
├── 📄 ulsan_parking_map.html  # 울산 남구 공공데이터 Folium 지도 시각화
│
├── 📂 docs/                   # 프로젝트 세부 도메인별 명세 문서 (3개 파일)
│   ├── 📄 profile.md          # 👤 엔지니어 아이덴티티, 5대 현장 도메인, 기술 스택
│   ├── 📄 projects.md         # 🚀 7대 프로젝트 상세 스펙 및 Anti Survivors 게임 명세
│   └── 📄 architecture.md     # ⚙️ 포트폴리오 웹 아키텍처 및 Supabase BaaS 구조
│
├── 📂 assets/                 # 프로필 사진, 배경 이미지, 프로젝트 시각 리소스
└── 📄 README.md               # 포트폴리오 개요 및 문서 가이드 허브 (본 파일)
```

---

## 📬 Contact

- **Email**: [windforsea@gmail.com](mailto:windforsea@gmail.com)
- **GitHub**: [@windforsea](https://github.com/windforsea)
- **Portfolio**: [https://windforsea.github.io](https://windforsea.github.io)
