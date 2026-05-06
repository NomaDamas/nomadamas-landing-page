# NomaDamas photo album

사진 앨범은 파일과 캡션을 분리해서 관리합니다.

## 사진 추가 방법

1. 사진 파일을 `public/photos/uploads/`에 넣습니다.
2. `public/photos/album.json`의 `photos` 배열에 아래 형태의 객체를 추가합니다.
3. `public/index.html`은 메타데이터를 읽어 앨범 카드를 자동으로 렌더링합니다.

```json
{
  "id": "2026-05-06-demo-night",
  "file": "2026-05-06-demo-night.jpg",
  "caption": "Demo night at NomaDamas",
  "note": "What we built, shipped, and learned that night.",
  "takenAt": "2026-05-06",
  "location": "NomaDamas, Seoul",
  "people": ["@vkehfdl1", "@Hyunwook-Kwon"],
  "tags": ["demo", "hackerhouse"],
  "credit": "NomaDamas",
  "alt": "Hackers presenting a demo at NomaDamas"
}
```

## 필드

- `id`: 고유 식별자입니다.
- `file`: `public/photos/uploads/` 안의 파일명입니다. 외부 URL을 쓰려면 `src`를 대신 사용할 수 있습니다.
- `caption`: 카드 제목처럼 보이는 짧은 캡션입니다.
- `note`: 사진 설명입니다.
- `takenAt`: 촬영일입니다. `YYYY-MM-DD` 형식을 권장합니다.
- `location`: 촬영 장소입니다.
- `people`: 사진에 나온 사람 또는 관련 GitHub 핸들입니다.
- `tags`: 앨범 필터링/검색을 위한 태그입니다.
- `credit`: 촬영자 또는 출처입니다.
- `alt`: 접근성을 위한 이미지 설명입니다.
