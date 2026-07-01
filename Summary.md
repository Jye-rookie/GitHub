# GitHub 사용하기

## 1. 터미널 실행 위치 주의

터미널을 처음 열면 보통 사용자 홈 디렉토리에서 시작한다.

따라서 Git 명령어를 실행하기 전에 반드시 **프로젝트 폴더**, 즉 `.git` 폴더가 있는 경로로 이동해야 한다.

```bash
pwd
```

현재 위치를 확인한 뒤, 프로젝트 폴더로 이동한다.

```bash
cd 프로젝트폴더경로
```

또는 VS Code에서 해당 프로젝트 폴더를 열고 터미널을 실행하면 안전하다.

---

## 2. 로컬 레포지토리와 원격 레포지토리 연결하기

### 2-1. GitHub에서 원격 레포지토리 생성

1. GitHub 접속 및 로그인
2. `New repository` 클릭
3. 저장소 이름 작성
4. Description 작성
5. Visibility 선택

   * Public: 공개 저장소
   * Private: 비공개 저장소
6. 필요 시 옵션 선택

   * README: 프로젝트 설명서
   * `.gitignore`: Git에서 제외할 파일 목록
   * License: 코드 사용 권한 표시
7. `Create repository` 클릭

주의할 점은 Public 저장소에 개인정보, API Key, 비밀번호 등이 올라가면 안 된다는 것이다.
이런 파일은 반드시 `.gitignore`에 추가해야 한다.

---

## 3. 로컬 저장소와 원격 저장소 연결

GitHub에서 만든 원격 저장소 주소를 로컬 Git에 등록한다.

```bash
git remote add origin https://github.com/Jye-rookie/GitHub.git
```

여기서 `origin`은 원격 저장소 주소에 붙인 별명이다.

등록된 원격 저장소는 다음 명령어로 확인한다.

```bash
git remote -v
```

출력 예시:

```bash
origin  https://github.com/Jye-rookie/GitHub.git (fetch)
origin  https://github.com/Jye-rookie/GitHub.git (push)
```

* `fetch`: 원격 저장소에서 내려받을 때 사용하는 주소
* `push`: 원격 저장소로 업로드할 때 사용하는 주소

---

## 4. 로컬 작업물을 GitHub에 올리기

로컬에서 작업한 파일을 원격 저장소에 올릴 때는 `push`를 사용한다.

```bash
git push origin main
```

의미:

```bash
git push origin main
```

→ `origin`이라는 원격 저장소의 `main` 브랜치로 내 커밋을 올린다.

만약 로그인 정보를 요구하면 GitHub username을 입력하고, 비밀번호 자리에는 GitHub 비밀번호가 아니라 **Personal Access Token**을 입력해야 한다.

---

## 5. GitHub에서 수정한 내용을 로컬로 가져오기

GitHub에서 README 같은 파일을 직접 수정하면 원격 저장소에는 반영되지만, 로컬에는 자동으로 반영되지 않는다.

이때는 `pull`을 사용한다.

```bash
git pull origin main
```

`pull`은 다음 두 작업을 합친 명령어이다.

```text
pull = fetch + merge
```

즉, 원격 저장소의 최신 내용을 가져오고, 내 로컬 브랜치에 합친다.

---

## 6. Clone과 Pull의 차이

| 구분           | Clone          | Pull                   |
| ------------ | -------------- | ---------------------- |
| 사용 시점        | 처음 프로젝트를 받을 때  | 이미 받은 프로젝트를 최신화할 때     |
| 로컬 저장소 존재 여부 | 없음             | 있음                     |
| 명령어          | `git clone 주소` | `git pull origin main` |
| 목적           | 원격 저장소 전체 복사   | 변경사항 동기화               |

정리하면, 처음 시작할 때는 `clone`, 이미 작업 중인 프로젝트를 최신 상태로 맞출 때는 `pull`을 사용한다.

---

## 7. 협업 상황에서 Git & GitHub 사용 흐름

1. 팀장이 프로젝트를 만들고 `git init` 실행
2. 팀장이 GitHub 원격 저장소에 `push`
3. 팀원은 `git clone`으로 프로젝트 복사
4. 각자 브랜치를 만들어 작업
5. 작업 후 `commit`
6. 원격 저장소에 `push`
7. Pull Request 생성
8. 코드 리뷰 후 `main` 브랜치에 merge
9. 다른 팀원들은 `git pull`로 최신 코드 반영

---

## 8. 작업 중 다른 사람의 변경사항을 가져와야 할 때

### 상황 1. 다른 사람의 최신 작업이 내 작업에 영향을 준다

내가 작업 중인 내용과 충돌 가능성이 있거나, 최신 코드가 꼭 필요한 경우이다.

이때는 내 작업을 잠시 정리한 뒤 최신 내용을 가져와야 한다.

예시 흐름:

```bash
git status
git add .
git commit -m "작업 중인 내용 저장"
git pull origin main
```

그 후 최신 상태에서 다시 작업을 이어간다.

### 상황 2. 다른 사람의 최신 작업이 내 작업에 영향을 주지 않는다

