import * as React from 'react';

import {
  media,
  torch,
  MobileModel,
} from 'react-native-pytorch-core';

import Measurement from './Measurement';

const answerDict = {
  "stage1": "Unripe!",
  "stage2": "Ripe!",
  "stage3": "Overripe!",
  "blood": "Hollow!",
  "virus": "Virus!",
};

const packFn = async (audio) => {
  // Convert audio to a blob, which is a byte representation of the audio
  // in the format of an array of bytes
  const blob = media.toBlob(audio);

  // Get a tensor of shorts (int16) for the audio data
  const tensor = torch.fromBlob(blob, [1, blob.size / 2], {
    dtype: 'int16',
  });

  // Convert the tensor to a float32 format since the model expects the tensor
  // in a float format
  const floatTensor = tensor.to({dtype: 'float32'});
  return floatTensor;
};

const inferenceFn = async (model, tensor) => {
  return await model.forward(tensor);
};

const unpackFn = async (output) => {
  return {answer: answerDict[output]};
};

export default function useAudioModelInference() {
  const [metrics, setMetrics] = React.useState();
  const [answer, setAnswer] = React.useState();
  const modelRef = React.useRef(null);

  const processAudio = React.useCallback(
    async (audio) => {
      if (audio != null) {
        if (modelRef.current == null) {
          const filePath = await MobileModel.download(require("./checkpoints/audio_classifier.ptl"));
          modelRef.current = await torch.jit._loadForMobile(filePath);
          console.log('model loaded!')
        }

        Measurement.mark('pack');
        const inputs = await packFn(audio);
        Measurement.measure('pack');

        Measurement.mark('inference');
        const output = await inferenceFn(modelRef.current, inputs);
        Measurement.measure('inference');

        Measurement.mark('unpack');
        const {answer} = await unpackFn(output);
        Measurement.measure('unpack');

        const m = Measurement.getMetrics();

        setAnswer(answer);
        setMetrics(m);
      }
    },
    [setAnswer, setMetrics],
  );

  return {
    answer,
    metrics,
    setAnswer,
    setMetrics,
    processAudio,
  };
}