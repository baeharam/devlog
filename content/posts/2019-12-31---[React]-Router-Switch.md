---
title: "[React] <Switch>는 언제 써야 할까?"
date: "2019-12-31"
template: "post"
draft: false
slug: "why-switch-is-needed"
category: "React"
tags:
  - "React"
  - "React Router"
  - "Switch"
description: "React Router에서 Switch가 필요한 이유에 대해 알아보자."
---

## 기본적인 라우터의 동작 방식

라우터에는 `<BrowserRouter>` 가 보통 많이 사용되며 `<Link>` 와 `<Route>` 를 통해서 라우팅을 구현하는 방식이다. 예를 들어, 홈페이지, 영화페이지, 리뷰페이지가 있다고 하자. 각각의 URL을 `/` , `/movies` , `/reviews` 라고 했을 때, 다음과 같이 구현할 수 있다.

```jsx
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

const Routes = () => {
    return (
    	<Router>
          <Route path="/" component={Home} />
          <Route path="/movies" component={Movies} />
          <Route path="/reviews" component={Reviews} />
        </Router>
    );
};
```

3가지 컴포넌트가 있다는 가정하에, 위와 같이 `path` 속성을 통해서 각각의 컴포넌트가 렌더링 되는 URL이 정해진다.  그러나 여기서의 문제점은, 홈페이지에 들어갔을 때 `/movies` 와 `/reviews` 또한 `/` 가 매칭되기 때문에 3개의 컴포넌트가 모두 렌더링된다는 것이다.

## 정확한 경로를 사용하자

위와 같은 문제점을 해결하기 위해선 `exact path` 를 사용하여 정확히 일치하는, 즉 부분적으로 일치하는 것이 아니라 정확하게 일치하는 URL의 컴포넌트를 렌더링시키는 방법을 사용할 수 있다.

```jsx
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

const Routes = () => {
    return (
    	<Router>
          <Route exact path="/" component={Home} />
          <Route path="/movies" component={Movies} />
          <Route path="/reviews" component={Reviews} />
        </Router>
    );
};
```

따라서 이렇게 해결할 수 있고, 3가지 컴포넌트가 각자의 URL에 렌더링이 된다. 여기서, 어떠한 URL로 이동할 수 없는 경우에 에러 페이지를 띄우려고 한다. 이 경우엔 `path` 값이 없는 `<Route>` 를 사용해서 구현할 수 있다.

```jsx
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

const Routes = () => {
    return (
    	<Router>
          <Route exact path="/" component={Home} />
          <Route path="/movies" component={Movies} />
          <Route path="/reviews" component={Reviews} />
          <Route component={PageNotFound} />
        </Router>
    );
};
```

코드를 작성한 의도는 에러가 발생했을 때 `<PageNotFound>` 컴포넌트를 보여주고 싶은데, 실제로 실행시켜보면 에러가 발생하지 않음에도 불구하고 해당 컴포넌트가 어떠한 URL에도 렌더링된다는 것을 알 수 있다. 그 이유는 리액트의 라우터가 `path` 를 매칭시킬 때 값이 없기 때문에 무조건적으로 렌더링을 시켜버리는 것이다.

## Switch의 등장

따라서, 이 문제를 해결하기 위해 `<Switch>` 가 등장한다. `<Switch>` 는 첫번째로 매칭되는 `path` 를 가진 컴포넌트를 렌더링 시킨다. 이것이 `exact path` 와 다른 점은 첫번째 매칭만 본다는 것이다.

```jsx
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

const Routes = () => {
    return (
    	<Router>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/movies" component={Movies} />
            <Route path="/reviews" component={Reviews} />
            <Route component={PageNotFound} />
          </Switch>
        </Router>
    );
};
```

위와 같이 `<Route>` 들을 `<Switch>` 로 감싸주면 에러가 발생했을 때 `<PageNotFound>` 가 나오게 되는데, 이는 첫번째로 매칭하는 `path` 값이 위에서 전부 없었기 때문이다.

## 마무리하며...

지금까지 리액트 라우터의 `<Switch>` 가 왜 필요한지에 대해 알아봤다. 이 특성을 통해서 라우팅 시스템을 구현할 때, 적절히 `<Route>` 와 `<Switch>` 를 섞어서 쓰면 훨씬 체계적으로 구현할 수 있을 것이다. 또한 `path` 와 `exact path` 의 차이점을 확실하게 알고 사용하도록 하자.

## 참고

* [React router Switch behavior](https://stackoverflow.com/questions/45122800/react-router-switch-behavior)
* [React : difference between \<Route exact path="/" /> and \<Route path="/" /> ](https://stackoverflow.com/questions/49162311/react-difference-between-route-exact-path-and-route-path)