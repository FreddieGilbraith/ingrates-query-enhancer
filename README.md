# Ingrates Assert Enhancer

> Provide an `assert` function, to quickly sanity check actors

```javascript
import { createActorSystem } from "@little-bonsai/ingrates";
import assertEnhancer from "@little-bonsai/ingrates-assert-enhancer";

const system = createActorSystem({
  enhancers: [assertEnhancer],
});

function LogActor({ msg, assert, dispatch }) {
  assert(msg.value > 0, "Value must be greater than 0");

  dispatch(msg.src, { valueLog: Math.log(msg.value) });
}

system.register(LogActor);
system.dispatch(system.spawn.logarithm(LogActor), {
  value: -1,
});
```
