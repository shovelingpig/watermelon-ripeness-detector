declare var performance;

const measures = {
  pack: 0,
  inference: 0,
  unpack: 0,
};

export default {
  mark(mark) {
    measures[mark] = performance.now();
  },
  measure(mark) {
    measures[mark] = performance.now() - measures[mark];
  },
  getMetrics() {
    const packTime = Math.floor(measures.pack);
    const inferenceTime = Math.floor(measures.inference);
    const unpackTime = Math.floor(measures.unpack);

    for (const mark of ['inference', 'pack', 'unpack']) {
      measures[mark] = 0;
    }

    return {
      inferenceTime: inferenceTime,
      packTime: packTime,
      unpackTime: unpackTime,
      totalTime: packTime + inferenceTime + unpackTime,
    };
  },
};