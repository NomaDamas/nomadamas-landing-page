# Cloudflare R2 owner click prompt

아래 문구를 `nomadamas.org` Cloudflare 계정을 가진 사람에게 그대로 보내면 됩니다.
목표는 CLI 없이 Cloudflare 대시보드 클릭만으로 앨범 사진 공개 주소를 여는 것입니다.

```txt
nomadamas.org가 당신 Cloudflare 계정에 있는 것 같아요.
사진 앨범용 공개 저장소를 연결해야 해서 아래 둘 중 편한 방식으로 부탁드립니다.

최종 목표
- 버킷 이름: nomadamas-photos
- 공개 도메인: photos.nomadamas.org
- 테스트 파일 주소: https://photos.nomadamas.org/album/2026/05/landing-capture.png

방법 A — 제일 쉬움: 저를 Cloudflare 멤버로 초대
1. Cloudflare 대시보드 → Manage Account / Members로 이동
2. 제 Cloudflare 이메일을 초대
3. 가능하면 임시 Administrator 권한을 주거나, 최소한 nomadamas.org DNS 편집 + R2 편집 권한을 주세요
4. 제가 R2 버킷 생성, photos.nomadamas.org 연결, 테스트 업로드까지 처리하겠습니다

방법 B — 직접 딸깍 설정
1. Cloudflare에서 nomadamas.org가 보이는 계정으로 로그인
2. 왼쪽 메뉴 → R2 Object Storage
3. Create bucket 클릭
4. Bucket name에 nomadamas-photos 입력 후 생성
5. 만든 버킷 → Settings → Custom Domains
6. Add / Connect Domain 클릭
7. photos.nomadamas.org 입력
8. DNS 레코드 추가 확인 화면이 나오면 Connect Domain 클릭
9. 상태가 Active가 될 때까지 기다림
10. 버킷에 파일을 이 경로로 업로드:
    album/2026/05/landing-capture.png
11. 브라우저에서 아래 주소가 열리는지 확인:
    https://photos.nomadamas.org/album/2026/05/landing-capture.png

주의
- photos.nomadamas.org 추가 시 “domain was not found on your account”가 나오면 잘못된 Cloudflare 계정입니다.
- nomadamas.org가 Websites 목록에 보이는 계정에서 해야 합니다.
- r2.dev 주소는 임시 테스트용이고, 최종은 photos.nomadamas.org로 부탁드립니다.

끝나면 저에게 아래 둘 중 하나만 보내주세요.
- 초대 완료: “Cloudflare 초대 보냈음”
- 직접 완료: “https://photos.nomadamas.org/album/2026/05/landing-capture.png 열림”
```

## 우리가 쓰는 값

```txt
R2 bucket: nomadamas-photos
Custom domain: photos.nomadamas.org
R2 object prefix: album/
Album JSON basePath: https://photos.nomadamas.org/album/
Example object key: album/2026/05/landing-capture.png
Example JSON file field: 2026/05/landing-capture.png
```

## 공식 문서

- R2 공개 버킷 / 커스텀 도메인: https://developers.cloudflare.com/r2/buckets/public-buckets/
- R2 버킷 생성: https://developers.cloudflare.com/r2/buckets/create-buckets/
- R2 오브젝트 업로드: https://developers.cloudflare.com/r2/objects/upload-objects/
