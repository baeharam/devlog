---
title: "[JS] Iterable과 Iterator"
date: "2020-02-17 10:08:37"
template: "post"
draft: false
slug: "JS-Iterable과-Iterator"
category: "javascript"
tags:
  - "자바스크립트"
  - "Iterable"
  - "Iterator"
description: "Iterable/Iterator 프로토콜에 대해 알아보자"
---

## Iterable 프로토콜

Iterable 프로토콜은 일련의 값들을 순회할 수 있는지에 대한 표현을 나타내는 규약으로 외부에서 각 값들을 순회할 수 있게 하는 데이터 구조라고 생각하면 된다. 그러나 지금 어떤 값을 순회하는지에 대한 상태는 나타내지 않는다. 즉, 반복하고 있는 현재 시점의 값을 알 수는 없다는 것이다. 이 프로토콜을 만족시키기 위해선 `Symbol.iterator` 메소드를 구현하면 된다. **이 메소드는 곧 나올 iterator 프로토콜을 따르는 객체를 리턴해야 한다.**

```javascript
const iterable = {
  [Symbol.iterator](){
    // iterator 프로토콜을 따르는 객체 리턴.
  }
};
```



## Iterator 프로토콜

Iterator 프로토콜은 Iterable 프로토콜을 통해 정의된 데이터 구조를 순회하는 포인터를 정의하는 규약이다. 즉, iterable 프로토콜을 따르는 객체를 iterator 프로토콜을 따르는 객체로 순회하는 방식이다. 프로토콜을 만족시키기 위해선 해당 객체가 `next()` 메소드를 가져야 하며 이 메소드는 `value` 와 `done` 속성을 가진 객체를 리턴해야 한다. 여기서 `value` 는 현재 시점의 값을 뜻하고 `done` 은 반복행위가 종료되었는지에 대한 여부를 나타낸다. 예제로, 1부터 3까지 반복하는 행위를 iterator 객체로 만들어보면 다음과 같다. **단, iterator 객체를 직접 순회할 수는 없고 iterable 객체를 순회해야 한다.**

```javascript
let i = 1;
const iterator = {
  next() {
    return i > 3 ? { done: true } : { value: i++, done: false }
  }
};
```



## 잘 정의된(Well-formed) iterable

객체가 iterable 하다는 것은 다음을 말한다.

* Iterable 프로토콜을 만족해야 한다.
* Iterator 프로토콜을 만족해야 한다.

이것이 위에서 살펴본 바이고, `for...of` 나 spread syntax 등의 ES6+ 문법을 사용하기 위해선 보통(관습적이라는 것) 하나의 조건이 더 추가된다.

* 잘 정의된 iterable이어야 한다.

**이 말은 iterator 객체 자신이 iterable 객체라는 것을 뜻한다.** 즉, iterator 객체의 `Symbol.iterator` 메소드가 존재하며, iterator 객체인 자기 자신을 반환하는 것을 말한다. 따라서, 위에서 살펴본 코드들을 통합해보면 다음과 같이 나타낼 수 있다.

```javascript
const wellFormedIterable = {
  [Symbol.iterator](){
    let i = 1;
    return {
      next() {
        return i > 3 ? { done: true } : { value: i, done: false };
      }
      [Symbol.iterator]() { return this; }
    }
  }
}
```

**잘 정의된 iterable은 진행된 시점을 기억한다는 점에서 잘 정의되지 못한 iterable과 다르다.**  `next()` 를 통해서 테스트 해보면 바로 확인할 수 있다.



## Generator

Generator는 편리하게 iterator 객체를 생성해주는 문법으로,  iterable 및 iterator 프로토콜의 조건을 만족하고 잘 정의된 iterable이다.

```javascript
const gen = function* () {
  yield 1;
  yield 2;
  yield 3;
};

const iterator = gen();
typeof iterator.next // function 이므로 iterator 프로토콜을 따른다.
typeof iterator[Symbol.iterator] // function 이므로 iterable 프로토콜을 따른다.
iterator[Symbol.iterator]() === iterator // true 이므로 잘 정의된 iterable 이다.
```



## 마무리

지금까지 iterable 및 iterator 프로토콜에 대해 알아봤는데, 앞으로 iterable로 구현된 객체의 경우에는 ES6+의 최신 문법들을 활용해서 조금 더 간결하게 코드를 작성하도록 하자.



## 참조

* [Stackoverflow, Difference between Iterator and Iterable](https://stackoverflow.com/questions/36874525/difference-between-iterator-and-iterable)
* [MDN, Iteration protocols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)
* [DEV, JavaScript Iterators and Generators: Synchronous Iterators](https://dev.to/jfet97/javascript-iterators-and-generators-synchronous-iterators-141d)
* [bong's devlog, well-formed 이터러블의 장점 (feat. 피보나치수열)](https://underbleu.com/Functional-programming/well-formed/)