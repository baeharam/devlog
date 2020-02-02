---
title: "[JS] setTimeout을 멈춰보자"
date: "2020-02-02 15:54:24"
template: "post"
draft: false
slug: "JS-setTimeout을-멈춰보자"
category: "javascript"
tags:
  - "자바스크립트"
  - "setTimeout"
description: "setTimeout 함수를 멈춰보는 기능을 배워보자."
---

## 계기

[Pathfinding Visualizer](https://github.com/baeharam/Pathfinding-Visualizer) 를 만들면서 사용자가 일시정지 및 재개하는 기능을 넣으면 좀 더 편리하다고 생각했다. 그러기 위해선 일정시간 뒤에 리렌더링을 발생시키는 `setTimeout()` 함수를 멈추고 재개하는 방식을 사용해야 했다. 하지만, 이 함수와 관련된 함수들 중에 해당 기능에 관련된 것이 없었다. 그래서 어떻게 해야 하지 하고 구글리을 하던 도중에 스택오버플로우에서 [javascript: pause setTimeout();](https://stackoverflow.com/questions/3969475/javascript-pause-settimeout) 를 보게 되었고 이걸 통해 해결할 수 있게 되었다. 이 포스팅에선 간단하지만 효과적인 일시정지/재개 기능을 어떻게 구현해야 하는지에 대해 알아볼 것이다.

## 요구조건

위 프로젝트에서 렌더링 하는 방식은 블록 하나하나의 렌더링 함수가 일정 지연 시간 뒤에 실행되는 방식이었다. 즉, 최단경로를 찾기 위해 방문하는 블록마다 `setTimeout()` 함수를 실행하기 때문에 일시정지를 구현하기 위해선 남아있는 모든 렌더링 함수를 없애야 했다. 렌더링 함수를 없애기 위해선 결국 `clearTimeout()` 을 통해서 타이머를 정지시켜야 했다. 따라서, 최종적으로 정리하자면 요구조건은 아래와 같다.

* "일시정지" 를 누르면, 그 타이머들이 모두 일시정지되어야 한다.
* "재개" 를 누르면 그 타이머들이 모두 재개되어야 한다.

## 아이디어

타이머 1개에 대해 해당 기능을 구현해본다고 하자. 유지해야 하는 변수는, 타이머를 해제시켜야 하기 때문에 가져야 하는 `id` 와 타이머의 시작시점을 가지는 `start` 그리고 타이머의 남아있는 시간을 가지는 `remain` 이다. 이를 바탕으로 어떤 식으로 구현해야 할지 본다면 아래와 같은 순서로 진행된다.

* **일시정지**
  * 현재 타이머를 초기화시킨다 = `clearTimeout(id)`
  * 남아있는 시간을 업데이트한다 = `remain -= (Date.now() - start)`
* **재개**
  * 여러번 눌릴 수 있으므로 타이머를 먼저 초기화한다 = `clearTimeout(id)`
  * 타이머 시작시간을 초기화시킨다 = `start = Date.now()`
  * 타이머를 시작한다 = `id = setTimeout(callback, remain)`

물론 콜백함수(callback)와 지연시간(delay)에 대한 변수는 넘어오는 값이다. 이제 위 프로세스를 이해했다면 이를 코드로 구현해보자.

## 구현

답변은 함수를 사용했지만 여기선 ES6의 클래스를 사용하겠다.

```javascript
class Timer {
  constructor(callback, delay) {
    this.remain = delay;
    this.callback = callback;
    this.start = Date.now();
    this.id = setTimeout(callback, delay);
  }
  
  // 일시정지
  pause = () => {
    clearTimeout(this.id);
    this.remain -= (Date.now() - start);
  }
  
  // 재개
  resume = () => {
    clearTimeout(this.id);
    this.start = Date.now();
    this.id = setTimeout(callback, remain);
  }
}
```

이 구현방식은 인스턴스를 만들자마자 타이머를 시작하는 방식이다.

## 마무리

이번 포스팅에선 `setTimeout()` 함수를 어떻게 일시정지시키고 재개하는지에 대해 알아보았다. 이런 방식은 혼자서도 충분히 생각할 수 있다고 생각한다. 앞으로는 바로 검색하기전에 어떻게 문제를 해결할지에 대해서 고민해보는 시간을 갖도록 하자. :thinking: