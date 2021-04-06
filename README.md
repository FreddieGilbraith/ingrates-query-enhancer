# Ingrates Query Enhancer

> Add `query` to ingrates actors

`query` allows you to await a response from an actor. The promise will reject if a timeout is reached

```javascript
import queryEnhancer from "@little-bonsai/ingrates-query-enhancer";

async function* ExampleActor({ spawn, query }) {
  const child = spawn(ChildActor);
  const response = await query(child, { type: "REQUEST_DATA" });
}

createActorSystem({ enhancers: [queryEnhancer] })(ExampleActor);
```