내가 작업하는 파일과 다른 사람이 수정한 파일이 완전히 다르다면 당장 `pull`이 필요하지 않을 수 있다.

다만 협업에서는 작업을 시작하기 전이나 PR을 보내기 전에는 최신 상태를 확인하는 것이 좋다.

---

## 9. Issues

GitHub의 Issue는 작업 관리 도구이다.

프로젝트에서 해야 할 일, 버그, 개선사항 등을 기록하고 담당자를 지정할 수 있다.

Issue에서 설정할 수 있는 항목:

* 제목
* 설명
* 담당자
* 라벨
* 마일스톤
* 댓글

Issue를 만든 뒤에는 보통 해당 작업을 위한 브랜치를 따로 만든다.

---

## 10. 브랜치 생성 후 작업하기

새 브랜치를 만든다.

```bash
git branch docs
```

브랜치로 이동한다.

```bash
git switch docs
```

파일을 수정한 뒤 커밋한다.

```bash
git add README.md
git commit -m "Update README"
```

원격 저장소에 브랜치를 올린다.

```bash
git push origin docs
```

---

## 11. Pull Request

브랜치를 원격 저장소에 push하면 GitHub에서 Pull Request를 만들 수 있다.

Pull Request를 사용하는 이유는 `main` 브랜치에 바로 반영하지 않고, 먼저 코드 리뷰를 받기 위해서이다.

Pull Request 작성 시 보통 다음 내용을 적는다.

* 어떤 작업을 했는지
* 어떤 이슈와 관련 있는지
* 변경된 파일 설명
* 리뷰어가 확인해야 할 부분

예시:

```text
Update README #2

- README.md 내용 수정
- GitHub 사용법 설명 추가
- Issue #2와 관련된 작업
```

리뷰가 끝나고 문제가 없으면 `Merge pull request`를 눌러 `main` 브랜치에 반영한다.

---

## 12. 사용이 끝난 브랜치 삭제

Pull Request가 merge된 후 더 이상 필요 없는 브랜치는 GitHub에서 삭제할 수 있다.

삭제 위치:

```text
Pull Request → Closed → 해당 PR 클릭 → Delete branch
```

필요하면 삭제한 브랜치를 다시 복원할 수도 있다.

---

## 13. 원격 저장소의 merge 결과를 로컬에 반영하기

GitHub에서 PR이 merge되면 로컬의 `main` 브랜치에는 아직 반영되지 않는다.

먼저 main 브랜치로 이동한다.

```bash
git switch main
```

그다음 원격 저장소의 최신 내용을 가져온다.

```bash
git pull origin main
```

---

## 14. 커밋 기록 짧게 보기

작업 기록을 간단하게 보고 싶을 때는 다음 명령어를 사용한다.

```bash
git log --oneline
```

출력 예시:

```bash
8b6366d Merge pull request #2 from Jye-rookie/docs
0c1996d Update README
dc5cb89 Create README.md
604d95e Fix conflict
```

각 줄의 앞부분은 커밋 해시이다.

---

## 15. 특정 커밋 내용 확인하기

특정 커밋의 자세한 내용을 보고 싶을 때는 `git show`를 사용한다.

```bash
git show 커밋해시
```

예시:

```bash
git show 604d95e
```

가장 최근 커밋을 보고 싶다면 다음처럼 입력한다.

```bash
git show HEAD
```

---

## 16. 특정 파일을 누가 수정했는지 확인하기

어떤 파일의 각 줄을 누가, 언제 수정했는지 확인하려면 `git blame`을 사용한다.

```bash
git blame README.md
```

출력 예시:

```bash
dc5cb892 (Jye-rookie 2026-07-01 16:36:11 +0900 1) # OZ AI BootCamp Git Example
0c1996d0 (Jye-rookie 2026-07-01 17:05:34 +0900 2) - Date: 2026.06.30 ~ 2026.07.01
0c1996d0 (Jye-rookie 2026-07-01 17:05:34 +0900 3) - Topic: Git, GitHub, Version Control
```

`git blame`은 협업 중 특정 코드나 문서의 수정 이력을 확인할 때 유용하다.

---

# 핵심 명령어 정리

| 목적             | 명령어                        |
| -------------- | -------------------------- |
| 현재 위치 확인       | `pwd`                      |
| Git 저장소 생성     | `git init`                 |
| 원격 저장소 연결      | `git remote add origin 주소` |
| 원격 저장소 확인      | `git remote -v`            |
| 파일 스테이징        | `git add 파일명`              |
| 커밋 생성          | `git commit -m "메시지"`      |
| 원격 저장소에 업로드    | `git push origin main`     |
| 원격 저장소 내용 가져오기 | `git pull origin main`     |
| 브랜치 생성         | `git branch 브랜치명`          |
| 브랜치 이동         | `git switch 브랜치명`          |
| 커밋 기록 간단히 보기   | `git log --oneline`        |
| 특정 커밋 확인       | `git show 커밋해시`            |
| 최근 커밋 확인       | `git show HEAD`            |
| 파일 수정자 확인      | `git blame 파일명`            |
