const useBouncer = () => {
	const bouncer = (func: () => void, timer: number) => {
		let timeoutid: number = 0;

		return () => {
			if (timeoutid) {
				clearTimeout(timeoutid);
			}

			timeoutid = setTimeout(() => {
				func.apply(timeoutid);
			}, timer);
		};
	};

	return {
		bouncer,
	};
};

export default useBouncer;
