export default function queryEnhancer({ self, spawn, dispatch }) {
	function query(snk, msg, timeout = 100) {
		return new Promise((done, fail) => {
			function* QueryActor({ self, dispatch }) {
				dispatch(snk, msg);

				setTimeout(
					dispatch.bind(null, self, { type: "TIMEOUT" }),
					timeout,
				);

				const response = yield;

				if (response.type === "TIMEOUT") {
					fail({ type: "QUERY_TIMEOUT", timeout });
				} else {
					done(response);
				}
			}

			spawn(QueryActor);
		});
	}

	return {
		query,
	};
}
