# NomaDamas photo album

사진 파일은 GitHub에 계속 올리지 않고 Cloudflare R2에 둡니다. GitHub에는 사진 설명만 남깁니다.

## 운영 방식

- 사진 파일: Cloudflare R2 버킷 `nomadamas-photos`에 업로드합니다.
- 공개 주소: `https://photos.nomadamas.org/album/`
- 사진 설명: `public/photos/album.json`에 날짜, 캡션, 사람, 장소를 적고 커밋/푸시합니다.
- 앨범 페이지: `public/album.html`이 `album.json`을 읽고 `basePath + file`로 이미지 주소를 만듭니다.
- 도메인 주인에게 보낼 딸깍 요청문은 [`../../docs/cloudflare-r2-owner-prompt.md`](../../docs/cloudflare-r2-owner-prompt.md)에 있습니다.

## 사진 추가 방법

1. R2에 사진을 아래 위치로 업로드합니다.

```txt
album/YYYY/MM/file-name.jpg
```

예:

```txt
album/2026/05/landing-capture.png
```

현재 테스트 업로드에 쓸 로컬 파일은 `public/photos/uploads/2026-05-06-landing-capture.png`입니다. 이 파일은 R2 업로드용으로만 두고 GitHub에는 커밋하지 않습니다.

2. `public/photos/album.json`의 `photos` 배열에 객체를 추가합니다.

```json
{
  "id": "2026-05-landing-capture",
  "file": "2026/05/landing-capture.png",
  "caption": "Landing page test capture",
  "note": "R2 upload test image for the NomaDamas photo album.",
  "takenAt": "2026-05-06",
  "location": "NomaDamas",
  "people": ["@NomaDamas"],
  "tags": ["test", "screenshot", "album", "r2"],
  "credit": "NomaDamas",
  "alt": "Screenshot of the NomaDamas landing page local preview"
}
```

3. 실제 이미지 주소는 자동으로 이렇게 됩니다.

```txt
https://photos.nomadamas.org/album/2026/05/landing-capture.png
```

## 필드

- `basePath`: 모든 사진 앞에 붙는 공개 주소입니다. 현재 값은 `https://photos.nomadamas.org/album/`입니다.
- `id`: 고유 식별자입니다.
- `file`: R2의 `album/` 뒤쪽 경로입니다. 예: `2026/05/photo.jpg`
- `src`: 예외적으로 완전한 외부 URL을 직접 쓰고 싶을 때 `file` 대신 사용할 수 있습니다.
- `caption`: 카드 제목처럼 보이는 짧은 캡션입니다.
- `note`: 사진 설명입니다.
- `takenAt`: 촬영일입니다. `YYYY-MM-DD` 형식을 권장합니다. 이 값으로 연도·월 섹션이 자동 생성됩니다.
- `location`: 촬영 장소입니다.
- `people`: 사진에 나온 사람 또는 관련 GitHub 핸들입니다.
- `tags`: 앨범 필터링/검색을 위한 태그입니다.
- `credit`: 촬영자 또는 출처입니다.
- `alt`: 접근성을 위한 이미지 설명입니다.

## 정리 방식

- R2에는 `album/YYYY/MM/파일명`으로 정리합니다.
- `album.json`의 `file`에는 `YYYY/MM/파일명`만 적습니다.
- 화면에서는 `takenAt`을 읽어서 최신 연도와 최신 월부터 자동으로 묶어 보여줍니다.
- 사람 이름은 얼굴 인식 없이 `people`에 수동 태그로 적습니다.
