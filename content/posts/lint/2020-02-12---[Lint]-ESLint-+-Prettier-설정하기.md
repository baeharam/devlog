---
title: "[Lint] ESLint + Prettier 설정하기"
date: "2020-02-12 09:15:15"
template: "post"
draft: false
slug: "Lint-ESLint-+-Prettier-설정하기"
category: "lint"
tags:
  - "React"
  - "ESLint"
  - "Prettier"
description: "CRA에서 ESLint와 Prettier를 써보자"
---

## 왜?

코드를 짜다보면 논리적 오류가 아닌 의도치 않은 코딩 실수 때문에 에러가 나는 경우가 많다. 바로 이런 잠재적인 에러들을 정적으로 먼저 분석해서 알려주는 부분이 린트(Lint)이며 ESLint란 자바스크립트 표준인 ECMAScript를 린트 시켜주는 도구라고 할 수 있다. ESLint를 사용하게 되면 실수 뿐만 아니라 전반적인 코딩 스타일을 표준화시키기 때문에 여러 사람이 협업한다고 했을 때에도 균일화된 스타일을 가질 수 있다.

코딩 스타일 뿐만 아니라 코드를 깔끔하게 포맷팅하는 기능도 필요한데, 이를 ESLint도 제공은 한다. 하지만 이보다 더 좋은 도구가 바로 Prettier이다. 따라서, ESLint와 Prettier를 같이 사용하는 것이다. 하지만 겹치는 부분이 있기 때문에 이를 비활성화시켜주어야 한다. 이제 이들의 설정에 대해 살펴보도록 하자.



## 설치

### ESLint

* eslint: ESLint 코어
* eslint-config-airbnb: Airbnb의 eslint 스타일 가이드
* eslint-plugin-import: ES2015+의 import/export 구문을 지원
* eslint-plugin-react: 리액트 지원
* eslint-plugin-jsx-a11y: 접근성 지원
* eslint-plugin-react-hooks: 리액트 hooks 지원

여기서 eslint-config-airbnb가 나머지 패키지들을 의존성으로 가지기 때문에 해당 의존성 패키지의 버전에 맞게 설치를 해주어야 한다. 따라서 먼저 의존성 목록을 확인하자.

```bash
npm info "eslint-config-airbnb@latest" peerDependencies
```

2020년 2월 12일 기준 아래와 같이 나온다.

```json
{
  eslint: '^5.16.0 || ^6.1.0',
  'eslint-plugin-import': '^2.18.2',
  'eslint-plugin-jsx-a11y': '^6.2.3',
  'eslint-plugin-react': '^7.14.3',
  'eslint-plugin-react-hooks': '^1.7.0'
}
```

따라서 이것들을 설치해주면 된다.

```bash
yarn add -D eslint-config-airbnb eslint@^6.1.0 eslint-plugin-import@^2.18.2 eslint-plugin-jsx-a11y@^6.2.3 eslint-plugin-react@^7.14.3 eslint-plugin-react-hooks@^1.7.0
```

CRA(Create-React-App)에서는 `eslint-config-airbnb` 를 제외하고는 모두 설치해주니 1개만 설치해주면 된다.

### Prettier

* eslint-config-prettier: ESLint의 포맷팅을 비활성화 시킨다.
* eslint-plugin-prettier: 포맷팅 규칙을 Prettier를 사용해서 추가시킨다.

```bash
yarn add -D eslint-config-prettier eslint-plugin-prettier
```



## 설정

### ESLint

여기서는 CRA + Jest를 사용한다고 가정하고 하나하나씩 설정해 볼 것이다. 먼저 `.eslintrc` 파일을 만든 후에 하나씩 보도록 하자.

```json
{
  "extends": ["airbnb", "plugin:prettier/recommended"],
  "plugins": ["prettier"]
}
```

여기서 `extends` 는 기존 설정파일을 확장하는 개념으로, 배열로 나열되어있는 설정 파일들을 계속 덧붙이는 느낌으로 이해하면 된다. `plugins` 는 `extends` 와 비슷하지만 사용자가 명시적으로 필요한 것들을 `extends` 에 적어줘야 하는 점에서 다르다. 즉, 제공만 해주는 것이라 보면 된다. 위 설정에서도 `plugins` 에는 prettier를 적어줬고 `extends` 에는 prettier/recommended 를 적어준 걸 보면 그 차이점을 알 수 있다.

```json
{
  "env": {
    "browser": true,
    "jest": true
  }
}
```

