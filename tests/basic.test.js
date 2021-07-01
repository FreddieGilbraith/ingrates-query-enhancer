import test from "ava";
import { createActorSystem } from "@little-bonsai/ingrates";

import { queryEnhancer, QueryActor } from "../src/index.js";

test.beforeEach((t) => {
	t.context.system = createActorSystem({
		enhancers: [queryEnhancer()],
	});

	t.context.system.register(QueryActor);
});

test("can directly query an actor", (t) =>
	new Promise((done) => {
		function Child({ msg, dispatch }) {
			dispatch(msg.src, { valueDoubled: msg.value * 2 });
		}

		async function Parent() {}

		Parent.startup = async ({ query, spawn }) => {
			const addr = spawn.child(Child);
			const reply = await query(addr, { value: 2 });

			t.like(reply, {
				src: addr,
				valueDoubled: 4,
			});

			done();
		};

		t.context.system.register(Child);
		t.context.system.register(Parent);
		t.context.system.spawn.root(Parent);
	}));

test("will reject if the query times out", (t) =>
	new Promise((done) => {
		async function Parent({ query, self }) {
			try {
				await query(
					"Mo0k4c70r",
					{
						value: 2,
					},
					100,
				);
			} catch (error) {
				t.like(error, {
					message: `IngratesQueryError: [${self} | Parent => Mo0k4c70r] {"value":2}`,
					name: "IngratesQueryError",
					snk: "Mo0k4c70r",
					actorInfo: {
						name: "Parent",
						self,
						msg: { value: 2 },
					},
				});

				done();
			}
		}

		t.context.system.register(Parent);
		t.context.system.dispatch(t.context.system.spawn.root(Parent), {
			kind: "runTest",
		});
	}));
