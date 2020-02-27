---
title: "[JS] Task와 Microtask의 동작방식"
date: "2020-02-27 11:53:59"
template: "post"
draft: false
slug: "JS-Task와-Microtask의-동작방식"
category: "javascript"
tags:
  - "자바스크립트"
  - "이벤트 루프"
  - "task"
  - "microtask"
description: "Event loop가 task와 microtask를 어떻게 다루는지 알아보자."
---

## 이벤트 루프

이벤트 루프란 자바스크립트 엔진이 아닌, 구동하는 환경(브라우저, 노드)에서 가지고 있는 장치이다. 콜 스택과 태스크 큐(= 콜백 큐)를 감시하며, 콜 스택이 비어있을 경우에 태스크 큐에서 태스크(= 콜백함수)를 가져와 콜 스택에 넣어 실행시키는 기능을 한다.

지금까진 이렇게 알고 있었는데 태스크 큐 말고도 마이크로태스크 큐 (Micro task queue)가 존재한다는 것을 알았고 이는 Promise의 동작 방식과 연관이 있다. 이제 이벤트 루프가 2개의 큐를 통해서 어떻게 각각의 태스크를 핸들링하는지 알아보자.



## 태스크 큐 vs 마이크로태스크 큐

2개의 큐 모두 콜백함수가 들어간다는 점에서 동일하지만 어떤 함수를 실행하느냐에 따라 어디로 들어가는지가 달라진다. 또한 명칭은 큐 (Queue) 이지만 실제 우리가 아는 자료구조의 큐와는 다르다. 엄밀히 말하자면 **우선순위 큐 (Priority Queue)** 라고 할 수 있는데, 이벤트 루프가 2개의 큐에서 태스크를 꺼내는 조건이 **"제일 오래된 태스크"** 이기 때문이다. (동작방식을 확인하고 싶다면 [HTML 스펙](https://html.spec.whatwg.org/multipage/webappapis.html#task-queue) 을 보자)

그럼 이제 어떤 함수들이 어떤 큐에 들어가는지 살펴보자.

* **콜백함수를 태스크 큐에 넣는 함수들**
  * **<u>setTimeout</u>**, setInterval, setImmediate, requestAnimationFrame, I/O, UI 렌더링
* **콜백함수를 마이크로태스크 큐에 넣는 함수들**
  * process.nextTick, **<u>Promise</u>**, Object.observe, MutationObserver

익숙한 함수인 Web API의 `setTimeout()` 의 콜백함수가 태스크 큐에 들어가고 `Promise` 의 콜백함수가 마이크로태스크 큐에 들어간다는 것을 알 수 있다. 이벤트 루프는 각 콜백함수를 태스크/마이크로태스크 큐에서 꺼내쓰는 것인데, 그렇다면 **어떤게 먼저일까?**



## 누가 먼저인가?

결론부터 말하자면, **마이크로태스크가 먼저이다.**

이벤트 루프는 마이크로태스크 큐의 모든 태스크들을 처리한 다음, 태스크 큐의 태스크들을 처리한다. 따라서, `Promise` 의 콜백함수가 `setTimeout()` 의 콜백함수보다 먼저 처리된다. 예시를 보자.

```javascript
console.log('콜 스택!');
setTimeout(() => console.log('태스크 큐!'), 0);
Promise.resolve().then(() => console.log('마이크로태스크 큐!'));
```

결과는 다음과 같다.

```
콜 스택!
마이크로태스크 큐!
태스크 큐!
```

볼 수 있다시피, 마이크로태스크 큐의 콜백함수가 먼저 처리된다. 그렇다면 여기서 처음 나오는 `console.log()` 는 언제 처리되는 것일까? 처음 스크립트가 로드될 때 **"스크립트 실행"** 이라는 태스크가 먼저 태스크 큐에 들어간다. 그리고 나서 이벤트 루프가 태스크 큐에서 해당 태스크를 가져와 콜 스택을 실행하는 것이다. 즉, 콜 스택에는 이미 GEC(Global Execution Context)가 생성되어 있는 상태에서 "스크립트 실행" 이라는 태스크를 실행하게 되면 그제서야 GEC에 속한 코드가 실행되는 방식이다.

그럼 하나하나 어떻게 동작하는지 그림으로 살펴보자.

<img src="/media/js/task0.PNG" width="600px">

제일 먼저, "스크립트 실행" 태스크가 태스크 큐에 들어가게 된다.

<img src="/media/js/task1.PNG" width="600px">

이후, 이벤트 루프가 그 태스크를 가져와서 로드된 스크립트를 실행시킨다. 따라서 맨 처음에 `console.log` 가 실행된다.

<img src="/media/js/task2.PNG" width="600px">

그 다음, `setTimeout()` 이 콜 스택으로 가고 브라우저가 이를 받아서 타이머를 동작시킨다.

<img src="/media/js/task3.PNG" width="600px">

타이머가 끝나면 `setTimeout()` 의 콜백함수를 태스크 큐에 넣는다.

<img src="/media/js/task4.PNG" width="600px">

`Promise` 가 콜 스택으로 가고 콜백함수를 마이크로태스크 큐에 넣는다.

<img src="/media/js/task5.PNG" width="600px">

이벤트 루프는 마이크로태스크 큐에서 제일 오래된 태스크인 `Promise` 의 콜백함수를 가져와 콜 스택에 넣는다.

<img src="/media/js/task6.PNG" width="600px">

`Promise` 의 콜백함수가 끝나고 태스크 큐에서 제일 오래된 태스크인 `setTimeout()` 의 콜백함수를 가져와 콜 스택에 넣는다.

<img src="/media/js/task7.PNG" width="600px">

`setTimeout()` 의 콜백함수가 끝나면 콜 스택이 비게 되고 프로그램이 종료된다.



## 마무리

이제까지 태스크 큐와 마이크로태스크가 어떻게 다른지와 이벤트 루프가 각각을 어떻게 처리하는지에 대해 알아보았다. 앞으로 비동기 로직을 다룰 때 콜백함수를 사용하게 될 텐데, 이런 원리들을 이해하고 사용한다면 훨씬 견고하고 예측 가능한 코드를 짤 수 있을 것이다.



## 참고

* [Medium, Microtask and Macrotask: A Hands-on Approach](https://blog.bitsrc.io/microtask-and-macrotask-a-hands-on-approach-5d77050e2168)
* [Stackoverflow, Difference between microtask and macrotask within an event loop context](https://stackoverflow.com/questions/25915634/difference-between-microtask-and-macrotask-within-an-event-loop-context)
* [TOAST, 자바스크립트와 이벤트 루프](https://meetup.toast.com/posts/89)