이제 다음으로 `env` 는 글로벌 객체를 ESLint가 인식하게 하는 부분으로 여기서는 `document` 혹은 `window` 를 인식할 수 있도록 browser 값을 `true` 로 해주었고 jest를 사용하기 위해서 그 값도 `true` 로 해준 것을 볼 수 있다.

```json
{
  "ignorePatterns": ["node_modules/"]
}
```

`ignorePatterns` 는 말 그대로 ESLint 를 적용하지 않을 폴더나 파일을 명시하는 옵션이다.

```json
{
  "settings": {
    "import/resolver": {
      "node": {
        "paths": ["src"]
      }
    }
  }
}
```

또한 절대경로를 사용하는 경우에 src 폴더부터 시작하기 때문에 `import` 를 사용할 때 에러가 날 수 있다. 따라서 그 부분을 설정해준다. `settings` 는 모든 규칙에 의해 공유되는 설정을 하는 부분이며 `import/resolver` 는 `eslint-plugin-import` 의 경로 설정 옵션이다. 여기서 노드에서 사용되는 경로부분을 `src` 로 적어주면 절대경로를 인식하는 원리이다.

```json
"rules": {
  "react/jsx-filename-extension": ["warn", { "extensions": [".js", ".jsx"] }]
}
```

`rules` 는 `extends` 와 `plugins` 에서 제공되는 규칙들을 세부적으로 설정하는 부분으로 배열의 첫번째 값에 따라 표시하는 방식이 다르다.

* `"off"` : 규칙을 끈다.
* `"warn"` : 경고를 띄운다.
* `"error"` : 에러를 띄운다. (실행 불가)

문자열 말고도 숫자인 0,1,2로 표시할 수 있는데 가독성이 안 좋다고 생각해서 위와 같이 쓸 것이다. 어쨌든 위 규칙은 `eslint-plugin-react` 에서 JSX 문법을 포함하는 파일에 대한 확장자를 명시하는 것으로, `.js` 와 `.jsx` 를 모두 허용해주는 것이다. 이제 기본적인 설정은 다 했고 입맛에 맞게 규칙부분을 계속 추가해나가면서 커스터마이징 하면된다.

모두 합쳐보면 아래와 같다.

```json
{
  "extends": ["airbnb", "plugin:prettier/recommended"],
  "plugins": ["prettier"],
  "env": {
    "browser": true,
    "jest": true
  },
  "ignorePatterns": ["node_modules/"],
  "settings": {
    "import/resolver": {
      "node": {
        "paths": ["src"]
      }
    }
  },
  "rules": {
    "react/jsx-filename-extension": ["warn", { "extensions": [".js", ".jsx"] }]
  }
}
```

### Prettier

`.prettierrc` 파일을 만들고 설정해주면 된다. ESLint 처럼 복잡하지 않고 간단하다.

```json
{
  "printWidth": 80,
  "singleQuote": true,
  "trailingComma": "all"
}
```

`printWidth` 는 개행시켜야 하는 문자 수를 말하며 기본값이 80이다. `singleQuote` 는 작은 따옴표(') 를 쓰게 하는 것이고 `trailingComma` 는 가능한 모든 부분에 콤마(,)로 끝내게 하겠다는 것이다. 더 자세한 옵션들을 확인하고 싶다면 [Prettier - Options](https://prettier.io/docs/en/options.html) 를 참고하자.



## 마무리

지금까지 ESLint와 Prettier의 설정에 대해 알아보았다. 실질적인 프로그래밍이나 로직 부분에 대한 것이 아니라 소홀히 여겨질 수 있지만 실제로 적용해보면 많은 효과를 볼 수 있다. 프로젝트를 시작할 때마다 매번 찾아보는 것이 시간 낭비라고 생각되기 때문에 이렇게 시간을 들여 정리해보았다. 앞으로는 이 포스팅을 참고해서 설정을 하도록 하자.



## 참조

* [What's the difference between plugins and extends in eslint?](https://stackoverflow.com/questions/53189200/whats-the-difference-between-plugins-and-extends-in-eslint)
* [Integrating with Linters](https://prettier.io/docs/en/integrating-with-linters.html)
* [How to change eslint settings to understand absolute import?](https://stackoverflow.com/questions/50234858/how-to-change-eslint-settings-to-understand-absolute-import)
* [Zerocho님의 ESLint](https://www.zerocho.com/category/JavaScript/post/583231719a87ec001834a0f2)
* [velopert님의 리액트 프로젝트에 ESLint 와 Prettier 끼얹기](https://velog.io/@velopert/eslint-and-prettier-in-react)