import fixedId from "fixed-id";

const customErrorName = "IngratesQueryError";

class IngratesQueryError extends Error {
	constructor(self, name, msg, snk) {
		const message = `${customErrorName}: [${self} | ${name} => ${snk}] ${JSON.stringify(
			msg,
		)}`;

		super(message);

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, IngratesQueryError);
		}

		this.name = customErrorName;
		this.actorInfo = { self, name, msg };
		this.snk = snk;
	}
}

export function QueryActor({ msg }, sendTo, sendMsg, done) {
	done(msg);
}

QueryActor.startup = ({ dispatch }, sendTo, msg) => {
	dispatch(sendTo, msg);
};

export function createQueryEnhancer(defaultTimeout = 5000) {
	return function queryEnhancer({ spawn, self, name }) {
		function query(snk, msg, timeout = defaultTimeout) {
			return new Promise((done, fail) => {
				spawn[`queryActor(${fixedId()})`](QueryActor, snk, msg, done);

				setTimeout(
					fail,
					timeout,
					new IngratesQueryError(self, name, msg, snk),
				);
			});
		}

		return {
			query,
		};
	};
}
